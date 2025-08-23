const {faker, da} = require("@faker-js/faker");
const mysql = require("mysql2");

let connection = mysql.createConnection(
  {
  host : "localhost",
  user : "root",
  database : "delta_app",
  password : "DatabaseServer2006"
  }
);
let getRandomUser = ()=>{
  return[
    faker.string.uuid(),// key values pair nhi honge direct values use karenge 
    faker.internet.username(),
    faker.internet.email(),
    faker.internet.password()
  ];
};
//Inserting New Data
let q = "insert into user (id, username, email, password) values ?";

let data = [];
for(let i = 1; i<=96; i++){// 100 fake users
  data.push(getRandomUser()); //call function // data push in array
};
console.log(data);
// let users = [
//   ["123b", "123_newuserb", "abc@gmail.comb", "abcb"],
//   ["123c", "123_newuserc", "abc@gmail.comc", "abcc"]
// ];

try{
  connection.query(q, [data], (err, result) =>{
    if(err) throw err
    console.log(result);
//  console.log(result.length);
//   console.log(result[0]);
//   console.log(result[1]);
  });

}catch(err){
  console.log(err);
}
connection.end();
// let getRandomUser = () => {
//   return { // object return hota he
//     id: faker.string.uuid(),
//     username: faker.internet.username(),
//     email: faker.internet.email(),
//     password: faker.internet.password()
//   };
// };