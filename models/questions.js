const sql = require("../config/dbConnection");

// constructor
const Questions = function (fields) {
    for (const key in fields) {
        this[key] = fields[key];
    }
};

Questions.getQuestions = async (req_data, result) => {

    let query = "SELECT Questions.* FROM `Questions` WHERE is_age_18=1 AND CategoryID !=22";
    // INNER JOIN Game_questions on `Questions`.`QuestionID` != `Game_questions`.`QuestionID`

    const { user_id, question_id, game_id  } = req_data;
    
    // if( user_id ) {
    //     query += ` WHERE Game_questions.user_id = '${user_id}'`;
    // }

    // if( question_id ) {
    //     query += ` AND Game_questions.QuestionID = '${question_id}'`;
    // }

    // if( game_id ) {
    //     query += ` AND Game_questions.GameID = '${game_id}'`;
    // }   

    sql.query(query, (err, res) => {
        
        if (err) {
            result(null, err);
            return;
        }
        if( res.length > 0 ) {
            result(null, res);
            return;
        } else {
            result(null, {});
            return;
        }
    });
};


module.exports = Questions;