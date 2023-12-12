const sql = require("../config/dbConnection");

// constructor
const Games = function (fields) {
    for (const key in fields) {
        this[key] = fields[key];
    }
};


Games.create = (newGames, result) => {
    sql.query("INSERT INTO Games SET ?", newGames, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, { id: res.insertId, ...newGames }); return;
    });
};


Games.getGame = async (game_id) => {
    return new Promise((resolve, reject) => {
        sql.query('SELECT * FROM Games WHERE id = ?', [game_id], (error, results) => {
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



module.exports = Games;