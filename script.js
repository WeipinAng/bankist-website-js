'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');

// MODAL WINDOW

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// BUTTON SMOOTH SCROLLING

btnScrollTo.addEventListener('click', function (e) {
  // const s1coords = section1.getBoundingClientRect(); // relative to visible viewport (not document)
  // console.log(s1coords);
  // console.log(e.target.getBoundingClientRect());
  // console.log('Current scroll (X/Y)', window.scrollX, window.scrollY); // between edge of viewport and top of page (document)
  // console.log(
  //   'Viewport (Height/Width)',
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // ); // height & width of viewport

  // window.scrollTo(
  //   s1coords.left + window.scrollX,
  //   s1coords.top + window.scrollY
  // );
  // window.scrollTo({
  //   left: s1coords.left + window.scrollX,
  //   top: s1coords.top + window.scrollY,
  //   behavior: 'smooth',
  // });
  section1.scrollIntoView({ behavior: 'smooth' });
});

// PAGE NAVIGATION

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// event delegation #1: add event listener to common parent element
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // event delegation #2: determine which element originated the event (matching strategy to ignore clicks that did not happen right on one of the links)
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    if (id === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
    }
  }
});

// TABBED COMPONENT

// event delegation #1: add event listener to common parent element
tabsContainer.addEventListener('click', function (e) {
  // event delegation #2: determine which element originated the event (matching strategy to ignore clicks that did not happen right on one of the links)
  const clicked = e.target.closest('.operations__tab'); // find closest parent (take into account situation where <span> is clicked)

  if (!clicked) return; // guard clause - ignore clicks that did not happen right on one of the tabs (clicks outside 'tabs' within 'tabsContainer' result in 'null')

  // remove active classes for both tab and content area
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // activate tab
  clicked.classList.add('operations__tab--active');
  // activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// MENU FADE ANIMATION

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// alternative to pass arguments to handleHover() in the event handler
// closures allow us to pass in multiple arguments, like we normally pass to a function
// addEventListener() expects a callback (anonymous) function as its second argument which handleHover() returns
// with the help of CLOSURES, function returned by handleHover() still has access to the arguments passed to handleHover()
// a function always retains the access to variables that they had at the time of their creation (birth) no matter where the are called / a function always remembers all the variable available to it at its birthplace
// https://javascript.info/closure#lexical-environment

// const handleHover = function (o) {
//   return function (e) {
//     if (e.target.classList.contains('nav__link')) {
//       const link = e.target;
//       const siblings = link.closest('.nav').querySelectorAll('.nav__link');
//       const logo = link.closest('.nav').querySelector('img');

//       siblings.forEach(el => {
//         if (el !== link) el.style.opacity = o;
//       });
//       logo.style.opacity = o;
//     }
//   };
// };
// nav.addEventListener('mouseover', handleHover(0.5));
// nav.addEventListener('mouseout', handleHover(1));

// STICKY NAVIGATION

const initialCoords = section1.getBoundingClientRect();

// scroll event
// window.addEventListener('scroll', function () {
//   window.scrollY > initialCoords.top
//     ? nav.classList.add('sticky')
//     : nav.classList.remove('sticky');
// });

// Intersection Observer API
// const obsCallback = function (entries, observer) {
//   // array of threshold entries, observer object itself
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };
// const obsOptions = {
//   root: null, // element that target is intersecting ('null' means entire viewport)
//   threshold: [0, 0.2], // percentage of intersection at which observer callback will be called
// };
// const observer = new IntersectionObserver(obsCallback, obsOptions); // call callback function each time observed/target element [section1] is intersecting 'root' [viewport] at threshold defined [0% & 20% visible]
// observer.observe(section1);

const navHeight = nav.getBoundingClientRect().height; // take into account responsive site where size of all elements will change (updates dynamically regardless of size of viewport)

const stickyNav = function (entries) {
  const [entry] = entries;
  !entry.isIntersecting
    ? nav.classList.add('sticky')
    : nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`, // '-px' shrinks observed range of 'root'; height of navigation (90px by default)
});

headerObserver.observe(header);
