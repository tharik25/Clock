function clockRotation() {
    setInterval(function () {
        var date = new Date();
        var seconds = date.getSeconds();
        var minutes = date.getMinutes();
        var hours = date.getHours();
        var secondsRotation = 6 * seconds;
        var minutesRotation = 6 * minutes;
        var hoursRotation = 30 * (hours % 12) + 0.5 * minutes;
        $("#seconds").css({
            "-webkit-transform": "rotate(" + secondsRotation + "deg)",
            transform: "rotate(" + secondsRotation + "deg)"
        })
        $("#minutes").css({
            "-webkit-transform": "rotate(" + minutesRotation + "deg)",
            transform: "rotate(" + minutesRotation + "deg)"
        })
        $("#hours").css({
            "-webkit-transform": "rotate(" + hoursRotation + "deg)",
            transform: "rotate(" + hoursRotation + "deg)"
        })
    }, 1000);
}

// Export function for demo usage in index.html
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { clockRotation };
}
