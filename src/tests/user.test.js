const request = require("supertest");
const app = require("../app");

const URL_BASE = "/users";
const user = {
  firstName: "Rene",
  lastName: "ZZ",
  email: "rene@gmail.com",
  password: "rene1234",
  phone: "+521234567890",
};

test("POST -> 'URL_BASE', should return status code 201, res.body to be defined and res.body.firstName === user.firstName", async () => {

  const res = await request(app)
    .post(URL_BASE)
    .send(user)

expect(res.status).toBe(201)
expect(res.body).toBeDefined()
expect(res.body.firstName).toBe(user.firstName)

});
