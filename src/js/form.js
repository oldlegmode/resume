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