const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Разрешаем CORS (чтобы твой Angular мог слать запросы)
app.use(cors());

// Для чтения JSON body, если понадобится отдельный JSON POST
app.use(express.json());

// Настраиваем папку для сохранения PDF
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `invoice-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });


// ✅ Отдельный endpoint: только PDF
app.post('/api/upload-pdf', upload.single('file'), (req, res) => {
  console.log('📄 PDF received:', req.file);
  res.status(200).json({
    message: 'PDF uploaded!',
    filename: req.file.filename
  });
});

// ✅ Отдельный endpoint: только JSON
app.post('/api/invoices', (req, res) => {
  console.log('🧾 JSON invoice data:', req.body);
  res.status(200).json({
    message: 'Invoice JSON saved!',
    data: req.body
  });
});

// ✅ Комбинированный: PDF + JSON в одном multipart
app.post('/api/upload-invoice', upload.single('file'), (req, res) => {
  console.log('📄 PDF file:', req.file);
  console.log('🧾 Invoice JSON data:', req.body);
  res.status(200).json({
    message: 'Combined PDF + JSON received!',
    filename: req.file.filename,
    invoiceData: req.body
  });
});

// ✅ Чтобы раздавать загруженные PDF при необходимости
app.use('/uploads', express.static('uploads'));

app.listen(port, () => {
  console.log(`🚀 Mock backend running: http://localhost:${port}`);
});
