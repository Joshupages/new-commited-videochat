function authenticateUser(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    // Placeholder for authentication logic
    if (email === "user@mentalease.com" && password === "password123") {
      alert("Welcome back to MentalEase!");
    } else {
      alert("Invalid credentials. Please try again.");
    }
  }
  