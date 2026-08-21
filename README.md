# QRIS Payment - Vercel

## Deploy
1. Upload folder/project ini ke GitHub lalu import ke Vercel, atau gunakan Vercel CLI.
2. Di Vercel buka **Project Settings → Environment Variables**.
3. Tambahkan:
   - Name: `XSPEDIA_APIKEY`
   - Value: API key XS-PEDIA kamu
   - Environment: Production (dan Preview/Development jika diperlukan)
4. Redeploy project.

Frontend sekarang tidak lagi menyimpan API key. Browser hanya memanggil endpoint internal `/api/deposit`.

## Endpoint internal
- `GET /api/deposit?action=create&nominal=25000&metode=QRISFAST`
- `GET /api/deposit?action=status&id=ID_TRX_DEPO`
- `GET /api/deposit?action=cancel&id=ID_TRX_DEPO`

Backend akan meneruskan request ke XS-PEDIA menggunakan `XSPEDIA_APIKEY` dari environment variable.
