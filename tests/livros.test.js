process.env.NODE_ENV = 'test';

const request = require('supertest');
const { sequelize, Livro } = require('../src/models');

const versions = ['v1', 'v2', 'v3'];

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

beforeEach(async () => {
  await Livro.destroy({ where: {} });
});

afterAll(async () => {
  await sequelize.close();
});

describe.each(versions)('Versão %s - GET /livros/:id', (version) => {
  const app = require(`../src/versions/${version}/app`);

  test('retorna 200 com { id, titulo } quando o livro existe', async () => {
    const livroCriado = await Livro.create({
      titulo: 'Clean Code',
      autor: 'Robert C. Martin',
    });

    const res = await request(app).get(`/livros/${livroCriado.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: livroCriado.id,
      titulo: 'Clean Code',
    });
    expect(res.body).not.toHaveProperty('autor');
  });

  test('retorna 404 quando o livro não existe', async () => {
    const res = await request(app).get('/livros/99999');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ erro: 'Livro não encontrado' });
  });

  test('retorna 400 para tentativa de injection no id', async () => {
    const res = await request(app).get('/livros/1%20OR%201=1');

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ erro: 'Parâmetro id inválido' });
  });

  test('retorna 400 para id com tipo inválido', async () => {
    const res = await request(app).get('/livros/abc');

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ erro: 'Parâmetro id inválido' });
  });

  test('retorna 400 para id fora do limite seguro de inteiro', async () => {
    const res = await request(app).get('/livros/9007199254740992');

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ erro: 'Parâmetro id inválido' });
  });
});