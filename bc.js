const bcrypt = require("bcryptjs");
let { genSalt, hash, compare } = bcrypt;
const { promisify } = require("util");

// promisfy our bcrypt functions
genSalt = promisify(genSalt);
hash = promisify(hash);
compare = promisify(compare);

module.exports.hash = (plainTxtPw) => genSalt().then((salt) => hash(plainTxtPw, salt));
module.exports.compare = compare;

/////////////////////  demo //////////////////////////
// genSalt()
//     .then((salt) => {
//         //get the salt
//         console.log("salt:", salt);
//         //hash the password with the salt
//         return hash("safePassword", salt);
//     })
//     .then((hashedPw) => {
//         //final result
//         console.log("hashedPassword:", hashedPw);
//         //compare takes two args. clear text password and a hash to compare it to
//         //and returns a boolean
//         return compare("safePassword", hashedPw);
//     })
//     .then((result) => {
//         console.log(result);
//     });
