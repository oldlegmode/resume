;(function(window, document) {

  document.addEventListener('DOMContentLoaded', printCode);
  //window.addEventListener('resize', printCode);

  function printCode() {
    var lines = document.querySelectorAll('.ide-imitation__line'),
          codeStr = [],
          startTimePrint = 300,
          symbolTimePrint = 150,
          str = document.getElementById('template').innerHTML.split('+');

    for (var i = 0; i < lines.length; i++) {
      codeStr.push(lines[i].innerHTML);
      lines[i].innerHTML = '';
    };

    for (var i = 0; i < lines.length; i++) {
      for (var j = 0; j <= str[i].length; j++) {

      var print  = (function (i, j) {
          return function () {
            if (j === 0) {
              cursorStatic(lines[i]);
              return;
            }
            if (str[i][j-1] == ' ') {
              lines[i].removeChild(lines[i].children[0]);
              lines[i].innerHTML += ('\&#8239;\&#8239;\&#8239;');
              cursorStatic(lines[i]);
              return;
            }
            lines[i].removeChild(lines[i].children[0]);
            lines[i].innerHTML += (str[i][j-1]);
            if (str[i][j] !== undefined) {
              cursorStatic(lines[i]);
            }
            if( i === 3 && str[i][j] === undefined) {
              cursorStatic(lines[i]);
              makeCursorDinamic();
              return;
            }
          }
        })(i, j);
        setTimeout(print, startTimePrint);
        startTimePrint += symbolTimePrint;
      }
    }
  }

  function cursorStatic(parent) {
    var span = document.createElement('span');

    span.classList.add('ide-imitation__cursor');
    parent.appendChild(span);
  }
  function makeCursorDinamic() {
    document.querySelector('.ide-imitation__cursor').classList.add('cursor');
  }
})(window, document);



