// prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const { hash } = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  // Usuário demo
  const passwordHash = await hash("demo12345", 10);
  const user = await prisma.user.upsert({
    where: { email: "demo@reuse.app" },
    update: {},
    create: {
      name: "Demo",
      email: "demo@reuse.app",
      passwordHash,
    },
  });

  // Categorias
  const categories = [
    { name: "Livros", slug: "livros" },
    { name: "Eletrônicos", slug: "eletronicos" },
    { name: "Móveis", slug: "moveis" },
  ];
  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
  }

  const livros = await prisma.category.findUnique({ where: { slug: "livros" } });

  // Item exemplo
  const item = await prisma.item.upsert({
    where: { id: "seed-clean-arch-book" },
    update: {},
    create: {
      id: "seed-clean-arch-book",
      title: "Livro Clean Architecture",
      description: "Em bom estado, poucas marcas de uso.",
      condition: "GOOD",
      ownerId: user.id,
      categoryId: livros?.id ?? null,
      images: { create: [{ url: "https://picsum.photos/seed/reuse/800/600" }] },
    },
  });

  console.log("✅ Seed ok:", { user: user.email, item: item.title });
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });