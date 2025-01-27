const express = require('express');
const jwt = require('jsonwebtoken');

const jwtSecret = "iamareef";
const app = express();
app.use(express.json());

const users=[];

function auth(req,res,next){    
    const token=req.headers.token;
    const decodeddata=jwt.verify(token,jwtSecret);
    if(decodeddata.username){
        req.username=decodeddata.username;
        next();
    }else{
        res.json({
            message:"you are not signed in"
        })
    }
}
function logger(req,res,next){
    console.log(req.method+" request came");
    next();
}

app.post("/signup",logger,function(req,res){
    const username=req.body.username;
    const password=req.body.password;
    const user=users.find(users=>users.username==username);
    if(user){
        res.json({
            message:"user already exists"
        })
    }else{
        const newUser={
            username:username,
            password:password
        }
        users.push(newUser);
        res.json({
            message:"user created"
        })
    }
});

app.post("/signin",logger,function(req,res){
    const username=req.body.username;
    const password=req.body.password;
    const user=users.find(users=>users.username==username && users.password==password);
    if(!user){
        res.json({
            message:"you are not signed in"
        })
    }else{
            const token = jwt.sign({
                username: username
            },jwtSecret);
            res.json({
                token:token
            })
    }
});

app.get("/me",logger,auth,function(req,res){

    if(req.username){
        let foundUser=users.find(users=>users.username==req.username);
        res.json({
            username:foundUser.username,
            password:foundUser.password
        })
    }
});

app.listen(3000);

