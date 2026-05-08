/* ═══════════════════════════════════════
   RTC HERITAGE PORTAL — script.js
   ═══════════════════════════════════════ */

window.onload = function () {

    /* ── GALLERY VIDEO: pause when off-screen to prevent scroll jank ── */
    if ('IntersectionObserver' in window) {
        document.querySelectorAll('.gallery-card video').forEach(function (video) {
            var obs = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        video.play().catch(function () {});
                    } else {
                        video.pause();
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
            obs.observe(video);
        });
    }

    /* ── HERO SLIDER ── */
    var slides  = document.querySelectorAll('.slide');
    var current = 0;

    if (slides.length > 0) {
        slides[current].classList.add('active');
        setInterval(function () {
            slides[current].classList.remove('active');
            slides[current].style.transform = 'scale(1)';
            current = (current + 1) % slides.length;
            void slides[current].offsetWidth;
            slides[current].classList.add('active');
        }, 6000);
    }

    /* ── SHARED VARS ── */
    var hamburger     = document.getElementById('hamburger');
    var mainNav       = document.getElementById('main-nav');
    var searchBtn     = document.getElementById('search-btn');
    var searchWrapper = document.getElementById('search-wrapper');
    var searchInput   = document.getElementById('search-input');

    /* ── HOVER DROPDOWNS (desktop) ── */
    document.querySelectorAll('.has-dropdown').forEach(function (item) {
        var mega   = item.querySelector('.mega-dropdown');
        var simple = item.querySelector('.dropdown');
        var drop   = mega || simple;
        if (!drop) return;

        var closeTimer = null;

        function openDrop() {
            clearTimeout(closeTimer);
            document.querySelectorAll('.mega-dropdown, .dropdown').forEach(function (d) {
                if (d !== drop) d.style.display = '';
            });
            drop.style.display = 'flex';
        }

        function scheduleDrop() {
            closeTimer = setTimeout(function () { drop.style.display = ''; }, 120);
        }

        item.addEventListener('mouseenter', function () { if (window.innerWidth > 900) openDrop(); });
        item.addEventListener('mouseleave', function () { if (window.innerWidth > 900) scheduleDrop(); });
        drop.addEventListener('mouseenter', function () { if (window.innerWidth > 900) clearTimeout(closeTimer); });
        drop.addEventListener('mouseleave', function () { if (window.innerWidth > 900) scheduleDrop(); });
    });

    /* ── SEARCH ── */
    if (searchBtn) {
        searchBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            var isExpanded = searchWrapper.classList.toggle('expanded');
            if (isExpanded) { searchInput.focus(); }
            else { searchInput.value = ''; searchInput.blur(); }
        });
    }

    document.addEventListener('click', function (e) {
        if (searchWrapper && !searchWrapper.contains(e.target)) {
            searchWrapper.classList.remove('expanded');
            if (searchInput) searchInput.value = '';
        }
    });

    /* ── HAMBURGER ── */
    if (hamburger) {
        hamburger.addEventListener('click', function (e) {
            e.stopPropagation();
            hamburger.classList.toggle('open');
            mainNav.classList.toggle('open');
        });
    }

   document.querySelectorAll('.has-dropdown').forEach(function (item) {
    item.addEventListener('click', function (e) {
        if (window.innerWidth <= 900) {
            // If the click came from a real <a> link (not the toggle row itself), let it navigate
            var clickedLink = e.target.closest('a');
            var toggleLink  = item.querySelector(':scope > a');
            if (clickedLink && clickedLink !== toggleLink) {
                // It's a child nav link — allow normal navigation
                return;
            }

            var mega     = item.querySelector('.mega-dropdown');
            var simple   = item.querySelector('.dropdown');
            var dropdown = mega || simple;
            var arrow    = item.querySelector('.arrow');
            if (!dropdown) return;

            var isOpen = dropdown.classList.contains('mobile-open');
            document.querySelectorAll('.mega-dropdown.mobile-open, .dropdown.mobile-open')
                .forEach(function (d) { d.classList.remove('mobile-open'); });
            document.querySelectorAll('.arrow')
                .forEach(function (a) { a.style.transform = ''; });

            if (!isOpen) {
                dropdown.classList.add('mobile-open');
                if (arrow) arrow.style.transform = 'rotate(180deg)';
            }
            e.preventDefault(); // only blocks the parent toggle, not child links
        }
    });
});

    /* ── CLOSE NAV ON OUTSIDE CLICK ── */
    document.addEventListener('click', function (e) {
        if (mainNav && hamburger &&
            !mainNav.contains(e.target) &&
            !hamburger.contains(e.target)) {
            mainNav.classList.remove('open');
            hamburger.classList.remove('open');
            document.querySelectorAll('.mega-dropdown.mobile-open, .dropdown.mobile-open')
                .forEach(function (d) { d.classList.remove('mobile-open'); });
        }
    });

    /* Theme nav links — scroll to themes section */
