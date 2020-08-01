const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");

router.get("/login", (req, res) => {
    res.render("Login");
});

router.get("/register", (req, res) => {
    res.render("Register")
});

router.post("/register", (req, res) => {
    const {
        name,
        email,
        password,
        password2
    } = req.body;
    let errors = [];

    // Check if fields are empty
    if (!name || !email || !password || !password2) {
        errors.push({
            msg: "Fields should not be empty"
        });
    }

    // Check if passwords are not matched
    if (password !== password2) {
        errors.push({
            msg: "Passwords should be same"
        });
    }

    // Check if password length is small than 6 characters
    if (password.length < 6) {
        errors.push({
            msg: "Password must be 6 characters long."
        });
    }

    if (errors.length > 0) {
        res.render("register", {
            errors,
            name,
            email,
            password,
            password2
        })
    } else {
        // Email validation
        User.findOne({
            email: email
        }).then(user => {
            if (user) {
                errors.push({
                    msg: "This email is already in use"
                });
                res.render("register", {
                    errors,
                    name,
                    email,
                    password,
                    password2
                })
            } else {
                const newUser = new User({
                    name,
                    email,
                    password
                })

                // Hash Password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;

                        // Set password to hashed password
                        newUser.password = hash;

                        // Save User
                        newUser.save().then(user => {
                            req.flash("success_msg", 'You are registered now.');
                            res.redirect("/users/login")
                        }).catch(err => console.log(err));
                    })
                })
            }
        })
    }
});

router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/dashboard",
        failureRedirect: "/users/login",
        failureFlash: true
    })(req, res, next);
});

router.get("/logout", (req, res) => {
    req.logout();
    req.flash('success_msg', "Your are logged out");
    res.redirect("/users/login");
});

module.exports = router;