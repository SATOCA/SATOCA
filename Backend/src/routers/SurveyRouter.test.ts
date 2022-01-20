import request from "supertest"
import app from "../App"
import MockDatabase from "../MockDatabase";

beforeEach(async () => {
    await MockDatabase.create();
});

afterEach(async () => {
    await MockDatabase.close();
})

describe("GET /data/:surveyId/:uniqueId", () => {
    test("next question", async () => {
        const response = await request(app).get("/api/survey/data/1/3956838d-1726-4f1a-ac72-c3e29dc2a726");
        expect(response.statusCode).toBe(200);
        expect(response.body.error.hasError).toBeFalsy();
        expect(response.body.error.message).toBe("");
        expect(response.body.legalDisclaimerAccepted).toBeFalsy()
        expect(response.body.ability).toBe(0);
        expect(response.body.finished).toBeFalsy()
        // first question
        expect(response.body.item.id).toBe(1)
        expect(response.body.item.text).toBe("Pizza?")
    });
})

describe("GET /disclaimer/:surveyId", () => {
    test("valid survey", async () => {
        const response = await request(app).get("/api/survey/disclaimer/1");
        expect(response.statusCode).toBe(200);
        expect(response.body.error.hasError).toBeFalsy();
        expect(response.body.error.message).toBe("");
        expect(response.body.legalDisclaimer).toBe("test legal disclaimer");
    });
});
