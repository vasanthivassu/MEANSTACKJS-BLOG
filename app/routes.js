
module.exports = function (app, passport) {

// show the home page (will also have our login links)
    app.get('/', function (req, res) {
        productModel.find(function (err, result) {
            if (err) {
                res.send(err);
            } else {
                var currentUser = req.user;
                if (!currentUser) {
                    res.render('index.ejs', {result: result});
                } else if (currentUser) {
                    res.render('products.ejs', {result: result, user: req.user});
                }
            }
        });
    });

// PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function (req, res) {
        res.render('profile.ejs', {
            user: req.user
        });
    });

//Contact number =======================
    app.get('/contact', function (req, res) {
        res.render('contact.ejs');
    });

// LOGOUT ==============================
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });
// Change password ========================
    app.get('/changePassword', function (req, res) {
        res.render('forgotpassword.ejs', {message: req.flash('forgotMessage')});
    });

// LOGIN ===============================changePassword
// show the login form
    app.get('/login', function (req, res) {
        var currentUser = req.user;
        if (!currentUser) {
            res.render('login.ejs', {message: req.flash('loginMessage')});
        } else {
            res.redirect('/');
        }

    });

    var User = require('../app/models/user');
// process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));
// LOGIN ===============================
// show the login form
    app.get('/forgotpassword', function (req, res) {
        res.render('forgotpassword.ejs', {message: req.flash('forgotMessage')});
    });

// process the login form
    app.post('/forgotpassword', passport.authenticate('local-forgotpassword', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/forgotpassword', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));
// SIGNUP =================================
// show the signup form
    app.get('/signup', function (req, res) {
        var currentUser = req.user;
        if (!currentUser) {
            res.render('signup.ejs', {message: req.flash('signupMessage')});
        } else {
            if (req.user.local.email == 'admin@gmail.com') {
                res.redirect('/admin');

            } else {
                res.redirect('/');
            }

        }
    });

// process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));
// ADMIN =================================
// 
// 
// 
    mongoose = require('mongoose');
    var AdminUser = require('../app/models/adminuser');
    var Useradmin = mongoose.model('Useradmin');
    app.get('/adminlogin', function (req, res) {
        var currentUser = req.user;
        if (!currentUser) {
            res.render('adminLogin.ejs', {message: req.flash('loginMessage')});
        } else {
            res.redirect('/admin');
        }

    });

// process the login form
    app.post('/adminlogin', passport.authenticate('local-adminlogin', {
        successRedirect: '/admin', // redirect to the secure profile section
        failureRedirect: '/adminlogin', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));
// LOGIN ===============================
// show the login form
    app.get('/adminforgotpassword', function (req, res) {
        res.render('adminforgotpassword.ejs', {message: req.flash('forgotMessage')});
    });

// process the login form
    app.post('/adminforgotpassword', passport.authenticate('local-adminforgotpassword', {
        successRedirect: '/adminlogin', // redirect to the secure profile section
        failureRedirect: '/adminforgotpassword', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));
// SIGNUP =================================
// show the signup form
    app.get('/adminsignup', function (req, res) {
        res.render('adminSignup.ejs', {message: req.flash('signupMessage')});
    });

// process the signup form
    app.post('/adminsignup', passport.authenticate('local-adminsignup', {
        successRedirect: '/admin', // redirect to the secure profile section
        failureRedirect: '/adminsignup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));
// show the Admin Page
    app.get('/admin', function (req, res) {
        var user = req.session.user;
        console.log(user);
        res.render('addproduct.ejs', {message: req.flash('adminMessage')});
    });

    mongoose = require('mongoose');

    var prdctModel = require('../app/models/productModel');
    var productModel = mongoose.model('productModel');

// process the Admin ============================================================================ 
    app.post('/addproduct', function (req, res) {
        var newProduct = new productModel({
            productName: req.body.productName,
            categore: req.body.categore,
            fileName: req.body.fileName,
            price: req.body.price,
            details: req.body.details,
            rating: req.body.rating,
            availability: req.body.availability
        });
        console.log(newProduct);
        newProduct.save(function (error) {
            if (error) {
                console.log(error);
                res.render('addproduct.ejs', {message: req.flash('adminMessage')});
                return done(null, false, req.flash('adminMessage', 'Oops! Something went Wrong.'));
// res.send(error);
            } else {
                console.log(newProduct);
                res.send(newProduct);
            }
        });

    });
    app.get('/productViewUpdate', function (req, res) {
        res.render('productViewUpdate.ejs');
    });

    app.get('/listOfProducts', function (req, res) {
        productModel.find(function (err, result) {
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        });
    });
    app.get('/listOfProducts/:categore', function (req, res) {
        productModel.find({'categore': req.params.categore}, function (err, result) {
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        });
    });
    app.post('/adminDelteProduct/:id', function (req, res) {
        productModel.remove({'_id': req.params.id}, function (err, result) {
            console.log("delete-error" + req.params.id);
            if (err) {
                res.send(err);
            } else {
                console.log(result);
                res.send("Delted!!" + result);
            }

        });

    });

    app.get('/productUpdate/:id', function (req, res) {
        productModel.findOne({'_id': req.params.id}, function (err, result) {
            if (err) {
                console.log("error-" + req.params.id);
// res.send(err)
            } else {
                console.log(result);
// res.send(result)
                res.render('productUpdate.ejs', {result: result});
            }

        })
// console.log(res);
    });
    app.post('/productUpdate/:id', function (req, res) {
// console.log("com")
        var update = req.body;
        productModel.findByIdAndUpdate({'_id': req.params.id}, update, function (err, result) {
            if (err) {
                console.log("error-" + req.params.id);
                res.send(err);
            } else {
                console.log(result);
                res.send(result);
            }
        });
    });
};
// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
};
// route middleware to ensure user is logged in
function isadminLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/adminlogin');
};



