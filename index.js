const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Aquí defines tu token directamente (NO recomendado para producción)
const BOTGHOST_TOKEN = '486836b99742fde93dd45f150dfe0662d3f70aafe5789565edd6cf4c52770452';

app.use(cors());

app.get('/api/stats', async (req, res) => {
  try {
    const response = await fetch('https://api.botghost.com/bot/stats', {
      headers: {
        Authorization: `Bearer ${BOTGHOST_TOKEN}`
      }
    });

    if (!response.ok) {
      return res.status(500).json({ error: 'Error al obtener estadísticas' });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
