# 🐙 SETUP GITHUB UNTUK DEPLOY

## Langkah 1: Buat Repository di GitHub

1. Buka [github.com](https://github.com)
2. Login atau buat akun
3. Klik "New repository"
4. Beri nama: `finance-app` (atau nama lain)
5. Pilih "Public" atau "Private"
6. Jangan centang "Add a README" (karena sudah ada)
7. Klik "Create repository"

## Langkah 2: Connect Local ke GitHub

Copy dan jalankan commands ini di terminal:

```bash
# Ganti USERNAME dengan username GitHub Anda
# Ganti REPO_NAME dengan nama repository yang Anda buat

git remote add origin https://github.com/USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

**Contoh:**
```bash
git remote add origin https://github.com/johndoe/finance-app.git
git branch -M main
git push -u origin main
```

## Langkah 3: Deploy ke Vercel

1. Buka [vercel.com](https://vercel.com)
2. Login dengan GitHub yang sama
3. Klik "New Project"
4. Pilih repository yang baru dibuat
5. Klik "Deploy"

## Langkah 4: SELESAI! 🎉

Aplikasi Anda akan live di:
- URL: `https://your-app.vercel.app`
- Simple App: `https://your-app.vercel.app/simple`

---

## 🔧 Troubleshooting

**Error: "does not appear to be a git repository"**
- Pastikan Anda sudah buat repository di GitHub
- Copy URL dengan benar
- Ganti USERNAME dan REPO_NAME dengan yang benar

**Error: "Permission denied"**
- Pastikan GitHub login benar
- Cek apakah repository sudah dibuat
- Gunakan HTTPS (bukan SSH)

**Error: "remote origin already exists"**
```bash
git remote remove origin
git remote add origin https://github.com/USERNAME/REPO_NAME.git
```

---

## 📱 Quick Commands

```bash
# Cek remote
git remote -v

# Tambah remote baru
git remote add origin https://github.com/USERNAME/REPO_NAME.git

# Push pertama kali
git push -u origin main

# Push selanjutnya
git push origin main
```

---

**Sekarang tinggal setup GitHub dan deploy!** 🚀