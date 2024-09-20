const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
app.use(bodyParser.json());

let tokens = [];

let usuarios = [
	{id: 1, nombre: 'Martin Tomeo', email: 'mtomeo@mail.com', clave: 'abc123'},
	{id: 2, nombre: 'Santiago Fazzini', email: 'sfazzini@mail.com', clave: 'def456'},
	{id: 3, nombre: 'Félix Fernández', email: 'ffernandez@mail.com', clave: 'ghi789'}
];

let eventos = [
	{ id: 1, id_usuario: 1, fecha_hora: "", titulo: 'Cumpleaños', descripcion: 'Fiesta de cumpleaños en salón', invitados: [] },
	{ id: 2, id_usuario: 2, fecha_hora: "", titulo: 'Casamiento', descripcion: 'Fiesta de cumpleaños en salón', invitados: [] },
	{ id: 3, id_usuario: 1, fecha_hora: "", titulo: 'Fiesta de 15', descripcion: 'Fiesta de cumpleaños en salón', invitados: [] },
	{ id: 4, id_usuario: 3, fecha_hora: "", titulo: '50 Años', descripcion: 'Fiesta de cumpleaños en salón', invitados: [] }
]

// Generación de token de autenticación
const generarToken = () => {
  let token = Math.floor(Math.random() * 1000 * Date.now()).toString(36); // string aleatorio
  tokens.push(token);
  return token;
}

app.post('/login', (req, res) => {
  const credenciales = req.body;
  if (usuarios.find(cred => cred.email==credenciales.email && cred.clave==credenciales.clave)) {
    let token = generarToken();
    res.status(201).json({token: token});
  } else {
    return res.status(401).json({ error: 'No autorizado!' });
  }
});

// Middleware de autenticación que verifica si el usuario tiene un token de autorización
const requireLogin = (req, res, next) => {
  if (req.headers.authorization && tokens.indexOf(req.headers.authorization)>=0) {
    next();
  } else {
    return res.status(401).json({ error: 'No autorizado!' });
  }
};

// Ruta sin autenticación
app.get('/', (req, res) => {
  res.send('Ruta no protegida. Debe ingresar');
});

// Ruta de ejemplo protegida por el middleware de autenticación
app.get('/eventos', requireLogin, (req, res) => {
  let respuesta = eventos.map(evnt => {
    return { fecha_hora: evnt.fecha_hora, titulo: evnt.titulo, invitados: evnt.invitados.length, id: evnt.id }; 
  });
  res.json(respuesta);
});

// Obtener evento según id
app.get('/eventos/:id', requireLogin, (req, res) => {
  const { id } = req.params;
  const evento = eventos.find(evnt => evnt.id === parseInt(id));
  if (evento === -1) {
    return res.status(404).send('Evento no encontrado');
  }
  
  const eventDetail = {
    ...evento,
    cantidad_invitados: evento.invitados.length,
  };

  res.json(eventDetail);
});

// Agregar un evento
app.post('/eventos', requireLogin, (req, res) => {
  const { id_usuario, fecha_hora, titulo, descripcion, invitados } = req.body;
  const id = Math.max(...eventos.map(usr => usr.id)) + 1;
  const nuevoEvento = { id, id_usuario, fecha_hora, titulo, descripcion, invitados };
  eventos.push(nuevoEvento);
  res.status(201).json(nuevoEvento.id);
});

// Editar un evento
app.patch('/eventos/:id', requireLogin, (req, res) => {
  const { id } = req.params;
  const { id_usuario, fecha_hora, titulo, descripcion, invitados } = req.body;
  const eventoIndex = eventos.findIndex(evnt => evnt.id === parseInt(id));
  if (eventoIndex === -1) {
    return res.status(404).send('Evento no encontrado');
  }
  
  eventos[eventoIndex].id_usuario = id_usuario;
  eventos[eventoIndex].fecha_hora = fecha_hora;
  eventos[eventoIndex].titulo = titulo;
  eventos[eventoIndex].descripcion = descripcion;
  eventos[eventoIndex].invitados = invitados;
  
  res.json(eventos[eventoIndex].id);
});

// Eliminar un evento
app.delete('/eventos/:id', requireLogin, (req, res) => {
  const { id } = req.params;
  const eventoIndex = eventos.findIndex(evnt => evnt.id === parseInt(id));
  if (eventoIndex === -1) {
    return res.status(404).send('Evento no encontrado');
  }
  
  const eventoEliminado = eventos.splice(eventoIndex, 1);
  res.json('Evento eliminado');
});

// Agregar un invitado a un evento
app.post('/eventos/:idEvento/invitado/:idUsuario', requireLogin, (req, res) => {
  const { idEvento, idUsuario } = req.params;

  const evnt = eventos.find(evnt => evnt.id === parseInt(idEvento));
  const usuario = usuarios.find(u => u.id === parseInt(idUsuario));

  if (!evnt){
	return res.status(404).send('Evento no encontrado');  
  }
  
  if (!usuario) {
    return res.status(404).send('Usuario no encontrado');
  }

  if (evnt.invitados.includes(usuario.id)) {
    return res.status(400).send('Este usuario ya està invitado');
  }
  
  evnt.invitados.push(usuario.id);

  res.status(201).send('Invitado satisfactoriamente');
});

// Eliminar un invitado de un evento
app.delete('/eventos/:idEvento/invitado/:idUsuario', requireLogin, (req, res) => {
  const { idEvento, idUsuario } = req.params;

  const evnt = eventos.find(evnt => evnt.id === parseInt(idEvento));
  const usuario = usuarios.find(u => u.id === parseInt(idUsuario));

  if (!evnt){
	return res.status(404).send('Evento no encontrado');  
  }
  
  if (!usuario) {
    return res.status(404).send('Usuario no encontrado');
  }
  
  const eventoIndex = evnt.invitados.indexOf(usuario.id);

  if (eventoIndex === -1) {
    return res.status(400).send('El usuario no está invitado a este evento');
  }


  evnt.invitados.splice(eventoIndex, 1);

  res.send('Se revocó la invitación');
});


// Iniciar el servidor
app.listen(port, () => {
  console.log('Servidor iniciado en el puerto 3000');
});
