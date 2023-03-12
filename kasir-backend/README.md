# API Documentation

### Kasir:
- [x] Kasir dapat login ke aplikasi
- [] Melakukan transaksi pemesanan makanan dan minuman
- [] Menentukan nomor meja yang tersedia (meja yang tidak sedang terpakai)
- [] Melihat seluruh daftar transaksi yang ditangani
- [] Mengubah status pembayaran pesanan
- [] Mencetak nota transaksi (desain dan ukuran nota transaksi sesuai kertas roll yang biasa 
digunakan di kasir)

### Manajer:
- [x] Manajer dapat login ke aplikasi
- [] Melihat seluruh data transaksi seluruh karyawan baik transaksi harian maupun bulanan
- [] Melakukan filtering data transaksi berdasarkan nama karyawan
- [] Melakukan filtering data transaksi berdasarkan tanggal tertentu
- [] Melihat laporan transaksi pendapatan berdasarkan filtering harian maupun bulanan
- [] Melihat dashboard statistik makanan minuman terlaris/paling favorit & paling jarang
dipesan (tampilan berupa pie chart / bar chart)

### Admin:
- [x] Admin dapat login ke aplikasi
- [] Mengelola data user & mengatur peran user
- [] Mengelola data makanan & minuman
- [] Mengelola data meja

### Endpoint yang gue butuhin
Auth
- [x] Kasir dapat login ke aplikasi 
- [x] Manajer dapat login ke aplikasi
- [x] Admin dapat login ke aplikasi
- [x] kasir dan undefined dapat mengubah email, username, dan password mereka. hanya milik mereka dan bukan orang lain. 

User
- [x] Mengelola data user 
- [x] Mengatur peran user 

Meja
- [x] Menentukan nomor meja yang tersedia (meja yang tidak sedang terpakai)
- [x] Mengelola data meja 

Transaksi
- [] Melakukan transaksi pemesanan makanan dan minuman
- [] Melihat seluruh daftar transaksi yang ditangani 
- [] Mengubah status pembayaran pesanan
- [] Mencetak nota transaksi (desain dan ukuran nota transaksi sesuai kertas roll yang biasa digunakan di kasir)

- [] Melihat seluruh data transaksi seluruh karyawan baik transaksi harian maupun bulanan
- [] Melakukan filtering data transaksi berdasarkan nama karyawan
- [] Melakukan filtering data transaksi berdasarkan nama karyawan
- [] Melihat laporan transaksi pendapatan berdasarkan filtering harian maupun bulanan
- [] Melihat dashboard statistik makanan minuman terlaris/paling favorit & paling jarang dipesan (tampilan berupa pie chart / bar chart)

Menu
- [] Mengelola data makanan & minuman


### Improvement
- Use express-validator (avoid sql injection that currently my own middleware dont cover etc)
- Using a logger with winston
- Is this even best practice including all in one file like this?
- Create a constant for message
- Nyimpan jwt di unique identifier (jti) in a database or a cache
- add validation
- error message e benakno
- add log activity

=======
- [x] Kasir dapat login ke aplikasi
- [] Melakukan transaksi pemesanan makanan dan minuman
- [] Menentukan nomor meja yang tersedia (meja yang tidak sedang terpakai)
- [] Melihat seluruh daftar transaksi yang ditangani
- [] Mengubah status pembayaran pesanan
- [] Mencetak nota transaksi (desain dan ukuran nota transaksi sesuai kertas roll yang biasa 
digunakan di kasir)

### Manajer:
- [x] Manajer dapat login ke aplikasi
- [] Melihat seluruh data transaksi seluruh karyawan baik transaksi harian maupun bulanan
- [] Melakukan filtering data transaksi berdasarkan nama karyawan
- [] Melakukan filtering data transaksi berdasarkan tanggal tertentu
- [] Melihat laporan transaksi pendapatan berdasarkan filtering harian maupun bulanan
- [] Melihat dashboard statistik makanan minuman terlaris/paling favorit & paling jarang
dipesan (tampilan berupa pie chart / bar chart)

### Admin:
- [x] Admin dapat login ke aplikasi
- [] Mengelola data user & mengatur peran user
- [] Mengelola data makanan & minuman
- [] Mengelola data meja


1. migration tabel user
sequelize model:create --name user --attributes id_user:integer,nama_user:string,role:string,username:string,password:text

2. migratiion tabel meja
sequelize model:create --name meja --:integer,nomor_meja:string

3. migration tabel menu
sequelize model:create --name menu --attributes id_menu:integer,nama_menu:string,jenis:string,deskripsi:text,gambar:string,harga:integer

4. migration tabel transaksi
sequelize model:create --name transaksi --attributes id_transaksi:integer,tgl_transaksi:date,id_user:integer,id_meja:integer,nama_pelanggan:string,status:string

5. migration tabel detail_transaksi
sequelize model:create --name detail_transaksi --attributes id_detail_transaksi:integer,id_transaksi:integer,id_menu:integer,harga:integer

6. menu_statistik
sequelize model:create --name menu_statistik