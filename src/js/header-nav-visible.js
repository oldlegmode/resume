;(function (window, document) {
  var timerId = null;

  window.addEventListener('scroll', function (e) {
    var nav = document.getElementById('header-nav');
    var coords = nav.getBoundingClientRect();
    var header = nav.parentElement.getBoundingClientRect();


    if ( header.bottom < 0 && !nav.classList.contains("page-header__nav-container--visible")) {
      clearTimeout(timerId);
      nav.classList.remove('page-header__nav-container--visible');
      nav.classList.remove('fadeOutUp');
      nav.classList.add('page-header__nav-container--visible');
      nav.classList.add('fadeInDown');

    } else if ( header.bottom > 0 && nav.classList.contains("page-header__nav-container--visible")) {
      nav.classList.remove('fadeInDown');
      nav.classList.add('fadeOutUp');
      setTimeout(function() {
      timerId = nav.classList.remove('page-header__nav-container--visible');
      }, 1000);
    }
  });
  
})(window, document)

