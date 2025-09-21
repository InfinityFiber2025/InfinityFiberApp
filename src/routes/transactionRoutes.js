const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { approveTransaction } = require('../services/transactionService');

// Mock de validação facial (depois substituir pela lógica real)
async function validateFacialRecognition(image) {
  if (image === "admin_ok") {
    return true;
  }
  return false;
}

// Rota para aprovar transação com biometria facial
router.post('/:id/approve', async (req, res) => {
  try {
    const { image } = req.body;
    const adminValidated = await validateFacialRecognition(image);
    const message = await approveTransaction(parseInt(req.params.id), adminValidated);
    res.json({ success: true, message });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Listar transações pendentes
router.get('/pending', async (req, res) => {
  try {
    const txs = await prisma.transaction.findMany({
      where: { status: "PENDING" },
      select: { id: true, description: true, amount: true, status: true }
    });
    res.json(txs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
