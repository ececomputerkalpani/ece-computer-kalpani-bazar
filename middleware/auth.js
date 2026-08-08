const jwt = require("jsonwebtoken");

function verifyAdmin(req, res, next) {

    const token = req.headers.authorization;

    if (!token) {

        return res.status(401).json({

            success: false,
            message: "Access Denied"

        });

    }

    try {

        const decoded = jwt.verify(
            token.replace("Bearer ", ""),
            process.env.JWT_SECRET
        );

        req.admin = decoded;

        next();

    }

    catch (error) {

        return res.status(401).json({

            success: false,
            message: "Invalid Token"

        });

    }

}

module.exports = verifyAdmin;
