(function() {

    var quotes = $(".quotes");
    var quoteIndex = -1;

    function showNextQuote() {
        ++quoteIndex;
        quotes.eq(quoteIndex % quotes.length)
            .fadeIn(1500)
            .delay(1500)
            .fadeOut(1500, showNextQuote);
    }

    showNextQuote();

})();