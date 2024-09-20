const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');

app.use(bodyParser.json());

// Data Set
let usuarios = [
  { id: 1, nombre: 'Emiliano', apellido: 'Martínez', edad: 30, seguidores: [], seguidos: [] },
  { id: 2, nombre: 'Nicolás', apellido: 'Tagliafico', edad: 30, seguidores: [], seguidos: [] },
  { id: 3, nombre: 'Gonzalo', apellido: 'Montiel', edad: 26, seguidores: [], seguidos: [] },
  { id: 4, nombre: 'Angel', apellido: 'Di María', edad: 35, seguidores: [], seguidos: [] }
];


app.get('/', (req, res) => {
  res.send('Ejercicio 1');
});

// Get all users
app.get('/usuarios', (req, res) => {
  let respuesta = usuarios.map(usr => {
    return { id: usr.id, nombre: usr.nombre, apellido: usr.apellido, edad: usr.edad, seguidores: usr.seguidores, seguidos: usr.seguidos }; 
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

// Add new user to data set
app.post('/usuarios', (req, res) => {
  const { nombre, apellido, edad } = req.body;
  const id = Math.max(...usuarios.map(usr => usr.id)) + 1;
  const seguidores = [];
  const seguidos = [];
  const nuevoUsuario = { id, nombre, apellido, edad, seguidores, seguidos };
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
  
  const usuario = usuarios[usuarioIndex];

  usuario.nombre = nombre;
  usuario.apellido = apellido;
  usuario.edad = edad;

  const userDetail = {
    ...usuario,
    seguidos: usuario.seguidos.length,
    seguidores: usuario.seguidores.length,
  };

  res.json(userDetail);
});

// Delete user
app.delete('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const usuarioIndex = usuarios.findIndex(u => u.id === parseInt(id));
  if (usuarioIndex === -1) {
    return res.status(404).send('Usuario no encontrado');
  }
  const usuarioEliminado = usuarios.splice(usuarioIndex, 1);
  res.json('Usuario eliminado');
});

// Follow user
app.post('/seguimiento/:usuarioIdSeguidor/:usuarioIdSeguido', (req, res) => {
  const { usuarioIdSeguidor, usuarioIdSeguido } = req.params;

  const seguidor = usuarios.find(u => u.id === parseInt(usuarioIdSeguidor));
  const seguido = usuarios.find(u => u.id === parseInt(usuarioIdSeguido));

  if (!seguidor || !seguido) {
    return res.status(404).send('Usuario no encontrado');
  }

  if (seguidor.seguidos.includes(seguido.id)) {
    return res.status(400).send('El usuario ya sigue a este usuario');
  }

  seguidor.seguidos.push(seguido.id);
  seguido.seguidores.push(seguidor.id);

  res.status(201).send('Seguido satisfactoriamente');
});

// Unfollow user
app.delete('/seguimiento/:usuarioIdSeguidor/:usuarioIdSeguido', (req, res) => {
  const { usuarioIdSeguidor, usuarioIdSeguido } = req.params;

  const seguidor = usuarios.find(u => u.id === parseInt(usuarioIdSeguidor));
  const seguido = usuarios.find(u => u.id === parseInt(usuarioIdSeguido));

  if (!seguidor || !seguido) {
    return res.status(404).send('Usuario no encontrado');
  }

  const seguidorIndex = seguidor.seguidos.indexOf(seguido.id);
  const seguidoIndex = seguido.seguidores.indexOf(seguidor.id);

  if (seguidorIndex === -1 || seguidoIndex === -1) {
    return res.status(400).send('El usuario no sigue a este usuario');
  }

  seguidor.seguidos.splice(seguidorIndex, 1);
  seguido.seguidores.splice(seguidoIndex, 1);

  res.send('Dejaste de seguir al usuario');
});

 
app.listen(port, () => {
  console.log(`App de ejemplo en puerto ${port}`)
});
