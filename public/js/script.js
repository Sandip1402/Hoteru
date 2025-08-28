
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

function updateButtons(){
  // Disable left button if at the very start
  leftButton.disabled = itemContainer.scrollLeft <= 0;

  // Disable right button if at the very end
  rightButton.disabled =
    itemContainer.scrollLeft + itemContainer.clientWidth >= itemContainer.scrollWidth;
}

itemContainer.addEventListener("scroll", updateButtons);

window.addEventListener("load", updateButtons);
window.addEventListener("resize", updateButtons);