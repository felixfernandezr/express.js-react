const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');

app.use(bodyParser.json());

// Data Set
let usuarios = [
  { id: 1, nombre: 'Emiliano', apellido: 'Martínez', edad: 30, seguidores: [], seguidos: [], bloqueados: [] },
  { id: 2, nombre: 'Nicolás', apellido: 'Tagliafico', edad: 30, seguidores: [], seguidos: [], bloqueados: [] },
  { id: 3, nombre: 'Gonzalo', apellido: 'Montiel', edad: 26, seguidores: [], seguidos: [], bloqueados: [] },
  { id: 4, nombre: 'Angel', apellido: 'Di María', edad: 35, seguidores: [], seguidos: [], bloqueados: [] }
];


app.get('/', (req, res) => {
  res.send('Ejercicio 1');
});

// Get all users
app.get('/usuarios', (req, res) => {
  let respuesta = usuarios.map(usr => {
    return { id: usr.id, nombre: usr.nombre, apellido: usr.apellido, seguidores: usr.seguidores, seguidos: usr.seguidos, bloqueados: usr.bloqueados }; 
  });
  res.json(respuesta);
});

// User by ID
app.get('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const usuario = usuarios.find(u => u.id === parseInt(id));
  if (usuario === -1) {
    return res.status(404).send('Usuario no encontrado');
  }
  
  const userDetail = {
    ...usuario,
    seguidos: usuario.seguidos.length,
    seguidores: usuario.seguidores.length,
	  bloqueados: usuario.bloqueados.length,
  };

  res.json(userDetail);
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
  
  const usuario = usuarios[usuarioIndex];

  usuario.nombre = nombre;
  usuario.apellido = apellido;
  usuario.edad = edad;

  const userDetail = {
    ...usuario,
    seguidos: usuario.seguidos.length,
    seguidores: usuario.seguidores.length,
	  bloqueados: usuario.bloqueados.length,
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
    return res.status(400).send('Ya sigues a este usuario');
  }
  
  if (seguidor.bloqueados.includes(seguido.id)) {
    return res.status(403).send('No puedes seguir a este usuario');
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

// Block user
app.post('/bloqueo/:usuarioId/:usuarioIdBloqueado', (req, res) => {
  const { usuarioId, usuarioIdBloqueado } = req.params;

  const usuario = usuarios.find(u => u.id === parseInt(usuarioId));
  const usuarioBloqueado = usuarios.find(u => u.id === parseInt(usuarioIdBloqueado));

  if (!usuario || !usuarioBloqueado) {
    return res.status(404).send('Usuario no encontrado');
  }

  if (usuario.bloqueados.includes(usuarioBloqueado.id)) {
    return res.status(400).send('El usuario ya está bloqueado');
  }

  const seguidorIndex = usuario.seguidos.indexOf(usuarioBloqueado.id);
  if (seguidorIndex !== -1) {
    usuario.seguidos.splice(seguidorIndex, 1);
  }

  const seguidoIndex = usuarioBloqueado.seguidores.indexOf(usuario.id);
  if (seguidoIndex !== -1) {
    usuarioBloqueado.seguidores.splice(seguidoIndex, 1);
  }

  usuario.bloqueados.push(usuarioBloqueado.id);

  res.status(201).send('Usuario bloqueado');
});

// Unblock user
app.delete('/bloqueo/:usuarioId/:usuarioIdBloqueado', (req, res) => {
  const { usuarioId, usuarioIdBloqueado } = req.params;

  const usuario = usuarios.find(u => u.id === parseInt(usuarioId));
  const usuarioBloqueado = usuarios.find(u => u.id === parseInt(usuarioIdBloqueado));

  if (!usuario || !usuarioBloqueado) {
    return res.status(404).send('Usuario no encontrado');
  }

  const bloqueadoIndex = usuario.bloqueados.indexOf(usuarioBloqueado.id);

  if (bloqueadoIndex === -1) {
    return res.status(400).send('El usuario no está bloqueado');
  }

  usuario.bloqueados.splice(bloqueadoIndex, 1);

  res.send('Usuario desbloqueado');
});

 
app.listen(port, () => {
  console.log(`App de ejemplo en puerto ${port}`)
});
