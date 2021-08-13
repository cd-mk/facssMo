/*=========================================================================================
    File Name: wizard-steps.js
    Description: wizard steps page specific js
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy  - Vuejs, HTML & Laravel Admin Dashboard Template
    Author: PIXINVENT
    Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

$(function () {
    'use strict';

    var bsStepper = document.querySelectorAll('.bs-stepper'),
        select = $('.select2'),
        horizontalWizard = document.querySelector('.horizontal-wizard-example')

    // Adds crossed class
    if (typeof bsStepper !== undefined && bsStepper !== null) {
        for (var el = 0; el < bsStepper.length; ++el) {
            bsStepper[el].addEventListener('show.bs-stepper', function (event) {
                var index = event.detail.indexStep;
                var numberOfSteps = $(event.target).find('.step').length - 1;
                var line = $(event.target).find('.step');

                // The first for loop is for increasing the steps,
                // the second is for turning them off when going back
                // and the third with the if statement because the last line
                // can't seem to turn off when I press the first item. ¯\_(ツ)_/¯

                for (var i = 0; i < index; i++) {
                    line[i].classList.add('crossed');

                    for (var j = index; j < numberOfSteps; j++) {
                        line[j].classList.remove('crossed');
                    }
                }
                if (event.detail.to == 0) {
                    for (var k = index; k < numberOfSteps; k++) {
                        line[k].classList.remove('crossed');
                    }
                    line[0].classList.remove('crossed');
                }
            });
        }
    }

    // select2
    select.each(function () {
        var $this = $(this);
        $this.wrap('<div class="position-relative"></div>');
        $this.select2({
            placeholder: 'Select value',
            dropdownParent: $this.parent()
        });
    });

    // Horizontal Wizard
    // --------------------------------------------------------------------
    if (typeof horizontalWizard !== undefined && horizontalWizard !== null) {
        var numberedStepper = new Stepper(horizontalWizard),
            $form = $(horizontalWizard).find('form');
        $form.each(function () {
            var $this = $(this);
            $this.validate({
                rules: {
                    input1: {
                        required: true,
                        minlength: 4,
                        maxlength: 4
                    },
                    input2: {
                        required: true,
                        minlength: 4,
                        maxlength: 4
                    },
                    input3: {
                        required: true,
                        minlength: 4,
                        maxlength: 4
                    },
                    input4: {
                        required: true,
                        minlength: 4,
                        maxlength: 4
                    }
                }
            });
        });

        $(horizontalWizard)
            .find('.btn-next')
            .each(function () {
                $(this).on('click', function (e) {
                    var isValid = $(this).parent().siblings('form').valid();
                    if (isValid) {
                        numberedStepper.next();
                    } else {
                        e.preventDefault();
                    }
                });
            });

        $(horizontalWizard)
            .find('.btn-prev')
            .on('click', function () {
                numberedStepper.previous();
            });

        $(horizontalWizard)
            .find('.btn-submit')
            .on('click', function () {
                var isValid = $(this).parent().siblings('form').valid();
                if (isValid) {
                    alert('Submitted..!!');
                }
            });
    }



    window.onload = function () {
        // 카메라 버튼
        $(".btn-camera").click(function () {
            $("#photoFile").click();
        });
        // 카메라 재촬영 버튼
        $(".btn-recamera").click(function () {
            $("#photoFile").click();
        });


        // 사진 선택 후
        $("#photoFile").on('change', function () {

            // 파일명만 추출
            if (window.FileReader) {  // modern browser
                var filename = $(this)[0].files[0].name;
            } else {  // old IE
                var filename = $(this).val().split('/').pop().split('\\').pop();  // 파일명만 추출
            }

            // var fileSize = document.getElementById("photoFile").files[0].size;
            // console.log( "파일사이즈 : " + $("#photoFile")[0].files[0].size );
            console.log("파일사이즈 : " + $(this)[0].files[0].size);
            console.log("파일명 : " + filename);

            LoadImg($("#photoFile")[0]);
            $(".step4").show();
            $(".step3").hide()
        });
    }
    // 선택이미지 미리보기
    function LoadImg(value) {
        if (value.files && value.files[0]) {

            var reader = new FileReader();

            reader.onload = function (e) {
                $('#photoImg').attr('src', e.target.result);
                $('#photoImg').show();
            }

            reader.readAsDataURL(value.files[0]);
        }
    }


    //임시 링크 : 사진등록하기 클릭 시
    $(".btn-regist").click(function () {
        $(".step3").show();
        $(".step2").hide();
    });

    //임시 링크 : 모니터링연결 클릭 시
    $(".btn-connect").click(function () {
        $(".step5").show();
        $(".step2").hide();
    });


    //임시 링크 : 팝업의 확인 클릭 시
    $(".registOk .btn").click(function () {
        $(".step1").hide();
        $(".step2").show();
        $(".step3").hide();
        $(".step4").hide();
    });
});
