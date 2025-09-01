// ---------------------------- new & edit page ----------------------
// form validation
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()


// ----------------------- Navbar ---------------------------
// navbar top center item toggle on click
const navItems = document.querySelectorAll('.nav-item');

navItems.forEach(item => {
  item.addEventListener('click', () => {
    navItems.forEach(el => el.classList.remove('active'));
    item.classList.add('active');
  });
});


// positon of nav items change on screen size reduction
function moveContainer() {
  const items = document.querySelector('.movable');
  const navbarBottom = document.querySelector('.nav-bottom');
  const navbarTopCenter = document.querySelector('.nav-top-center');

  if (window.innerWidth < 768) {
    navbarBottom.appendChild(items);
  } else {
    navbarTopCenter.appendChild(items);
  }
}

window.addEventListener('resize', moveContainer);
window.addEventListener('load', moveContainer);



// ----------------------- home page ------------------
// scroll horizontally when button pressed
const itemContainer = document.querySelector('.home-list');
const leftButton = document.querySelector('.move-left');
const rightButton = document.querySelector('.move-right');

rightButton.addEventListener('click', () => {
  // let moveRight = (visualViewport.width < 768) ? window.innerWidth : window.innerWidth / 2;
  itemContainer.scrollBy({
    // left: moveRight,
    left: itemContainer.clientWidth,
    behavior: 'smooth'
  });
});

leftButton.addEventListener('click', () => {
  // let moveLeft = (visualViewport.width < 768) ? (-window.innerWidth) : - ( window.innerWidth / 2);
  itemContainer.scrollBy({
    // left: moveLeft,
    left: -itemContainer.clientWidth,
    behavior: 'smooth'
  });
});

function updateButtons() {
  // Disable left button if at the very start
  leftButton.disabled = itemContainer.scrollLeft <= 0;

  // Disable right button if at the very end
  rightButton.disabled =
    itemContainer.scrollLeft + itemContainer.clientWidth >= itemContainer.scrollWidth;
}

itemContainer.addEventListener("scroll", updateButtons);

window.addEventListener("load", updateButtons);
window.addEventListener("resize", updateButtons);



// --------------------- login page -----------------
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

// Optional: form submission handling
document.getElementById('createAccountForm').addEventListener('submit', e => {
  e.preventDefault();
  alert('Account creation is not connected in this demo.');
});