document.querySelectorAll('[data-theme]').forEach(function (link) {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        if (mainNav)   mainNav.classList.remove('open');
        if (hamburger) hamburger.classList.remove('open');
        var themesSection = document.getElementById('features');
        if (themesSection) {
            themesSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
});
        window.addEventListener('resize', function () { jumpTo(featCurrent); });

        document.getElementById('featuresNext').addEventListener('click', function () {
            slideTo(featCurrent + 1); resetAuto();
        });
        document.getElementById('featuresPrev').addEventListener('click', function () {
            slideTo(featCurrent - 1); resetAuto();
        });

        featDots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                slideTo(parseInt(dot.dataset.index) + 1); resetAuto();
            });
        });

        function startAuto() {
            clearInterval(featAuto);
            if (!isPaused) {
                featAuto = setInterval(function () { slideTo(featCurrent + 1); }, 5000);
            }
        }

        function resetAuto() { clearInterval(featAuto); startAuto(); }

        var featViewport = document.querySelector('.features-viewport');
        if (featViewport) {
            featViewport.addEventListener('wheel', function (e) {
                e.stopPropagation();
            }, { passive: true });

            featViewport.addEventListener('mouseenter', function () {
                isPaused = true;
                clearInterval(featAuto);
            });
            featViewport.addEventListener('mouseleave', function () {
                isPaused = false;
                startAuto();
            });
        }

        /* Theme nav links → scroll to features slider */
        document.querySelectorAll('[data-theme]').forEach(function (link) {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                var themeIndex = parseInt(this.dataset.theme) + 1;
                if (mainNav)   mainNav.classList.remove('open');
                if (hamburger) hamburger.classList.remove('open');
                document.querySelector('.features-slider').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                setTimeout(function () {
                    isPaused = false;
                    clearInterval(featAuto);
                    slideTo(themeIndex);
                    startAuto();
                }, 500);
            });
        });

        /* ?theme= param from inner pages */
        var urlParams  = new URLSearchParams(window.location.search);
        var themeParam = urlParams.get('theme');

        if (themeParam !== null) {
            window.history.replaceState({}, '', window.location.pathname);
            var themeIndex = parseInt(themeParam) + 1;
            jumpTo(themeIndex);
            featCurrent = themeIndex;
            updateDots();
            setTimeout(function () {
                var featSection = document.getElementById('features') ||
                                  document.querySelector('.features-slider');
                if (featSection) {
                    featSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 300);
        }

        jumpTo(featCurrent);
        triggerInView();
        updateDots();
        startAuto();

    } /* end if(featTrack) */

    /* ── STORY VIDEO PLAY BUTTON ── */
    var storyVideo   = document.getElementById('main-video');
    var storyPlayBtn = document.getElementById('play-overlay-btn');

    if (storyVideo && storyPlayBtn) {

        storyPlayBtn.addEventListener('click', function () {
            storyVideo.setAttribute('controls', '');
            storyVideo.style.pointerEvents = 'auto';
            storyPlayBtn.classList.add('hidden');
            storyVideo.play().catch(function (e) {
                console.log('Play error:', e);
            });
        });

        storyVideo.addEventListener('pause', function () {
            if (storyVideo.ended) return;
            storyVideo.removeAttribute('controls');
            storyVideo.style.pointerEvents = 'none';
            storyPlayBtn.classList.remove('hidden');
        });

        storyVideo.addEventListener('ended', function () {
            storyVideo.removeAttribute('controls');
            storyVideo.style.pointerEvents = 'none';
            storyPlayBtn.classList.remove('hidden');
        });
    }

 /* end window.onload */


/* ═══════════════════════════════════════
   CROSS-PAGE CONTENT DATA
   ═══════════════════════════════════════ */

var allContent = {
    films: [
        { video: 'image/laya.mp4',      title: 'Voices of Laya',       desc: 'A portrait of the Layap people — their yak herding traditions, matrilineal customs, and the haunting songs sung at altitude.' },
        { video: 'image/deity.mp4',     title: 'The Living Deity',      desc: 'Following the annual Tsechu festival at Paro Dzong, where sacred cham dances invoke protection for an entire valley.' },
        { video: 'image/salt.mp4',      title: 'Salt & Passes',         desc: 'Tracing the ancient trade routes between Tibet and Bhutan through the eyes of the last generation of highland traders.' },
        { video: 'image/threads.mp4',   title: 'Threads of Kishuthara', desc: 'Inside the homes of Khoma village weavers, where silk patterns carry coded stories of ancestry and seasonal change.' },
        { video: 'image/monastery.mp4', title: 'The Monastery School',  desc: 'A year inside a remote shedra where young monks memorise ancient texts while navigating a rapidly modernising Bhutan.' },
        { video: 'image/merak.mp4',     title: 'Return to Merak',       desc: 'A Brokpa elder returns to the village of his birth after four decades — finding both change and a fierce cultural resilience.' }
    ],
    photoessay: [
        { img: 'image/Bhutan-Ceremonial-procession-getting-ready.jpg', title: 'Before the Mask',      desc: 'Backstage portraits of cham dancers preparing in silence — robes folded, faces calm before transformation.' },
        { img: 'image/Bhutan_mountains.jpg',                           title: 'Above the Cloud Line', desc: 'High-altitude landscapes of the Lunana Gewog, where glacial lakes reflect a sky untouched by light pollution.' },
        { img: 'image/ritual.jpeg',                                    title: 'Fire & Juniper',       desc: 'The lhab-sang smoke ritual at dawn — photographs of incense, prayer flags, and ash rising over mountain ridgelines.' },
        { img: 'image/namads.jpeg',                                    title: 'Felt & Flock',         desc: 'The craft of namda felt-making in Haa — hands pressing raw wool into dense, patterned mats beside open hearths.' },
        { img: 'image/culture.jpg',                                    title: 'The Harvest Table',    desc: 'Post-harvest gatherings in Phobjikha valley — red rice, ara, and communal meals laid on woven grass mats.' },
        { img: 'image/student.jpg',                                    title: 'Daughters of Sephu',   desc: 'Young women from Sephu balancing school notebooks and traditional striped kiras — two worlds in a single frame.' }
    ],
    vignettes: [
        { img: 'image/ritual.jpeg',          title: 'The Butter Lamp Room',      desc: 'A written sketch of an elderly nun who tends 108 lamps each morning in a monastery above Trongsa — alone, methodical, luminous.' },
        { img: 'image/Bhutan_mountains.jpg', title: 'When the Snow Comes Early', desc: 'A Laya herder recounts the winter of 2019 — when unexpected snow buried pastureland and changed a migration route forever.' },
        { img: 'image/culture.jpg',          title: 'Ara & Absence',             desc: 'On the ritual of distilling home-brewed ara and the conversations it opens — grief, memory, and highland hospitality.' },
        { img: 'image/namads.jpeg',          title: 'The Archery Ground at Dusk',desc: 'A single afternoon at a village datse competition — laughter, rivalry, and unspoken language between lifelong friends.' },
        { img: 'image/education.webp',       title: 'Reading the Sky',           desc: 'An elder from Merak explains cloud formations and snowfall patterns — knowledge passed down without ever being written.' },
        { img: 'image/student.jpg',          title: 'The Last Thangka Painter',  desc: 'A portrait of a master thangka artist in his seventies — hands still steady, apprentice absent, pigments ground from stone.' }
    ]
};

var cardGrid   = document.querySelector('.inner-cards');
var filterOpts = document.querySelectorAll('.filter-option');

function renderCards(set) {
    var items = allContent[set];
    if (!cardGrid || !items) return;

    cardGrid.style.opacity   = '0';
    cardGrid.style.transform = 'translateY(10px)';
    cardGrid.style.transition = 'opacity 0.25s ease, transform 0.25s ease';

    setTimeout(function () {
        cardGrid.innerHTML = items.map(function (item, i) {
            return '<a href="#" class="inner-card" style="animation-delay:' + (0.1 + i * 0.1) + 's">' +
                (item.video
                    ? '<video autoplay muted loop playsinline><source src="' + item.video + '" type="video/mp4"></video>'
                    : '<img src="' + item.img + '" alt="' + item.title + '">'
                ) +
                '<div class="inner-card-info"><h4>' + item.title + '</h4><p>' + item.desc + '</p></div>' +
                '</a>';
        }).join('');

        cardGrid.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
        cardGrid.style.opacity    = '1';
        cardGrid.style.transform  = 'translateY(0)';
    }, 250);
}

if (filterOpts.length && cardGrid) {
    filterOpts.forEach(function (opt) {
        opt.addEventListener('click', function (e) {
            e.preventDefault();
            filterOpts.forEach(function (o) { o.classList.remove('active'); });
            this.classList.add('active');

            var trigger = document.querySelector('.filter-trigger');
            if (trigger) trigger.childNodes[0].textContent = this.textContent + ' ';

            renderCards(this.dataset.set);
        });
    });
}


/* ═══════════════════════════════════════
   LANGUAGE TOGGLE
   ═══════════════════════════════════════ */

(function () {
    var wrapper  = document.getElementById('lang-wrapper');
    var btn      = document.getElementById('lang-btn');
    var dropdown = document.getElementById('lang-dropdown');
    var label    = document.getElementById('lang-label');

    if (!btn) return;

    btn.addEventListener('click', function (e) {
        e.stopPropagation();
        wrapper.classList.toggle('open');
    });

    document.querySelectorAll('.lang-option').forEach(function (opt) {
        opt.addEventListener('click', function () {
            if (opt.disabled) return;
            document.querySelectorAll('.lang-option').forEach(function (o) {
                o.classList.remove('active');
            });
            opt.classList.add('active');
            label.textContent = opt.dataset.lang.toUpperCase();
            wrapper.classList.remove('open');
        });
    });

    document.addEventListener('click', function () {
        wrapper.classList.remove('open');
    });

    dropdown.addEventListener('click', function (e) {
        e.stopPropagation();
    });
})();
/* ── THEMES HORIZONTAL DRAG SCROLL ── */
var themesTrack = document.getElementById('themesScrollTrack');
if (themesTrack) {
    var isDown = false;
    var startX;
    var scrollLeft;

    themesTrack.addEventListener('mousedown', function (e) {
        isDown = true;
        startX = e.pageX - themesTrack.offsetLeft;
        scrollLeft = themesTrack.scrollLeft;
    });

    themesTrack.addEventListener('mouseleave', function () { isDown = false; });
    themesTrack.addEventListener('mouseup',    function () { isDown = false; });

    themesTrack.addEventListener('mousemove', function (e) {
        if (!isDown) return;
        e.preventDefault();
        var x    = e.pageX - themesTrack.offsetLeft;
        var walk = (x - startX) * 1.5;
        themesTrack.scrollLeft = scrollLeft - walk;
    });
}