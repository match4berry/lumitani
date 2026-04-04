Perbaiki alur autentikasi pada aplikasi mobile marketplace pertanian "LumiTani".

Gunakan logo LumiTani pada halaman autentikasi dan pertahankan gaya desain yang sama dengan halaman utama aplikasi (tema hijau, bersih, modern, mobile friendly).

Tujuan desain adalah membuat flow login dan pendaftaran sederhana untuk kebutuhan prototype aplikasi.

1. Halaman Login Konsumen (Mobile)

Ketika pengguna menekan tombol "Login" pada bottom navigation, arahkan ke halaman Login terlebih dahulu.

Struktur halaman:

Bagian atas:

* Logo LumiTani
* Judul: "Masuk ke LumiTani"
* Subjudul kecil: "Belanja produk segar langsung dari petani lokal"

Form login:

* Input Email atau Nomor HP
* Input Password

Tombol utama:

* Tombol hijau "Login"

Link tambahan:

* "Belum punya akun? Daftar"
* "Lupa password?"

2. Perilaku Tombol Login (Prototype)

Untuk kebutuhan prototype:

Ketika tombol "Login" ditekan, sistem tidak perlu memvalidasi input.
Setelah tombol login ditekan, pengguna langsung diarahkan ke halaman "Profil / Akun Saya".

3. Halaman Daftar Konsumen

Ketika pengguna menekan link "Daftar", arahkan ke halaman pendaftaran akun.

Field yang harus diisi:

* Nama Lengkap
* Email
* Password

Tombol utama:

* Tombol hijau "Daftar"

Setelah pengguna menekan tombol "Daftar":

* Tampilkan pesan bahwa akun berhasil dibuat
* Arahkan pengguna kembali ke halaman Login.

Untuk prototype saat ini tidak perlu verifikasi email atau konfirmasi akun.

4. Desain UI

Gunakan gaya yang konsisten dengan aplikasi LumiTani:

* Warna utama hijau pertanian
* Aksen kuning/oranye dari logo
* Layout mobile
* Card form dengan rounded corner
* Input field dengan icon
* Spacing rapi seperti aplikasi marketplace modern

5. Flow Navigasi

Home → klik "Login"
→ halaman Login

Login → klik tombol Login
→ langsung masuk ke halaman Profil

Login → klik "Daftar"
→ halaman Daftar

Daftar → klik tombol Daftar
→ kembali ke halaman Login.
