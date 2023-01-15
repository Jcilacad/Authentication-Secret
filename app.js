require('dotenv').config()
const express = require("express")
const ejs = require("ejs")
const app = express()
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption")

app.set("view engine", "ejs")
app.use(express.static("public"));
app.use(express.urlencoded({
    extended: true
}))


mongoose.set("strictQuery", true)
mongoose.connect("mongodb://0.0.0.0:27017/secretsDB", {useNewUrlParser: true})

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const secret = process.env.SECRET;
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

const User = mongoose.model("User", userSchema);

app.get("/", function (req, res) {
    res.render("home")
})

app.get("/register", function (req, res) {
    res.render("register")
})

app.get("/login", function (req, res) {
    res.render("login")
})

app.post("/register", function (req, res) {

    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })

    newUser.save(function (err) {
        if (!err) {
            res.render("secrets")
        } else {
            res.send(err)
        }
    })

})

app.post("/login", function (req, res) {

    const username = req.body.username
    const password = req.body.password

    User.findOne({email: username}, function (err, foundUser) {
        if (err) {
            res.send(err)
        } else {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render("secrets")
                }
            }
        }
    })

})

app.listen("3000", function () {
    console.log("Listening on port 3000")
})