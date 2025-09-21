const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Restaura o Banco Principal para R$ 37.000.000
  await prisma.account.update({
    where: { key: 'bank_main' },
    data: { balance: BigInt(37000000) }, // R$ 37 milhões
  });

  console.log('↩️ Rollback concluído: saldo do Banco Principal restaurado para R$ 37.000.000,00');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
