const menu = "╭━━━ MRYX BOT ━━━ │ !menu │ !list │ !addlist nama | isi │ !dellist nama │ !tebak ╰━━━━━━━━━━━━━━";

const daftar = {};

function proses(pesan) {
const teks = pesan.trim();

if (teks === "!menu") return menu;

if (teks === "!list") {
const isi = Object.entries(daftar)
.map(([nama, nilai]) => "${nama}: ${nilai}")
.join("\n");
return isi || "Daftar masih kosong.";
}

if (teks.startsWith("!addlist ")) {
const data = teks.slice(9).split("|");
const nama = data[0]?.trim();
const nilai = data.slice(1).join("|").trim();

if (!nama || !nilai) return "Format: !addlist nama | isi";
daftar[nama] = nilai;
return "Berhasil menambahkan " + nama;

}

if (teks.startsWith("!dellist ")) {
const nama = teks.slice(9).trim();
if (!(nama in daftar)) return "Nama tidak ditemukan.";
delete daftar[nama];
return "Berhasil menghapus " + nama;
}

if (teks === "!tebak") {
return "Tebak: aku punya jarum, tetapi tidak bisa menjahit. Apakah aku?";
}

return null;
}

console.log("MRYX BOT siap diuji.");
console.log(proses("!menu"));