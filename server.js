const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// "Bases de datos" en memoria
let reservas = [];
let comandas = [];
let nextComandaId = 1;

// --- RESERVAS ---
app.get('/reservas', (req, res) => {
  res.json(reservas);
});

app.post('/reservas', (req, res) => {
  const { mesa, telefono } = req.body;
  if (!mesa || !telefono) {
    return res.status(400).json({ error: 'Datos de reserva inválidos' });
  }
  if (reservas.some(r => r.mesa === mesa)) {
    return res.status(400).json({ error: 'Esa mesa ya tiene reserva' });
  }
  reservas.push({ mesa, telefono });
  res.status(201).json({ mesa, telefono });
});

// --- COMANDAS ---
app.get('/comandas', (req, res) => {
  res.json(comandas);
});

app.post('/comandas', (req, res) => {
  const { mesa, platos } = req.body;
  if (!mesa || !platos || !Array.isArray(platos) || platos.length === 0) {
    return res.status(400).json({ error: 'Datos de comanda inválidos' });
  }
  // Solo permitir comandas si hay reserva para esa mesa
  if (!reservas.some(r => r.mesa === mesa)) {
    return res.status(400).json({ error: 'No hay reserva para esa mesa' });
  }
  const comanda = {
    id: nextComandaId++,
    mesa,
    platos,
    estado: 'pendiente'
  };
  comandas.push(comanda);
  res.status(201).json(comanda);
});

// (Opcional: para limpiar reservas/comandas en pruebas)
app.delete('/reset', (req, res) => {
  reservas = [];
  comandas = [];
  nextComandaId = 1;
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});