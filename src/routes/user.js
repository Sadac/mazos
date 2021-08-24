const express = require('express');
const { createUser, getUsers, updateUser } = require('../controllers/userController');

const router = express.Router();
router.post('/', createUser);
router.get('/', getUsers);
router.patch('/:id', updateUser);

module.exports = router;
