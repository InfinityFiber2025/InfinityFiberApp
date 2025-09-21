const express = require('express');
const app = express();
const transactionRoutes = require('./src/routes/transactionRoutes');

app.use(express.json());
app.use('/transactions', transactionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API rodando na porta ${PORT}`);
});
