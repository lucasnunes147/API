const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const server = express();

server.use(express.json());
server.use(cors());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'projeto'
});

connection.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados!');
});

server.get('/', (req, res) => {
    return res.json({ mensagem: 'Nossa API está funcionando' });
});

// Adicionar um item
server.post('/loja', (req, res) => {
    const { tipo_produto, quantidade, unidade } = req.body;
    const query = 'INSERT INTO loja (tipo_produto, quantidade, unidade) VALUES (?, ?, ?)';
    connection.query(query, [tipo_produto, quantidade, unidade], (err, results) => {
        if (err) {
            return res.status(500).json({ mensagem: 'Erro ao adicionar item', error: err });
        }
        return res.status(201).json({ mensagem: 'Item adicionado com sucesso', id: results.insertId, tipo_produto, quantidade, unidade });
    });
});

// Listar todos os itens
server.get('/loja', (req, res) => {
    const query = 'SELECT * FROM loja';
    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ mensagem: 'Erro ao listar itens', error: err });
        }
        return res.json({ mensagem: 'Itens listados com sucesso', itens: results });
    });
});

// Obter um item específico
server.get('/loja/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM loja WHERE id = ?';
    connection.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ mensagem: 'Erro ao obter item', error: err });
        }
        if (results.length === 0) {
            return res.status(404).json({ mensagem: 'Item não encontrado' });
        }
        return res.json({ mensagem: 'Item obtido com sucesso', item: results[0] });
    });
});

// Atualizar um item
server.put('/loja/:id', (req, res) => {
    const { id } = req.params;
    const { tipo_produto, quantidade, unidade } = req.body;
    const query = 'UPDATE loja SET tipo_produto = ?, quantidade = ?, unidade = ? WHERE id = ?';
    connection.query(query, [tipo_produto, quantidade, unidade, id], (err, results) => {
        if (err) {
            return res.status(500).json({ mensagem: 'Erro ao atualizar item', error: err });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Item não encontrado' });
        }
        return res.json({ mensagem: 'Item atualizado com sucesso', id, tipo_produto, quantidade, unidade });
    });
});

// Deletar um item
server.delete('/loja/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM loja WHERE id = ?';
    connection.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ mensagem: 'Erro ao deletar item', error: err });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Item não encontrado' });
        }
        return res.status(204).json(); 
    });
});

server.listen(3000, () => {
    console.log('Servidor está funcionando');
});
