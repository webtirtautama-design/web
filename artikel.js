/* Cara menambah artikel: cukup tambah satu blok baru di artikel-data.js.
   Field opsional:
     gambar : "foto.jpg"   -> pakai foto; kalau kosong, dipakai ilustrasi
     ilustrasi : tetes | bayar | keran | jaringan | gelas
     isi    : ["paragraf 1", "paragraf 2", ...]  -> isi lengkap artikel
     link   : kalau diisi alamat lain (bukan artikel.html), kartu menuju alamat itu */
(function () {
    var data = (typeof DAFTAR_ARTIKEL !== 'undefined' ? DAFTAR_ARTIKEL : []).map(function (a, i) {
        a.id = i;
        return a;
    });

    /* terbaru di atas */
    var urut = data.slice().sort(function (a, b) {
        return a.tanggal < b.tanggal ? 1 : (a.tanggal > b.tanggal ? -1 : 0);
    });

    var svgIlustrasi = BUMDES.svgIlustrasi;
    var formatTanggal = BUMDES.formatTanggal;

    var elList   = document.getElementById('ar-list');
    var elDetail = document.getElementById('ar-detail');
    var elGrid   = document.getElementById('ar-grid');
    var elEmpty  = document.getElementById('ar-empty');
    var elFilter = document.getElementById('ar-filter');
    var elSearch = document.getElementById('ar-search');
    var elCount  = document.getElementById('ar-count');
    var elRead   = document.getElementById('ar-read');
    var elMore   = document.getElementById('ar-more');
    var elMoreGr = document.getElementById('ar-more-grid');
    if (!elGrid) return;

    var kategoriAktif = 'Semua';

    /* ---------- Bantuan ---------- */
    function el(tag, kelas, teks) {
        var e = document.createElement(tag);
        if (kelas) e.className = kelas;
        if (teks != null) e.textContent = teks;
        return e;
    }

    function visual(a, kelas) {
        var box = el('div', kelas);
        if (a.gambar) {
            var img = document.createElement('img');
            img.src = a.gambar;
            img.alt = a.judul;
            img.loading = 'lazy';
            /* kalau foto gagal dimuat, pakai ilustrasi */
            img.onerror = function () { box.innerHTML = svgIlustrasi(a.ilustrasi); };
            box.appendChild(img);
        } else {
            box.innerHTML = svgIlustrasi(a.ilustrasi);
        }
        return box;
    }

    function buatKartu(a) {
        var kartu = document.createElement('a');
        kartu.className = 'berita-card';
        kartu.href = (a.link && a.link !== 'artikel.html') ? a.link : '#artikel-' + a.id;

        kartu.appendChild(visual(a, 'berita-img'));

        var body = el('div', 'berita-body');
        body.appendChild(el('span', 'berita-kategori', a.kategori));
        body.appendChild(el('h3', 'berita-judul', a.judul));
        body.appendChild(el('p', 'berita-ringkasan', a.ringkasan));

        var meta = el('div', 'berita-meta');
        meta.appendChild(el('span', '', formatTanggal(a.tanggal)));
        meta.appendChild(el('span', 'berita-baca', 'Baca selengkapnya \u2192'));
        body.appendChild(meta);

        kartu.appendChild(body);
        return kartu;
    }

    /* ---------- Daftar, filter, pencarian ---------- */
    function buatFilter() {
        var kategori = ['Semua'];
        urut.forEach(function (a) {
            if (a.kategori && kategori.indexOf(a.kategori) === -1) kategori.push(a.kategori);
        });

        elFilter.innerHTML = '';
        kategori.forEach(function (k) {
            var b = el('button', 'ar-chip' + (k === kategoriAktif ? ' active' : ''), k);
            b.type = 'button';
            b.setAttribute('aria-pressed', k === kategoriAktif ? 'true' : 'false');
            b.addEventListener('click', function () {
                kategoriAktif = k;
                buatFilter();
                tampilkanDaftar();
            });
            elFilter.appendChild(b);
        });
    }

    function tampilkanDaftar() {
        var q = (elSearch.value || '').toLowerCase().trim();

        var hasil = urut.filter(function (a) {
            var cocokKategori = kategoriAktif === 'Semua' || a.kategori === kategoriAktif;
            var cocokCari = !q || (a.judul + ' ' + a.ringkasan + ' ' + a.kategori).toLowerCase().indexOf(q) !== -1;
            return cocokKategori && cocokCari;
        });

        elGrid.innerHTML = '';
        hasil.forEach(function (a) { elGrid.appendChild(buatKartu(a)); });

        elEmpty.hidden = hasil.length !== 0;
        elCount.textContent = hasil.length === 0 ? '' : 'Menampilkan ' + hasil.length + ' dari ' + urut.length + ' artikel';
    }

    /* ---------- Tampilan baca ---------- */
    function tampilkanDetail(a) {
        elRead.innerHTML = '';
        elRead.appendChild(visual(a, 'berita-img'));

        var body = el('div', 'ar-read-body');
        body.appendChild(el('span', 'berita-kategori', a.kategori));
        body.appendChild(el('h1', '', a.judul));
        body.appendChild(el('span', 'ar-read-date', formatTanggal(a.tanggal)));
        body.appendChild(el('p', 'ar-lead', a.ringkasan));

        if (a.isi && a.isi.length) {
            a.isi.forEach(function (par) { body.appendChild(el('p', '', par)); });
        }
        elRead.appendChild(body);

        /* artikel lainnya (maks. 2, kategori sama didahulukan) */
        var lain = urut.filter(function (x) { return x.id !== a.id; });
        lain.sort(function (x, y) {
            return (y.kategori === a.kategori ? 1 : 0) - (x.kategori === a.kategori ? 1 : 0);
        });
        lain = lain.slice(0, 2);
        elMoreGr.innerHTML = '';
        lain.forEach(function (x) { elMoreGr.appendChild(buatKartu(x)); });
        elMore.hidden = lain.length === 0;

        document.title = a.judul + ' - BUMDes Tirta Utama';
    }

    /* ---------- Pindah tampilan lewat hash ---------- */
    function router() {
        var m = /^#artikel-(\d+)$/.exec(location.hash);
        var a = m ? data[parseInt(m[1], 10)] : null;

        if (a) {
            tampilkanDetail(a);
            elList.hidden = true;
            elDetail.hidden = false;
        } else {
            elDetail.hidden = true;
            elList.hidden = false;
            document.title = 'Artikel - BUMDes Tirta Utama';
        }
        window.scrollTo({ top: 0 });
    }

    elSearch.addEventListener('input', tampilkanDaftar);
    window.addEventListener('hashchange', router);

    buatFilter();
    tampilkanDaftar();
    router();
})();