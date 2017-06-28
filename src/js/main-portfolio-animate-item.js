;(function (window, document) {
  var items = document.querySelectorAll('.portfolio-exemple__item-wrap');

  for (var i = 0; i < items.length; i++) {
    items[i].addEventListener('mouseover', function (e) {
      this.firstElementChild.classList.remove('fadeOut')
      this.firstElementChild.classList.add('portfolio-exemple__item-info-wrap--visible');
      this.firstElementChild.classList.add('fadeInDown');
    });
    items[i].addEventListener('mouseout', function (e) {
      this.firstElementChild.classList.remove('fadeInDown');
      this.firstElementChild.classList.add('fadeOut');
    });
  }
})(window, document)
