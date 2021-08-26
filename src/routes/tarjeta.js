const express = require("express");

const router = express.Router();
const {
  createTarjeta,
  getTarjetas,
  updateTarjetas,
  deleteTarjeta,
} = require("../controllers/tarjetaController");

router.post("/", createTarjeta);
router.get("/", getTarjetas);
router.patch("/:id", updateTarjetas);
router.delete("/:id", deleteTarjeta);

module.exports = router;
