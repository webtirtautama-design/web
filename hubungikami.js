/* Script halaman HUBUNGI KAMI.
   Formulir tidak memakai server: pesan disusun lalu dibuka lewat WhatsApp atau aplikasi Email. */
(function () {
    var NOMOR_WA = '6281913682231';                 // format internasional, tanpa 0 di depan dan tanpa +
    var EMAIL    = 'tirtautamabumdes@gmail.com';

    var form = document.getElementById('hk-form');
    if (!form) return;

    var nama   = document.getElementById('hk-nama');
    var perlu  = document.getElementById('hk-perlu');
    var pesan  = document.getElementById('hk-pesan');
    var hint   = document.getElementById('hk-hint');

    function valid() {
        var kosong = !nama.value.trim() ? nama : (!pesan.value.trim() ? pesan : null);
        if (kosong) {
            hint.textContent = 'Mohon isi nama dan pesan terlebih dahulu.';
            kosong.focus();
            return false;
        }
        return true;
    }

    function susunPesan() {
        return 'Halo BUMDes Tirta Utama,\n\n' +
               'Nama: ' + nama.value.trim() + '\n' +
               'Keperluan: ' + perlu.value + '\n\n' +
               pesan.value.trim();
    }

    form.addEventListener('click', function (e) {
        var tombol = e.target.closest('[data-via]');
        if (!tombol || !valid()) return;

        var teks = susunPesan();

        if (tombol.getAttribute('data-via') === 'wa') {
            window.open('https://wa.me/' + NOMOR_WA + '?text=' + encodeURIComponent(teks), '_blank', 'noopener');
            hint.textContent = 'WhatsApp akan terbuka. Tekan kirim di sana untuk mengirim pesan Anda.';
        } else {
            window.location.href = 'mailto:' + EMAIL +
                '?subject=' + encodeURIComponent('Pertanyaan: ' + perlu.value) +
                '&body=' + encodeURIComponent(teks);
            hint.textContent = 'Aplikasi email akan terbuka. Tekan kirim di sana untuk mengirim pesan Anda.';
        }
    });

    form.addEventListener('submit', function (e) { e.preventDefault(); });   // Enter tidak memuat ulang halaman
    form.addEventListener('input', function () { hint.textContent = ''; });
})();