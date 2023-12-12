const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");
const { loginValidation, registrationValidation } = require('../middleware/validation');


router.get('/test', (req, res, next) => {
    return res.status(201).send({
        msg: 'Working!'
    });
})

// User 
const users_controller = require("../controllers/userController");
router.post("/login",loginValidation, users_controller.login);
router.post("/verify-number",loginValidation, users_controller.verifyNumber);
router.post("/registration",registrationValidation, users_controller.registration);
router.get("/get-players",auth, users_controller.listPlayers);

// Games
const game_controller = require("../controllers/gameController");
router.get("/games", game_controller.listGames);
router.get("/start-game",auth, game_controller.startGame);
router.post("/newGame",auth, game_controller.newGame);

// Questions
const question_controller = require("../controllers/questionsController");
router.post("/get-questions",auth, question_controller.getQuestions);

// Answer
const answer_controller = require("../controllers/answersController");
router.post("/check-answer",auth, answer_controller.checkAnswer);
router.post("/get-score",auth, answer_controller.gameAnswers);


// router.get("/get-users", auth, users_controller.getUsers);

module.exports = router;