const UPSTREAM = 'https://xs-pedia.my.id/h2h/deposit';

module.exports = async function handler(req, res) {
  // CORS is only needed if you call this API from another domain.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const apiKey = process.env.XSPEDIA_APIKEY;
  if (!apiKey) {
    return res.status(500).json({
      success: false,
      message: 'Server belum dikonfigurasi. Tambahkan environment variable XSPEDIA_APIKEY di Vercel.'
    });
  }

  const { action, nominal, metode, id } = req.query || {};
  const allowed = ['create', 'status', 'cancel'];

  if (!allowed.includes(action)) {
    return res.status(400).json({ success: false, message: 'Action tidak valid. Gunakan create, status, atau cancel.' });
  }

  const params = new URLSearchParams();
  if (action === 'create') {
    const amount = Number(nominal);
    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Nominal tidak valid.' });
    }
    params.set('nominal', String(Math.round(amount)));
    params.set('metode', metode || 'QRISFAST');
  } else {
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ success: false, message: 'ID transaksi wajib diisi.' });
    }
    params.set('id', id);
  }

  try {
    const upstreamUrl = `${UPSTREAM}/${action}?${params.toString()}`;
    const response = await fetch(upstreamUrl, {
      method: 'GET',
      headers: {
        'X-APIKEY': apiKey,
        'Accept': 'application/json'
      }
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { success: false, message: 'API upstream mengembalikan respons yang bukan JSON.', raw: text.slice(0, 500) };
    }

    return res.status(response.status).json(data);
  } catch (error) {
    console.error('XS-PEDIA request error:', error);
    return res.status(502).json({
      success: false,
      message: 'Tidak dapat terhubung ke server pembayaran.'
    });
  }
};
