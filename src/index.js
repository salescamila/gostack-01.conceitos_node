const express = require('express');

const server = express();

server.use(express.json());
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

// 'yarn index.js' no console para iniciar o servidor
// 'yarn add nodemon -D' para monitorar alterações de arquivos e reiniciar o servidor automaticamente

// CRUD - Create, Read, Update, Delete

const users = ['Camila', 'Silva', 'Sales'];

server.use((req, res, next) => {
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

// Consumindo Query params
//localhost:3000/teste?nome=Camila
server.get('/teste', (req, res) => {
  const nome = req.query.nome;
  return res.json({ message: `Hello ${nome}` });
})

// Consumindo Route params
//localhost:3000/users/1234
server.get('/users/:index', checkUserInArray, (req, res) => {
  //const { index } = req.params;
  return res.json({ message: `Buscando o usuário ${req.user}` });
})

server.get('/users', (req, res) => {
  return res.json(users);
});

server.post('/users', checkUserExists, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});

server.put('/users/:index', checkUserExists, checkUserInArray, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);
})

server.delete('/users/:index', checkUserInArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);

  //Boa prática: retornar apenas um status de ok após deletar
  return res.send();
});

server.listen(3000, () => {
  console.log('🚀 Back-end started!');
});