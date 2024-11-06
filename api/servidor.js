const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;
const cors = require('cors');
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'taskDB'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Conectado a MySQL');
});

app.use(express.json());

app.get('/task', (req, res) => {
    db.query('SELECT * FROM task', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.post('/task', (req, res) => {
    const newTask = {nombre: req.body.nombre };
    db.query('INSERT INTO task SET ?', newTask, (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertId, ...newTask });
    });
});

app.delete('/task/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM task WHERE id = ?', [id], (err) => {
        if (err) throw err;
        res.sendStatus(204);
    });
});

app.listen(port, () => {
    console.log("Servidor corriendo en http://localhost:${port}");
});