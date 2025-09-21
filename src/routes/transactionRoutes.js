const express = require('express');
const router = express.Router();
const { approveTransaction } = require('../services/transactionService');

// Mock de validação facial (depois substituir pela lógica real)
async function validateFacialRecognition(image) {
  // Simulação: se a string recebida for "admin_ok", valida como verdadeiro
  if (image === "admin_ok") {
    return true;
  }
  return false;
}

// Rota para aprovar transação com biometria facial
router.post('/:id/approve', async (req, res) => {
  try {
    const { image } = req.body; // Captura enviada pelo front (ex: base64)
    const adminValidated = await validateFacialRecognition(image);

    const message = await approveTransaction(parseInt(req.params.id), adminValidated);
    res.json({ success: true, message });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;
