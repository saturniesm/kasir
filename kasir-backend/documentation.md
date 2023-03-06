# API Documentation

### Kasir:
-[x] Kasir dapat login ke aplikasi
-[] Melakukan transaksi pemesanan makanan dan minuman
-[] Menentukan nomor meja yang tersedia (meja yang tidak sedang terpakai)
-[] Melihat seluruh daftar transaksi yang ditangani
-[] Mengubah status pembayaran pesanan
-[] Mencetak nota transaksi (desain dan ukuran nota transaksi sesuai kertas roll yang biasa 
digunakan di kasir)

### Manajer:
-[x] Manajer dapat login ke aplikasi
-[] Melihat seluruh data transaksi seluruh karyawan baik transaksi harian maupun bulanan
-[] Melakukan filtering data transaksi berdasarkan nama karyawan
-[] Melakukan filtering data transaksi berdasarkan tanggal tertentu
-[] Melihat laporan transaksi pendapatan berdasarkan filtering harian maupun bulanan
-[] Melihat dashboard statistik makanan minuman terlaris/paling favorit & paling jarang
dipesan (tampilan berupa pie chart / bar chart)

### Admin:
-[x] Admin dapat login ke aplikasi
-[] Mengelola data user & mengatur peran user
-[] Mengelola data makanan & minuman
-[] Mengelola data meja

### Endpoint yang gue butuhin
Auth
-[x] Kasir dapat login ke aplikasi 
-[x] Manajer dapat login ke aplikasi
-[x] Admin dapat login ke aplikasi
-[] kasir dan undefined dapat mengubah email, username, dan password mereka. hanya milik mereka dan bukan orang lain. 

User
[] Mengelola data user & mengatur peran user 

Meja
-[] Menentukan nomor meja yang tersedia (meja yang tidak sedang terpakai)
-[] Mengelola data meja 

Transaksi
-[] Melakukan transaksi pemesanan makanan dan minuman
-[] Melihat seluruh daftar transaksi yang ditangani 
-[] Mengubah status pembayaran pesanan
-[] Mencetak nota transaksi (desain dan ukuran nota transaksi sesuai kertas roll yang biasa digunakan di kasir)

-[] Melihat seluruh data transaksi seluruh karyawan baik transaksi harian maupun bulanan
-[] Melakukan filtering data transaksi berdasarkan nama karyawan
-[] Melakukan filtering data transaksi berdasarkan nama karyawan
-[] Melihat laporan transaksi pendapatan berdasarkan filtering harian maupun bulanan
-[] Melihat dashboard statistik makanan minuman terlaris/paling favorit & paling jarang dipesan (tampilan berupa pie chart / bar chart)

Menu
-[] Mengelola data makanan & minuman


### Improvement
- Use express-validator (avoid sql injection that currently my own middleware dont cover etc)
- Using a logger with winston
- Is this even best practice including all in one file like this?
- Create a constant for message
*/

