const sql = require("../config/dbConnection");

// constructor
const GamePlayers = function (fields) {
    for (const key in fields) {
        this[key] = fields[key];
    }
};

GamePlayers.create = (postData, result) => {
    sql.query("INSERT INTO Game_players SET ?", postData, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, { id: res.insertId, ...postData }); return;
    });
};

module.exports = GamePlayers;