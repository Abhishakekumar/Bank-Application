var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    User          = require("./models/user"),
    Client        = require("./models/client"),
    seedDB        = require("./seeds");

mongoose.connect('mongodb://localhost:27017/bank-data',{useNewUrlParser: true, useCreateIndex:true});



app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));


app.use(require("express-session")({
    secret: "Ops!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});

app.get("/clients", isLoggedIn, function(req, res){
   
    Client.find({}, function(err, allClients){
        if(err){
            console.log(err);
        } else {
            res.render("clients/index",{clients:allClients});
       }
    });
});

app.post("/clients", isLoggedIn, function(req, res){

    var name    = req.body.name;
    var age     = req.body.age;
    var email   = req.body.email;
    var account = req.body.account;
    var money   = req.body.money;
    
    var newClient = {name: name, age: age, email:email , account: account, money:money}
   
    Client.create(newClient, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/clients");
        }
    });
});

app.get("/clients/new", isLoggedIn,  function(req, res){
   res.render("clients/new"); 
});


app.get("/clients/:id", function(req, res){
  
    Client.findById(req.params.id).populate("info").exec(function(err, foundClient){
        if(err){
            console.log(err);
        } else {
            console.log(foundClient);
            res.render("clients/show", {client: foundClient});
        }
    });
});

app.get("/", function(req, res){
    res.render("main");
});


app.get("/register", function(req, res){
   res.render("register"); 
});

app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/clients"); 
        });
    });
});


app.get("/login", function(req, res){
   res.render("login"); 
});

app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/clients",
        failureRedirect: "/login"
    }), function(req, res){
});

app.get("/client-login", function(req, res){
    res.render("client-login"); 
 });

 app.post("/client-login", passport.authenticate("local", 
 {
     successRedirect: "/clients/:id",
     failureRedirect: "/client-login"
 }), function(req, res){
});




app.get("/logout", function(req, res){
   req.logout();
   res.redirect("/");
});



function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(3000, function(){
    console.log("The Bank Simulation has started!");
});