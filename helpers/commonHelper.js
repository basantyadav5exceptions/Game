const sql = require("../config/dbConnection");


const Helpers = function (fields) {
    for (const key in fields) {
        this[key] = fields[key];
    }
};


Helpers.calculateSimilarity = (str1, str2) => {
    const m = str1.length + 1;
    const n = str2.length + 1;

    // Create a matrix to store the distances between substrings
    const matrix = Array.from(Array(m), () => Array(n).fill(0));

    // Initialize the matrix
    for (let i = 0; i < m; i++) {
        matrix[i][0] = i;
    }
    for (let j = 0; j < n; j++) {
        matrix[0][j] = j;
    }

    // Fill in the matrix
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,      // Deletion
                matrix[i][j - 1] + 1,      // Insertion
                matrix[i - 1][j - 1] + cost  // Substitution
            );
        }
    }

    // Calculate similarity as a percentage
    const similarity = 100 - (matrix[m - 1][n - 1] / Math.max(m - 1, n - 1)) * 100;

    return similarity;
};


Helpers.getQuestionsCount = async (game_id='') => {
    return new Promise((resolve, reject) => {
        sql.query('SELECT Questions.* FROM `Questions` WHERE is_age_18=1 AND CategoryID !=22', (error, results) => {
            if (error) {
                reject(error);
            } else {
                if (results.length > 0) {
                    resolve(results); // Return the first row
                } else {
                    resolve(null); // Return null if there's no result
                }
            }
        });
    });
};

module.exports = Helpers;