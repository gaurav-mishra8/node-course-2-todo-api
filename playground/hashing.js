const {
  SHA256
} = require('crypto-js');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = 'abc123!';

// bcrypt.genSalt(10, (err, salt) => {
//   bcrypt.hash(password, salt, (err, hash) => {
//     console.log(hash);
//   });
// });

var hashedPassword = '$2a$10$568A4.j6Oo2cWfKAo.R9/ugTyuxa2i80xn1Gw74vJifVmaSJ2Lw26';

bcrypt.compare(password, hashedPassword,(err,res)=>{
  console.log(res);
});

//
// var data = {
//   id: 10
// };
//
// var token = jwt.sign(data,'123abc');
//
// console.log(token);
//
// var decoded = jwt.verify(token,'123abc');
//
// console.log('decoded',decoded);


// var message = 'I am user number 3';
// var hash = SHA256(message).toString();
//
// console.log('Message:', message);
// console.log('Hash:', hash);
//
//
//
//
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data)).toString()
// }
