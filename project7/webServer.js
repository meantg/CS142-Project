"use strict";

/* jshint node: true */

/*
 * This builds on the webServer of previous projects in that it exports the current
 * directory via webserver listing on a hard code (see portno below) port. It also
 * establishes a connection to the MongoDB named 'cs142project6'.
 *
 * To start the webserver run the command:
 *    node webServer.js
 *
 * Note that anyone able to connect to localhost:portNo will be able to fetch any file accessible
 * to the current user in the current directory or any of its children.
 *
 * This webServer exports the following URLs:
 * /              -  Returns a text status message.  Good for testing web server running.
 * /test          - (Same as /test/info)
 * /test/info     -  Returns the SchemaInfo object from the database (JSON format).  Good
 *                   for testing database connectivity.
 * /test/counts   -  Returns the population counts of the cs142 collections in the database.
 *                   Format is a JSON object with properties being the collection name and
 *                   the values being the counts.
 *
 * The following URLs need to be changed to fetch there reply values from the database.
 * /user/list     -  Returns an array containing all the User objects from the database.
 *                   (JSON format)
 * /user/:id      -  Returns the User object with the _id of id. (JSON format).
 * /photosOfUser/:id' - Returns an array with all the photos of the User (id). Each photo
 *                      should have all the Comments on the Photo (JSON format)
 *
 */

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var async = require('async');

// Load the Mongoose schema for User, Photo, and SchemaInfo
var User = require('./schema/user.js');
var Photo = require('./schema/photo.js');
var SchemaInfo = require('./schema/schemaInfo.js');

var express = require('express');
var app = express();

var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var path = require('path');
var fs = require("fs");

// XXX - Your submission should work without this line
var cs142models = require('./modelData/photoApp.js').cs142models;
const { types } = require('babel-core');
const { request, response } = require('express');

mongoose.connect('mongodb://localhost/cs142project6', { useMongoClient: true });

// We have the express static module (http://expressjs.com/en/starter/static-files.html) do all
// the work for us.
app.use(express.static(__dirname));

