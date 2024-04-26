const express = require('express');
const path = require('path');
const collection = require('./connect');
const axios = require('axios');

const app = express();
const port = 3000;
const api_key = "6a7dd33727124df5b48a846b35796aac";

app.use(express.json());



// app.use(express.static('public'))

app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
// app.set("view engine", "hbs");
app.set('view engine', 'ejs');


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
        res.render('response.ejs',{
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
        res.render('response.ejs',{
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
            res.render('response.ejs',{
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
            // res.render('response.hbs',{
            //     title: "Home",
            //     response: "Logged in successfully!",
            //     loc: "/",
            //     btn: "Logout"
            // });
            res.render("index.ejs");
        }
        else{
            // res.sendFile('public/wrongpass.html', {root: './'})
            res.render('response.ejs',{
                title: "Wrong pass",
                response: "Wrong password",
                loc: "/",
                btn: "Login"
            });
        }}
    }catch{
        // res.sendFile('public/error.html', {root: './'})
        res.render('response.ejs',{
            title: "Error",
            response: "Error",
            loc: "/",
            btn: "Login"
        });
    }
});

//Search
app.post('/search', async (req, res) => {
    const {query} = req.body;
    const response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${api_key}`)
    const recipes = response.data.results
    res.render('results.ejs', {recipes})
})

//Recipe
app.get("/recipe/:id", async(req,res )=> {
    const {id} = req.params;
    const response = await axios.get(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${api_key}`)
    const recipe = response.data;
    res.render('recipe.ejs', {recipe})
})

app.listen(port, () => {
    console.log('Server running on port: ${port}');
})

