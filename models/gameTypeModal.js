const sql = require("../config/dbConnection");

// constructor
const GameType = function (fields) {
    for (const key in fields) {
        this[key] = fields[key];
    }
};

GameType.getGameType = (game_id, result) => {
    let query = "SELECT * FROM game_type where 1=1";
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


module.exports = GameType;