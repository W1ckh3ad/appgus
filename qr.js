const QRCode = require('qrcode');
const fs = require('fs');

const baseUrl = 'https://appgus-liho.vercel.app/statue/';
const urls = ['faustkaempfer-quirinal', 'ringergruppe', 'hera-tempel-paestum', 'torso-belvedere', 'satyr-hermaphrodit', 'athena_parthenos'];

urls.forEach(async (url, i) => {
  try {
    await QRCode.toFile(`./qr/qr_${url}.png`, baseUrl + url);
  } catch (err) {
    console.error(err);
  }
});