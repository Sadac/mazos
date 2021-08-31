const express = require("express");
require("dotenv").config();
const cors = require("cors");

const app = express();

app.set("port", process.env.PORT || 4000);
app.use(cors());
app.use(express.json());
app.use(cors());
app.use("/api/usuario", require("./routes/user"));
app.use("/api/mazo", require("./routes/mazo"));
app.use("/api/tarjeta", require("./routes/tarjeta"));
app.use("/api/medalla", require("./routes/medalla"));

app.listen(app.get("port"), () => {
  console.log(`Servidor esta levantado en el puerto ${app.get("port")}`);
});
