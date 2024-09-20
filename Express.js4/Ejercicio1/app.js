const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  storage: 'db_alumnos.db',
  dialect: 'sqlite',
  define: {
    defaultScope: {
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    },
  },
});

const Alumno = sequelize.define('alumnos', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'El campo "nombre" no puede ser nulo'
      },
      notEmpty: {
        msg: 'El campo "nombre" no puede estar vacío'
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
	isUnique :true,
    defaultValue: true,
    validate: {
		isEmail : true
    }
  },
  fecha_nacimiento: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
		isDate: true,
		notNull: {
			msg: 'El campo "fecha" no puede ser nulo'
		},
		notEmpty: {
			msg: 'El campo "fecha" no puede estar vacío'
		}
    }
  }
});

const Cursada = sequelize.define('cursadas', {
  materia : {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'El campo "materia" no puede ser nulo'
      },
      notEmpty: {
        msg: 'El campo "materia" no puede estar vacío'
      }
    }
  },
  anio: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'El campo "anio" no puede ser nulo'
      },
      notEmpty: {
        msg: 'El campo "anio" no puede estar vacío'
      },
      max: 2024,
      min: 1,
    }
  },
  cuatrimestre : {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'El campo "cuatrimestre" no puede ser nulo'
      },
      notEmpty: {
        msg: 'El campo "cuatrimestre" no puede estar vacío'
      },
      isIn: {
        args: [[1, 2]],
        msg: 'El campo "cuatrimestre" debe indicar 1º o 2º cuatrimestre'
      }
    }
  },
  aprobada: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
	defaultValue: null,
    validate: {
      isIn: {
        args: [[true, false, null]],
        msg: 'El campo "aprobada" debe indicar TRUE para "aprobada", FALSE para "desaprobada" o NULL para "en curso"'
      }
    }
  },
});

Alumno.hasMany(Cursada, { as: 'cursadas' });

app.use(bodyParser.json());

sequelize.sync()
  .then(() => {
    app.listen(port, () => {
      popular();
      console.log('El servidor está corriendo en el puerto ' + port);
    });
  })
  .catch((error) => {
    console.error('Error al sincronizar la base de datos:', error);
  });

app.get('/alumnos', async (req, res) => {
  const data = await Alumno.findAll()
  res.json(data)
});

app.get('/alumnos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const unAlumno = await Alumno.findByPk(id, {
      include: 'cursadas'
    });
    if (unAlumno === null) {
      res.status(404).json({ error: `No se encontró el alumno con ID ${id}.` });
    } else {
      res.json(unAlumno);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ha ocurrido un error al ejecutar la consulta.' });
  }
});

app.post('/alumnos/', async (req, res) => {
  try {
    const unAlumno = await Alumno.build(req.body);
    await unAlumno.validate();
    const unAlumnoValidado = await Alumno.create(req.body);
    res.json({id: unAlumnoValidado.id});
  } catch (error) {
    console.error(error);
    res.status(409).json({ errores: error.errors.map(function (e) {return e.message;}) });
  }
});

app.patch('/alumnos/:id', async (req, res) => {
  const { id } = req.params;
  const unAlumno = req.body;
  
  try {
    const [, affectedRows] = await Alumno.update(
      unAlumno,
      { where: { id } }
    );
    if (affectedRows === 0) {
      res.status(404).json({ error: `No se encontró el alumno con ID ${id}.` });
    } else {
      res.json({ id: id });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ha ocurrido un error al actualizar los datos.' });
  }
});

app.delete('/alumnos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const unAlumno = await Alumno.findOne({ where: { id } });
    if (!unAlumno) {
      return res.status(404).json({ error: 'Alumno no encontrado' });
    }
    await unAlumno.destroy();
    res.json('ok');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/alumnos/:id/cursada', async (req, res) => {
  const { id } = req.params;
  const cursada = req.body;

  try {
	const cursadaNueva = await Cursada.build(req.body);
    await cursadaNueva.validate();
    cursada.alumnoId = id;
    const createdCursada = await Cursada.create(cursada);
    res.json({ id: createdCursada.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ha ocurrido un error al crear la cursada.' });
  }
});

app.patch('/cursadas/aprobar/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const [, affectedRows] = await Cursada.update(
      { aprobada: true },
      { where: { id } }
    );
    if (affectedRows === 0) {
      res.status(404).json({ error: `No se modificó el estado de la cursada con ID ${id}.` });
    } else {
      res.json({ id: id });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ha ocurrido un error al actualizar los datos.' });
  }
});

app.patch('/cursadas/reprobar/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const [, affectedRows] = await Cursada.update(
      { aprobada: false },
      { where: { id } }
    );
    if (affectedRows === 0) {
      res.status(404).json({ error: `No se modificó el estado de la cursada con ID ${id}.` });
    } else {
      res.json({ id: id });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ha ocurrido un error al actualizar los datos.' });
  }
});

app.delete('/cursadas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const unaCursada = await Cursada.findOne({ where: { id } });
    if (!unaCursada) {
      return res.status(404).json({ error: 'Cursada no encontrada' });
    }
    await unaCursada.destroy();
    res.json('ok');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

async function popular() {
  const qAlumnos = await Alumno.count();
  const qCursadas = await Cursada.count();
  if(qAlumnos==0 && qCursadas==0) {
    const alumnos = [
      { nombre: 'Jimi Hendrix', email: 'jimihen@gmail.com', fecha_nacimiento: '1978-01-04' },
      { nombre: 'Flea', email: 'flea@mail.com', fecha_nacimiento: '2001-04-05' },
      { nombre: 'Dave Grohl', email: 'dgrohl@mail.com', fecha_nacimiento: '1980-04-05' },
      { nombre: 'Robert Trujillo', email: 'trujiman@mail.com', fecha_nacimiento: '1980-12-31' },
      { nombre: 'Tom Morello', email: 'more@mail.com', fecha_nacimiento: '2015-08-01' }
    ];

    const cursadas = [
      { materia: 'Programaciòn Web II', anio: 2024, cuatrimestre: 1, aprobada: false, alumnoId: 1 },
      { materia: 'Programaciòn Web I', anio: 2023, cuatrimestre: 2, aprobada: true, alumnoId: 1 },
      { materia: 'Programaciòn II', anio: 2023, cuatrimestre: 2, aprobada: null, alumnoId: 2 },
      { materia: 'Programaciòn I', anio: 2023, cuatrimestre: 1, aprobada: true, alumnoId: 2 },
      { materia: 'Programaciòn Orientada a Objetos', anio: 2023, cuatrimestre: 2, aprobada: null, alumnoId: 3 },
      { materia: 'Diseño Orientado a Obtejos', anio: 2023, cuatrimestre: 1, aprobada: false, alumnoId: 3 },
      { materia: 'Bases de Datos II', anio: 2023, cuatrimestre: 2, aprobada: false, alumnoId: 4 },
      { materia: 'Bases de Datos I', anio: 2023, cuatrimestre: 1, aprobada: null, alumnoId: 4 },
      { materia: 'Ingenierìa de Software', anio: 2024, cuatrimestre: 1, aprobada: null, alumnoId: 5 },
      { materia: 'Ètica', anio: 2023, cuatrimestre: 1, aprobada: true, alumnoId: 5 }
    ];
    Alumno.bulkCreate(alumnos, { validate: true });
    Cursada.bulkCreate(cursadas, { validate: true });
  }
}
