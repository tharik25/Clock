function clockRotarion() {
    setInterval(function () {
        var date = new Date();
        var seconds = date.getSeconds();
        var minutes = date.getMinutes();
        var hours = date.getHours();
        var secondsRotation = 6 * seconds;
        var minutesRotation = 6 * minutes;
        var hoursRotation = 30 * hours + 0.5 * minutes;
        $("#seconds").css({
            "-webkit-transform": "rotate(" + secondsRotation + "deg)",
            transform: "rotate(" + secondsRotation + "deg)"
        })
    }, 1000);
}
