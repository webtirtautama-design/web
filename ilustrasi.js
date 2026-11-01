/* Bagian bersama: ilustrasi artikel + format tanggal.
   Dipakai oleh index.html (slider) dan artikel.html. Pasang SEBELUM artikel.js / beranda.js. */
window.BUMDES = (function () {
    var BG = '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#EEF6FC"/><stop offset="1" stop-color="#CDE5F6"/></linearGradient></defs><rect width="320" height="200" fill="url(#g)"/>';
    var ILUSTRASI = {
        tetes:
            '<circle cx="160" cy="105" r="78" fill="#FFFFFF" opacity=".55"/>' +
            '<path d="M160 38s44 48 44 84a44 44 0 0 1-88 0c0-36 44-84 44-84z" fill="#5AAEE8"/>' +
            '<path d="M138 122a24 24 0 0 0 16 22" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" fill="none" opacity=".85"/>' +
            '<ellipse cx="160" cy="176" rx="46" ry="8" fill="none" stroke="#3B8FCF" stroke-width="3" opacity=".5"/>' +
            '<ellipse cx="160" cy="176" rx="72" ry="12" fill="none" stroke="#3B8FCF" stroke-width="2" opacity=".28"/>',
        bayar:
            '<circle cx="250" cy="52" r="34" fill="#FFFFFF" opacity=".55"/>' +
            '<rect x="70" y="58" width="180" height="112" rx="14" fill="#3B8FCF"/>' +
            '<rect x="70" y="82" width="180" height="22" fill="#1E3A52" opacity=".35"/>' +
            '<rect x="88" y="126" width="62" height="10" rx="5" fill="#FFFFFF" opacity=".85"/>' +
            '<rect x="88" y="144" width="40" height="8" rx="4" fill="#FFFFFF" opacity=".5"/>' +
            '<circle cx="232" cy="64" r="28" fill="#5AAEE8" stroke="#FFFFFF" stroke-width="5"/>' +
            '<path d="M220 64l9 9 15-18" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
        keran:
            '<circle cx="90" cy="60" r="40" fill="#FFFFFF" opacity=".5"/>' +
            '<path d="M70 78h84a34 34 0 0 1 34 34v10" stroke="#3B8FCF" stroke-width="16" stroke-linecap="round" fill="none"/>' +
            '<rect x="100" y="48" width="12" height="30" rx="4" fill="#1E3A52" opacity=".55"/>' +
            '<rect x="86" y="42" width="40" height="10" rx="5" fill="#1E3A52" opacity=".55"/>' +
            '<path d="M188 138s9 11 9 18a9 9 0 0 1-18 0c0-7 9-18 9-18z" fill="#5AAEE8"/>' +
            '<path d="M188 168s6 7 6 12a6 6 0 0 1-12 0c0-5 6-12 6-12z" fill="#5AAEE8" opacity=".55"/>' +
            '<path d="M222 70s7 9 7 14a7 7 0 0 1-14 0c0-5 7-14 7-14z" fill="#9CCBEE"/>',
        jaringan:
            '<g stroke="#5AAEE8" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" fill="none">' +
            '<path d="M50 100h70v-46h60"/><path d="M120 100v54h90"/><path d="M180 54h60v46h30"/><path d="M210 154h60"/></g>' +
            '<g fill="#FFFFFF" stroke="#3B8FCF" stroke-width="5">' +
            '<circle cx="50" cy="100" r="13"/><circle cx="120" cy="100" r="13"/><circle cx="180" cy="54" r="13"/>' +
            '<circle cx="270" cy="100" r="13"/><circle cx="210" cy="154" r="13"/><circle cx="270" cy="154" r="13"/></g>',
        gelas:
            '<circle cx="230" cy="58" r="36" fill="#FFFFFF" opacity=".5"/>' +
            '<path d="M112 48h96l-12 118a12 12 0 0 1-12 10h-48a12 12 0 0 1-12-10z" fill="#FFFFFF" opacity=".85" stroke="#3B8FCF" stroke-width="5" stroke-linejoin="round"/>' +
            '<path d="M118 92h84l-8 74a8 8 0 0 1-8 6h-52a8 8 0 0 1-8-6z" fill="#5AAEE8"/>' +
            '<path d="M118 92q21-10 42 0t42 0" stroke="#9CCBEE" stroke-width="5" fill="none"/>' +
            '<path d="M130 62v20" stroke="#3B8FCF" stroke-width="5" stroke-linecap="round" opacity=".5"/>'
    };

    function svgIlustrasi(nama) {
        var isi = ILUSTRASI[nama] || ILUSTRASI.tetes;
        return '<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true">' + BG + isi + '</svg>';
    }

    var BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli',
                 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    function formatTanggal(s) {
        var p = String(s || '').split('-');
        if (p.length !== 3) return s || '';
        return parseInt(p[2], 10) + ' ' + BULAN[parseInt(p[1], 10) - 1] + ' ' + p[0];
    }

    return { svgIlustrasi: svgIlustrasi, formatTanggal: formatTanggal };
})();