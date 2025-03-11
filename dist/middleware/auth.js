"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const getTokenFromHeader = (req) => {
    const authHeader = req.headers.authorization;
    return (authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith("Bearer ")) ? authHeader.split(" ")[1] : null;
};
const authenticate = (req, res, next) => {
    try {
        const token = getTokenFromHeader(req);
        if (!token) {
            res.status(401).json({ message: "Authentication required" });
            return;
        }
        const decoded = (0, jwt_1.verifyToken)(token);
        if (!decoded.id || !decoded.username || !decoded.email) {
            res.status(400).json({ message: "Invalid token payload" });
            return;
        }
        req.user = {
            id: decoded.id,
            username: decoded.username,
            email: decoded.email,
        };
        next();
    }
    catch (error) {
        if (error.name === "TokenExpiredError") {
            res.status(401).json({ message: "Token expired" });
        }
        else if (error.name === "JsonWebTokenError") {
            res.status(401).json({ message: "Invalid token" });
        }
        else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
};
exports.authenticate = authenticate;
