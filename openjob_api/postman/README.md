# Postman

File di folder ini:

- `[271] OpenJob API Test V2.postman_collection.json` — koleksi uji (jangan diubah).
- `OpenJob API.postman_environment.json` — environment (pilih di Postman, `port=3000`).
- `sample-resume.pdf` — contoh berkas untuk request upload.

## Upload file

Request **`[Mandatory] Documents → Upload Document with Valid PDF`** memakai path absolut mesin pembuat koleksi
(`/home/aras/...`) yang tidak ada di Windows. Wajib diganti manual:

1. Buka request tersebut.
2. Tab **Body** → **form-data** → baris key `document`.
3. Klik **Select Files** → pilih `postman/sample-resume.pdf`.
4. Simpan (Ctrl+S), baru jalankan collection.

Rename key jangan diubah; harus tetap `document`.
