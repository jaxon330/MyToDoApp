const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { authenticate } = require('../middleware/auth');
const express = require('express');

const router = express.Router()

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email }});
    if(!user || !await user.isValidPassword(password)) {
        return res.status(401).send({ message: 'Invalid email or password'})
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    return res.send({ token });
});


router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
      const user = await User.create({ username, email, password });
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
      return res.send({ token });
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).send({ message: 'Username or email already taken' });
      }
      return res.status(500).send({ message: 'Internal server error' });
    }
});

module.exports = router