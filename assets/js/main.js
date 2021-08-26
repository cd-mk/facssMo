


(function (window, undefined) {
  'use strict';


  $(window).on('load', function () {
      if (feather) {
          feather.replace({
              width: 14,
              height: 14
          });
      }
    localStorage.clear()
  })


})(window);
