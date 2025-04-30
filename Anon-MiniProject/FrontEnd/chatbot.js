document.addEventListener('DOMContentLoaded', function() {
  const chatMessages = document.getElementById('chat-messages');
  const userInput = document.getElementById('user-input');
  const sendButton = document.getElementById('send-message');
  const minimizeButton = document.getElementById('minimize-chatbot');
  const openChatButton = document.getElementById('open-chatbot');
  const chatbotContainer = document.querySelector('.chatbot-container');
  
  // Connect to socket.io
  const socket = io();
  
  // Hide chatbot initially
  chatbotContainer.classList.add('hidden');
  
  // Event listeners
  sendButton.addEventListener('click', sendMessage);
  userInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
          sendMessage();
      }
  });
  
  minimizeButton.addEventListener('click', function() {
      chatbotContainer.classList.add('hidden');
  });
  
  openChatButton.addEventListener('click', function() {
      chatbotContainer.classList.remove('hidden');
  });
  
  // Add welcome message when chat opens
  openChatButton.addEventListener('click', function() {
      if (chatMessages.children.length === 0) {
          addBotMessage("Hi there! I'm your ANON style assistant. How can I help you find the perfect outfit today?");
      }
  });
  
  function sendMessage() {
      const message = userInput.value.trim();
      if (message) {
          // Add user message to chat
          addUserMessage(message);
          userInput.value = '';
          
          // Send message to server
          socket.emit('chat message', message);
          
          // Add typing indicator
          const typingIndicator = document.createElement('div');
          typingIndicator.className = 'message bot-message typing';
          typingIndicator.innerHTML = '<span>Typing</span><span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>';
          typingIndicator.id = 'typing-indicator';
          chatMessages.appendChild(typingIndicator);
          scrollToBottom();
          
          // Listen for response
          socket.once('bot response', function(response) {
              // Remove typing indicator
              const indicator = document.getElementById('typing-indicator');
              if (indicator) {
                  indicator.remove();
              }
              
              // Handle different response types
              if (typeof response === 'object' && response.type === 'products') {
                  addProductSuggestions(response.products);
                  addBotMessage(response.message);
              } else {
                  addBotMessage(response);
              }
          });
      }
  }
  
  function addUserMessage(message) {
      const messageDiv = document.createElement('div');
      messageDiv.className = 'message user-message';
      messageDiv.textContent = message;
      chatMessages.appendChild(messageDiv);
      scrollToBottom();
  }
  
  function addBotMessage(message) {
      const messageDiv = document.createElement('div');
      messageDiv.className = 'message bot-message';
      messageDiv.innerHTML = message;
      chatMessages.appendChild(messageDiv);
      scrollToBottom();
  }
  
  function addProductSuggestions(products) {
      const suggestionsContainer = document.createElement('div');
      suggestionsContainer.className = 'product-suggestions';
      
      products.forEach(product => {
          const productCard = document.createElement('div');
          productCard.className = 'product-card';
          
          productCard.innerHTML = `
              <img src="${product.image}" alt="${product.name}">
              <div class="product-info">
                  <div class="product-name">${product.name}</div>
                  <div class="product-price">$${product.price.toFixed(2)}</div>
                  <button class="view-product-btn" data-id="${product._id}">View</button>
              </div>
          `;
          
          suggestionsContainer.appendChild(productCard);
      });
      
      chatMessages.appendChild(suggestionsContainer);
      
      // Add event listeners to product buttons
      suggestionsContainer.querySelectorAll('.view-product-btn').forEach(button => {
          button.addEventListener('click', function() {
              const productId = this.getAttribute('data-id');
              window.location.href = `/product/${productId}`;
          });
      });
      
      scrollToBottom();
  }
  
  function scrollToBottom() {
      chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  // Animate typing indicator dots
  setInterval(function() {
      document.querySelectorAll('.typing .dot').forEach(dot => {
          dot.style.opacity = Math.random() > 0.5 ? 1 : 0.5;
      });
  }, 500);
});