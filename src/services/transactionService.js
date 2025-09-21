// src/services/transactionService.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function approveTransaction(transactionId, adminValidated) {
  if (!adminValidated) {
    throw new Error("Transação não autorizada - biometria inválida");
  }

  const tx = await prisma.transaction.findUnique({
    where: { id: transactionId },
  });

  if (!tx) throw new Error("Transação não encontrada");

  // Pega o saldo atual do banco principal
  const bank = await prisma.account.findUnique({
    where: { key: 'bank_main' },
  });

  if (bank.balance < tx.amount) {
    throw new Error("Saldo insuficiente no banco");
  }

  // Atualiza status da transação e debita do saldo
  await prisma.$transaction([
    prisma.transaction.update({
      where: { id: transactionId },
      data: { status: 'APPROVED' },
    }),
    prisma.account.update({
      where: { key: 'bank_main' },
      data: { balance: bank.balance - BigInt(tx.amount) },
    }),
  ]);

  return `✔️ Transação ${transactionId} aprovada. Novo saldo: ${bank.balance - BigInt(tx.amount)}`;
}

module.exports = { approveTransaction };
