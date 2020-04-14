var express       = require("express"),
	flash         = require("connect-flash"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
	seedDB        = require("./seeds"),
	passport      = require("passport"),
	methodOverride= require("method-override"),
	LocalStrategy = require("passport-local"),
	User       	  = require("./models/user"),
	Comment       = require("./models/comment"),
	Campground    = require("./models/campground"),
    campground    = require("./models/comment");

//Requiring routes
var commentRoutes    = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes       = require("./routes/index");

mongoose.connect("mongodb+srv://akmiyata:D4llasC0wb0ys4@cluster0-r8oxn.mongodb.net/yelp_camp?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); //seed the database

//PASSPORT config
app.use(require("express-session")({
	secret:"Early Sunday morning",
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
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

//ask server to listen on port 3000
app.listen(3000, function() { 
  console.log('YelpCamp has started'); 
});