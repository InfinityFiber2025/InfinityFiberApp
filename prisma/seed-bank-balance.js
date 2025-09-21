const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Atualiza o saldo do banco principal
  await prisma.account.update({
    where: { key: 'bank_main' }, // ajuste a chave/ID se necessário
    data: { balance: BigInt(7400000000) }, // R$ 7,4 bilhões
  });

  // Garante que o Cofre continua com 30 bilhões
  await prisma.account.update({
    where: { key: 'cofre_bank' },
    data: { balance: BigInt(30000000000) }, // R$ 30 bilhões
  });

  console.log('✔️ Saldos atualizados: Banco Principal = R$ 7,4 bi | Cofre = R$ 30 bi');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
