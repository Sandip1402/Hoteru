
// Password toggle logic
const togglePasswordButton = document.getElementById('togglePassword');
const passwordInput = document.getElementById('passwordInput');
const eyeIcon = document.getElementById('eyeIcon');


togglePasswordButton.addEventListener('click', () => {
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    eyeIcon.innerHTML = `
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A4.5 4.5 0 0110.125 15a4.488 4.488 0 01.75-1.5M15 12a3 3 0 10-3 3" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18" />
      `;
  } else {
    passwordInput.type = 'password';
    eyeIcon.innerHTML = `
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      `;
  }
});


// disabling error message
const emailInput = document.getElementById('emailInput');
const loginError = document.querySelector('.login-error');
if (loginError) {
  // Hide error once the user starts typing
  function hideError() {
    loginError.style.display = "none";
    emailInput.removeEventListener("input", hideError);
    passwordInput.removeEventListener("input", hideError);
  }

  emailInput.addEventListener("input", hideError);
  passwordInput.addEventListener("input", hideError);
}
