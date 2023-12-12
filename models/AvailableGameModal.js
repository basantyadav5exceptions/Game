const sql = require("../config/dbConnection");
// const secRetKey = process.env.secRetKey;

// constructor
const AvailableGame = function (fields) {
    for (const key in fields) {
        this[key] = fields[key];
    }
};

AvailableGame.getGames = (game_id, result) => {
    let query = "SELECT * FROM Available_games INNER JOIN game_type ON Available_games.GameType = game_type.id";
    if (game_id) {
        query += ` WHERE GameID = '${game_id}'`;
    }
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


module.exports = AvailableGame;