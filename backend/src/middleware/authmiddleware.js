const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const CryptoJS = require('crypto-js');
const environment = process.env.ENV || ""
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];

            //decodes token id
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select("-password");

            next();
        } catch (error) {
            res.status(401);
            throw new Error("Not authorized, token failed");
        }
    }

    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
    }
});

// encryptionMiddleware.js
function encryptResponse(req, res, next) {
    // Save the original send method
    const originalSend = res.send;
    const secretKey = process.env.EN_KEY;

    // Override the send method
    res.send = function (body) {
        // Check if the response body is an object or a string
        const responseBody = typeof body === 'object' ? JSON.stringify(body) : body;
        // Encrypt the response using AES encryption
        const encryptedResponse = CryptoJS.AES.encrypt(responseBody, secretKey).toString();
        // Set the encrypted response as the actual response body
        res.set('Content-Type', 'application/json');
        originalSend.call(this, encryptedResponse);
    };

    next();
}

module.exports = { protect, encryptResponse };
