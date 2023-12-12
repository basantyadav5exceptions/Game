const sql = require("../config/dbConnection");

// constructor
const GameQuestions = function (fields) {
    for (const key in fields) {
        this[key] = fields[key];
    }
};


GameQuestions.addGameQuestion = async (data) => {
    return new Promise((resolve, reject) => {
        sql.query('INSERT INTO Game_questions SET ?', data, (error, result) => {
            if (error) {
                reject(error);
            } else {
                const _result = { id: result.insertId, ...data };
                resolve(_result);
            }
        });
    });
};

module.exports = GameQuestions;