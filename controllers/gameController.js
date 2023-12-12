const AvailableGame = require('../models/AvailableGameModal');
const users_controller = require("../controllers/userController");
const game_type = require("../controllers/gameType");
const Games = require('../models/games');
const GamePlayers = require('../models/gamePlayers');


/**
 * List All Available games
 */
exports.listGames = async (req, res) => {
    const game_id = '';
    if (req.body.game_id) {
        game_id = req.body.game_id;
    }
    AvailableGame.getGames(game_id, (err, data) => {
        if (err) {
            res.status(400).send({
                message: 'Someting went wrong',
                status: 'error',
                data: err
            });
            return;
        }
        
        else {

            console.log( data );

            let out = data.map((elem) => ({
                id: elem.GameID,
                game_name: elem.GameName ? elem.GameName : '',
                game_type_id: elem.GameType ? elem.GameType : '',
                game_type: elem.type ? elem.type : '',
                game_type_name: elem.name ? elem.name : '',
                game_img: elem.GameImg ? files_url + elem.GameImg : '',
                players: elem.Players ? elem.Players : '',
            }));

            res.status(200).send({
                message: 'Success',
                status: 'success',
                data: out
            });
            return;
        }
    });
};

exports.startGame = async (req, res) => {
    const playersData = await users_controller.players();
    const gameType = await game_type.gameType();
    let _players_data = playersData.length > 0 ? playersData : {};
    let _game_type = gameType.length > 0 ? gameType : {};

    res.status(200).send({
        message: 'Success',
        status: 'success',
        data: { playersData: _players_data, gameType: _game_type }
    });
    return;
};

const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
};

exports.newGame = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send({
                message: 'Request body is empty',
                status: 'error',
                data: {}
            });
        }
        const {
            game_title,
            game_type_id,
            is_age_18,
            current_user,
            players
        } = req.body;

        const newRecord = new Games({
            game_name: game_title,
            game_type_id,
            leader_id: current_user,
            is_age_18
        });
        Games.create(newRecord, async (err, gameData) => {
            if (err) {
                res.status(400).send({
                    message: 'Someting went wrong',
                    status: 'error',
                    data: {}
                });
                return;
            }
            if (gameData.id) {
                if (players.length > 0) {
                    await asyncForEach(players, async (player) => {
                        const updatedRecord = {
                            game_id: gameData.id,
                            player_id: player,
                            is_leader: current_user === player ? 1 : 0
                        };
                        GamePlayers.create(updatedRecord, async (err, data) => {
                            if (err) {
                                res.status(400).send({
                                    message: 'Unable to create players',
                                    status: 'error',
                                    data: {}
                                });
                                return;
                            }
                        })
                    });
                } else {
                    return res.status(400).send({
                        message: 'Please select players',
                        status: 'error',
                        data: {}
                    });
                }
            }
            return res.status(200).send({
                message: 'Game created successfully',
                status: 'success',
                data: {
                    game_id: gameData.id
                }
            });
        });
    } catch (error) {
        return res.status(500).send({
            message: 'Internal server error',
            status: 'error',
            data: {}
        });
    }
};