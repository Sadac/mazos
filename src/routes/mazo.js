const express = require("express");

const router = express.Router();
const {
  createMazo,
  getMazos,
  updateMazos,
  deleteMazo,
} = require("../controllers/mazoController");

router.post("/", createMazo);
router.get("/", getMazos);
router.patch("/:id", updateMazos);
router.delete("/:id", deleteMazo);

module.exports = router;
