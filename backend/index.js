const express = require("express");
const bcrypt = require("bcrypt");
const { connection } = require("./config/db");
const { Auth } = require("./Modals/Auth.Modal");
const jwt = require("jsonwebtoken");
const { Todo } = require("./Modals/Todo.Modal");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const authentication = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]

// console.log(token)
  if(!token){
     res.send({msg: "please login again"})
  }
  else{
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const { _id } = decoded;
    if (decoded) {
  
      next();
    } else {
      res.send({ msg: "please login again" });
    }
  }
  
};

app.post("/signup", async (req, res) => {
  //console.log(req.body)
  const { name, email, password } = req.body;
  const user = await Auth.findOne({ email });
  if (user) {
    res.send({ msg: "user already exist , please login" });
  } else {
    try {
      bcrypt.hash(password, 5, async function (err, hash) {
        const user = new Auth({
          name,
          email,
          password: hash,
        });
        await user.save();
        res.send({ msg: "Signup Successfully" });
      });
    } catch (err) {
      console.log(err);
      res.send({ msg: "Something went wrong" });
    }
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await Auth.findOne({ email });
  if(user){
    const hashed_password = user.password;
    bcrypt.compare(password, hashed_password, function (err, result) {
      if (result) {
        const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);
        res.send({ msg: "Login Successfully", token });
      } else {
        res.send({ msg: "please login again " });
      }
    });
  }else{
    res.send({msg:"please signup again"})
  }
  
});

app.post("/user/create", authentication, async (req, res) => {
  const { taskname, status, tag ,_id } = req.body;

  try {
    const user = new Todo({
      taskname,
      status,
      tag,
      userId:_id
    });
    await user.save();
    res.send({ msg: "todo created sucessfully" });
  } catch (err) {
    console.log(err);
    res.send({ msg: "please try again after sometimes" });
  }
});


app.patch("/user/update/:id", authentication, async (req, res) => {
  
  
    const Id= req.params.id
    
    try {
      await Todo.findByIdAndUpdate({_id:Id }, {$set: {...req.body}})
    
      res.send({ msg: "todo updated sucessfully" });
    } catch (err) {
      console.log(err);
      res.send({ msg: "please try again after sometimes" });
    }
  });
  


  app.delete("/user/delete/:id", authentication, async (req, res) => {
  
  
    const Id= req.params.id
    
    try {
      await Todo.findByIdAndDelete({_id:Id })
    
      res.send({ msg: "todo deleted  sucessfully" });
    } catch (err) {
      console.log(err);
      res.send({ msg: "please try again after sometimes" });
    }
  });
  

app.get("/user/read", authentication, async (req,res)=> {
    
    const Id= req.params.id
    
    try {
    const user=  await Todo.findOne({_id:Id })
    
      res.send({ user});
    } catch (err) {
      console.log(err);
      res.send({ msg: "please try again after sometimes" });
    }
})





const PORT = process.env.PORT;

app.listen(PORT, async () => {
  try {
    await connection;
    console.log("Connected to DB Successfully");
  } catch (err) {
    console.log("error in connected to db");
    console.log(err);
  }
  console.log(`Running at port ${PORT}`);
});
