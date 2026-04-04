Perbaiki alur login pada aplikasi mobile marketplace pertanian "LumiTani".

Saat pengguna menekan tombol "Login" pada bottom navigation, aplikasi tidak langsung membuka halaman profil. Sebagai gantinya, tampilkan halaman Login terlebih dahulu.

Gunakan logo LumiTani pada bagian atas halaman login dan gunakan desain yang konsisten dengan tampilan marketplace (tema hijau, modern, mobile friendly).

1. Halaman Login Konsumen (Mobile)

Buat halaman login sederhana untuk kebutuhan prototype aplikasi.

Struktur halaman:

Bagian atas:

* Logo LumiTani
* Judul: "Masuk ke LumiTani"
* Subjudul kecil: "Belanja produk segar langsung dari petani lokal"

Form Login:

* Input Email atau Nomor HP
* Input Password

Tombol utama:

* Tombol hijau "Login"

Link kecil:

* "Belum punya akun? Daftar"
* "Lupa password?"

2. Perilaku Tombol Login (Prototype Behavior)

Untuk kebutuhan prototype UX:

* Ketika tombol "Login" ditekan, sistem tidak perlu memvalidasi email atau password.
* Setelah tombol login ditekan, pengguna langsung diarahkan ke halaman "Profil / Akun Saya".

Tujuannya adalah untuk mensimulasikan proses login dalam prototype tanpa autentikasi backend.

3. Desain UI

Gunakan gaya yang konsisten dengan halaman marketplace LumiTani:

* Tema warna hijau organik
* Layout mobile
* Card login dengan rounded corner
* Tombol besar agar mudah ditekan
* Spacing rapi seperti aplikasi e-commerce modern

4. Flow Navigasi

Home → klik tombol "Login" di bottom navigation
→ membuka halaman Login
→ klik tombol "Login"
→ langsung masuk ke halaman Profil / Akun Saya.
