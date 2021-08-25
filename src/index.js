const express = require('express');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 4000;
app.use(express.json());
app.use('/api/user', require('./routes/user'));
app.use('/api/mazo', require('./routes/mazo'));
app.use('/api/tarjeta', require('./routes/tarjeta'));

app.use((error, req, res, next) => {
  res.status(error.status);
  res.json({
    status: error.status,
    message: error.message,
    stack: error.stack,
  });
});
app.listen(PORT, () => {
  console.log(`Server is up un port ${PORT}`);
});
