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

