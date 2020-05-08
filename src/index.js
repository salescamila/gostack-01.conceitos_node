const express = require('express');
const cors = require('cors');
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(cors());
app.use(express.json());

/**
 * Métodos HTTP:
 *
 * GET: Buscar informações do back-end
 * POST: Criar uma informação no back-end
 * PUT/PATCH: Alterar uma informação no back-end
 * DELETE: Deletar uma informação no back-end
 */

 /**
  * Tipos de parâmetros:
  *
  * Query Params: Filtros e paginação
  *   exemplo = ?teste=1
  * Route Params: Identificar recursos (Atualizar/Deletar)
  *   exemplo = /users/1
  * Request Body: Conteúdo na hora de criar ou editar um recurso
  *   exemplo = { "name": "Camila", "salescamila1@gmail.com" }
  */

  /**
   * Middleware:
   *
   * Interceptador de requisições que pode interromper totalmente a requisição
   * ou alterar dados da requisição
   */

// 'yarn index.js' no console para iniciar o servidor
// 'yarn add nodemon -D' para monitorar alterações de arquivos e reiniciar o servidor automaticamente

// CRUD - Create, Read, Update, Delete

const users = ['Camila', 'Silva', 'Sales'];
const projects = [];

// ------------------------------- //
app.use((req, res, next) => {
  console.time('Request');
  console.log(`Método: ${req.method}; URL: ${req.url}`);

  next();

  console.timeEnd('Request');
});

function checkUserExists(req, res, next) {
  if(!req.body.name) {
    return res.status(400).json({ error: 'User name is required' });
  }

  return next();
}

function checkUserInArray(req, res, next) {
  const user = users[req.params.index];

  if (!user) {
    return res.status(400).json({ error: 'User does not exists' });
  }

  req.user = user;

  return next();
}
// ------------------------------- //


function logRequest(request, response, next) {
	const { method, url } = request;

	const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.time(logLabel);

  next(); // Próximo middleware

  console.timeEnd(logLabel);
};

function validateProjectId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid project ID.' });
  }

  return next();
}
// ------------------------------- //
// PROJECTS API
app.use(logRequest);
app.use('/projects/:id', validateProjectId);

app.get('/projects', (request, response) => {
  const { title } = request.query;
  const results = title
    ? projects.filter(project => project.title.includes(title))
    : projects;

  return response.json(results);
});

app.post('/projects', (request, response) => {
  const { title, owner } = request.body;

  const project = { id: uuid(), title, owner };

  projects.push(project);

  return response.json(project);
});

app.put('/projects/:id', (request, response) => {
  const { id } = request.params;
  const { title, owner } = request.body;

  const projectIndex = projects.findIndex(project => project.id === id );

  if (projectIndex < 0) {
    return response.status(400).json({ error: 'Project not found.' });
  }

  const project = {
    id,
    title,
    owner,
  };

  projects[projectIndex] = project;

  return response.json(project);
});

app.delete('/projects/:id', (request, response) => {
  const { id } = request.params;

  const projectIndex = projects.findIndex(project => project.id === id );

  if (projectIndex < 0) {
    return response.status(400).json({ error: 'Project not found.' });
  }

  projects.splice(projectIndex, 1);

  return response.status(204).send();
});
// ------------------------------- //

// ------------------------------- //
// Consumindo Query params
//localhost:3000/teste?nome=Camila
app.get('/teste', (req, res) => {
  const nome = req.query.nome;
  return res.json({ message: `Hello ${nome}` });
})

// Consumindo Route params
//localhost:3000/users/1234
app.get('/users/:index', checkUserInArray, (req, res) => {
  //const { index } = req.params;
  return res.json({ message: `Buscando o usuário ${req.user}` });
})

app.get('/users', (req, res) => {
  return res.json(users);
});

app.post('/users', checkUserExists, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});

app.put('/users/:index', checkUserExists, checkUserInArray, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);
})

app.delete('/users/:index', checkUserInArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);

  //Boa prática: retornar apenas um status de ok após deletar
  return res.send();
});
// ------------------------------- //

app.listen(3000, () => {
  console.log('🚀 Back-end started!');
});