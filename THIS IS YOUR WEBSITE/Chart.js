

window.onload = function() {

Highcharts.chart('skillsChart', {
 chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        backgroundColor:'rgba(255, 255, 255, 0.0)'
    },
    
    title: {
        text: 'Skill distribution'
    },
    
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
            }
        }
    },
    
    series: [{
        name: 'Languages',
        colorByPoint: true,
        data: [{
            name: 'HTML',
            y: 35
        }, {
            name: 'CSS',
            y: 11
        }, {
            name: 'JavaScript',
            y: 20
        }, {
            name: 'Bootstrap',
            y: 9
        }, {
            name: 'Highcharts',
            y: 1
        }, {
            name: 'JQuery',
            y: 3
        }, {
            name: 'Python',
            y: 1.2
        }, {
            name: 'SQL',
            y: 16
        }, {
            name: 'Java',
            y: 25
        }]
    }]
});

}