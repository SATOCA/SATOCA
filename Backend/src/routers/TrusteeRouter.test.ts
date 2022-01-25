import request from "supertest"
import app from "../App"
import MockDatabase from "../MockDatabase";

beforeEach(async () => {
    await MockDatabase.create();
});

afterEach(async () => {
    await MockDatabase.close();
})

describe("POST /login", () => {
    test("valid credentials", async () => {
        const response = await request(app)
            .post("/api/trustee/login")
            .set('Content-type', 'application/json')
            .send({
                login: "foo",
                password: "bar"
            });
        expect(response.statusCode).toBe(200);
        expect(response.body.error.hasError).toBeFalsy();
        expect(response.body.error.message).toBe("");
        expect(response.body.success).toBeTruthy();
    });

    test("invalid credentials", async () => {
        const response = await request(app)
            .post("/api/trustee/login")
            .set('Content-type', 'application/json')
            .send({
                login: "user",
                password: "bat"
            });
        expect(response.statusCode).toBe(200);
        expect(response.body.error.hasError).toBeFalsy();
        expect(response.body.error.message).toBe("");
        expect(response.body.success).toBeFalsy();
    });
});
