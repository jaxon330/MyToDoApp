const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authenticate = (req, res, nex) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).send({ message: 'Unauthorized' });
    }
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user =payload;
        next();
    } catch (error) {
        return res.status(401).send({ message: 'Unauthorized' });
    }
}

module.exports = { authenticate };