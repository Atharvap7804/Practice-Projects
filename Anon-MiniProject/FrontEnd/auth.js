document.addEventListener("DOMContentLoaded", function () {
  const authModal = document.getElementById("authModal");
  const signinForm = document.getElementById("signinForm");
  const registerForm = document.getElementById("registerForm");
  const showRegister = document.getElementById("showRegister");
  const showSignin = document.getElementById("showSignin");
  const closeSignin = document.getElementById("closeSignin");
  const closeRegister = document.getElementById("closeRegister");
  const signinFormData = document.getElementById("signinFormData");
  const registerFormData = document.getElementById("registerFormData");

  // Session check
  const savedUser = localStorage.getItem("anon_user");
  updateNavbarUI(!!savedUser);
  updateCartCount(); // Update cart count on load

  // Toggle to register form
  showRegister.addEventListener("click", function (e) {
    e.preventDefault();
    signinForm.style.display = "none";
    registerForm.style.display = "block";
  });

  // Toggle to sign in form
  showSignin.addEventListener("click", function (e) {
    e.preventDefault();
    registerForm.style.display = "none";
    signinForm.style.display = "block";
  });

  // Close buttons
  closeSignin.addEventListener("click", () => {
    authModal.style.display = "none";
  });

  closeRegister.addEventListener("click", () => {
    authModal.style.display = "none";
  });

  // Register submission
  registerFormData.addEventListener("submit", async function (e) {
    e.preventDefault();
    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value.trim();

    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("✅ Registered successfully");
      registerFormData.reset();
      authModal.style.display = "none";
    } else {
      alert("❌ " + (data.message || "Registration failed"));
    }
  });

  // Sign In submission
  signinFormData.addEventListener("submit", async function (e) {
    e.preventDefault();
    const email = document.getElementById("signinEmail").value.trim();
    const password = document.getElementById("signinPassword").value.trim();

    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok && data.user) {
      alert("✅ Login successful");
      localStorage.setItem("anon_user", JSON.stringify(data.user));
      signinFormData.reset();
      authModal.style.display = "none";
      updateNavbarUI(true);
      updateCartCount();
    } else {
      alert("❌ " + (data.message || "Login failed"));
    }
  });
});

// Optional: update cart count globally
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  const countEl = document.getElementById("cart-count");

  if (countEl) {
    countEl.textContent = count > 0 ? count : "";
  }
}

function updateNavbarUI(isLoggedIn) {
  const navbarAuth = document.getElementById("navbar-auth");
  const cartCountEl = document.getElementById("cart-count");

  if (isLoggedIn) {
    const user = JSON.parse(localStorage.getItem("anon_user"));
    const username = user?.name || "User";

    navbarAuth.innerHTML = `
      <span>Welcome, ${username}</span>
      <button id="logoutBtn">Logout</button>
    `;

    document.getElementById("logoutBtn").addEventListener("click", () => {
      const confirmed = confirm("Are you sure you want to logout?");
      if (confirmed) {
        localStorage.removeItem("anon_user");
        localStorage.removeItem("cart"); // Optional: clear cart on logout
        updateNavbarUI(false);
        updateCartCount();
        window.location.href = "/"; // redirect to homepage or login
      }
    });

  } else {
    navbarAuth.innerHTML = `<a href="#" id="signin-link">Sign In</a>`;
    const newSigninLink = document.getElementById("signin-link");

    newSigninLink.addEventListener("click", function (e) {
      e.preventDefault();
      document.getElementById("authModal").style.display = "block";
      document.getElementById("signinForm").style.display = "block";
      document.getElementById("registerForm").style.display = "none";
    });
  }
}
