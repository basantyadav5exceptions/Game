const User = require('../models/userModal');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

/**
 * Login API
 */
exports.login = async (req, res) => {
    try {
        let secRetKey = process.env.secRetKey;
        let login_result = validationResult(req);
        if (!login_result.isEmpty()) {
            res.status(400).send({
                message: "All fields are required",
                status: 'error',
                data: login_result.array(),
    
            });
            return;
        }
        // Check Number is alredy exist or not
        User.findByNumber(req.body.mobile_number, async (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(400).send({
                        // err: err,
                        message: 'Invalid Details',
                        status: 'error',
                        data: null
                    });
                    return;
                }
            }
            if (data) {
                let ref_token = jwt.sign({ id: data.id }, secRetKey, { expiresIn: '1h' });
                res.status(200).send({
                    message: 'User logged in successfully',
                    status: 'success',
                    data: { token: ref_token, ...data }
                });
                return;
            }
        })
    } catch (error) {
        
    }
};

/**
 * Registration API
 */
exports.registration = async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        res.status(400).send({
            message: "All fields are required",
            status: 'error',
            data: result.array(),
        });
        return;
    }
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: 'All fields are required',
            status: 'error',
            data: null
        });
        return;
    }
    // Check Number is alredy exist or not
    User.findByNumber(req.body.mobile_number, async (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                // let encPassword = await bcrypt.hash(req.body.password, 10);
                // Create a User
                const newRecord = new User({
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    username: req.body.first_name,
                    mobile_number: req.body.mobile_number,
                    age: req.body.age,
                    location: "Indore"
                });

                // Save User in the database
                User.create(newRecord, async (err, newUser) => {
                    if (err) {
                        res.status(400).send({
                            message: 'Someting went wrong',
                            status: 'error',
                            data: null
                        });
                        return;
                    }
                    // res.send(newUser);
                    res.status(200).send({
                        message: 'User registerd successfully',
                        status: 'success',
                        data: newUser
                    });
                    return;
                });
            } else {
                res.status(400).send({
                    message: 'Someting went wrong',
                    status: 'error',
                    data: null,
                });
                return;
            }
        } else {
            res.status(400).send({
                message: 'Number is alreay Exists',
                status: 'error',
                data: null
            });
            return;
        }
    });
};

/**
 * Verify Mobile Number API
 */
exports.verifyNumber = async (req, res) => {
    let login_result = validationResult(req);
    if (!login_result.isEmpty()) {
        res.status(400).send({
            message: "All fields are required",
            status: 'error',
            data: login_result.array(),

        });
        return;
    }
    // Check Number is alredy exist or not
    User.findByNumber(req.body.mobile_number, async (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(400).send({
                    // err: err,
                    message: 'User not registerd with us!',
                    status: 'error',
                    data: null
                });
                return;
            }
        }
        if (data) {
            res.status(200).send({
                message: 'Verified',
                status: 'success',
                data: null
            });
            return;
        }
    })
};

exports.listPlayers = async (req, res) => {
    const mobile_number = req.body.mobile_number;
    User.getAll('', (err, data) => {
        if (err) {
            res.status(400).send({
                message: 'Someting went wrong',
                status: 'error',
                data: err
            });
        }
        else {
            res.status(200).send({
                message: 'Success',
                status: 'success',
                data: data
            });
            return;
        }
    });
};

exports.players = () => {
    return new Promise((resolve, reject) => {
        User.getAll('', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};
