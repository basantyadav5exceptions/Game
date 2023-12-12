const GameType = require('../models/gameTypeModal');

exports.gameType = () => {
    return new Promise((resolve, reject) => {
        GameType.getGameType('', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};