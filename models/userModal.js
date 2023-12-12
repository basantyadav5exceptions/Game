const sql = require("../config/dbConnection");
const jwt = require('jsonwebtoken');
// const secRetKey = process.env.secRetKey;

// constructor
const User = function (fields) {
    for (const key in fields) {
        this[key] = fields[key];
    }
};


/**
 * Function for check mobile number is exist or not
 */
User.findByNumber = (number, result) => {
    sql.query(`SELECT id,first_name,last_name,mobile_number,age FROM users WHERE mobile_number = '${number}'`, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        if (res.length) {
            result(null, res[0]);
            return;
        }
        // not found User with the id
        result({ kind: "not_found" }, null);
    });
};

/**
 * Function for create user account
 */

User.create = (newUser, result) => {
    let secRetKey = process.env.secRetKey;
    sql.query("INSERT INTO users SET ?", newUser, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        const token = jwt.sign({ id: res.insertId }, secRetKey, { expiresIn: "1h"});
        result(null, { token: token, id: res.insertId, ...newUser });
    });
};

/**
 * Function for update user info by id
 */
User.updateById = (id, User, result) => {
    sql.query(
        "UPDATE users SET ? WHERE id = ?",
        [User, id],
        (err, res) => {
            if (err) {
                result(null, err);
                return;
            }
            if (res.affectedRows == 0) {
                // not found Tutorial with the id
                result({ kind: "not_found" }, null);
                return;
            }
            result(null, { id: id, ...User });
        }
    );
};

/**
 * Function for get all users
 */
User.getAll = (mobile_number, result) => {
    let query = "SELECT id,first_name,last_name,mobile_number,age FROM users";
    if (mobile_number) {
        query += ` WHERE mobile_number = '${number}'`;
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

module.exports = User;