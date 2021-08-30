const express = require('express');
require('dotenv').config();
const cors = require('cors');

const app = express();

const PORT = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());
app.use('/api/usuario', require('./routes/user'));
app.use('/api/mazo', require('./routes/mazo'));
app.use('/api/tarjeta', require('./routes/tarjeta'));
app.use('/api/medalla', require('./routes/medalla'));

// app.use((error, req, res) => {
//   res.status(error.status);
//   res.json({
//     status: error.status,
//     message: error.message,
//     stack: error.stack,
//   });
// });
app.listen(PORT, () => {
  console.log(`Servidor esta levantado en el puerto ${PORT}`);
});
