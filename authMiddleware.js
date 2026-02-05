const jwt = require('jsonwebtoken');
require('dotenv').config(); //for loading the secret key

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('JWT_SECRET is not set in .env file');
  process.exit(1); // crash in dev if missing
}

const authenticate = (req,res,next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            error: 'No token provided – use header: Authorization: Bearer <token>'
        })
    }

    const token = authHeader.split(' ')[1];


    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next()
    }catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

module.exports = authenticate;