app.use(session({ secret: 'secretKey', resave: false, saveUninitialized: false }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


app.get('/', function (request, response) {
    response.send('Simple web server of files from ' + __dirname);
});

/*
 * Use express to handle argument passing in the URL.  This .get will cause express
 * To accept URLs with /test/<something> and return the something in request.params.p1
 * If implement the get as follows:
 * /test or /test/info - Return the SchemaInfo object of the database in JSON format. This
 *                       is good for testing connectivity with  MongoDB.
 * /test/counts - Return an object with the counts of the different collections in JSON format
 */
app.get('/test/:p1', function (request, response) {
    // Express parses the ":p1" from the URL and returns it in the request.params objects.
    console.log('/test called with param1 = ', request.params.p1);

    var param = request.params.p1 || 'info';

    if (param === 'info') {
        // Fetch the SchemaInfo. There should only one of them. The query of {} will match it.
        SchemaInfo.find({}, function (err, info) {
            if (err) {
                // Query returned an error.  We pass it back to the browser with an Internal Service
                // Error (500) error code.
                console.error('Doing /user/info error:', err);
                response.status(500).send(JSON.stringify(err));
                return;
            }
            if (info.length === 0) {
                // Query didn't return an error but didn't find the SchemaInfo object - This
                // is also an internal error return.
                response.status(500).send('Missing SchemaInfo');
                return;
            }

            // We got the object - return it in JSON format.
            console.log('SchemaInfo', info[0]);
            response.end(JSON.stringify(info[0]));
        });
    } else if (param === 'counts') {
        // In order to return the counts of all the collections we need to do an async
        // call to each collections. That is tricky to do so we use the async package
        // do the work.  We put the collections into array and use async.each to
        // do each .count() query.
        var collections = [
            { name: 'user', collection: User },
            { name: 'photo', collection: Photo },
            { name: 'schemaInfo', collection: SchemaInfo }
        ];
        async.each(collections, function (col, done_callback) {
            col.collection.count({}, function (err, count) {
                col.count = count;
                done_callback(err);
            });
        }, function (err) {
            if (err) {
                response.status(500).send(JSON.stringify(err));
            } else {
                var obj = {};
                for (var i = 0; i < collections.length; i++) {
                    obj[collections[i].name] = collections[i].count;
                }
                response.end(JSON.stringify(obj));

            }
        });
    } else {
        // If we know understand the parameter we return a (Bad Parameter) (400) status.
        response.status(400).send('Bad param ' + param);
    }
});

/*
 * URL /user/list - Return all the User object.
 */
app.get('/user/list', function (request, response) {

    if (request.session.User) {
        User.find({}, function (err, docs) {
            if (!err) {
                response.status(200).send(docs);
            } else {
                throw err;
            }
        });
        return;
    }
    response.status(401).send('Unauthorized');
});

/*
 * URL /user/:id - Return the information for User (id)
 */
app.get('/user/:id', function (request, response) {
    var id = request.params.id;
    if (request.session.User) {
        User.find({ _id: id }, function (err, docs) {
            if (!err) {
                if (docs.length != 0) {
                    response.status(200).send(docs[0]);
                    return;
                } else {
                    response.status(400).send("Bad Request");
                }

            } else {
                throw err;
            }
        })
    } else {
        return response.status(401).send('Unauthorized')
    }
});

/*
 * URL /admin/login - Login User
 */
app.post('/admin/login', function (request, response) {
    var login_name = request.body.login_name;
    var password = request.body.password;
    let user = {}
    User.findOne({ login_name: login_name }, function (err, docs) {
        if (!err) {
            if (docs != null) {
                if (docs.password === password) {
                    response.status(200).send(docs);
                    return;
                }
            } else {
                response.status(400).send("Bad Request");
            }
        } else {
            throw err;
        }
    })
    request.session.User = {
        login_name: login_name,
    }
})

/*
 * URL /admin/login - Login User
 */
app.post('/admin/register', function (request, response) {
    var login_name = request.body.login_name;
    var password = request.body.password;
    var newUser = new User({
        first_name: "", // First name of the user.
        last_name: login_name,  // Last name of the user.
        login_name: login_name,
        password: password,
        location: "",    // Location  of the user.
        description: "",  // A brief user description
        occupation: ""
    })
    User.findOne({ login_name: login_name }, function (err, docs) {
        if (!docs) {
            newUser.save(err => {
                console.log(err);
            })
            response.status(200).send("Register Done")
        }
        else {
            response.status(400).send("User already exist !")
        }
    })

})

/*
 * URL /get_session - Get user in session
 */
app.get('/get_session', (req, res) => {
    //check session
    if (req.session.User) {
        User.findOne({ login_name: req.session.User.login_name }, function (err, docs) {
            if (!err) {
                if (docs != null) {
                    res.status(200).send(docs);
                    return;
                } else {
                    res.status(400).send("Bad Request");
                }

            } else {
                throw err;
            }
        })
    }
})



/*
 * URL /admin/logout - Logout User
 */

app.post('/admin/logout', function (request, response) {
    request.session.destroy(function (err) {
        return response.status(200).json({ status: 'user logout success', session: 'cannot access session here' })
    })
})

/*
 * URL /photosOfUser/:id - Return the Photos for User (id)
 */
app.get('/photosOfUser/:id', function (request, response) {
    var id = request.params.id;
    if (request.session.User) {
        Photo.find({ user_id: id }, function (err, docs) {
            if (!err) {
                if (docs.length != 0) {
                    response.status(200).send(docs);
                    return;
                } else {
                    response.status(400).send("Bad Request");
                }

            } else {
                throw err;
            }
        })
    } else {
        return response.status(401).send('Unauthorized')
    }
});

/*
 * URL /commentsOfPhoto/:photo_id - Insert aan comment to photo with photo_id
 */
app.post('/commentsOfPhoto', function (request, response) {
    console.log("Create comment");
    if (request.session.User) {
        const file_name = request.body.file_name;
        const comment = request.body.comment;
        const photo_id = request.body.photo_id;
        User.findOne({ login_name: request.session.User.login_name }, function (err, docs) {
            if (!err) {
                console.log(docs);
                const commenter = docs;
                if (commenter != {}) {
                    const req = {
                        comment: comment,
                        user_id: commenter._id
                    };
                    if (comment != "") {

                        Photo.update({ file_name: file_name, _id: photo_id },
                            { $push: { comments: req } },
                            { new: true, upsert: true }
                        ).exec();
                    }
                    return response.status(200).send("Cmt Done");
                }
                else return response.status(400).send("Bad request");
            }
            else throw err
        })
    } else {
        return response.status(401).send('Unauthorized')
    }
});

/*
 * URL /photos/new - Upload new photo
 */
app.post('/photos/new', (request, response) => {
    const img = request.body.file;
    const img_name = request.body.filename;
    const userId = request.body.userId;

    var base64Img = img.replace(/^data:image\/png;base64,/, "");

    fs.writeFileSync('./images/' + img_name, base64Img, 'base64', err => {
        console.log(err);
        return response.status(400).send("File not found");
    })

    var newPhoto = new Photo({
        user_id: userId,
        file_name: img_name,
        comments: [],
        __v: 0,
    })

    newPhoto.save(err => {
        console.log(err);
        return;
    })
    return response.status(200).send("Upload done");
})




var server = app.listen(3000, function () {
    var port = server.address().port;
    console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});


