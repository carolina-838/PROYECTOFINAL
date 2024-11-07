// Importación de módulos
const path = require('path');   // Para ejecutar desde index.html
const express = require('express');
const connection = require('./db'); // Asegúrate de que este archivo esté configurado correctamente
const { error } = require('console');

// Inicialización de la aplicación Express
const app = express();
app.use(express.json());  // Middleware para parsear solicitudes con formato JSON
app.use(express.urlencoded({ extended: true }));

// Servir el archivo index.html
app.use(express.static(path.join(__dirname, 'template')));

// Ruta GET para verificar el estado de la API
app.get('/api/prueba', (req, res) => {
    res.send("La Api esta funcionando bien....");
});

// Ruta GET de prueba
app.get('/api/prueba1', (req, res) => { 
    const PORT = 3000;  
    res.status(200).json({
        message: 'La API responde bien..',
        port: PORT,
        status: 'success'
    });
});

// Obtener todas las canciones (ejemplo)
app.get('/api/songs', (req, res) => {
    connection.query('SELECT * FROM songs', (err, results) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.json(results);
    });
});

// Agregar una nueva canción (ejemplo)
app.post('/api/songs', (req, res) => {
    const { title, url } = req.body;

    const sql = 'INSERT INTO songs (title, url) VALUES (?, ?)';
    
    connection.query(sql, [title, url], (err, result) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        res.status(201).json({ id: result.insertId, title, url });
    });
});

// Ruta POST para manejar contactos
app.post('/api/contactos', (req, res) => {
    const { nombre, asunto, celular, correo_electronico, fecha_contacto, hora_contacto } = req.body;

    // Validar que los campos requeridos no estén vacíos
    if (!nombre || !asunto || !correo_electronico || !fecha_contacto || !hora_contacto) {
        return res.status(400).json({ message: "Faltan campos requeridos." });
    }

    // Combinar fecha y hora en un solo valor DATETIME
    const fechaHoraContacto = new Date(`${fecha_contacto}T${hora_contacto}`);

    const sql = 'INSERT INTO contactos (nombre, asunto, celular, correo_electronico, fecha_contacto, hora_contacto) VALUES (?, ?, ?, ?, ?, ?)';
    
    connection.query(sql, [nombre, asunto, celular, correo_electronico, fecha_contacto, fechaHoraContacto], (err, result) => {
        if (err) {
            console.error('Error al insertar en la base de datos:', err);
            return res.status(400).json({ message: err.message });
        }
        
        // Retornar los datos del contacto guardado
        res.status(201).json({
            id: result.insertId,
            nombre,
            asunto,
            celular,
            correo_electronico,
            fecha_contacto,
            hora_contacto: fechaHoraContacto // Retornar la fecha y hora combinadas
        });
    });
});

// Configuración del puerto y mensaje de conexión
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor en ejecución en el puerto ${PORT}`);
});