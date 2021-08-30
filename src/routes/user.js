const express = require('express');
const {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  addMedal,
  getUserDetails,
  deleteMedal,
} = require('../controllers/userController');

const router = express.Router();
router.post('/', createUser);
router.get('/', getUsers);
router.get('/:id', getUserDetails);
router.patch('/:id', updateUser);
router.delete('/delete/:id', deleteUser);
router.post('/add', addMedal);
router.delete('/delete', deleteMedal);

module.exports = router;
