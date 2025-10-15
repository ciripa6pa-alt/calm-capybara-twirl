#!/bin/bash

# Script untuk push perubahan ke GitHub
# Jalankan dengan: bash push-to-github.sh

echo "🚀 Memulai push ke GitHub..."

# Cek apakah ada perubahan
if git diff-index --quiet HEAD --; then
    echo "✅ Tidak ada perubahan untuk di-push"
    exit 0
fi

# Push ke GitHub
git push origin main 2>&1 || git push origin master 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Berhasil push ke GitHub!"
else
    echo "❌ Gagal push ke GitHub. Pastikan koneksi GitHub aktif."
    exit 1
fi
