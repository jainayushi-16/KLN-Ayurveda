const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding KLN Ayurveda database...");

  // Connection retry for Neon cloud database cold start
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await prisma.$connect();
      break;
    } catch (err) {
      if (attempt === 3) throw err;
      console.log(`⏳ Database cold start retry ${attempt}/3...`);
      await new Promise((res) => setTimeout(res, 3000));
    }
  }

  // 1. Create Admin User & Customer User
  const hashedAdminPassword = await bcrypt.hash("Admin@12345", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@klnayurveda.com" },
    update: {},
    create: {
      email: "admin@klnayurveda.com",
      password: hashedAdminPassword,
      firstName: "KLN",
      lastName: "Admin",
      phone: "+91 9876543210",
      role: "ADMIN",
      isEmailVerified: true,
    },
  });
  console.log("👤 Admin user created:", admin.email);

  const hashedCustomerPassword = await bcrypt.hash("Customer@12345", 10);
  const customer = await prisma.user.upsert({
    where: { email: "customer@klnayurveda.com" },
    update: {},
    create: {
      email: "customer@klnayurveda.com",
      password: hashedCustomerPassword,
      firstName: "Ananya",
      lastName: "Sharma",
      phone: "+91 9876543211",
      role: "CUSTOMER",
      isEmailVerified: true,
    },
  });
  console.log("👤 Customer user created:", customer.email);

  // 2. Create Categories
  const hairCare = await prisma.category.upsert({
    where: { slug: "hair-care" },
    update: {},
    create: {
      name: "Hair Care",
      slug: "hair-care",
      description: "Authentic Kshirapaka oils, hair masks, and revitalize tonics.",
      image: "/images/products/hairoil/oilf.jpeg",
    },
  });

  const scalpCare = await prisma.category.upsert({
    where: { slug: "scalp-care" },
    update: {},
    create: {
      name: "Scalp Care",
      slug: "scalp-care",
      description: "Targeted Ayurvedic scalp mists and purifying serums.",
      image: "/images/products/hairtonic/tonicf.jpeg",
    },
  });

  // const skinCare = await prisma.category.upsert({
  //   where: { slug: "skin-care" },
  //   update: {},
  //   create: {
  //     name: "Skin Care",
  //     slug: "skin-care",
  //     description: "Kumkumadi saffron facial elixirs and radiance oils.",
  //     image: "/images/products/hairoil/oilp.jpeg",
  //   },
  // });

  // 3. Create Products
  const oilProduct = await prisma.product.upsert({
    where: { slug: "intensive-hair-growth-oil" },
    update: {
      id: "kln-hair-oil-01",
      price: 610,
      originalPrice: 799,
      discountPercent: 24,
    },
    create: {
      id: "kln-hair-oil-01",
      name: "Intensive Hair Growth Oil",
      slug: "intensive-hair-growth-oil",
      shortDesc: "Traditional Kshirapaka formulation with Bhringraj & Amla for root strengthening.",
      fullDesc: "Crafted through ancient Ayurvedic Kshirapaka method using pure sesame oil, Bhringraj, Amla, Brahmi, and 16 vital herbs. Deeply penetrates roots to prevent hair fall.",
      price: 610,
      originalPrice: 799,
      discountPercent: 24,
      categoryId: hairCare.id,
      badge: "Bestseller",
      rating: 4.9,
      reviewsCount: 328,
      inStock: true,
      stockQuantity: 250,
      isFeatured: true,
      usageInstructions: "Gently warm oil. Massage into scalp using fingertips in circular motions. Leave overnight before washing.",
      images: {
        create: [
          { url: "/images/products/hairoil/oilf.jpeg", isPrimary: true },
          { url: "/images/products/hairoil/oilbenefit.jpeg", isPrimary: false },
          { url: "/images/products/hairoil/oilb.jpeg", isPrimary: false },
          { url: "/images/products/hairoil/oilp.jpeg", isPrimary: false },
        ],
      },
      ingredients: {
        create: [
          { name: "Bhringraj (Eclipta Alba)", description: "Promotes hair follicle regeneration" },
          { name: "Amla (Indian Gooseberry)", description: "Rich in Vitamin C for anti-hairfall" },
          { name: "Brahmi (Bacopa Monnieri)", description: "Soothes scalp and reduces stress" },
          { name: "Sesame Seed Oil" },
          { name: "Coconut Oil" },
          { name: "Gunja & Rosemary Extracts" },
        ],
      },
      benefits: {
        create: [
          { name: "Hair Growth" },
          { name: "Fall Control" },
          { name: "Scalp Nourishment" },
        ],
      },
    },
  });

  const maskProduct = await prisma.product.upsert({
    where: { slug: "deep-conditioning-herbal-mask" },
    update: {
      id: "kln-hair-mask-02",
      price: 340,
      originalPrice: 499,
      discountPercent: 32,
    },
    create: {
      id: "kln-hair-mask-02",
      name: "Deep Conditioning Herbal Mask",
      slug: "deep-conditioning-herbal-mask",
      shortDesc: "Nourishing clay & botanical mask for silky texture and scalp hydration.",
      fullDesc: "A rich restorative hair butter mask packed with Fenugreek, Hibiscus petals, Neem, and Organic Butter. Repairs environmental damage and tames frizz.",
      price: 340,
      originalPrice: 499,
      discountPercent: 32,
      categoryId: hairCare.id,
      badge: "Organic",
      rating: 4.8,
      reviewsCount: 194,
      inStock: true,
      stockQuantity: 180,
      isFeatured: true,
      usageInstructions: "Apply generously to damp hair post-shampoo. Leave on for 15-20 minutes, then rinse with cool water.",
      images: {
        create: [
          { url: "/images/products/hairmask/maskbb.jpeg", isPrimary: true },
          { url: "/images/products/hairmask/maskf.jpeg", isPrimary: false },
          { url: "/images/products/hairmask/maskbenefit.jpeg", isPrimary: false },
          { url: "/images/products/hairmask/hairmask.jpeg", isPrimary: false },
        ],
      },
      ingredients: {
        create: [
          { name: "Hibiscus Petal Extract", description: "Deep conditioning" },
          { name: "Fenugreek (Methi) Seeds", description: "Strengthens hair shafts" },
          { name: "Organic Neem Powder" },
          { name: "Aloe Vera Juice" },
          { name: "Shea Butter & Jojoba Oil" },
        ],
      },
      benefits: {
        create: [
          { name: "Scalp Nourishment" },
          { name: "Anti-Dandruff" },
          { name: "Hair Growth" },
        ],
      },
    },
  });

  const tonicProduct = await prisma.product.upsert({
    where: { slug: "scalp-revitalizing-herbal-tonic" },
    update: {
      id: "kln-hair-tonic-03",
      price: 360,
      originalPrice: 499,
      discountPercent: 28,
    },
    create: {
      id: "kln-hair-tonic-03",
      name: "Scalp Revitalizing Herbal Tonic",
      slug: "scalp-revitalizing-herbal-tonic",
      shortDesc: "Non-sticky daily spray infused with Rosemary, Brahmi, and Aloe Vera.",
      fullDesc: "A weightless daily scalp mist formulated to stimulate dormant follicles, balance oil production, and soothe itchiness naturally.",
      price: 360,
      originalPrice: 499,
      discountPercent: 28,
      categoryId: scalpCare.id,
      badge: "New",
      rating: 4.7,
      reviewsCount: 156,
      inStock: true,
      stockQuantity: 300,
      isFeatured: true,
      usageInstructions: "Spray directly onto scalp twice daily. Gently massage with fingertips.",
      images: {
        create: [
          { url: "/images/products/hairtonic/tonicf.jpeg", isPrimary: true },
          { url: "/images/products/hairtonic/tonicbenefit.jpeg", isPrimary: false },
          { url: "/images/products/hairtonic/tonicb.jpeg", isPrimary: false },
          { url: "/images/products/hairtonic/tonics.jpeg", isPrimary: false },
        ],
      },
      ingredients: {
        create: [
          { name: "Pure Rosemary Water", description: "Follicle stimulation" },
          { name: "Brahmi Herb Infusion" },
          { name: "Aloe Vera Gel Extract", description: "Scalp cooling and hydration" },
          { name: "Peppermint Essential Oil" },
          { name: "Witch Hazel & Glycerin" },
        ],
      },
      benefits: {
        create: [
          { name: "Scalp Nourishment" },
          { name: "Fall Control" },
          { name: "Anti-Dandruff" },
        ],
      },
    },
  });

  // 4. Create FAQs
  await prisma.fAQ.createMany({
    data: [
      {
        question: "What makes KLN Kshirapaka formulation unique?",
        answer: "Our oils are prepared through slow thermal infusion with fresh herbal paste and milk over 72 hours, preserving all bio-active nutrients.",
        category: "Product Info",
      },
      {
        question: "How long does shipping take?",
        answer: "We ship orders within 24 hours. Express global delivery usually arrives within 3-5 business days.",
        category: "Shipping",
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