;(function (window, document) {

  function CustomValidation() { }

  CustomValidation.prototype = {
    // Установим пустой массив сообщений об ошибках
    invalidities: [],

    // Метод, проверяющий валидность
    checkValidity: function(input) {

      var validity = input.validity;

      if (validity.patternMismatch) {
        this.addInvalidity('This is the wrong pattern for this field');
      }

      if (validity.rangeOverflow) {
        var max = getAttributeValue(input, 'max');
        this.addInvalidity('The maximum value should be ' + max);
      }

      if (validity.rangeUnderflow) {
        var min = getAttributeValue(input, 'min');
        this.addInvalidity('The minimum value should be ' + min);
      }

      if (validity.stepMismatch) {
        var step = getAttributeValue(input, 'step');
        this.addInvalidity('This number needs to be a multiple of ' + step);
      }

      // И остальные проверки валидности...
    },

    // Добавляем сообщение об ошибке в массив ошибок
    addInvalidity: function(message) {
      this.invalidities.push(message);
    },

    // Получаем общий текст сообщений об ошибках
    getInvalidities: function() {
      return this.invalidities.join('. \n');
    },

    // Сбросим общий текст сообщений об ошибках
    resetInvalidity: function() {
      return this.invalidities.length = 0;
    }
  };

  CustomValidation.prototype.getInvaliditiesForHTML = function() {
  return this.invalidities.join('. <br>');
  }



  var submit = document.getElementById('submit');

  // Добавляем обработчик клика на кнопку отправки формы
  submit.addEventListener('click', formValidation);

  // Добавляем обработчик поднятия клавиши на каждое поле
  var inputs = [];
  for (var i = 0; i < submit.parentElement.length; i++) {
    if(submit.parentElement[i].id === 'submit') {
      continue;
    }
    inputs.push(submit.parentElement[i]);
  }
  // Пройдёмся по всем полям
  for (var i = 0; i < inputs.length; i++) {

    var input = inputs[i];

    if (!input.required) {
      continue;
    }
    input.addEventListener('keyup', inputValidation);
  }

  function formValidation(e) {
    e.preventDefault();
    var formData  = new FormData(this.form);
    var inputs = [];

    for (var i = 0; i < this.parentElement.length; i++) {
      if(this.parentElement[i] == this) {
        continue;
      }
      inputs.push(this.parentElement[i]);
    }
    // Пройдёмся по всем полям
    for (var i = 0; i < inputs.length; i++) {

      var input = inputs[i];

      if (!input.required) {
        continue;
      }
      // Проверим валидность поля, используя встроенную в JavaScript функцию checkValidity()
      if (!input.checkValidity()) {
        input.parentElement.classList.remove('page-main__label--wrong');
        input.parentElement.classList.remove('page-main__label--correct');// Удаляем метку валидности поля, используя заранее подготовленный классы в less
        input.parentElement.classList.add('page-main__label--wrong');// Добаляем метку НЕ валидности поля, используя заранее подготовленный классы в less
        var inputCustomValidation = new CustomValidation(); // Создадим объект CustomValidation
        inputCustomValidation.checkValidity(input); // Выявим ошибки
        var customValidityMessage = inputCustomValidation.getInvalidities(); // Получим все сообщения об ошибках
        input.setCustomValidity(customValidityMessage); // Установим специальное сообщение об ошибке

        // Удалим существующие ошибки (надо будет переделать на replace)
        if(input.parentElement.children.length > 1) {
          input.parentElement.removeChild(input.parentElement.children[1]);
        }

        // Добавим ошибки в документ

        //  Строка сообщения
        var customValidityMessageForHTML = inputCustomValidation.getInvaliditiesForHTML();
        // Если поле пустое, то ничего не делаем
        if (!customValidityMessageForHTML) {
          customValidityMessageForHTML ='Required field';
        }

        input.parentElement.insertAdjacentHTML('beforeEnd', '<span class="page-main__label--help">' + customValidityMessageForHTML + '</span>');
        inputCustomValidation.resetInvalidity();

        var stopSubmit = true;

        continue;
      } // закончился if
      // Удалим существующие ошибки (надо будет переделать на replace)
      if(input.parentElement.children.length > 1) {
        input.parentElement.removeChild(input.parentElement.children[1]);
      }
      input.parentElement.classList.remove('page-main__label--wrong');// Добаляем метку НЕ валидности поля, используя заранее подготовленный классы в less
      input.parentElement.classList.add('page-main__label--correct');// Удаляем метку валидности поля, используя заранее подготовленный классы в less
    } // закончился цикл

    if (stopSubmit) {
      e.preventDefault();
      this.classList.add('page-main__contact-btn--disable');
    } else  {
      e.preventDefault();
      console.log(formData);
      this.classList.remove('page-main__contact-btn--disable');
      request(formData );
    }
  }

  function inputValidation(e) {
    // Проверим валидность поля, используя встроенную в JavaScript функцию checkValidity()
    if (this.value.length < 2) return;
    if (!this.checkValidity()) {
      this.parentElement.classList.remove('page-main__label--wrong');
      this.parentElement.classList.remove('page-main__label--correct');// Удаляем метку валидности поля, используя заранее подготовленный классы в less
      this.parentElement.classList.add('page-main__label--wrong');// Добаляем метку НЕ валидности поля, используя заранее подготовленный классы в less
      var inputCustomValidation = new CustomValidation(); // Создадим объект CustomValidation
      inputCustomValidation.checkValidity(this); // Выявим ошибки
      var customValidityMessage = inputCustomValidation.getInvalidities(); // Получим все сообщения об ошибках
      this.setCustomValidity(customValidityMessage); // Установим специальное сообщение об ошибке

      // Удалим существующие ошибки (надо будет переделать на replace)
      if(this.parentElement.children.length > 1) {
        this.parentElement.removeChild(this.parentElement.children[1]);
      }

      // Добавим ошибки в документ

      //  Строка сообщения
      var customValidityMessageForHTML = inputCustomValidation.getInvaliditiesForHTML();
      // Если поле пустое, то ничего не делаем
      if (!customValidityMessageForHTML) {
        customValidityMessageForHTML ='Required field';
      }

      this.parentElement.insertAdjacentHTML('beforeEnd', '<span class="page-main__label--help">' + customValidityMessageForHTML + '</span>');
      inputCustomValidation.resetInvalidity();

      var stopSubmit = true;
      
      return;
    } // закончился if
    // Удалим существующие ошибки (надо будет переделать на replace)
    if(this.parentElement.children.length > 1) {
      this.parentElement.removeChild(this.parentElement.children[1]);
    }
    this.parentElement.classList.remove('page-main__label--wrong');// Добаляем метку НЕ валидности поля, используя заранее подготовленный классы в less
    this.parentElement.classList.add('page-main__label--correct');// Удаляем метку валидности поля, используя заранее подготовленный классы в less
    
  }

  function request(argument) {
    var xhr = new XMLHttpRequest();

    xhr.open('POST', '/send', true);

    xhr.send(argument);

    xhr.onreadystatechange = function() {
      if (this.readyState != 4) {
        return;// по окончании запроса доступны:
      }
      // status, statusText
      // responseText, responseXML (при content-type: text/xml)
      if (this.status != 200) {
        // обработать ошибку
        alert( 'ошибка: ' + (this.status ? this.statusText : 'запрос не удался') );
        return;
      }
    }
  }

})(window, document);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvZGUtaW1pdGF0aW9uLmpzIiwiY29tbW9uLmpzIiwiZm9ybS5qcyIsImhlYWRlci1idG4tc2Nyb2xsLmpzIiwiaGVhZGVyLW5hdi1zY3JvbGwuanMiLCJoZWFkZXItbmF2LXZpc2libGUuanMiLCJtYWluLXBvcnRmb2xpby1hbmltYXRlLWl0ZW0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdEQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDck5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJjb21tb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyI7KGZ1bmN0aW9uKHdpbmRvdywgZG9jdW1lbnQpIHtcclxuXHJcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIHByaW50Q29kZSk7XHJcbiAgLy93aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgcHJpbnRDb2RlKTtcclxuXHJcbiAgZnVuY3Rpb24gcHJpbnRDb2RlKCkge1xyXG4gICAgdmFyIGxpbmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmlkZS1pbWl0YXRpb25fX2xpbmUnKSxcclxuICAgICAgICAgIGNvZGVTdHIgPSBbXSxcclxuICAgICAgICAgIHN0YXJ0VGltZVByaW50ID0gMzAwLFxyXG4gICAgICAgICAgc3ltYm9sVGltZVByaW50ID0gMTUwLFxyXG4gICAgICAgICAgc3RyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RlbXBsYXRlJykuaW5uZXJIVE1MLnNwbGl0KCcrJyk7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBjb2RlU3RyLnB1c2gobGluZXNbaV0uaW5uZXJIVE1MKTtcclxuICAgICAgbGluZXNbaV0uaW5uZXJIVE1MID0gJyc7XHJcbiAgICB9O1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPD0gc3RyW2ldLmxlbmd0aDsgaisrKSB7XHJcblxyXG4gICAgICB2YXIgcHJpbnQgID0gKGZ1bmN0aW9uIChpLCBqKSB7XHJcbiAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoaiA9PT0gMCkge1xyXG4gICAgICAgICAgICAgIGN1cnNvclN0YXRpYyhsaW5lc1tpXSk7XHJcbiAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChzdHJbaV1bai0xXSA9PSAnICcpIHtcclxuICAgICAgICAgICAgICBsaW5lc1tpXS5yZW1vdmVDaGlsZChsaW5lc1tpXS5jaGlsZHJlblswXSk7XHJcbiAgICAgICAgICAgICAgbGluZXNbaV0uaW5uZXJIVE1MICs9ICgnXFwmIzgyMzk7XFwmIzgyMzk7XFwmIzgyMzk7Jyk7XHJcbiAgICAgICAgICAgICAgY3Vyc29yU3RhdGljKGxpbmVzW2ldKTtcclxuICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGluZXNbaV0ucmVtb3ZlQ2hpbGQobGluZXNbaV0uY2hpbGRyZW5bMF0pO1xyXG4gICAgICAgICAgICBsaW5lc1tpXS5pbm5lckhUTUwgKz0gKHN0cltpXVtqLTFdKTtcclxuICAgICAgICAgICAgaWYgKHN0cltpXVtqXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgY3Vyc29yU3RhdGljKGxpbmVzW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiggaSA9PT0gMyAmJiBzdHJbaV1bal0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgIGN1cnNvclN0YXRpYyhsaW5lc1tpXSk7XHJcbiAgICAgICAgICAgICAgbWFrZUN1cnNvckRpbmFtaWMoKTtcclxuICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9KShpLCBqKTtcclxuICAgICAgICBzZXRUaW1lb3V0KHByaW50LCBzdGFydFRpbWVQcmludCk7XHJcbiAgICAgICAgc3RhcnRUaW1lUHJpbnQgKz0gc3ltYm9sVGltZVByaW50O1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBjdXJzb3JTdGF0aWMocGFyZW50KSB7XHJcbiAgICB2YXIgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuXHJcbiAgICBzcGFuLmNsYXNzTGlzdC5hZGQoJ2lkZS1pbWl0YXRpb25fX2N1cnNvcicpO1xyXG4gICAgcGFyZW50LmFwcGVuZENoaWxkKHNwYW4pO1xyXG4gIH1cclxuICBmdW5jdGlvbiBtYWtlQ3Vyc29yRGluYW1pYygpIHtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5pZGUtaW1pdGF0aW9uX19jdXJzb3InKS5jbGFzc0xpc3QuYWRkKCdjdXJzb3InKTtcclxuICB9XHJcbn0pKHdpbmRvdywgZG9jdW1lbnQpO1xyXG5cclxuIiwiIiwiOyhmdW5jdGlvbiAod2luZG93LCBkb2N1bWVudCkge1xyXG5cclxuICBmdW5jdGlvbiBDdXN0b21WYWxpZGF0aW9uKCkgeyB9XHJcblxyXG4gIEN1c3RvbVZhbGlkYXRpb24ucHJvdG90eXBlID0ge1xyXG4gICAgLy8g0KPRgdGC0LDQvdC+0LLQuNC8INC/0YPRgdGC0L7QuSDQvNCw0YHRgdC40LIg0YHQvtC+0LHRidC10L3QuNC5INC+0LEg0L7RiNC40LHQutCw0YVcclxuICAgIGludmFsaWRpdGllczogW10sXHJcblxyXG4gICAgLy8g0JzQtdGC0L7QtCwg0L/RgNC+0LLQtdGA0Y/RjtGJ0LjQuSDQstCw0LvQuNC00L3QvtGB0YLRjFxyXG4gICAgY2hlY2tWYWxpZGl0eTogZnVuY3Rpb24oaW5wdXQpIHtcclxuXHJcbiAgICAgIHZhciB2YWxpZGl0eSA9IGlucHV0LnZhbGlkaXR5O1xyXG5cclxuICAgICAgaWYgKHZhbGlkaXR5LnBhdHRlcm5NaXNtYXRjaCkge1xyXG4gICAgICAgIHRoaXMuYWRkSW52YWxpZGl0eSgnVGhpcyBpcyB0aGUgd3JvbmcgcGF0dGVybiBmb3IgdGhpcyBmaWVsZCcpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodmFsaWRpdHkucmFuZ2VPdmVyZmxvdykge1xyXG4gICAgICAgIHZhciBtYXggPSBnZXRBdHRyaWJ1dGVWYWx1ZShpbnB1dCwgJ21heCcpO1xyXG4gICAgICAgIHRoaXMuYWRkSW52YWxpZGl0eSgnVGhlIG1heGltdW0gdmFsdWUgc2hvdWxkIGJlICcgKyBtYXgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodmFsaWRpdHkucmFuZ2VVbmRlcmZsb3cpIHtcclxuICAgICAgICB2YXIgbWluID0gZ2V0QXR0cmlidXRlVmFsdWUoaW5wdXQsICdtaW4nKTtcclxuICAgICAgICB0aGlzLmFkZEludmFsaWRpdHkoJ1RoZSBtaW5pbXVtIHZhbHVlIHNob3VsZCBiZSAnICsgbWluKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHZhbGlkaXR5LnN0ZXBNaXNtYXRjaCkge1xyXG4gICAgICAgIHZhciBzdGVwID0gZ2V0QXR0cmlidXRlVmFsdWUoaW5wdXQsICdzdGVwJyk7XHJcbiAgICAgICAgdGhpcy5hZGRJbnZhbGlkaXR5KCdUaGlzIG51bWJlciBuZWVkcyB0byBiZSBhIG11bHRpcGxlIG9mICcgKyBzdGVwKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8g0Jgg0L7RgdGC0LDQu9GM0L3Ri9C1INC/0YDQvtCy0LXRgNC60Lgg0LLQsNC70LjQtNC90L7RgdGC0LguLi5cclxuICAgIH0sXHJcblxyXG4gICAgLy8g0JTQvtCx0LDQstC70Y/QtdC8INGB0L7QvtCx0YnQtdC90LjQtSDQvtCxINC+0YjQuNCx0LrQtSDQsiDQvNCw0YHRgdC40LIg0L7RiNC40LHQvtC6XHJcbiAgICBhZGRJbnZhbGlkaXR5OiBmdW5jdGlvbihtZXNzYWdlKSB7XHJcbiAgICAgIHRoaXMuaW52YWxpZGl0aWVzLnB1c2gobWVzc2FnZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vINCf0L7Qu9GD0YfQsNC10Lwg0L7QsdGJ0LjQuSDRgtC10LrRgdGCINGB0L7QvtCx0YnQtdC90LjQuSDQvtCxINC+0YjQuNCx0LrQsNGFXHJcbiAgICBnZXRJbnZhbGlkaXRpZXM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5pbnZhbGlkaXRpZXMuam9pbignLiBcXG4nKTtcclxuICAgIH0sXHJcblxyXG4gICAgLy8g0KHQsdGA0L7RgdC40Lwg0L7QsdGJ0LjQuSDRgtC10LrRgdGCINGB0L7QvtCx0YnQtdC90LjQuSDQvtCxINC+0YjQuNCx0LrQsNGFXHJcbiAgICByZXNldEludmFsaWRpdHk6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5pbnZhbGlkaXRpZXMubGVuZ3RoID0gMDtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBDdXN0b21WYWxpZGF0aW9uLnByb3RvdHlwZS5nZXRJbnZhbGlkaXRpZXNGb3JIVE1MID0gZnVuY3Rpb24oKSB7XHJcbiAgcmV0dXJuIHRoaXMuaW52YWxpZGl0aWVzLmpvaW4oJy4gPGJyPicpO1xyXG4gIH1cclxuXHJcblxyXG5cclxuICB2YXIgc3VibWl0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N1Ym1pdCcpO1xyXG5cclxuICAvLyDQlNC+0LHQsNCy0LvRj9C10Lwg0L7QsdGA0LDQsdC+0YLRh9C40Log0LrQu9C40LrQsCDQvdCwINC60L3QvtC/0LrRgyDQvtGC0L/RgNCw0LLQutC4INGE0L7RgNC80YtcclxuICBzdWJtaXQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmb3JtVmFsaWRhdGlvbik7XHJcblxyXG4gIC8vINCU0L7QsdCw0LLQu9GP0LXQvCDQvtCx0YDQsNCx0L7RgtGH0LjQuiDQv9C+0LTQvdGP0YLQuNGPINC60LvQsNCy0LjRiNC4INC90LAg0LrQsNC20LTQvtC1INC/0L7Qu9C1XHJcbiAgdmFyIGlucHV0cyA9IFtdO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3VibWl0LnBhcmVudEVsZW1lbnQubGVuZ3RoOyBpKyspIHtcclxuICAgIGlmKHN1Ym1pdC5wYXJlbnRFbGVtZW50W2ldLmlkID09PSAnc3VibWl0Jykge1xyXG4gICAgICBjb250aW51ZTtcclxuICAgIH1cclxuICAgIGlucHV0cy5wdXNoKHN1Ym1pdC5wYXJlbnRFbGVtZW50W2ldKTtcclxuICB9XHJcbiAgLy8g0J/RgNC+0LnQtNGR0LzRgdGPINC/0L4g0LLRgdC10Lwg0L/QvtC70Y/QvFxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgaW5wdXRzLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgdmFyIGlucHV0ID0gaW5wdXRzW2ldO1xyXG5cclxuICAgIGlmICghaW5wdXQucmVxdWlyZWQpIHtcclxuICAgICAgY29udGludWU7XHJcbiAgICB9XHJcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGlucHV0VmFsaWRhdGlvbik7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBmb3JtVmFsaWRhdGlvbihlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB2YXIgZm9ybURhdGEgID0gbmV3IEZvcm1EYXRhKHRoaXMuZm9ybSk7XHJcbiAgICB2YXIgaW5wdXRzID0gW107XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnBhcmVudEVsZW1lbnQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgaWYodGhpcy5wYXJlbnRFbGVtZW50W2ldID09IHRoaXMpIHtcclxuICAgICAgICBjb250aW51ZTtcclxuICAgICAgfVxyXG4gICAgICBpbnB1dHMucHVzaCh0aGlzLnBhcmVudEVsZW1lbnRbaV0pO1xyXG4gICAgfVxyXG4gICAgLy8g0J/RgNC+0LnQtNGR0LzRgdGPINC/0L4g0LLRgdC10Lwg0L/QvtC70Y/QvFxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpbnB1dHMubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgIHZhciBpbnB1dCA9IGlucHV0c1tpXTtcclxuXHJcbiAgICAgIGlmICghaW5wdXQucmVxdWlyZWQpIHtcclxuICAgICAgICBjb250aW51ZTtcclxuICAgICAgfVxyXG4gICAgICAvLyDQn9GA0L7QstC10YDQuNC8INCy0LDQu9C40LTQvdC+0YHRgtGMINC/0L7Qu9GPLCDQuNGB0L/QvtC70YzQt9GD0Y8g0LLRgdGC0YDQvtC10L3QvdGD0Y4g0LIgSmF2YVNjcmlwdCDRhNGD0L3QutGG0LjRjiBjaGVja1ZhbGlkaXR5KClcclxuICAgICAgaWYgKCFpbnB1dC5jaGVja1ZhbGlkaXR5KCkpIHtcclxuICAgICAgICBpbnB1dC5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ3BhZ2UtbWFpbl9fbGFiZWwtLXdyb25nJyk7XHJcbiAgICAgICAgaW5wdXQucGFyZW50RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdwYWdlLW1haW5fX2xhYmVsLS1jb3JyZWN0Jyk7Ly8g0KPQtNCw0LvRj9C10Lwg0LzQtdGC0LrRgyDQstCw0LvQuNC00L3QvtGB0YLQuCDQv9C+0LvRjywg0LjRgdC/0L7Qu9GM0LfRg9GPINC30LDRgNCw0L3QtdC1INC/0L7QtNCz0L7RgtC+0LLQu9C10L3QvdGL0Lkg0LrQu9Cw0YHRgdGLINCyIGxlc3NcclxuICAgICAgICBpbnB1dC5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3BhZ2UtbWFpbl9fbGFiZWwtLXdyb25nJyk7Ly8g0JTQvtCx0LDQu9GP0LXQvCDQvNC10YLQutGDINCd0JUg0LLQsNC70LjQtNC90L7RgdGC0Lgg0L/QvtC70Y8sINC40YHQv9C+0LvRjNC30YPRjyDQt9Cw0YDQsNC90LXQtSDQv9C+0LTQs9C+0YLQvtCy0LvQtdC90L3Ri9C5INC60LvQsNGB0YHRiyDQsiBsZXNzXHJcbiAgICAgICAgdmFyIGlucHV0Q3VzdG9tVmFsaWRhdGlvbiA9IG5ldyBDdXN0b21WYWxpZGF0aW9uKCk7IC8vINCh0L7Qt9C00LDQtNC40Lwg0L7QsdGK0LXQutGCIEN1c3RvbVZhbGlkYXRpb25cclxuICAgICAgICBpbnB1dEN1c3RvbVZhbGlkYXRpb24uY2hlY2tWYWxpZGl0eShpbnB1dCk7IC8vINCS0YvRj9Cy0LjQvCDQvtGI0LjQsdC60LhcclxuICAgICAgICB2YXIgY3VzdG9tVmFsaWRpdHlNZXNzYWdlID0gaW5wdXRDdXN0b21WYWxpZGF0aW9uLmdldEludmFsaWRpdGllcygpOyAvLyDQn9C+0LvRg9GH0LjQvCDQstGB0LUg0YHQvtC+0LHRidC10L3QuNGPINC+0LEg0L7RiNC40LHQutCw0YVcclxuICAgICAgICBpbnB1dC5zZXRDdXN0b21WYWxpZGl0eShjdXN0b21WYWxpZGl0eU1lc3NhZ2UpOyAvLyDQo9GB0YLQsNC90L7QstC40Lwg0YHQv9C10YbQuNCw0LvRjNC90L7QtSDRgdC+0L7QsdGJ0LXQvdC40LUg0L7QsSDQvtGI0LjQsdC60LVcclxuXHJcbiAgICAgICAgLy8g0KPQtNCw0LvQuNC8INGB0YPRidC10YHRgtCy0YPRjtGJ0LjQtSDQvtGI0LjQsdC60LggKNC90LDQtNC+INCx0YPQtNC10YIg0L/QtdGA0LXQtNC10LvQsNGC0Ywg0L3QsCByZXBsYWNlKVxyXG4gICAgICAgIGlmKGlucHV0LnBhcmVudEVsZW1lbnQuY2hpbGRyZW4ubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgaW5wdXQucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZChpbnB1dC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzFdKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINCU0L7QsdCw0LLQuNC8INC+0YjQuNCx0LrQuCDQsiDQtNC+0LrRg9C80LXQvdGCXHJcblxyXG4gICAgICAgIC8vICDQodGC0YDQvtC60LAg0YHQvtC+0LHRidC10L3QuNGPXHJcbiAgICAgICAgdmFyIGN1c3RvbVZhbGlkaXR5TWVzc2FnZUZvckhUTUwgPSBpbnB1dEN1c3RvbVZhbGlkYXRpb24uZ2V0SW52YWxpZGl0aWVzRm9ySFRNTCgpO1xyXG4gICAgICAgIC8vINCV0YHQu9C4INC/0L7Qu9C1INC/0YPRgdGC0L7QtSwg0YLQviDQvdC40YfQtdCz0L4g0L3QtSDQtNC10LvQsNC10LxcclxuICAgICAgICBpZiAoIWN1c3RvbVZhbGlkaXR5TWVzc2FnZUZvckhUTUwpIHtcclxuICAgICAgICAgIGN1c3RvbVZhbGlkaXR5TWVzc2FnZUZvckhUTUwgPSdSZXF1aXJlZCBmaWVsZCc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbnB1dC5wYXJlbnRFbGVtZW50Lmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlRW5kJywgJzxzcGFuIGNsYXNzPVwicGFnZS1tYWluX19sYWJlbC0taGVscFwiPicgKyBjdXN0b21WYWxpZGl0eU1lc3NhZ2VGb3JIVE1MICsgJzwvc3Bhbj4nKTtcclxuICAgICAgICBpbnB1dEN1c3RvbVZhbGlkYXRpb24ucmVzZXRJbnZhbGlkaXR5KCk7XHJcblxyXG4gICAgICAgIHZhciBzdG9wU3VibWl0ID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICAgIH0gLy8g0LfQsNC60L7QvdGH0LjQu9GB0Y8gaWZcclxuICAgICAgLy8g0KPQtNCw0LvQuNC8INGB0YPRidC10YHRgtCy0YPRjtGJ0LjQtSDQvtGI0LjQsdC60LggKNC90LDQtNC+INCx0YPQtNC10YIg0L/QtdGA0LXQtNC10LvQsNGC0Ywg0L3QsCByZXBsYWNlKVxyXG4gICAgICBpZihpbnB1dC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICBpbnB1dC5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKGlucHV0LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMV0pO1xyXG4gICAgICB9XHJcbiAgICAgIGlucHV0LnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgncGFnZS1tYWluX19sYWJlbC0td3JvbmcnKTsvLyDQlNC+0LHQsNC70Y/QtdC8INC80LXRgtC60YMg0J3QlSDQstCw0LvQuNC00L3QvtGB0YLQuCDQv9C+0LvRjywg0LjRgdC/0L7Qu9GM0LfRg9GPINC30LDRgNCw0L3QtdC1INC/0L7QtNCz0L7RgtC+0LLQu9C10L3QvdGL0Lkg0LrQu9Cw0YHRgdGLINCyIGxlc3NcclxuICAgICAgaW5wdXQucGFyZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKCdwYWdlLW1haW5fX2xhYmVsLS1jb3JyZWN0Jyk7Ly8g0KPQtNCw0LvRj9C10Lwg0LzQtdGC0LrRgyDQstCw0LvQuNC00L3QvtGB0YLQuCDQv9C+0LvRjywg0LjRgdC/0L7Qu9GM0LfRg9GPINC30LDRgNCw0L3QtdC1INC/0L7QtNCz0L7RgtC+0LLQu9C10L3QvdGL0Lkg0LrQu9Cw0YHRgdGLINCyIGxlc3NcclxuICAgIH0gLy8g0LfQsNC60L7QvdGH0LjQu9GB0Y8g0YbQuNC60LtcclxuXHJcbiAgICBpZiAoc3RvcFN1Ym1pdCkge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIHRoaXMuY2xhc3NMaXN0LmFkZCgncGFnZS1tYWluX19jb250YWN0LWJ0bi0tZGlzYWJsZScpO1xyXG4gICAgfSBlbHNlICB7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgY29uc29sZS5sb2coZm9ybURhdGEpO1xyXG4gICAgICB0aGlzLmNsYXNzTGlzdC5yZW1vdmUoJ3BhZ2UtbWFpbl9fY29udGFjdC1idG4tLWRpc2FibGUnKTtcclxuICAgICAgcmVxdWVzdChmb3JtRGF0YSApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gaW5wdXRWYWxpZGF0aW9uKGUpIHtcclxuICAgIC8vINCf0YDQvtCy0LXRgNC40Lwg0LLQsNC70LjQtNC90L7RgdGC0Ywg0L/QvtC70Y8sINC40YHQv9C+0LvRjNC30YPRjyDQstGB0YLRgNC+0LXQvdC90YPRjiDQsiBKYXZhU2NyaXB0INGE0YPQvdC60YbQuNGOIGNoZWNrVmFsaWRpdHkoKVxyXG4gICAgaWYgKHRoaXMudmFsdWUubGVuZ3RoIDwgMikgcmV0dXJuO1xyXG4gICAgaWYgKCF0aGlzLmNoZWNrVmFsaWRpdHkoKSkge1xyXG4gICAgICB0aGlzLnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgncGFnZS1tYWluX19sYWJlbC0td3JvbmcnKTtcclxuICAgICAgdGhpcy5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ3BhZ2UtbWFpbl9fbGFiZWwtLWNvcnJlY3QnKTsvLyDQo9C00LDQu9GP0LXQvCDQvNC10YLQutGDINCy0LDQu9C40LTQvdC+0YHRgtC4INC/0L7Qu9GPLCDQuNGB0L/QvtC70YzQt9GD0Y8g0LfQsNGA0LDQvdC10LUg0L/QvtC00LPQvtGC0L7QstC70LXQvdC90YvQuSDQutC70LDRgdGB0Ysg0LIgbGVzc1xyXG4gICAgICB0aGlzLnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LmFkZCgncGFnZS1tYWluX19sYWJlbC0td3JvbmcnKTsvLyDQlNC+0LHQsNC70Y/QtdC8INC80LXRgtC60YMg0J3QlSDQstCw0LvQuNC00L3QvtGB0YLQuCDQv9C+0LvRjywg0LjRgdC/0L7Qu9GM0LfRg9GPINC30LDRgNCw0L3QtdC1INC/0L7QtNCz0L7RgtC+0LLQu9C10L3QvdGL0Lkg0LrQu9Cw0YHRgdGLINCyIGxlc3NcclxuICAgICAgdmFyIGlucHV0Q3VzdG9tVmFsaWRhdGlvbiA9IG5ldyBDdXN0b21WYWxpZGF0aW9uKCk7IC8vINCh0L7Qt9C00LDQtNC40Lwg0L7QsdGK0LXQutGCIEN1c3RvbVZhbGlkYXRpb25cclxuICAgICAgaW5wdXRDdXN0b21WYWxpZGF0aW9uLmNoZWNrVmFsaWRpdHkodGhpcyk7IC8vINCS0YvRj9Cy0LjQvCDQvtGI0LjQsdC60LhcclxuICAgICAgdmFyIGN1c3RvbVZhbGlkaXR5TWVzc2FnZSA9IGlucHV0Q3VzdG9tVmFsaWRhdGlvbi5nZXRJbnZhbGlkaXRpZXMoKTsgLy8g0J/QvtC70YPRh9C40Lwg0LLRgdC1INGB0L7QvtCx0YnQtdC90LjRjyDQvtCxINC+0YjQuNCx0LrQsNGFXHJcbiAgICAgIHRoaXMuc2V0Q3VzdG9tVmFsaWRpdHkoY3VzdG9tVmFsaWRpdHlNZXNzYWdlKTsgLy8g0KPRgdGC0LDQvdC+0LLQuNC8INGB0L/QtdGG0LjQsNC70YzQvdC+0LUg0YHQvtC+0LHRidC10L3QuNC1INC+0LEg0L7RiNC40LHQutC1XHJcblxyXG4gICAgICAvLyDQo9C00LDQu9C40Lwg0YHRg9GJ0LXRgdGC0LLRg9GO0YnQuNC1INC+0YjQuNCx0LrQuCAo0L3QsNC00L4g0LHRg9C00LXRgiDQv9C10YDQtdC00LXQu9Cw0YLRjCDQvdCwIHJlcGxhY2UpXHJcbiAgICAgIGlmKHRoaXMucGFyZW50RWxlbWVudC5jaGlsZHJlbi5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgdGhpcy5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMucGFyZW50RWxlbWVudC5jaGlsZHJlblsxXSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vINCU0L7QsdCw0LLQuNC8INC+0YjQuNCx0LrQuCDQsiDQtNC+0LrRg9C80LXQvdGCXHJcblxyXG4gICAgICAvLyAg0KHRgtGA0L7QutCwINGB0L7QvtCx0YnQtdC90LjRj1xyXG4gICAgICB2YXIgY3VzdG9tVmFsaWRpdHlNZXNzYWdlRm9ySFRNTCA9IGlucHV0Q3VzdG9tVmFsaWRhdGlvbi5nZXRJbnZhbGlkaXRpZXNGb3JIVE1MKCk7XHJcbiAgICAgIC8vINCV0YHQu9C4INC/0L7Qu9C1INC/0YPRgdGC0L7QtSwg0YLQviDQvdC40YfQtdCz0L4g0L3QtSDQtNC10LvQsNC10LxcclxuICAgICAgaWYgKCFjdXN0b21WYWxpZGl0eU1lc3NhZ2VGb3JIVE1MKSB7XHJcbiAgICAgICAgY3VzdG9tVmFsaWRpdHlNZXNzYWdlRm9ySFRNTCA9J1JlcXVpcmVkIGZpZWxkJztcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5wYXJlbnRFbGVtZW50Lmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlRW5kJywgJzxzcGFuIGNsYXNzPVwicGFnZS1tYWluX19sYWJlbC0taGVscFwiPicgKyBjdXN0b21WYWxpZGl0eU1lc3NhZ2VGb3JIVE1MICsgJzwvc3Bhbj4nKTtcclxuICAgICAgaW5wdXRDdXN0b21WYWxpZGF0aW9uLnJlc2V0SW52YWxpZGl0eSgpO1xyXG5cclxuICAgICAgdmFyIHN0b3BTdWJtaXQgPSB0cnVlO1xyXG4gICAgICBcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfSAvLyDQt9Cw0LrQvtC90YfQuNC70YHRjyBpZlxyXG4gICAgLy8g0KPQtNCw0LvQuNC8INGB0YPRidC10YHRgtCy0YPRjtGJ0LjQtSDQvtGI0LjQsdC60LggKNC90LDQtNC+INCx0YPQtNC10YIg0L/QtdGA0LXQtNC10LvQsNGC0Ywg0L3QsCByZXBsYWNlKVxyXG4gICAgaWYodGhpcy5wYXJlbnRFbGVtZW50LmNoaWxkcmVuLmxlbmd0aCA+IDEpIHtcclxuICAgICAgdGhpcy5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMucGFyZW50RWxlbWVudC5jaGlsZHJlblsxXSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgncGFnZS1tYWluX19sYWJlbC0td3JvbmcnKTsvLyDQlNC+0LHQsNC70Y/QtdC8INC80LXRgtC60YMg0J3QlSDQstCw0LvQuNC00L3QvtGB0YLQuCDQv9C+0LvRjywg0LjRgdC/0L7Qu9GM0LfRg9GPINC30LDRgNCw0L3QtdC1INC/0L7QtNCz0L7RgtC+0LLQu9C10L3QvdGL0Lkg0LrQu9Cw0YHRgdGLINCyIGxlc3NcclxuICAgIHRoaXMucGFyZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKCdwYWdlLW1haW5fX2xhYmVsLS1jb3JyZWN0Jyk7Ly8g0KPQtNCw0LvRj9C10Lwg0LzQtdGC0LrRgyDQstCw0LvQuNC00L3QvtGB0YLQuCDQv9C+0LvRjywg0LjRgdC/0L7Qu9GM0LfRg9GPINC30LDRgNCw0L3QtdC1INC/0L7QtNCz0L7RgtC+0LLQu9C10L3QvdGL0Lkg0LrQu9Cw0YHRgdGLINCyIGxlc3NcclxuICAgIFxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcmVxdWVzdChhcmd1bWVudCkge1xyXG4gICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cclxuICAgIHhoci5vcGVuKCdQT1NUJywgJy9zZW5kJywgdHJ1ZSk7XHJcblxyXG4gICAgeGhyLnNlbmQoYXJndW1lbnQpO1xyXG5cclxuICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcclxuICAgICAgaWYgKHRoaXMucmVhZHlTdGF0ZSAhPSA0KSB7XHJcbiAgICAgICAgcmV0dXJuOy8vINC/0L4g0L7QutC+0L3Rh9Cw0L3QuNC4INC30LDQv9GA0L7RgdCwINC00L7RgdGC0YPQv9C90Ys6XHJcbiAgICAgIH1cclxuICAgICAgLy8gc3RhdHVzLCBzdGF0dXNUZXh0XHJcbiAgICAgIC8vIHJlc3BvbnNlVGV4dCwgcmVzcG9uc2VYTUwgKNC/0YDQuCBjb250ZW50LXR5cGU6IHRleHQveG1sKVxyXG4gICAgICBpZiAodGhpcy5zdGF0dXMgIT0gMjAwKSB7XHJcbiAgICAgICAgLy8g0L7QsdGA0LDQsdC+0YLQsNGC0Ywg0L7RiNC40LHQutGDXHJcbiAgICAgICAgYWxlcnQoICfQvtGI0LjQsdC60LA6ICcgKyAodGhpcy5zdGF0dXMgPyB0aGlzLnN0YXR1c1RleHQgOiAn0LfQsNC/0YDQvtGBINC90LUg0YPQtNCw0LvRgdGPJykgKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG59KSh3aW5kb3csIGRvY3VtZW50KTsiLCI7KGZ1bmN0aW9uICh3aW5kb3csZG9jdW1lbnQpIHtcclxuICB2YXIgYnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhZ2UtaGVhZGVyX19zY3JvbGwtYWJvdXQnKTtcclxuXHJcbiAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgc2Nyb2xsID0gd2luZG93LnBhZ2VZT2Zmc2V0LCAgLy8g0L/RgNC+0LrRgNGD0YLQutCwXHJcbiAgICAgICAgaGFzaCA9ICcjYWJvdXQnIC8vIGlkINGN0LvQtdC80LXQvdGC0LAsINC6INC60L7RgtC+0YDQvtC80YMg0L3Rg9C20L3QviDQv9C10YDQtdC50YLQuFxyXG4gICAgICAgIGRpc3RhbmNlRnJvbVdpbmRvdyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoaGFzaCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wIC01MCwgIC8vINC+0YLRgdGC0YPQvyDQvtGCINC+0LrQvdCwINCx0YDQsNGD0LfQtdGA0LAg0LTQviBpZFxyXG4gICAgICAgIHN0YXJ0ID0gbnVsbDtcclxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwKTsgIC8vINC/0L7QtNGA0L7QsdC90LXQtSDQv9GA0L4g0YTRg9C90LrRhtC40Y4g0LDQvdC40LzQsNGG0LjQuCBbZGV2ZWxvcGVyLm1vemlsbGEub3JnXVxyXG4gICAgZnVuY3Rpb24gc3RlcCh0aW1lKSB7XHJcbiAgICAgIGlmIChzdGFydCA9PT0gbnVsbCkgc3RhcnQgPSB0aW1lO1xyXG4gICAgICB2YXIgcHJvZ3Jlc3MgPSB0aW1lIC0gc3RhcnQsXHJcbiAgICAgICAgICBlbmRDb29yZHMgPSAoZGlzdGFuY2VGcm9tV2luZG93IDwgMCA/IE1hdGgubWF4KHNjcm9sbCAtIHByb2dyZXNzL3NwZWVkLCBzY3JvbGwgKyBkaXN0YW5jZUZyb21XaW5kb3cpIDogTWF0aC5taW4oc2Nyb2xsICsgcHJvZ3Jlc3Mvc3BlZWQsIHNjcm9sbCArIGRpc3RhbmNlRnJvbVdpbmRvdykpO1xyXG4gICAgICB3aW5kb3cuc2Nyb2xsVG8oMCxlbmRDb29yZHMpO1xyXG4gICAgICBpZiAoZW5kQ29vcmRzICE9IHNjcm9sbCArIGRpc3RhbmNlRnJvbVdpbmRvdykge1xyXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pXHJcbn0pKHdpbmRvdyxkb2N1bWVudCkiLCJ2YXIgbmF2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNpdGUtbmF2X193cmFwJyksXHJcbiAgICBzcGVlZCA9IDI7ICAvLyDRgdC60L7RgNC+0YHRgtGMLCDQvNC+0LbQtdGCINC40LzQtdGC0Ywg0LTRgNC+0LHQvdC+0LUg0LfQvdCw0YfQtdC90LjQtSDRh9C10YDQtdC3INGC0L7Rh9C60YNcclxuXHJcblxyXG4gIG5hdi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICBpZiAoZS50YXJnZXQudGFnTmFtZSAhPT0gJ0EnKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgbGluayA9IGUudGFyZ2V0LFxyXG4gICAgICAgIHNjcm9sbCA9IHdpbmRvdy5wYWdlWU9mZnNldCwgIC8vINC/0YDQvtC60YDRg9GC0LrQsFxyXG4gICAgICAgIGhhc2ggPSBsaW5rLmhyZWYucmVwbGFjZSgvW14jXSooLiopLywgJyQxJyk7ICAvLyBpZCDRjdC70LXQvNC10L3RgtCwLCDQuiDQutC+0YLQvtGA0L7QvNGDINC90YPQttC90L4g0L/QtdGA0LXQudGC0LhcclxuICAgICAgICBkaXN0YW5jZUZyb21XaW5kb3cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGhhc2gpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCAtIDUzLCAgLy8g0L7RgtGB0YLRg9C/INC+0YIg0L7QutC90LAg0LHRgNCw0YPQt9C10YDQsCDQtNC+IGlkXHJcbiAgICAgICAgc3RhcnQgPSBudWxsO1xyXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXApOyAgLy8g0L/QvtC00YDQvtCx0L3QtdC1INC/0YDQviDRhNGD0L3QutGG0LjRjiDQsNC90LjQvNCw0YbQuNC4IFtkZXZlbG9wZXIubW96aWxsYS5vcmddXHJcbiAgICBcclxuICAgIGZ1bmN0aW9uIHN0ZXAodGltZSkge1xyXG4gICAgICBpZiAoc3RhcnQgPT09IG51bGwpIHN0YXJ0ID0gdGltZTtcclxuICAgICAgdmFyIHByb2dyZXNzID0gdGltZSAtIHN0YXJ0LFxyXG4gICAgICAgICAgZW5kQ29vcmRzID0gKGRpc3RhbmNlRnJvbVdpbmRvdyA8IDAgPyBNYXRoLm1heChzY3JvbGwgLSBwcm9ncmVzcy9zcGVlZCwgc2Nyb2xsICsgZGlzdGFuY2VGcm9tV2luZG93KSA6IFxyXG4gICAgICAgICAgICBNYXRoLm1pbihzY3JvbGwgKyBwcm9ncmVzcy9zcGVlZCwgc2Nyb2xsICsgZGlzdGFuY2VGcm9tV2luZG93KSk7XHJcbiAgICAgIHdpbmRvdy5zY3JvbGxUbygwLGVuZENvb3Jkcyk7XHJcbiAgICAgIGlmIChlbmRDb29yZHMgIT0gc2Nyb2xsICsgZGlzdGFuY2VGcm9tV2luZG93KSB7XHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSk7IiwiOyhmdW5jdGlvbiAod2luZG93LCBkb2N1bWVudCkge1xyXG4gIHZhciB0aW1lcklkID0gbnVsbDtcclxuXHJcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICB2YXIgbmF2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hlYWRlci1uYXYnKTtcclxuICAgIHZhciBjb29yZHMgPSBuYXYuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICB2YXIgaGVhZGVyID0gbmF2LnBhcmVudEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblxyXG5cclxuICAgIGlmICggaGVhZGVyLmJvdHRvbSA8IDAgJiYgIW5hdi5jbGFzc0xpc3QuY29udGFpbnMoXCJwYWdlLWhlYWRlcl9fbmF2LWNvbnRhaW5lci0tdmlzaWJsZVwiKSkge1xyXG4gICAgICBjbGVhclRpbWVvdXQodGltZXJJZCk7XHJcbiAgICAgIG5hdi5jbGFzc0xpc3QucmVtb3ZlKCdwYWdlLWhlYWRlcl9fbmF2LWNvbnRhaW5lci0tdmlzaWJsZScpO1xyXG4gICAgICBuYXYuY2xhc3NMaXN0LnJlbW92ZSgnZmFkZU91dFVwJyk7XHJcbiAgICAgIG5hdi5jbGFzc0xpc3QuYWRkKCdwYWdlLWhlYWRlcl9fbmF2LWNvbnRhaW5lci0tdmlzaWJsZScpO1xyXG4gICAgICBuYXYuY2xhc3NMaXN0LmFkZCgnZmFkZUluRG93bicpO1xyXG5cclxuICAgIH0gZWxzZSBpZiAoIGhlYWRlci5ib3R0b20gPiAwICYmIG5hdi5jbGFzc0xpc3QuY29udGFpbnMoXCJwYWdlLWhlYWRlcl9fbmF2LWNvbnRhaW5lci0tdmlzaWJsZVwiKSkge1xyXG4gICAgICBuYXYuY2xhc3NMaXN0LnJlbW92ZSgnZmFkZUluRG93bicpO1xyXG4gICAgICBuYXYuY2xhc3NMaXN0LmFkZCgnZmFkZU91dFVwJyk7XHJcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgIHRpbWVySWQgPSBuYXYuY2xhc3NMaXN0LnJlbW92ZSgncGFnZS1oZWFkZXJfX25hdi1jb250YWluZXItLXZpc2libGUnKTtcclxuICAgICAgfSwgMTAwMCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgXHJcbn0pKHdpbmRvdywgZG9jdW1lbnQpXHJcblxyXG4iLCI7KGZ1bmN0aW9uICh3aW5kb3csIGRvY3VtZW50KSB7XHJcbiAgdmFyIGl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBvcnRmb2xpby1leGVtcGxlX19pdGVtLXdyYXAnKTtcclxuXHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgaXRlbXNbaV0uYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgdGhpcy5maXJzdEVsZW1lbnRDaGlsZC5jbGFzc0xpc3QucmVtb3ZlKCdmYWRlT3V0JylcclxuICAgICAgdGhpcy5maXJzdEVsZW1lbnRDaGlsZC5jbGFzc0xpc3QuYWRkKCdwb3J0Zm9saW8tZXhlbXBsZV9faXRlbS1pbmZvLXdyYXAtLXZpc2libGUnKTtcclxuICAgICAgdGhpcy5maXJzdEVsZW1lbnRDaGlsZC5jbGFzc0xpc3QuYWRkKCdmYWRlSW5Eb3duJyk7XHJcbiAgICB9KTtcclxuICAgIGl0ZW1zW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgdGhpcy5maXJzdEVsZW1lbnRDaGlsZC5jbGFzc0xpc3QucmVtb3ZlKCdmYWRlSW5Eb3duJyk7XHJcbiAgICAgIHRoaXMuZmlyc3RFbGVtZW50Q2hpbGQuY2xhc3NMaXN0LmFkZCgnZmFkZU91dCcpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59KSh3aW5kb3csIGRvY3VtZW50KVxyXG4iXX0=
