/* Script bersama untuk SEMUA halaman (pasang di tiap halaman sebelum </body>):
   1. Garis biru "aktif" di navbar pindah otomatis sesuai halaman yang dibuka
   2. Logo kecil di pojok kiri navbar muncul di semua halaman */
(function () {
    var nav = document.querySelector('.container-navbar');
    if (!nav) return;

    /* ---------- 1. Menu aktif otomatis ---------- */
    var file = decodeURIComponent(location.pathname.split('/').pop() || 'index.html').toLowerCase();
    var links = nav.querySelectorAll('.a-navbar');
    var cocok = null;

    links.forEach(function (a) {
        var tujuan = (a.getAttribute('href') || '').split('#')[0].split('?')[0].split('/').pop().toLowerCase();
        if (tujuan && tujuan === file) cocok = a;
    });

    if (cocok) {                       // kalau halaman ini ada di menu, pindahkan garisnya
        links.forEach(function (a) { a.classList.remove('active'); });
        cocok.classList.add('active');
    }

    /* ---------- 2. Logo kecil di pojok kiri navbar ---------- */
    if (!nav.querySelector('.navbar-logo')) {
        var sumber = document.querySelector('.img-content') || document.querySelector('.footer-logo');
        var mini = document.createElement('img');
        mini.src = sumber ? sumber.getAttribute('src') : 'logo.png';   // ganti nama file logo di sini kalau perlu
        mini.alt = 'Logo BUMDes Tirta Utama';
        mini.className = 'navbar-logo';
        mini.addEventListener('click', function () {
            if (file === 'index.html' || file === '') {
                window.scrollTo({ top: 0 });
            } else {
                window.location.href = 'index.html';
            }
        });
        nav.appendChild(mini);
    }
    /* ---------- 3. Menu HP: tombol garis tiga di kanan ----------
       Di layar kecil hanya HOME yang tampil di bar; menu lain ada di daftar yang dibuka tombol ini.
       (Di layar lebar tombol dan daftar ini disembunyikan oleh CSS.) */
    if (!nav.querySelector('.navbar-toggle')) {
        var panel = document.createElement('div');
        panel.className = 'navbar-menu';
        panel.id = 'navbar-menu';

        links.forEach(function (a, i) {
            if (i === 0) return;                         // menu pertama (HOME) tetap di bar
            var item = document.createElement('a');
            item.className = 'navbar-menu-link' + (a.classList.contains('active') ? ' active' : '');
            item.href = a.getAttribute('href');
            item.textContent = a.textContent;
            panel.appendChild(item);
        });

        var tombol = document.createElement('button');
        tombol.type = 'button';
        tombol.className = 'navbar-toggle';
        tombol.setAttribute('aria-label', 'Buka menu');
        tombol.setAttribute('aria-expanded', 'false');
        tombol.setAttribute('aria-controls', 'navbar-menu');
        tombol.innerHTML =
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
            '<path class="ic-buka" d="M4 7h16M4 12h16M4 17h16"/>' +
            '<path class="ic-tutup" d="M6 6l12 12M18 6L6 18"/></svg>';

        function atur(buka) {
            nav.classList.toggle('nav-open', buka);
            tombol.setAttribute('aria-expanded', buka ? 'true' : 'false');
            tombol.setAttribute('aria-label', buka ? 'Tutup menu' : 'Buka menu');
        }

        tombol.addEventListener('click', function (e) {
            e.stopPropagation();
            atur(!nav.classList.contains('nav-open'));
        });
        document.addEventListener('click', function (e) {
            if (!nav.contains(e.target)) atur(false);    // klik di luar menu = tutup
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') atur(false);
        });
        window.addEventListener('resize', function () {
            if (window.innerWidth > 860) atur(false);
        });

        nav.appendChild(tombol);
        nav.appendChild(panel);
    }
})();