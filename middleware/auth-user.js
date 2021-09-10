'use strict';
const auth = require("basic-auth");
const bcrypt = require("bcryptjs");
const { User } = require("../models");


// Middleware to authenticate the request using Basic Authentication.
exports.authenticateUser = async (req, res, next) => {
    // Error message
    let errorMessage;

    // Parse the user's credentials from the Authorization header.
    const credentials = auth(req);

    // If the user's credentials are available...
    if (credentials) {
        const user = await User.findOne({ where: {emailAddress: credentials.name} });

        // If user exists
        if (user) {
            const authenticated = bcrypt.compareSync(credentials.pass, user.password);

            // If password matches
            if (authenticated) {
                console.log(`Authentication successful for username: ${user.firstName} ${user.lastName}`)
            
            // Store the user on the request object
            req.currentUser = user;
            }
            else {
                errorMessage = "Authentication failed - wrong password";
            }
        }
        else {
            errorMessage = "User not found";
        }
    }
    else {
        errorMessage = "Authentication not possible";
    }

    if (errorMessage) {
        console.warn(errorMessage);
        res.status(401).json({message: "Access Denied"});
    }
    else {
        next();
    }
}