const QRCode = require('qrcode');
const fs = require('fs');

// Generate SVG QR code pointing to menu.html
QRCode.toString('menu.html', {
  type: 'svg',
  color: {
    dark: '#0e1118',
    light: '#ffffff'
  },
  margin: 2,
  width: 320
}, function (err, string) {
  if (err) throw err;
  fs.writeFileSync('menu_qr.svg', string);
  console.log('SVG QR Code created successfully: menu_qr.svg');
});

