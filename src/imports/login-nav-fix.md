Perbaiki perilaku state login dan navigasi pada aplikasi mobile marketplace LumiTani.

Saat ini terjadi masalah pada navigasi berikut:
Setelah pengguna login dan berada di halaman "Profil Saya", ketika tombol panah kembali (back arrow) ditekan dan kembali ke halaman Home, tombol di bottom navigation berubah kembali menjadi "Login". Hal ini tidak sesuai dengan perilaku yang diharapkan.

Perbaiki agar status login tetap tersimpan selama pengguna berada di aplikasi.

1. State Login Konsisten

Jika pengguna sudah login:

* tombol "Login" pada bottom navigation harus berubah menjadi "Profil" atau "Akun".
* status ini harus tetap aktif selama pengguna masih menggunakan aplikasi.

2. Perilaku Navigasi

Flow yang benar:

Home
→ klik Login
→ halaman Login
→ klik tombol Login
→ masuk ke halaman Profil

Profil
→ klik back arrow
→ kembali ke halaman Home

Setelah kembali ke Home:

* tombol pada bottom navigation harus tetap "Profil"
* tidak boleh kembali menjadi "Login".

3. Jangan Reset Status Login

Navigasi antar halaman tidak boleh mengubah status login.

Status login hanya berubah jika:

* pengguna menekan tombol "Logout" di halaman profil.

4. Konsistensi UI

Jika pengguna sudah login:

* foto profil atau ikon akun dapat muncul di halaman profil
* tombol bottom navigation tetap menunjukkan "Profil".

Jika pengguna belum login:

* tombol bottom navigation tetap menunjukkan "Login".

Tujuan perubahan ini adalah menjaga konsistensi pengalaman pengguna dan memastikan status login tidak berubah hanya karena berpindah halaman.
