module.exports = {
    ensureAuthenticate: function (req, res, next) {
        if (req.isAuthenticated()) {
            next();
        }
        req.flash("error_msg", "Please logged in to view this page");
        res.redirect("/users/login");
    }
}