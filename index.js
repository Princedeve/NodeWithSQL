const {faker, da} = require("@faker-js/faker");
const mysql = require("mysql2");
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const {v4: uuidv4} = require("uuid");
const { use } = require("react");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

let port  = 3000;
const connection = mysql.createConnection({
  host : "localhost",
  user : "root",
  database : "delta_app",
  password : "xxxxxxx" // DatabaseServer2006
});
// genrate users data
let getRandomUser = () =>{
  return [
    faker.string.uuid(),// key values pair nhi honge direct values use karenge 
    faker.internet.username(),
    faker.internet.email(),
    faker.internet.password()
  ];
};
// Show Home Page Route
app.get("/", (req, res) =>{
  let q = `select count(*) from user`;
  try{
connection.query(q, (err, result) =>{
  if(err) throw err;
  let count = result[0]["count(*)"];
 res.render("home.ejs", {count});
});
}catch(err) {
  console.log(err);
  res.send("some error in DB");
}
});

// Show All Users Route
app.get("/user", (req, res) => {
  let q = `select * from user`;
  try{
    connection.query(q, (err, result) =>{
      if(err) throw err;
      let data = result;
      res.render("users.ejs", {data});
    });
  }catch(err){
    res.send("some error occured");
  }
});


//Edit username Route
app.get("/user/:id/edit", (req, res) =>{
  let {id} = req.params;// we can find userinfo with the help of id
  let q = `select * from user where id = '${id}'`; //id ko sting me karne ke liye "id" nhi to sift uski value jati he 
  try{
    connection.query(q, (err, result)=>{
      if(err) throw err;
      let user = result[0];// array me se object acces kiya
      res.render("edit.ejs", {user});
    });
  }catch(err){
    res.send("some error occured");
  }
});

//Update (DB) Route
app.patch("/user/:id", (req, res)=>{
  let {id} = req.params; // id object from array
  let {password: formPass, username: newUsername} = req.body;
  let q = `select * from user where id = '${id}'`;// user info from DB
  try{
    connection.query(q, (err, result) =>{
    if(err) throw err;
    let user = result[0];
    if(formPass != user.password){// Authentication layer for checking pass
      res.send("WRONG password");
    }else{
      let q2 = `update user set username='${newUsername}' where id='${id}'`;
      connection.query(q2, (err, result) =>{
        if(err) throw err;
        res.redirect("/user"); // redirect page
      });
    }
  });
  }catch(err){
    res.send("some error occured");
  }
});

app.get("/user/new", (req, res) => {
  res.render("new.ejs");
});

app.post("/user/new", (req, res) => {
  let { username, email, password } = req.body;
  let id = uuidv4();
  //Query to Insert New User
  let q = `INSERT INTO user (id, username, email, password) VALUES ('${id}','${username}','${email}','${password}') `;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      console.log("added new user");
      res.redirect("/user");
    });
  } catch (err) {
    res.send("some error occurred");
  }
});

// Show delete page
app.get("/user/:id/delete", (req, res)=>{
  let {id} = req.params;
  let q = `select * from user where id='${id}'`;
  try{
    connection.query(q, (err, result)=>{
      if(err) throw err;
      let user = result[0]
      res.render("delete.ejs", {user});
    });
  }catch(err){
    res.send("some error with DB");
  }
});

// Delete User Route
app.delete("/user/:id", (req, res)=>{
  let {id} = req.params;
  let {password} = req.body;
  let q = `select * from user where id='${id}'`;
  try{
    connection.query(q, (err, result)=>{
      if(err) throw err;
      let user = result[0];
      if( password != user.password){
        res.send("Wrong password entered");
      }else{
        let q2 = `delete from user where id='${id}'`;
        connection.query(q2, (err, result)=>{
          if(err) throw err;
          res.redirect("/user");

        });
      }
    });
  }catch(err){
    res.send("some error with DB");
  }
});

app.listen(port, (req, res) =>{
  console.log(`app is running on port ${port}`);
});

// try{
// connection.query(q, [data], (err, result) =>{
//   if(err) throw err;
//   console.log(result);
 
// });
// }catch(err) {
//   console.log(err);
// }
// connection.end();