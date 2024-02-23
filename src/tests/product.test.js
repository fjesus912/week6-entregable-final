require("../models");
const request = require("supertest");
const app = require("../app");
const Category = require("../models/Category");

const URL_BASE_USER = "/users/login";
const URL_BASE = "/products";
let TOKEN;
let category;
let product;
let productId;

beforeAll(async () => {
  const user = {
    email: "fernando@gmail.com",
    password: "fernando1234",
  };
  const res = await request(app).post(URL_BASE_USER).send(user);

  TOKEN = res.body.token;

  //creación de los registros de primera instancia para el modelo category
  category = await Category.create({ name: "Electrónica" });

  product = {
    title: "Televisión 55 pulgadas",
    description: "lorem20",
    price: "17499.99",
    categoryId: category.id,
  };
});

test("POST -> 'URL_BASE' should return status code 201, res.body to be defined and res.body.title === product.title", async () => {
  const res = await request(app)
    .post(URL_BASE)
    .send(product)
    .set("Authorization", `Bearer ${TOKEN}`);

  productId = res.body.id;

  expect(res.status).toBe(201);
  expect(res.body).toBeDefined();
  expect(res.body.title).toBe(product.title);
});

test("GET -> 'URL_BASE', should return status code 200, res.body to be defined and res.body.length length === 1 ", async () => {
  const res = await request(app).get(URL_BASE);

  expect(res.status).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body).toHaveLength(1);

  expect(res.body[0].category).toBeDefined();
  expect(res.body[0].category.id).toBe(category.id);
});

////
test("GET -> 'URL_BASE', should return status code 200, res.body to be defined and res.body.length === 1, res.body[0].categoryId === category.id and res.body[0].category.id === category.id", async () => {
  const res = await request(app).get(`${URL_BASE}?category=${category.id}`);

  expect(res.status).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body).toHaveLength(1);

  expect(res.body[0].categoryId).toBeDefined();
  expect(res.body[0].categoryId).toBe(category.id);

  expect(res.body[0].category).toBeDefined();
  expect(res.body[0].category.id).toBe(category.id);
});
////


test("GET -> 'URL_BASE/:id', should return status code 200, res.body to be defined, res.body.title === product.title, res.body.category.id to be defined and res.body.category.id === category.id", async () => { 
  const res = await request(app)
    .get(`${URL_BASE}/${productId}`)

    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.title).toBe(product.title)

    expect(res.body.category.id).toBeDefined()
    expect(res.body.category.id).toBe(category.id)
 })

test("PUT -> 'URL_BASE/:id', should return status code 200, res.body to be defined and res.body.price = '17500'", async () => {
  const res = await request(app)
    .put(`${URL_BASE}/${productId}`)
    .send({ price: "17500" })
    .set("Authorization", `Bearer ${TOKEN}`);

  expect(res.status).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body.price).toBe("17500");
});

test("DELETE -> 'URL_BASE/:id', should return status code 204", async () => {
  const res = await request(app)
  .delete(`${URL_BASE}/${productId}`)
  .set("Authorization", `Bearer ${TOKEN}`);
  
  expect(res.status).toBe(204);

  await category.destroy();
});
