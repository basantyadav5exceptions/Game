const sql = require("../config/dbConnection");

// constructor
const Answers = function (fields) {
    for (const key in fields) {
        this[key] = fields[key];
    }
};


Answers.getAnswers = (question_id, result) => {
    let query = "SELECT * FROM Answers";
    if (question_id) {
        query += ` WHERE QuestionID = '${question_id}'`;
    }
    sql.query(query, (err, res) => {
        if (err) {
            result(null, err);
            return;
        }
        if (res.length > 0) {
            result(null, res);
            return;
        } else {
            result(null, {});
            return;
        }
    });
};

// return new Promise((resolve, reject) => {
//     sql.query('SELECT * FROM Answers WHERE AnswerID IN (?)', [ans_id], (error, results) => {
//         if (error) {
//             reject(error);
//         } else {
//             if (results.length > 0) {
//                 resolve(results); // Return all rows matching the condition
//             } else {
//                 resolve(null); // Return null if there's no result
//             }
//         }
//     });
// });

Answers.checkAnswer = async (ans_id='', question_id='') => {
    return new Promise((resolve, reject) => {
        let query = 'SELECT * FROM Answers';
        let params;

        if (ans_id) {
            query += ' WHERE AnswerID = ?';
            params = [ans_id];
        } else if (question_id) {
            query += ' WHERE QuestionID = ?';
            params = [question_id];
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
                    resolve(results[0]); // Return the first row
                } else {
                    resolve(null); // Return null if there's no result
                }
            }
        });
    });
};


Answers.getAnswers = async (questionID, solutionArray = []) => {
    return new Promise((resolve, reject) => {
        let query = 'SELECT * FROM Answers WHERE questionID = ?';
        const values = [questionID];
        if (solutionArray && solutionArray.length > 0) {
            query += ' AND Solution IN (?)';
            values.push(solutionArray);
        }

        sql.query(query, values, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

module.exports = Answers;