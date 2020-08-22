const express = require('express');
const cors = require('cors');

const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get('/repositories', (request, response) => {
  return response.send(repositories);
});

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;
  const repo = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };
  repositories.push(repo);

  return response.status(201).send(repo);
});

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  if (repoIndex < 0) {
    return response.status(400).send({ error: 'Repository not found.' });
  }

  repo = repositories[repoIndex];
  repositories[repoIndex] = {
    id: id,
    title: title ? title : repo.title,
    url: url ? url : repo.url,
    techs: techs ? techs : repo.techs,
    likes: repo.likes,
  };

  return response.status(200).send(repositories[repoIndex]);
});

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  if (repoIndex < 0) {
    return response.status(400).send({ error: 'Repository not found.' });
  }

  repositories.splice(repoIndex, 1);

  return response.status(204).send();
});

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  if (repoIndex < 0) {
    return response.status(400).send({ error: 'Repository not found.' });
  }

  repositories[repoIndex].likes += 1;

  return response.status(200).send(repositories[repoIndex]);
});

module.exports = app;
