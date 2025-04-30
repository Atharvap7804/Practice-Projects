// ——————————————————————————————
// DOM READY
// ——————————————————————————————
document.addEventListener('DOMContentLoaded', () => {
  setupAddToCartButtons();
  updateCartCount();
  renderCart();
  setupContactForm();       // now defined, even if empty on cart page
  setupLogoutButton();      // your existing logout logic
  setupCheckoutButton();    // binds #checkoutBtn → proceedToCheckout
  setupShippingListener();  // binds #shippingForm → show payment
});

// ——————————————————————————————
// ADD TO CART (no login check)
// ——————————————————————————————
function setupAddToCartButtons() {
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const card = btn.closest('.pro');
      const id = card.getAttribute('data-id');
      const name = card.querySelector('h5').innerText;
      const brand = card.querySelector('span').innerText;
      const price = parseFloat(card.querySelector('h4').innerText.replace(/Rs\.?/, '').trim());
      const img = card.querySelector('img').src;
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      const idx = cart.findIndex(x => x.productId === id);

      if (idx > -1) cart[idx].quantity++;
      else cart.push({ productId: id, name, brand, img, price, quantity: 1 });

      localStorage.setItem('cart', JSON.stringify(cart));
      alert('Item added to cart!');
      updateCartCount();
      renderCart();
    });
  });
}

// ——————————————————————————————
// UPDATE GLOBAL CART COUNT
// ——————————————————————————————
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const total = cart.reduce((sum, i) => sum + i.quantity, 0);

  const elDesktop = document.getElementById('cart-count');
  const elMobile  = document.getElementById('cart-count-mobile');

  if (elDesktop) elDesktop.textContent        = total || '';
  if (elMobile)  elMobile.textContent         = total || '';
}

// ——————————————————————————————
// RENDER CART ITEMS + TOTALS
// ——————————————————————————————
function renderCart() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const tbody = document.getElementById('cart-items');
  
  if (!tbody) return;

  if (!cart.length) {
    tbody.innerHTML = '<tr><td colspan="6">Your cart is empty.</td></tr>';
    document.getElementById('cart-subtotal').textContent = 'Rs.0';
    document.getElementById('cart-total').textContent = 'Rs.0';
    return;
  }

  let subtotal = 0;
  tbody.innerHTML = cart.map((item, i) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    return `
      <tr>
        <td><button onclick="removeItem(${i})">Remove</button></td>
        <td><img src="${item.img}" width="50"/></td>
        <td>${item.name}</td>
        <td>Rs.${item.price.toFixed(2)}</td>
        <td>${item.quantity}</td>
        <td>Rs.${itemTotal.toFixed(2)}</td>
      </tr>
    `;
  }).join('');

  document.getElementById('cart-subtotal').textContent = `Rs.${subtotal.toFixed(2)}`;
  document.getElementById('cart-total').textContent = `Rs.${subtotal.toFixed(2)}`;
}


// ——————————————————————————————
// REMOVE SINGLE ITEM
// ——————————————————————————————
function removeItem(index) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

// ——————————————————————————————
// CLEAR ENTIRE CART
// ——————————————————————————————
function clearCart() {
  localStorage.removeItem('cart');
  updateCartCount();
  renderCart();
}

// ——————————————————————————————
// BIND “Proceed to checkout” BUTTON
// ——————————————————————————————
function setupCheckoutButton() {
  const btn = document.getElementById('checkoutBtn');
  if (!btn) return;
  btn.addEventListener('click', proceedToCheckout);
}

