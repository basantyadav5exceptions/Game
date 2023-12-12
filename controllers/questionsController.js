const Questions = require('../models/questions');
const Games = require('../models/games');
const Answers = require('../models/answers');
const sql = require("../config/dbConnection");

exports.getQuestions = async (req, res) => {
    try {
        const questionData = [];
        const myArray = ['Yes', 'yes', 'Ja', 'ja'];
        let gameName = '';

        Questions.getQuestions(req.body, async (err, data) => {
            if (err) {
                res.status(400).send({
                    message: 'Something went wrong',
                    status: 'error',
                    data: {}
                });
                return;
            }

            await Promise.all(data.map(async (questionItem) => {
                let questionType = '';

                const answersData = await Answers.getAnswers(questionItem.QuestionID);
                const gameTitle = await Games.getGame(req.body.game_id);

                if (gameTitle) {
                    gameName = gameTitle.game_name;
                }

                const solutionCount = answersData.filter(item => myArray.includes(item.Solution)).length;

                if( solutionCount > 1 ) {
                    return false;
                }

                if (!answersData) {
                    res.status(400).send({
                        game_title: gameName,
                        message: 'No Data Found',
                        status: 'error',
                        data: {}
                    });
                    return;
                }

                if (questionItem.CategoryID === 4) {
                    questionType = 'guess_the_value';
                } else if (questionItem.CategoryID === 5) {
                    questionType = 'true_false';
                } else if (answersData.length > 2) {
                    questionType = solutionCount > 1 ? 'multichoice_option' : 'single_option';
                }

                const question = {
                    question_id: questionItem.QuestionID,
                    question: questionItem.Question,
                    question_type: questionType,
                    photo_explanations: questionItem.Picture ? questionItem.photo_explanations : null,
                    url_explanations: questionItem.Link ? questionItem.Link : null,
                    options: [],
                };

                answersData.forEach((qOptions) => {
                    if (qOptions.Answer) {
                        question.options.push({
                            id: qOptions.AnswerID,
                            ans: qOptions.Answer
                        });
                    }
                    if (questionType == 'true_false') {
                        question.options.push(
                            {
                                id: qOptions.AnswerID,
                                ans_key: 'Wahr',
                                ans_value: 'True',
                            },
                            {
                                id: qOptions.AnswerID,
                                ans_key: 'falsch',
                                ans_value: 'False',
                            }
                        );
                    }

                });

                questionData.push(question);
            }));

            res.status(200).send({
                game_title: gameName,
                message: 'success',
                status: 'success',
                data: questionData
            });
        });

    } catch (error) {
        res.status(500).send({
            game_title: gameName,
            message: 'Internal server error',
            status: 'error',
            data: {}
        });
    }
};
