var nav = document.querySelector('.site-nav__wrap'),
    speed = 2;  // скорость, может иметь дробное значение через точку


  nav.addEventListener('click', function(e) {
    e.preventDefault();

    if (e.target.tagName !== 'A') {
      return;
    }

    var link = e.target,
        scroll = window.pageYOffset,  // прокрутка
        hash = link.href.replace(/[^#]*(.*)/, '$1');  // id элемента, к которому нужно перейти
        distanceFromWindow = document.querySelector(hash).getBoundingClientRect().top - 53,  // отступ от окна браузера до id
        start = null;
    requestAnimationFrame(step);  // подробнее про функцию анимации [developer.mozilla.org]
    
    function step(time) {
      if (start === null) start = time;
      var progress = time - start,
          endCoords = (distanceFromWindow < 0 ? Math.max(scroll - progress/speed, scroll + distanceFromWindow) : 
            Math.min(scroll + progress/speed, scroll + distanceFromWindow));
      window.scrollTo(0,endCoords);
      if (endCoords != scroll + distanceFromWindow) {
        requestAnimationFrame(step);
      }
    }
  });