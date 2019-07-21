function scrollToTop() {
    var position =
        document.body.scrollTop || document.documentElement.scrollTop;
    if (position) {
        window.scrollBy(0, -Math.max(1, Math.floor(position / 10)));
        scrollAnimation = setTimeout("scrollToTop()", 30);
    } else clearTimeout(scrollAnimation);
}




window.onload = function() {

Highcharts.chart('skillsChart', {
 chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        backgroundColor:'rgba(255, 255, 255, 0.0)',
        width: 600,
        height: 600
    },
    
    title: {
        text: 'Skill distribution',
        style: {
            fontSize: '22px',
            fontWeight: 'bold'
        }
    },
    
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
        style: {
            fontSize: '22px',
            fontWeight: 'bold'
        }
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
            y: 20
        }, {
            name: 'CSS',
            y: 25
        }, {
            name: 'JavaScript',
            y: 15
        }, {
            name: 'Bootstrap',
            y: 10
        }, {
            name: 'Highcharts',
            y: 5
        }, {
            name: 'jQuery',
            y: 5
        }, {
            name: 'Python',
            y: 2
        }, {
            name: 'SQL',
            y: 5
        }, {
            name: 'Java',
            y: 25
        }]
    }]
});

}