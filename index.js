// index.js
const express = require('express');      // Importamos el framework Express para crear el servidor.
const QRCode = require('qrcode');          // Importamos la librería 'qrcode' que se encargará de generar el código QR.

const app = express();                     // Creamos una instancia de la aplicación Express.

// Middleware para servir archivos estáticos
// Esto permite que la carpeta 'public' contenga nuestro HTML, CSS y JavaScript.
app.use(express.static('public'));

// Ruta principal: muestra un mensaje simple de bienvenida.
app.get('/', (req, res) => {
  res.send('Bienvenido al Generador de Códigos QR');
});

// Endpoint para generar el código QR
app.get('/api/generate', async (req, res) => {
  // Extraemos el parámetro 'text' que debe venir en la query string (por ejemplo, ?text=Hola%20Mundo)
  const { text } = req.query;

  // Validación: si no se proporciona el parámetro 'text', se retorna un error.
  if (!text) {
    return res.status(400).json({ error: "Debes enviar el parámetro 'text'" });
  }
  
  try {
    // Genera el código QR en formato Data URL (una cadena que representa la imagen en base64)
    const qrDataUrl = await QRCode.toDataURL(text);
    
    // Se envía la respuesta en formato JSON, incluyendo la imagen QR.
    res.json({ qr: qrDataUrl });
  } catch (error) {
    // En caso de error (por ejemplo, si la generación falla) se envía un error 500.
    res.status(500).json({ error: error.message });
  }
});

// Se inicia el servidor en el puerto 3000 o el puerto definido en las variables de entorno.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
