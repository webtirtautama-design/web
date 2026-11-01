/* Script halaman HOME (pasang setelah ilustrasi.js dan artikel-data.js).
   - Slide pertama (sapaan) ada di index.html
   - Slide berikutnya dibuat otomatis dari 4 artikel terbaru di artikel-data.js
   - Slider bisa digeser (sentuh / seret mouse), pakai panah, titik, dan jalan sendiri tiap beberapa detik */
(function () {
    var JUMLAH_ARTIKEL = 4;      // banyak artikel terbaru di slider
    var JEDA = 6500;             // jeda geser otomatis (milidetik)

    var track = document.getElementById('hm-track');
    if (!track) return;

    /* ---------- Buat slide artikel ---------- */
    var data = (typeof DAFTAR_ARTIKEL !== 'undefined' ? DAFTAR_ARTIKEL : []).map(function (a, i) {
        a.id = i;
        return a;
    }).sort(function (a, b) {
        return a.tanggal < b.tanggal ? 1 : (a.tanggal > b.tanggal ? -1 : 0);
    }).slice(0, JUMLAH_ARTIKEL);

    function el(tag, kelas, teks) {
        var e = document.createElement(tag);
        if (kelas) e.className = kelas;
        if (teks != null) e.textContent = teks;
        return e;
    }

    function tombol(teks, href, kelas) {
        var a = el('a', 'btn ' + kelas, teks);
        a.href = href;
        return a;
    }

    data.forEach(function (a) {
        var slide = el('div', 'hm-slide');
        var dalam = el('div', 'hm-slide-in');
        var teks = el('div');

        teks.appendChild(el('span', 'hm-kicker', a.kategori));
        teks.appendChild(el('h2', '', a.judul));
        teks.appendChild(el('p', '', a.ringkasan));
        teks.appendChild(el('span', 'hm-date', BUMDES.formatTanggal(a.tanggal)));

        var tombolWrap = el('div', 'hm-btns');
        var baca = (a.link && a.link !== 'artikel.html') ? a.link : 'artikel.html#artikel-' + a.id;
        tombolWrap.appendChild(tombol('Hubungi Kami', 'hubungikami.html', 'btn-primary'));
        tombolWrap.appendChild(tombol('Baca Selengkapnya', baca, 'btn-secondary'));
        teks.appendChild(tombolWrap);

        var visual = el('div', 'hm-visual');
        if (a.gambar) {
            var img = document.createElement('img');
            img.src = a.gambar;
            img.alt = a.judul;
            img.onerror = function () { visual.innerHTML = BUMDES.svgIlustrasi(a.ilustrasi); };
            visual.appendChild(img);
        } else {
            visual.innerHTML = BUMDES.svgIlustrasi(a.ilustrasi);
        }

        dalam.appendChild(teks);
        dalam.appendChild(visual);
        slide.appendChild(dalam);
        track.appendChild(slide);
    });

    /* ---------- Slider ---------- */
    var slides = track.querySelectorAll('.hm-slide');
    var dotsBox = document.getElementById('hm-dots');
    var btnPrev = document.getElementById('hm-prev');
    var btnNext = document.getElementById('hm-next');
    var dots = [];
    var aktif = 0;
    var timer = null;

    function lebar() { return track.clientWidth || 1; }

    function pindah(i, halus) {
        i = (i + slides.length) % slides.length;
        track.scrollTo({ left: i * lebar(), behavior: halus === false ? 'auto' : 'smooth' });
    }

    function tandai(i) {
        aktif = i;
        dots.forEach(function (d, n) {
            d.classList.toggle('active', n === i);
            if (n === i) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current');
        });
    }

    slides.forEach(function (s, i) {
        var d = el('button', 'hm-dot');
        d.type = 'button';
        d.setAttribute('aria-label', 'Ke slide ' + (i + 1));
        d.addEventListener('click', function () { pindah(i); });
        dotsBox.appendChild(d);
        dots.push(d);
    });
    tandai(0);

    if (slides.length < 2) {                     // kalau hanya 1 slide, sembunyikan kontrol
        btnPrev.hidden = true;
        btnNext.hidden = true;
        dotsBox.hidden = true;
        return;
    }

    btnPrev.addEventListener('click', function () { pindah(aktif - 1); });
    btnNext.addEventListener('click', function () { pindah(aktif + 1); });

    var menunggu = false;
    track.addEventListener('scroll', function () {
        if (menunggu) return;
        menunggu = true;
        requestAnimationFrame(function () {
            menunggu = false;
            var i = Math.round(track.scrollLeft / lebar());
            if (i !== aktif) tandai(i);
        });
    });

    window.addEventListener('resize', function () { pindah(aktif, false); });

    /* ---------- Seret dengan mouse ---------- */
    var seret = false, geser = false, awalX = 0, awalKiri = 0;

    track.addEventListener('pointerdown', function (e) {
        if (e.pointerType !== 'mouse' || e.button !== 0) return;
        seret = true;
        geser = false;
        awalX = e.clientX;
        awalKiri = track.scrollLeft;
        track.classList.add('dragging');
    });

    window.addEventListener('pointermove', function (e) {
        if (!seret) return;
        var dx = e.clientX - awalX;
        if (Math.abs(dx) > 5) geser = true;
        track.scrollLeft = awalKiri - dx;
    });

    function lepas() {
        if (!seret) return;
        seret = false;
        track.classList.remove('dragging');
        pindah(Math.round(track.scrollLeft / lebar()));
    }
    window.addEventListener('pointerup', lepas);
    window.addEventListener('pointercancel', lepas);

    /* setelah menyeret, klik tidak boleh ikut membuka tautan */
    track.addEventListener('click', function (e) {
        if (geser) { e.preventDefault(); e.stopPropagation(); geser = false; }
    }, true);

    /* ---------- Geser otomatis ---------- */
    var kurangGerak = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function mulai() {
        if (kurangGerak || timer) return;
        timer = setInterval(function () { pindah(aktif + 1); }, JEDA);
    }
    function berhenti() {
        clearInterval(timer);
        timer = null;
    }

    var hero = track.parentNode;
    hero.addEventListener('mouseenter', berhenti);
    hero.addEventListener('mouseleave', mulai);
    hero.addEventListener('focusin', berhenti);
    hero.addEventListener('focusout', mulai);
    hero.addEventListener('touchstart', berhenti, { passive: true });
    hero.addEventListener('touchend', mulai, { passive: true });
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) berhenti(); else mulai();
    });

    mulai();
})();