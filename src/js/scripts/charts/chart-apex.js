/*=========================================================================================
    File Name: chart-apex.js
    Description: Apexchart Examples
==========================================================================================*/

$(function () {
  'use strict';

  var flatPicker = $('.flat-picker'),
    isRtl = $('html').attr('data-textdirection') === 'rtl',
    chartColors = {
      column: {
        series1: '#826af9',
        series2: '#d2b0ff',
        bg: '#f8d3ff'
      },
      success: {
        shade_100: '#7eefc7',
        shade_200: '#06774f'
      },
      donut: {
        series1: '#6568ef',
        series2: '#fc7600',
        series3: '#ffce2b',
        series4: '#04cfac',
        series5: '#c84ee5',
        series6: '#ea5455',
        series7: '#20c9f5',
        series8: '#86c814'
      },
      area: {
        series3: '#a4f8cd',
        series2: '#60f2ca',
        series1: '#2bdac7'
      }
    };



  // Donut Chart
  // --------------------------------------------------------------------
  var donutChartEl = document.querySelector('#donut-chart'),
    donutChartConfig = {
      chart: {
        height: 350,
        type: 'donut'
      },
      legend: {
        show: true,
        position: 'bottom'
      },
      labels: ['정상출근', '지각', '조퇴', '외출', '정상퇴근', '무단결근', '휴가', '외출복귀'],
      series: [85, 16, 50, 50, 10, 20, 40, 15],
      colors: [
        chartColors.donut.series1,
        chartColors.donut.series5,
        chartColors.donut.series3,
        chartColors.donut.series4,
        chartColors.donut.series5,
        chartColors.donut.series6,
        chartColors.donut.series7,
        chartColors.donut.series8
      ],
      dataLabels: {
        enabled: true,
        formatter: function (val, opt) {
          return parseInt(val) + '%';
        }
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                fontSize: '1rem',
                fontFamily: 'Noto Sans KR'
              },
              value: {
                fontSize: '1.5rem',
                fontFamily: 'Noto Sans KR',
                formatter: function (val) {
                  return parseInt(val) + '%';
                }
              },
              total: {
                show: true,
                fontSize: '1rem',
                label: '출근율',
                formatter: function (w) {
                  return '31%';
                }
              }
            }
          }
        }
      }
    };
  if (typeof donutChartEl !== undefined && donutChartEl !== null) {
    var donutChart = new ApexCharts(donutChartEl, donutChartConfig);
    donutChart.render();
  }
});
