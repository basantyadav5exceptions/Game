const sql = require("../config/dbConnection");

// constructor
const GameAnswer = function (fields) {
    for (const key in fields) {
        this[key] = fields[key];
    }
};


GameAnswer.addGameAnswer = async (data) => {
    return new Promise((resolve, reject) => {
        sql.query('INSERT INTO Game_answers SET ?', data, (error, result) => {
            if (error) {
                reject(error);
            } else {
                const _result = { id: result.insertId, ...data };
                resolve(_result);
            }
        });
    });
};

GameAnswer.getAnswerByUsers = async (game_id='', user_id='') => {
    return new Promise((resolve, reject) => {
        let query = 'SELECT * FROM Game_answers';
        let params;

        if (game_id) {
            query += ' WHERE GameID = ?';
            params = [game_id];
        } else if (user_id) {
            query += ' WHERE UserID = ?';
            params = [user_id];
        } else {
            // Handle the case where neither ans_id nor question_id is provided
            resolve(null);
            return;
        }

        sql.query(query, params, (error, results) => {
            if (error) {
                reject(error);
            } else {
                if (results.length > 0) {
                    resolve(results); // Return the first row
                } else {
                    resolve(null); // Return null if there's no result
                }
            }
        });
    });
};

module.exports = GameAnswer;