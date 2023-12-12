const Answers = require('../models/answers');
const GameQuestions = require('../models/gameQuestionsModal');
const GameAnswer = require('../models/gameAnswersModal');
const Helpers = require('../helpers/commonHelper');

/**
 * Check answer is correct or not
 */
exports.checkAnswer = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send({
                message: 'Request body is empty',
                status: 'error',
                data: {}
            });
        }

        // Body Param
        const {
            user_id,
            game_id,
            question_id,
            ans_id,
            question_type,
            string_ans,
        } = req.body;


        // Get answer by answer id
        var answersData;
        if (question_type == 'true_false' || question_type == 'guess_the_value') {
            answersData = await Answers.checkAnswer('', question_id);
        } else {
            answersData = await Answers.checkAnswer(ans_id, '');
        }

        if (!answersData) {
            res.status(400).send({
                message: 'Invalid Answer ID',
                status: 'error',
                data: {}
            });
            return;
        }

        let is_correct_ans = 'no';
        let message = 'Your answer is incorrect';
        let answer_points = 0;
        let lower_string = answersData.Solution.toLowerCase() != '' ? answersData.Solution.toLowerCase() : '';

        // Check answer is correct or not
        if (question_type == 'single_option') {
            if (lower_string == 'ja' || lower_string == 'yes') {
                answer_points = 1;
                is_correct_ans = 'yes';
                message = 'Your answer is correct';
            }
        }

        if (question_type == 'true_false') {
            if (lower_string == string_ans.toLowerCase()) {
                answer_points = 1;
                is_correct_ans = 'yes';
                message = 'Your answer is correct';
            }
        }

        if (question_type == 'guess_the_value') {
            const rtr_ans = Helpers.calculateSimilarity(string_ans.toLowerCase(), lower_string);
            if (rtr_ans > 80) {
                answer_points = 1;
                is_correct_ans = 'yes';
                message = 'Your answer is correct';
            }
        }

        // Prepare record for the Game_Questions Table         
        const newRecord = new GameQuestions({
            GameID: game_id,
            QuestionID: answersData.QuestionID,
            user_id: user_id
        });

        try {

            // Insert Data to the Game_Questions table            
            const result = await GameQuestions.addGameQuestion(newRecord);

            // Prepare record for the Game_Answer Table 
            const gameAnsRecord = new GameAnswer({
                SurveyID: result.id,
                UserID: user_id,
                GameID:game_id,
                answer_id: answersData.AnswerID,
                AnswerNo: answersData.AnswerNo,
                Answer: answersData.Answer,
                AnswerPoints: answer_points
            });

            // Insert Data to the Game_Answer table
            const responseFromAddGameAnswer = await GameAnswer.addGameAnswer(gameAnsRecord);
            if (responseFromAddGameAnswer) {
                const response = {
                    is_correct_ans: is_correct_ans
                };
                res.status(200).send({
                    message: message,
                    status: 'success',
                    data: response
                });
                return;
            }
        } catch (error) {
            res.status(500).send({
                message: 'Internal Server Error 1',
                status: 'error',
                data: error
            });
            return;
        }
    } catch (error) {
        res.status(500).send({
            message: 'Internal server error 2',
            status: 'error',
            data: {}
        });
        return;
    }
};


/**
 * Check answer is correct or not
 */
exports.gameAnswers = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send({
                message: 'Request body is empty',
                status: 'error',
                data: {}
            });
        }

        const { game_id, user_id } = req.body;
        const getAnswerByUsers = await GameAnswer.getAnswerByUsers(game_id, user_id);
        let getQuestionsCount = await Helpers.getQuestionsCount();

        let correct_ans = 0;
        let total_question = 0;
        let attemp_question = 0;
        let winner_percent = 0;
        let is_winner = 'No';
        correct_ans = getAnswerByUsers.filter(item => item.AnswerPoints == 1).length;

        attemp_question = getAnswerByUsers.length;
        total_question = getQuestionsCount.length - 1;
        winner_percent = ((correct_ans / total_question) * 100).toFixed(2);

        if( winner_percent > 80 ) {
            is_winner = 'Yes';
        }

        const returnRecord = {
            correct_ans,
            player_number:null,
            total_question,
            attemp_question,
            is_winner,
            winner_percent
        };

        res.status(200).send({
            message: 'Success',
            status: 'success',
            data: returnRecord
        });
        return;

    } catch (error) {
        res.status(500).send({
            message: 'Internal server error',
            status: 'error',
            data: {}
        });
        return;
    }
};
