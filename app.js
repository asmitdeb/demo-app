const express = require('express');
const path = require('path');
const collection = require('./connect');

const app = express();
const port = 3000;

app.use(express.json());

app.use(express.urlencoded({extended: false})); //needed?
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "hbs");


app.get("/", (req, res) => {
    res.sendFile('public/signin.html', {root: './'})
});

app.use(express.static(__dirname + '/../public'));
app.get("/signup", (req, res) => {
    res.sendFile('public/signup.html', {root: './'})
});

//Signup
app.post("/signup", async (req, res) => {
    const data = {
        email: req.body.email,
        password: req.body.pass
    }
    
    const userExists = await collection.findOne({email: data.email});
    
    if(userExists){
        // res.sendFile('public/accexists.html', {root: './'})
        res.render('response.hbs',{
            title: "User Exists",
            response: "Account already exists.",
            loc: "/",
            btn: "Login"
        });
    }
    else{
        const userdata = await collection.insertMany(data);
        console.log(userdata);
        // res.sendFile('public/accreated.html', {root: './'})
        res.render('response.hbs',{
            title: "Account created",
            response: "Account created successfully!",
            loc: "/",
            btn: "Login"
        });
    }

});

//Signin
app.post("/login", async (req, res) => {
    try{
        const check = await collection.findOne({email: req.body.email});
        if(!check){
            // res.sendFile('public/notfound.html', {root: './'});
            res.render('response.hbs',{
                title: "Not found",
                response: "User not found",
                loc: "/signup",
                btn: "Sign up"
            });
        }
        else{
        const equals = (req.body.pass === check.password);
        if(equals){
            // res.sendFile('public/home.html', {root: './'})
            res.render('response.hbs',{
                title: "Home",
                response: "Logged in successfully!",
                loc: "/",
                btn: "Logout"
            });
        }
        else{
            // res.sendFile('public/wrongpass.html', {root: './'})
            res.render('response.hbs',{
                title: "Wrong pass",
                response: "Wrong password",
                loc: "/",
                btn: "Login"
            });
        }}
    }catch{
        // res.sendFile('public/error.html', {root: './'})
        res.render('response.hbs',{
            title: "Error",
            response: "Error",
            loc: "/",
            btn: "Login"
        });
    }
});

app.listen(port, () => {
    console.log('Server running on port: ${port}');
})

