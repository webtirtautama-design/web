/* Script halaman HOME (pasang setelah ilustrasi.js dan artikel-data.js).
   - Slide pertama (sapaan) ada di index.html
   - Slide berikutnya dibuat otomatis dari 4 artikel terbaru di artikel-data.js
   - Slider bisa digeser (sentuh / seret mouse), pakai panah, titik, dan jalan sendiri tiap beberapa detik */
(function () {
    var JUMLAH_ARTIKEL = 4;      // banyak artikel terbaru di slider
    var JEDA = 6500;             // jeda geser otomatis (milidetik)

    var track = document.getElementById('hm-track');
    if (!track) return;

    /* ---------- Buat slide layanan ---------- */
    var IKON = {
        air:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/><path d="M9.5 14.5a2.6 2.6 0 0 0 2.2 2.4"/></svg>',
        simpan:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v9"/><path d="M14.6 9.8c-.5-.9-1.5-1.3-2.6-1.3-1.5 0-2.5.7-2.5 1.7s1 1.5 2.5 1.8 2.5.8 2.5 1.8-1 1.7-2.5 1.7c-1.1 0-2.1-.4-2.6-1.3"/></svg>',
        pasar:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9l1.6-5h12.8L20 9"/><path d="M4 9a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0A2.7 2.7 0 0 0 20 9"/><path d="M5 12v8h14v-8"/><path d="M10 20v-5h4v5"/></svg>',
        ppob:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="6" width="18" height="12" rx="2.2"/><path d="M3 10.5h18"/><path d="M7 15h4"/></svg>',
        digital: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="12" rx="2.2"/><path d="M8 20h8M12 16v4"/><path d="M9.6 8.4L7.6 10l2 1.6M14.4 8.4l2 1.6-2 1.6"/></svg>'
        };

    var DAFTAR_LAYANAN = [
        {   judul: 'Penyediaan Air Bersih',
            ringkasan: 'Distribusi air bersih bagi warga Desa Mukiran dan sekitarnya.',
            ikon: 'air'
        },
        {   judul: 'Simpan Pinjam',
            ringkasan: 'Modal bagi pelaku UMKM dengan jasa pinjaman yang terjangkau.',
            ikon: 'simpan'
        },
        {   judul: 'Pasar Desa',
            ringkasan: 'Memfasilitasi UMKM Desa Mukiran agar berkembang di era digital.',
            ikon: 'pasar'
        },
        {   judul: 'Layanan PPOB',
            ringkasan: 'Pembayaran PBB, listrik, serta transfer ke bank dan e-wallet.',
            ikon: 'ppob'
        },
        {   judul: 'Layanan Digital',
            ringkasan: 'Pembuatan website, company profile, dan aplikasi sesuai kebutuhan.',
            ikon: 'digital'
        }
    ];

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

    DAFTAR_LAYANAN.forEach(function (l, i) {
        var slide = el('div', 'hm-slide');
        var dalam = el('div', 'hm-slide-in');
        var teks = el('div');

        teks.appendChild(el('span', 'hm-kicker', 'Layanan ' + (i + 1) + ' dari ' + DAFTAR_LAYANAN.length));
        teks.appendChild(el('h2', '', l.judul));
        teks.appendChild(el('p', '', l.ringkasan));

        var tombolWrap = el('div', 'hm-btns');
        tombolWrap.appendChild(tombol('Lihat Layanan', 'layanan.html', 'btn-primary'));
        tombolWrap.appendChild(tombol('Hubungi Kami', 'hubungikami.html', 'btn-secondary'));
        teks.appendChild(tombolWrap);

        var visual = el('a', 'hm-visual hm-visual-icon');
        visual.href = 'layanan.html';
        visual.setAttribute('aria-label', 'Lihat layanan ' + l.judul);
        visual.innerHTML = IKON[l.ikon];

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