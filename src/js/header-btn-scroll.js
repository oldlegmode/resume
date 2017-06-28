;(function (window,document) {
  var btn = document.querySelector('.page-header__scroll-about');

  btn.addEventListener('click', function() {
    var scroll = window.pageYOffset,  // прокрутка
        hash = '#about' // id элемента, к которому нужно перейти
        distanceFromWindow = document.querySelector(hash).getBoundingClientRect().top -50,  // отступ от окна браузера до id
        start = null;
    requestAnimationFrame(step);  // подробнее про функцию анимации [developer.mozilla.org]
    function step(time) {
      if (start === null) start = time;
      var progress = time - start,
          endCoords = (distanceFromWindow < 0 ? Math.max(scroll - progress/speed, scroll + distanceFromWindow) : Math.min(scroll + progress/speed, scroll + distanceFromWindow));
      window.scrollTo(0,endCoords);
      if (endCoords != scroll + distanceFromWindow) {
        requestAnimationFrame(step);
      }
    }
  })
})(window,document)