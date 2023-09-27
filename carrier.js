const express = require("express");
const path = require("path");


const app = express();
const port = 3000;
app.set('view engine','ejs');
const { getFirestore,Filter} = require('firebase-admin/firestore');
const { initializeApp, cert } = require('firebase-admin/app');
//
var passwordHash = require('password-hash');
const bodyParser=require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extend:false}));

var serviceAccount = require("./key.json");
const { Console } = require("console");
initializeApp({
    credential: cert(serviceAccount)
  });
  
  const db = getFirestore();

app.use( express.static('public'));
//app.use( express.static('public1'));

app.get("/careerinfo", (req, res) => {
    res.sendFile(path.join(__dirname+ "/main.html"));
});
app.get("/careerinfo/home",function(req,res){
    res.sendFile(__dirname+"/home.html");
});
app.get("/careerinfo/home/signup",function(req,res){
    res.render('sign up');
    
})
app.post('/updatedList',function(req,res){
    console.log(req.body);
    //res.send("hi")
    db.collection("information")
    .where(
        Filter.or(
            Filter.where("email","==",req.body.email_id_1),
            Filter.where("NAME","==",req.body.full_name)

        )

    )
    .get()
    .then((docs)=>{
        if(docs.size>0){
            res.send("New emailid and unique username should be used!!!");
        }
        else{
            db.collection("information").add({
                NAME:req.body.full_name,
                email:req.body.email_id_1,
                PASSWORD:passwordHash.generate(req.body.pass_word)
            
               
            }).then(()=>{
                res.render('login');
               
                //res.send("signup complted!!!!,Go to login page")
            })
        }
    });





   
})
app.get('/careerinfo/home/login',function(req,res){
    res.render('login');
    
})
app.get('/careerinfo/home/aboutus',function(req,res){
    res.sendFile(__dirname+'/about.html');
    
})
app.get('/loginpage',function(req,res){

    console.log(req.query);
    
    db.collection("information")
    .where("email","==",req.query.email)
    //.where("PASSWORD","==",req.query.password)
    .get()
    .then((docs)=>{
        let verified=false;
        docs.forEach((doc)=>{
            verified=passwordHash.verify(req.query.password,doc.data().PASSWORD);
        });
        if(verified){
            res.sendFile(__dirname+'/home.html');

        }else{
            res.send("LOGIN FAILED");
        }


       // if(docs.size > 0){
           
           

       // }else{
        //    
       // }
    })
})
app.get('/careerinfo/home/courses',function(req,res){
    res.sendFile(__dirname+"/courses.html");
})
app.get('/careerinfo/home/query',function(req,res){
    res.sendFile(__dirname+"/sample1.html");
})



app.get('/careerinfo/courses/html',function(req,res){
    res.sendFile(__dirname+"/courses/html.html");
})
app.get('/careerinfo/courses/css',function(req,res){
    res.sendFile(__dirname+"/courses/css.html");
})
app.get('/careerinfo/courses/javascript',function(req,res){
    res.sendFile(__dirname+"/courses/javascript.html");
})
app.get('/careerinfo/courses/java',function(req,res){
    res.sendFile(__dirname+"/courses/java.html");
})
app.get('/careerinfo/courses/python',function(req,res){
    res.sendFile(__dirname+"/courses/python.html");
})
app.get('/careerinfo/courses/c',function(req,res){
    res.sendFile(__dirname+"/courses/c.html");
})
app.get('/careerinfo/courses/cpp',function(req,res){
    res.sendFile(__dirname+"/courses/c++.html");
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
