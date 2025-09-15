import { prisma } from "../lib/prisma";
import { hash } from "bcryptjs";

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "demo@reuse.app" },
    update: {},
    create: {
      name: "Demo",
      email: "demo@reuse.app",
      passwordHash: await hash("demo12345", 10),
    },
  });

  const cat = await prisma.category.upsert({
    where: { slug: "livros" },
    update: {},
    create: { name: "Livros", slug: "livros" },
  });

  await prisma.item.create({
    data: {
      title: "Livro Clean Architecture",
      description: "Em bom estado",
      condition: "GOOD",
      ownerId: user.id,
      categoryId: cat.id,
      images: { create: [{ url: "https://picsum.photos/seed/reuse/800/600" }] },
    },
  });
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });