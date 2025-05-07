const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Função para registrar o log
function registrarLog(nome) {
  const id = uuidv4();
  const dataHora = new Date().toISOString().replace('T', ' ').split('.')[0];
  const linha = `${id} - ${dataHora} - ${nome}\n`;
  fs.appendFileSync('logs.txt', linha);
  return id;
}

// Rota para criar novo log
app.post('/logs', (req, res) => {
  const { nome } = req.body;
  if (!nome) return res.status(400).json({ erro: 'Nome é obrigatório' });

  const id = registrarLog(nome);
  res.status(201).json({ mensagem: 'Log criado com sucesso', id });
});

// Rota para consultar log por ID
app.get('/logs/:id', (req, res) => {
  const id = req.params.id;
  const linhas = fs.readFileSync('logs.txt', 'utf8').split('\n');
  const log = linhas.find(linha => linha.startsWith(id));

  if (!log) return res.status(404).json({ erro: 'Log não encontrado' });

  res.json({ log });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
