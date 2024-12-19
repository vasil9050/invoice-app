const jwt = require("jsonwebtoken");
const config = require('../config/secret.json');


function authenticateToken(req, res, next) {
    // Gather the jwt access token from the request header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401); // if there isn't any token

    jwt.verify(token, config.secret, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next(); // pass the execution off to whatever request the client intended
    });
}


module.exports = {
    authenticateToken,

};
