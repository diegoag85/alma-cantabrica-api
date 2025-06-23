const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let reservas = [];
let comandas = [];

// GET reservas
app.get('/reservas', (req, res) => {
  res.json(reservas);
});

// POST reserva
app.post('/reservas', (req, res) => {
  const { mesa, telefono } = req.body;
  if (reservas.some(r => r.mesa === mesa)) {
    return res.status(400).json({ error: 'La mesa ya está reservada' });
  }
  reservas.push({ mesa, telefono });
  res.status(201).json({ ok: true });
});

// DELETE reserva
app.delete('/reservas/:mesa', (req, res) => {
  const mesa = parseInt(req.params.mesa);
  const index = reservas.findIndex(r => r.mesa === mesa);
  if (index !== -1) {
    reservas.splice(index, 1);
    res.json({ ok: true });
  } else {
    res.status(404).json({ error: 'Reserva no encontrada' });
  }
});

// GET comandas
app.get('/comandas', (req, res) => {
  res.json(comandas);
});

// POST comanda
app.post('/comandas', (req, res) => {
  const { mesa, platos } = req.body;
  if (!reservas.some(r => r.mesa === mesa)) {
    return res.status(400).json({ error: 'La mesa no tiene reserva' });
  }
  if (comandas.some(c => c.mesa === mesa && c.estado !== "realizada")) {
    return res.status(400).json({ error: 'Ya existe una comanda pendiente para esta mesa' });
  }
  comandas.push({ mesa, platos, estado: 'pendiente' });
  res.status(201).json({ ok: true });
});

// DELETE comanda
app.delete('/comandas/:mesa', (req, res) => {
  const mesa = parseInt(req.params.mesa);
  const index = comandas.findIndex(c => c.mesa === mesa);
  if (index !== -1) {
    comandas.splice(index, 1);
    res.json({ ok: true });
  } else {
    res.status(404).json({ error: 'Comanda no encontrada' });
  }
});

// PATCH comanda (cambiar estado)
app.patch('/comandas/:mesa', (req, res) => {
  const mesa = parseInt(req.params.mesa);
  const { estado } = req.body;
  const comanda = comandas.find(c => c.mesa === mesa);
  if (comanda) {
    if (estado) comanda.estado = estado;
    res.json(comanda);
  } else {
    res.status(404).json({ error: 'Comanda no encontrada' });
  }
});

// Raíz opcional (para test)
app.get('/', (req, res) => {
  res.send('API de Alma Cantábrica funcionando.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Servidor backend escuchando en puerto', PORT));
