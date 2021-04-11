import "reflect-metadata";
import { createConnection } from "typeorm";
import { Participant } from "./entity/Participant";

const port = 3124

const express = require('express')
const uuid = require('uuid');

createConnection({
      "type": "postgres",
      "host": "localhost",
      "port": 5432,
      "username": "postgres", //! \todo: process.env.DATABASE_USERNAME!
      "database": "testdb",
      "synchronize": true,
      "logging": false,
      "entities": [
         "src/entity/**/*.ts"
      ]
   }).then(async connection => {
   //
   const participantRepository = connection.getRepository(Participant);
   // start express server
   const router = express.Router();
   const app = express();

   app.use(express.json());

   // temporary
   router.use(function (req, res, next) {

      // Website you wish to allow to connect
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
      // Request methods you wish to allow
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      // Request headers you wish to allow
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
      // Set to true if you need the website to include cookies in the requests sent
      // to the API (e.g. in case you use sessions)
      res.setHeader('Access-Control-Allow-Credentials', true);

      next();
   });

   // start the survey
   // 
   router.get("/survey/:surveyId/:participant", async function(req, res) {

      //! \todo check if survey exists
      // const survey = await surveyRepository.findOne({ where: { uuid: req.params.surveyId } });

      const participant = await participantRepository.findOne({ where: { uuid: req.params.participant } });
      if (participant == null)
      {
         res.json({ sucess: false, message: "cannot find participant"});
         return;
      }      
      //! \todo check if participant is allowed/valid
      //! \todo error handling

      // store generated id
      participant.session = uuid.v1();
      await participantRepository.save(participant);

      //! \todo return start question
      res.json({ session: participant.session });
   });

   // submit answer
   //
   router.post("/survey/:surveyId/:participant/answer", async function(req, res) {

      if (req.body.id == null)
      {
         res.json({ sucess: false, message: "cannot submit answer without session id"});
         return;
      }
      //! \todo 
      // const survey = await surveyRepository.findOne({ where: { uuid: req.params.id } });

      const participant = await participantRepository.findOne({ where: { uuid: req.params.participant } });
      if (participant == null)
      {
         res.json({ sucess: false, message: "cannot find participant"});
         return;
      }

      if (req.body.id !== participant.session)
      {
         res.json({ sucess: false, message: "another session is started"});
         return;
      }
      //! \todo return the next question
      res.json({ sucess: true });
   });

   // add a participant to a survey
   //
   router.get("/admin/survey/:surveyId/add", async function(req, res) {
      //! \ţodo req.params.surveyId is not used yet
      const participant = await participantRepository.create();
      participant.uuid = uuid.v1();
      await participantRepository.save(participant);
      return res.end();
   });

   // retrieve all participants
   //
   router.get("/admin/survey/:surveyId/participants", async function(req, res) {
      //! \ţodo req.params.surveyId is not used yet
      const participants = await participantRepository.find();
      res.json(participants);
   });

   app.use('/', router);

   app.listen(port, () => {
      console.log(`SATOCA backend is listening at http://localhost:${port}`)
   });
});
