(() => {
  'use strict';

  const navigation = document.getElementById('mainNav');
  const menu = document.getElementById('navbarResponsive');
  const toggle = navigation.querySelector('.navbar-toggler');
  const backToTop = document.getElementById('scroll-to-top');
  const banner = document.getElementById('home');
  const links = [...navigation.querySelectorAll('.nav-link')];
  const sections = [...document.querySelectorAll('main section')];
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = window.matchMedia('(min-width: 992px)');

  function closeMenu() {
    menu.classList.remove('show');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('show');
    toggle.setAttribute('aria-expanded', String(open));
  });

  document.querySelectorAll('a.js-scroll-trigger').forEach(link => {
    link.addEventListener('click', event => {
      const target = document.getElementById(link.hash.slice(1));
      if (!target) return;
      event.preventDefault();
      closeMenu();
      history.replaceState(null, '', link.hash);
      window.scrollTo({ top: Math.max(0, target.offsetTop - 74), behavior: motionPreference.matches ? 'instant' : 'smooth' });
    });
  });

  navigation.addEventListener('keydown', event => {
    if (event.key === 'Escape') { closeMenu(); toggle.focus(); }
  });

  function updateNavigation() {
    const scrolled = window.scrollY > 100;
    navigation.classList.toggle('navbar-shrink', scrolled);
    backToTop.classList.toggle('show', scrolled);
    const current = sections.filter(section => section.offsetTop <= window.scrollY + 100).at(-1) || banner;
    links.forEach(link => {
      const active = link.hash === '#' + current.id;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    banner.style.backgroundAttachment = desktop.matches && !motionPreference.matches ? 'fixed' : 'scroll';
    banner.style.backgroundPosition = desktop.matches && !motionPreference.matches ? `center ${-window.scrollY * .8}px` : 'center';
  }

  let pendingFrame = false;
  window.addEventListener('scroll', () => {
    if (pendingFrame) return;
    pendingFrame = true;
    requestAnimationFrame(() => { updateNavigation(); pendingFrame = false; });
  }, { passive: true });
  window.addEventListener('resize', updateNavigation);
  updateNavigation();

  const wrapper = document.querySelector('.cd-words-wrapper');
  const words = [...wrapper.querySelectorAll('b')];
  let index = 0;
  let timer;

  function sizeHeadline() {
    wrapper.style.width = motionPreference.matches ? 'auto' : `${words[index].offsetWidth + 10}px`;
  }

  function rotateHeadline() {
    if (document.hidden) { timer = setTimeout(rotateHeadline, 2500); return; }
    wrapper.style.width = '0px';
    timer = setTimeout(() => {
      words[index].classList.remove('is-visible');
      index = (index + 1) % words.length;
      words[index].classList.add('is-visible');
      sizeHeadline();
      timer = setTimeout(rotateHeadline, 2500);
    }, 600);
  }

  function configureHeadline() {
    clearTimeout(timer);
    sizeHeadline();
    if (!motionPreference.matches) timer = setTimeout(rotateHeadline, 2500);
    updateNavigation();
  }

  document.fonts.ready.then(configureHeadline);
  motionPreference.addEventListener('change', configureHeadline);
  window.addEventListener('resize', sizeHeadline);
})();
