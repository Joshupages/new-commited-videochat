function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
  }
  
  function sendVerificationCode(event) {
    event.preventDefault();
    
    // Email, phone, and captcha validation
    const email = document.getElementById("email").value;
    const confirmEmail = document.getElementById("confirmEmail").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const phone = document.getElementById("phone").value;
    const captchaInput = document.getElementById("captcha").value;
    const captchaText = document.getElementById("captchaText").innerText;
    
    if (email !== confirmEmail) {
      alert("Emails do not match.");
      return;
    }

    if (password !== confirmPassword) {
        alert("error!! Password do not match.");
        return;
      }
  
    if (captchaInput !== captchaText) {
      alert("Incorrect CAPTCHA. Please try again.");
      generateCaptcha();
      return;
    }
    
    const verificationCode = generateVerificationCode();
    alert(`A verification code has been sent to your phone number and email: ${verificationCode}`);
  }
  
  function generateCaptcha() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
      captcha += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    document.getElementById("captchaText").innerText = captcha;
  }
  
  function togglePassword() {
  // Get the password fields
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");

  // Check the current type and toggle between 'password' and 'text'
  const type = password.type === "password" ? "text" : "password";
  password.type = type;
  confirmPassword.type = type;
}


  // Initialize CAPTCHA on page load
  window.onload = generateCaptcha;
  