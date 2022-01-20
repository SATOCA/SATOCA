import { createConnection, getConnection } from 'typeorm';
import { Survey } from "./entities/Survey";
import { Participant } from "./entities/Participant";
import { Question } from "./entities/Question";
import { Answer } from "./entities/Answer";
import { FinishedQuestion } from "./entities/FinishedQuestion";
import { Trustee } from "./entities/Trustee";
import { Report } from "./entities/Report";
import { TimeTracker } from "./entities/TimeTracker";

const MockDatabase = {
    async create() {
        await createConnection({
            type: "sqlite",
            database: ":memory:",
            entities: [
                Survey,
                Participant,
                Question,
                Answer,
                FinishedQuestion,
                Trustee,
                Report,
                TimeTracker
            ],
            synchronize: true,
            dropSchema: false,
            logging: false,
        });

        let aq1 = new Answer()
        aq1.id = 1;
        aq1.text = "Tomaten";
        aq1.correct = false;

        let aq2 = new Answer()
        aq2.id = 2;
        aq2.text = "Schinken";
        aq2.correct = false;

        let aq3 = new Answer()
        aq3.id = 3;
        aq3.text = "Salami";
        aq3.correct = true;

        let q1 = new Question()
        q1.id = 1;
        q1.text = "Pizza?";
        q1.multiResponse = false;
        q1.startSet = true;
        q1.slope = 10.1;
        q1.difficulty = 1.2;
        q1.choices = [aq1, aq2, aq3];

        let aq4 = new Answer()
        aq4.id = 4;
        aq4.text = "Scharf";
        aq4.correct = false;

        let aq5 = new Answer()
        aq5.id = 5;
        aq5.text = "Käse";
        aq5.correct = true;

        let q2 = new Question()
        q2.id = 2;
        q2.text = "Döner?";
        q2.multiResponse = false;
        q2.startSet = true;
        q2.slope = 1;
        q2.difficulty = 0.;
        q2.choices = [aq4, aq5];

        let aq6 = new Answer()
        aq6.id = 6;
        aq6.text = "Tomaten";
        aq6.correct = true;

        let aq7 = new Answer()
        aq7.id = 7;
        aq7.text = "Sahne";
        aq7.correct = false;

        let q3 = new Question()
        q3.id = 3;
        q3.text = "Nudeln?";
        q3.multiResponse = false;
        q3.startSet = false;
        q3.slope = 0.75;
        q3.difficulty = 1.;
        q3.choices = [aq6, aq7];

        let testsurvey = new Survey()
        testsurvey.id = 1;
        testsurvey.title = "Test Survey";
        testsurvey.itemSeverityBoundary = 3.14;
        testsurvey.privacyBudget = 42;
        testsurvey.legalDisclaimer = "test legal disclaimer";
        testsurvey.isClosed = false;

        let testuser = new Participant()
        testuser.id = 14;
        testuser.uuid = "3956838d-1726-4f1a-ac72-c3e29dc2a726";
        testuser.finished = false;
        testuser.scoring = 0;
        testuser.legalDisclaimerAccepted = false;
        testuser.survey = testsurvey;
        testuser.currentQuestion = q1;

        await getConnection().getRepository(Question).save(q1);
        await getConnection().getRepository(Question).save(q2);
        await getConnection().getRepository(Question).save(q3);
        await getConnection().getRepository(Survey).save(testsurvey);
        await getConnection().getRepository(Participant).save(testuser);
        await getConnection().getRepository(Trustee).insert({
            login: "foo",
            password: "bar"
        });
    },

    async close() {
        await getConnection().close();
    },
};

export default MockDatabase;
