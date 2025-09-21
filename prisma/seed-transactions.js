const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Cria algumas transações de teste
  await prisma.transaction.createMany({
    data: [
      { id: 1, description: "Pagamento fornecedor A", amount: BigInt(1000000), status: "PENDING" }, // 1 milhão
      { id: 2, description: "Transferência cliente X", amount: BigInt(2500000), status: "PENDING" }, // 2,5 milhões
      { id: 3, description: "Liquidação título", amount: BigInt(500000000), status: "PENDING" }, // 500 milhões
    ],
    skipDuplicates: true,
  });

  console.log("✔️ Transações de teste criadas (status = PENDING).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
