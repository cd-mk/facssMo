


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

/*====  업로드 사진 체인지 =======*/
$(function () {
  var changePicture = $('#change-picture'),
    userAvatar = $('.user-avatar');

  // Change user profile picture
  if (changePicture.length) {
    $(changePicture).on('change', function (e) {
      var reader = new FileReader(),
        files = e.target.files;
      reader.onload = function () {
        if (userAvatar.length) {
          userAvatar.attr('src', reader.result);
        }
      };
      reader.readAsDataURL(files[0]);
    });
  }

  var changePictureFace = $('#change-picture-face'),
    userAvatarFace = $('.user-avatar-face');

  // Change user profile picture
  if (changePictureFace.length) {
    $(changePictureFace).on('change', function (e) {
      var reader = new FileReader(),
        files = e.target.files;
      reader.onload = function () {
        if (userAvatarFace.length) {
          userAvatarFace.attr('src', reader.result);
        }
      };
      reader.readAsDataURL(files[0]);
    });
  }

});

  //확인체크하면 버튼 활성화
  $("input[name='checkOk']").change(function () {
    var lenAll = $("input[name='checkOk']").length;
    var len = $("input[name='checkOk']:checked").length;
    if (len === lenAll)
      $(".btn-checkOk").removeClass("disabled");
    else
      $(".btn-checkOk").addClass("disabled");

  });

})(window);
