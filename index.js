const express = require("express");1
const {connectToMongoDB} = require ("./connect.js");
const cookieParser =  require("cookie-parser");
const { restrictToLoggedinUserOnly, checkAuth } = require("./middlewares/auth");

const path = require("path");
const URL = require("./models/url.js");

const staticRoute = require('./routes/staticRouter.js');
const urlRoute = require("./routes/url");
const userRoute = require('./routes/user.js');

const app = express();
const PORT =  8001;

const url = "You MongoDB Key Here";
connectToMongoDB(url).then(()=> console.log("Mongodb connected!"));
 
app.set("view engine" , "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use (cookieParser());

// app.get("/test", async (req, res)=>{
//     const allUrls = await URL.find( {} );
//     return res.render("home", {
//         urls: allUrls,
//     });
// });

app.use("/url",restrictToLoggedinUserOnly, urlRoute);
app.use("/",checkAuth, staticRoute);
app.use("/user", userRoute);


app.get("/link/:shortId" , async (req, res) => {

    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId,
    }, { $push: {
        visitHistory: {timestamp : Date.now(),} },
    });
     res.redirect(entry.redirectURL)});



app.listen(PORT, () => console.log(`Server Started at PORT: ${PORT}`));

