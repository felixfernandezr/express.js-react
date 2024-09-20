const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'uces',
  password: 'uces',
  database: 'express3',
});

const validacion = (req, res, next) => {
  const { id_usuario, fecha_hora, titulo, descripcion, invitados } = req.body
  if (!id_usuario || id_usuario == '') {
    res.status(409).send('Debe incluirse un id de usuario')
    return;
  }
  if (!fecha_hora || fecha_hora == '') {
    res.status(409).send('Debe incluirse la fecha y hora')
    return;
  }
  if (!titulo || titulo == '') {
    res.status(409).send('Debe indicarse un título')
    return;
  }
  if (!descripcion || descripcion == '') {
    res.status(409).send('Debe darse una descripción')
    return;
  }
  const id_invitado = [1, 2, 3]
  if (id_invitado.indexOf(invitados) == -1) {
    res.status(409).send('Debe incluirse un valor valido en invitados')
    return;
  }
  next();
}

connection.connect((error) => {
  if (error) {
    console.error(`Error de conexión: ${error.stack}`);
    return;
  }
  console.log('Conexión exitosa a la base de datos!');
});

let tokens = [];

// Generación de token de autenticación
const generarToken = () => {
  let token = Math.floor(Math.random() * 1000 * Date.now()).toString(36); // string aleatorio
  tokens.push(token);
  return token;
}

app.post('/login', (req, res) => {
  const credenciales = req.body;
  const usuario = connection.query('SELECT * FROM usuarios WHERE email = "' + credenciales.email + '" AND clave = "' + credenciales.clave + '"', (err, rows, fields) => {
	if (err) throw err
	if (rows.length == 0) {
	  return res.status(401).json({ error: 'No autorizado!' });
	} else {
	  let token = generarToken();
		res.status(201).json({token: token});
	}
  })
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
	connection.query('SELECT * FROM eventos', (err, rows, fields) => {
		if (err) throw err
		res.json(rows)
	})
});

// Obtener evento según id
app.get('/eventos/:id', (req, res) => {
	const { id } = req.params
	connection.query('SELECT * FROM eventos WHERE id=' + id, (err, rows, fields) => {
		if (err) throw err
		if (rows.length == 0) {
		  res.status(404).send('No se encontrò el evento');
		  return;
		} else {
		  res.json(rows[0])
		}
	})
});

// Agregar un evento
app.post('/eventos', requireLogin, (req, res) => {
	const { id_usuario, fecha_hora, titulo, descripcion, invitados } = req.body
	console.log(invitados);
	connection.query(`INSERT INTO eventos (id_usuario, fecha_hora, titulo, descripcion) VALUES (?, ?, ?, ?)`, [id_usuario, fecha_hora, titulo, descripcion], (err, rows, fields) => {
		if (err) {
		  res.sendStatus(500).send(err);
		  return;
		}
		const id_creado = rows.insertId;
		for (let i = 0; i < invitados.length; i++){
			connection.query(`INSERT INTO invitados (id_evento, id_invitado) VALUES (?, ?)`, [id_creado, invitados[i]], (er, ro, fi) => {
				if (er) {
				  res.sendStatus(500).send(er);
				  return;
				}
			})
		}
		res.json({
			id: rows.insertId
		})
	})
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
