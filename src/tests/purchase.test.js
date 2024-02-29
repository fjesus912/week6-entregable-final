require("../models");
const supertest = require("supertest");
const app = require("../app");
const Product = require("../models/Product");

const URL_USER = "/users/login";
const URL_PURCHASE = "/purchase";
let TOKEN;
let userId;
let product;
let productBody;
let bodyCart;

beforeAll(async () => {
  //inicio de sesión
  const user = {
    email: "fernando@gmail.com",
    password: "fernando1234",
  };

  const res = await supertest(app)
    .post(URL_USER)
    .send(user);

  TOKEN = res.body.token;
  userId = res.body.user.id;

  //producto
  productBody = {
    title: "lorem10",
    description: "lorem20",
    price: "45.65",
  };

  product = await Product.create(productBody);

  //cart
  bodyCart = {
    productId: product.id,
    quantity: 3,
  };

  await supertest(app)
    .post("/cart")
    .send(bodyCart)
    .set("Authorization", `Bearer ${TOKEN}`);
});

test("POST -> 'URL_PURCHASE', should return status code 201, res.body to be defined and res.body.quantity === bodyCart.quantity", async() => { 
  const res = await supertest(app)
    .post(URL_PURCHASE)
    .set("Authorization", `Bearer ${TOKEN}`)

    expect(res.status).toBe(201)
    expect(res.body[0]).toBeDefined()
    expect(res.body[0].quantity).toBe(bodyCart.quantity)
 })

 test("GET -> 'URL_PURCHASE', should return status code 200, res.body to be defined and res.body.length === 1", async() => {
  const res = await supertest(app)
    .get(URL_PURCHASE)
    .set("Authorization", `Bearer ${TOKEN}`)

  expect(res.status).toBe(200)
  expect(res.body).toBeDefined()
  expect(res.body).toHaveLength(1)

  expect(res.body[0].productId).toBeDefined()
  expect(res.body[0].productId).toBe(product.id)

  expect(res.body[0].userId).toBeDefined()
  expect(res.body[0].userId).toBe(userId)

  await product.destroy()
 })
