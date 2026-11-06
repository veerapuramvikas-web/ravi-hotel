const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const QRCode = require('qrcode');

const PORT = 3000;

function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const localIp = getLocalIpAddress();
const menuUrl = `http://${localIp}:${PORT}/menu.html`;

// Generate live dynamic QR code matching real Wi-Fi network address
QRCode.toFile('menu_qr.png', menuUrl, {
  width: 600,
  margin: 2,
  color: { dark: '#0e1118', light: '#ffffff' }
});

QRCode.toString(menuUrl, {
  type: 'svg',
  color: { dark: '#0e1118', light: '#ffffff' }
}, (err, svg) => {
  if (!err) fs.writeFileSync('menu_qr.svg', svg);
});

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.json': 'application/json'
};

const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, req.url === '/' ? 'qr_code.html' : req.url);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500);
        res.end('Server Error: ' + err.code);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('\n======================================================');
  console.log('🍽️  THE GRAND ROYALE - LUXURY DIGITAL MENU SERVER');
  console.log('======================================================');
  console.log(`\n💻 Local on PC:`);
  console.log(`   QR Standee : http://localhost:${PORT}/qr_code.html`);
  console.log(`   Menu View  : http://localhost:${PORT}/menu.html`);
  console.log(`\n📱 On Mobile (Same Wi-Fi network):`);
  console.log(`   Scan QR or Open: ${menuUrl}`);
  console.log('======================================================\n');
});

