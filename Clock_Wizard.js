function clockRotation() {
    // Create ticks and numbers if not already present
    if ($('.ticks').children().length === 0) {
        for (var i = 0; i < 60; i++) {
            var tick = $('<div class="tick"></div>');
            tick.addClass((i % 5 === 0) ? 'large' : 'small');
            var deg = i * 6;
            tick.css({ 'transform': 'translate(-50%,-100%) rotate(' + deg + 'deg) translateY(-50%)' });
            $('.ticks').append(tick);
        }
    }
    if ($('.numbers').children().length === 0) {
        for (var h = 1; h <= 12; h++) {
            var n = $('<div class="num"></div>');
            n.text(h);
            n.addClass('large');
            var deg = h * 30;
            // Position numbers 40% from center
            var r = 42; // percent
            var rad = (deg - 90) * (Math.PI / 180);
            var x = 50 + r * Math.cos(rad);
            var y = 50 + r * Math.sin(rad);
            n.css({ left: x + '%', top: y + '%', transform: 'translate(-50%,-50%)' });
            $('.numbers').append(n);
        }
    }

    var smooth = true;
    var smoothToggle = document.getElementById('smoothToggle');
    var themeToggle = document.getElementById('themeToggle');
    var brandWatermark = document.querySelector('.clock .brand-watermark');
    // Dates dial (between numbers and months)
    var lastMonthIndex = null;
    var lastYear = null;

    // Populate info-board months list with only the current month (single item)
    if ($('.info-board .months-list').children().length === 0) {
        var monthsArr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var monthEl = $('<div class="month-item"></div>');
        var currMonth = new Date().getMonth();
        monthEl.text(monthsArr[currMonth]);
        monthEl.attr('data-month-index', currMonth);
        $('.info-board .months-list').append(monthEl);
    }
    var digitalEl = document.querySelector('.digital');
    var dateEl = document.querySelector('.date');

    // Initialize toggles from localStorage
    try {
        var savedSmooth = localStorage.getItem('clock_smooth');
        var savedTheme = localStorage.getItem('clock_theme');
        if (savedSmooth !== null && smoothToggle) {
            smooth = savedSmooth === '1';
            smoothToggle.checked = smooth;
        }
        if (savedTheme !== null && themeToggle) {
            var themeOn = savedTheme === '1';
            themeToggle.checked = themeOn;
            document.body.classList.toggle('dark', themeOn);
        }
    } catch (err) {}

    if (smoothToggle) {
        smoothToggle.setAttribute('role', 'switch');
        smoothToggle.setAttribute('aria-label', 'Smooth motion');
        smoothToggle.addEventListener('change', function (e) {
            smooth = !!e.target.checked;
            try { localStorage.setItem('clock_smooth', smooth ? '1' : '0'); } catch (err) {}
        });
    }
    if (themeToggle) {
        themeToggle.setAttribute('role', 'switch');
        themeToggle.setAttribute('aria-label', 'Dark theme');
        themeToggle.addEventListener('change', function (e) {
            document.body.classList.toggle('dark', !!e.target.checked);
            try { localStorage.setItem('clock_theme', e.target.checked ? '1' : '0'); } catch (err) {}
        });
    }
    // reset button removed — the display always shows current month/date
    // Keyboard shortcuts: S to toggle smooth, T to toggle theme
    document.addEventListener('keydown', function (e) {
        if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable)) return;
        if (e.key === 's' || e.key === 'S') {
            if (smoothToggle) {
                smoothToggle.checked = !smoothToggle.checked;
                smoothToggle.dispatchEvent(new Event('change'));
            }
        }
        if (e.key === 't' || e.key === 'T') {
            if (themeToggle) {
                themeToggle.checked = !themeToggle.checked;
                themeToggle.dispatchEvent(new Event('change'));
            }
        }
    });

    function update() {
        var date = new Date();
        var ms = date.getMilliseconds();
        var sec = date.getSeconds();
        var mins = date.getMinutes();
        var hrs = date.getHours();
        var s = smooth ? sec + ms / 1000 : sec;
        var m = smooth ? mins + s / 60 : mins;
        var h = smooth ? (hrs % 12) + m / 60 : (hrs % 12) + mins / 60;
        var secondsRotation = 6 * s;
        var minutesRotation = 6 * m;
        var hoursRotation = 30 * h;
        $('#seconds').css({ transform: 'translateX(-50%) rotate(' + secondsRotation + 'deg)' });
        $('#minutes').css({ transform: 'translateX(-50%) rotate(' + minutesRotation + 'deg)' });
        $('#hours').css({ transform: 'translateX(-50%) rotate(' + hoursRotation + 'deg)' });
        
        // Update digital time
        if (digitalEl) {
            var ampm = hrs >= 12 ? 'PM' : 'AM';
            var displayHours = ((hrs + 11) % 12) + 1; // 12-hour
            var ds = Math.floor(s).toString().padStart(2, '0');
            var dm = mins.toString().padStart(2, '0');
            var dh = displayHours.toString().padStart(2, '0');
            digitalEl.textContent = dh + ':' + dm + ':' + ds + ' ' + ampm;
        }
        // Update date
        if (dateEl) {
            var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
            var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
            var day = days[date.getDay()];
            var mo = months[date.getMonth()];
            dateEl.textContent = day + ', ' + mo + ' ' + date.getDate() + ', ' + date.getFullYear();
        }
        // Update months highlight (use real current month)
        var currentMonthIndex = date.getMonth();
        var currentYear = date.getFullYear();
        $('.info-board .months-list .month-item').each(function () {
            var el = $(this);
            var idx = parseInt(el.attr('data-month-index'), 10);
            if (idx === currentMonthIndex) {
                el.addClass('current');
            } else {
                el.removeClass('current');
            }
        });
        // Recreate date item if month or year changed - only show the current day
        var monthChanged = (currentMonthIndex !== lastMonthIndex || currentYear !== lastYear || $('.info-board .dates-list').children().length === 0);
        if (monthChanged) {
            // Replace dates list with only the current day
            $('.info-board .dates-list').empty();
            var today = new Date().getDate();
            var dateElItem = $('<div class="date-item"></div>');
            dateElItem.text(today);
            dateElItem.attr('data-day-index', today);
            $('.info-board .dates-list').append(dateElItem);
            lastMonthIndex = currentMonthIndex;
            lastYear = currentYear;
            // Flip month badge on month change
            var monthEl = $('.info-board .months-list .month-item').first();
            if (monthEl.length) {
                monthEl.addClass('flip');
                setTimeout(function () { monthEl.removeClass('flip'); }, 600);
            }
        }
        // Highlight current date (ensure single current day shown)
        var currentDay = date.getDate();
        var dEl = $('.info-board .dates-list .date-item').first();
        if (dEl.length) {
            dEl.text(currentDay);
            dEl.attr('data-day-index', currentDay);
            dEl.addClass('current');
            // Flip date badge on day change
            if (currentDay !== window._lastDayShown) {
                dEl.addClass('flip');
                setTimeout(function () { dEl.removeClass('flip'); }, 600);
            }
        }
        // Pulse brand when month or day changes
        var brandEl = document.querySelector('.clock .brand');
        if (brandEl) {
            if (monthChanged || currentDay !== window._lastDayShown) {
                brandEl.classList.remove('pulse');
                // Force reflow to restart animation
                void brandEl.offsetWidth;
                brandEl.classList.add('pulse');
            }
        }
        window._lastDayShown = currentDay;
        // Add focus/hover reveal to watermark
        if (brandWatermark) {
            brandWatermark.addEventListener('focus', function () { brandWatermark.classList.add('reveal'); });
            brandWatermark.addEventListener('blur', function () { brandWatermark.classList.remove('reveal'); });
            brandWatermark.addEventListener('mouseenter', function () { brandWatermark.classList.add('reveal'); });
            brandWatermark.addEventListener('mouseleave', function () { brandWatermark.classList.remove('reveal'); });
            // Keyboard toggle: Enter/Space to toggle smooth motion
            brandWatermark.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (smoothToggle) {
                        smoothToggle.checked = !smoothToggle.checked;
                        smoothToggle.dispatchEvent(new Event('change'));
                    }
                }
            });
        }
        // No click handlers — only current month/day displayed
        requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

// Export function for demo usage in index.html
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { clockRotation };
}
