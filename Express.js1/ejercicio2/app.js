const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');

app.use(bodyParser.json());

// Data Set
let usuarios = [
  { id: 1, nombre: 'Emiliano', apellido: 'Martínez', edad: 30 },
  { id: 2, nombre: 'Nicolás', apellido: 'Tagliafico', edad: 30 },
  { id: 3, nombre: 'Gonzalo', apellido: 'Montiel', edad: 26 },
  { id: 4, nombre: 'Angel', apellido: 'Di María', edad: 35 }
];


app.get('/', (req, res) => {
  res.send('Ejercicio 1');
});

// Get all users
app.get('/usuarios', (req, res) => {
  let respuesta = usuarios.map(usr => {
    return {id: usr.id, nombre: usr.nombre, apellido: usr.apellido}; 
  });
  res.json(respuesta);
});

// Get user by ID
app.get('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const usuario = usuarios.find(u => u.id === parseInt(id));
  if (!usuario) {
    return res.status(404).send('Usuario no encontrado');
  }
  res.json(usuario);
});

// Add user to data set
app.post('/usuarios', (req, res) => {
  const { nombre, apellido, edad } = req.body;
  const id = Math.max(...usuarios.map(usr => usr.id)) + 1;
  const nuevoUsuario = { id, nombre, apellido, edad };
  usuarios.push(nuevoUsuario);
  res.status(201).json(nuevoUsuario.id);
});

// Edit user
app.patch('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, edad } = req.body;
  const usuarioIndex = usuarios.findIndex(u => u.id === parseInt(id));
  if (usuarioIndex === -1) {
    return res.status(404).send('Usuario no encontrado');
  }
  usuarios[usuarioIndex].nombre = nombre;
  usuarios[usuarioIndex].apellido = apellido;
  usuarios[usuarioIndex].edad = edad;
  res.json(usuarios[usuarioIndex].id);
});

// Delete user
app.delete('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const usuarioIndex = usuarios.findIndex(u => u.id === parseInt(id));
  if (usuarioIndex === -1) {
    return res.status(404).send('Usuario no encontrado');
  }
  const usuarioEliminado = usuarios.splice(usuarioIndex, 1);
  res.json('ok');
});

 
app.listen(port, () => {
  console.log(`App de ejemplo en puerto ${port}`)
});