// ——————————————————————————————
// PROCEED TO CHECKOUT → send cart, then show shipping form
// ——————————————————————————————
function proceedToCheckout() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  fetch('http://localhost:5000/api/order/place-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: "guest",  // Use actual user ID if available
      shippingDetails: {
        fullName: "Test User",
        contactNumber: "9876543210",
        email: "test@example.com",
        address: "123 Street, City",
        state: "Maharashtra"
      },
      cartItems: cart,
      totalAmount: total,
      paymentMethod: "COD"
    }),
  })
    .then(r => {
      if (!r.ok) throw new Error('Request failed with status: ' + r.status);
      return r.json();
    })
    .then(data => {
      console.log('✅ Order Response:', data);
      document.getElementById('cart-add').style.display = 'none';
      document.getElementById('checkout-form').style.display = 'block';
    })
    .catch(err => {
      console.error('🚨 Order Checkout Error:', err);
    });
}

// ——————————————————————————————
// BIND SHIPPING FORM SUBMIT → show payment
// ——————————————————————————————
function setupShippingListener() {
  const form = document.getElementById('shippingForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();

    const shippingDetails = {
      fullName: form.fullName.value,
      contactNumber: form.contactNumber.value,
      email: form.email.value,
      address: form.address.value,
      state: form.state.value
    };

    const total = document.getElementById('cart-total').textContent.replace('Rs.', '').trim();

    localStorage.setItem('shippingDetails', JSON.stringify(shippingDetails));
    localStorage.setItem('cartTotal', total);

    document.getElementById('checkout-form').style.display   = 'none';
    document.getElementById('payment-container').style.display = 'block';
    document.getElementById('paymentAmount').textContent      = `Rs.${total}`;
  });
}


// ——————————————————————————————
// DUMMY CONTACT FORM SETUP
// ——————————————————————————————
function setupContactForm() {
  // if you have a #contactForm on contact.html, bind here
}

// ——————————————————————————————
// LOGOUT BUTTON SETUP
// ——————————————————————————————
function setupLogoutButton() {
  const btn = document.getElementById('logoutBtn');
  if (!btn) return;
  btn.addEventListener('click', ()=> {
    localStorage.removeItem('anon_user');
    updateCartCount();
    window.location.href = '/';
  });
}

// ——————————————————————————————
// CONFIRM PAYMENT (dummy)
// ——————————————————————————————
function confirmPayment() {
  const user = JSON.parse(localStorage.getItem('anon_user')) || {}; // Assuming stored after login
  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  const totalAmount = localStorage.getItem('cartTotal') || "0";
  const shippingDetails = JSON.parse(localStorage.getItem('shippingDetails')) || {};

  const orderData = {
    userId: user?.email || "guest",
    cartItems,
    totalAmount,
    paymentMethod: "QR / UPI / Card / COD", // optionally get from selected option
    shippingDetails
  };

  fetch('http://localhost:5000/api/place-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert("✅ Payment Confirmed! Your order has been placed.");
      localStorage.removeItem('cart');
      localStorage.removeItem('cartTotal');
      localStorage.removeItem('shippingDetails');
      window.location.href = '/FrontEnd/index.html';
    } else {
      alert("❌ Something went wrong. Please try again.");
    }
  })
  .catch(err => {
    console.error("Order placement failed:", err);
    alert("❌ Network error. Try again.");
  });
}

// ——————————————————————————————
// APPLY COUPON (dummy)
// ——————————————————————————————
function applyCoupon() {
  alert('Coupon applied!');
}


function confirmPayment() {
  const user = JSON.parse(localStorage.getItem('loggedInUser')); // Assumed user session
  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  const totalAmount = localStorage.getItem('cartTotal') || 0;
  const shippingDetails = JSON.parse(localStorage.getItem('shippingDetails')) || {};

  const orderData = {
    userId: user?.email || "guest",
    cartItems,
    totalAmount,
    paymentMethod: "QR / UPI / Card / COD", // You can capture based on selection
    shippingDetails
  };

  fetch('http://localhost:5000/api/place-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert("Payment Confirmed! Your order has been placed.");
      localStorage.removeItem('cart');
      localStorage.removeItem('cartTotal');
      localStorage.removeItem('shippingDetails');
      window.location.href = '/FrontEnd/index.html';
    } else {
      alert("Something went wrong. Please try again.");
    }
  });
}
