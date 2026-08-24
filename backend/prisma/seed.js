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

  // 2. Create 5 Hair Care Categories
  const hairOils = await prisma.category.upsert({
    where: { slug: "hair-oils" },
    update: {
      name: "Hair Oils",
      description: "Authentic Kshirapaka oils with Bhringraj & Sesame for deep root strengthening.",
      image: "/images/products/hairoil/oilf.jpeg",
    },
    create: {
      name: "Hair Oils",
      slug: "hair-oils",
      description: "Authentic Kshirapaka oils with Bhringraj & Sesame for deep root strengthening.",
      image: "/images/products/hairoil/oilf.jpeg",
    },
  });

  const hairFallCare = await prisma.category.upsert({
    where: { slug: "hair-fall-care" },
    update: {
      name: "Hair Fall Care",
      slug: "hair-fall-care",
      description: "Targeted root-strengthening serums and anti-hairfall botanical formulations.",
      image: "/images/products/hairtonic/tonicf.jpeg",
    },
    create: {
      name: "Hair Fall Care",
      slug: "hair-fall-care",
      description: "Targeted root-strengthening serums and anti-hairfall botanical formulations.",
      image: "/images/products/hairtonic/tonicf.jpeg",
    },
  });

  const scalpCare = await prisma.category.upsert({
    where: { slug: "scalp-care" },
    update: {
      name: "Scalp Care",
      slug: "scalp-care",
      description: "Purifying herbal mists and anti-dandruff scalp tonics.",
      image: "/images/products/hairtonic/tonicbenefit.jpeg",
    },
    create: {
      name: "Scalp Care",
      slug: "scalp-care",
      description: "Purifying herbal mists and anti-dandruff scalp tonics.",
      image: "/images/products/hairtonic/tonicbenefit.jpeg",
    },
  });

  const hairCleanser = await prisma.category.upsert({
    where: { slug: "hair-cleanser" },
    update: {
      name: "Hair Cleanser",
      slug: "hair-cleanser",
      description: "Gentle SLES-free Reetha & Shikakai cleansers for healthy scalp hygiene.",
      image: "/images/products/hairmask/maskf.jpeg",
    },
    create: {
      name: "Hair Cleanser",
      slug: "hair-cleanser",
      description: "Gentle SLES-free Reetha & Shikakai cleansers for healthy scalp hygiene.",
      image: "/images/products/hairmask/maskf.jpeg",
    },
  });

  const herbalHairCare = await prisma.category.upsert({
    where: { slug: "herbal-hair-care" },
    update: {
      name: "Herbal Hair Care",
      slug: "herbal-hair-care",
      description: "Nourishing clay masks, hair butter, and botanical restorative treatments.",
      image: "/images/products/hairmask/maskbb.jpeg",
    },
    create: {
      name: "Herbal Hair Care",
      slug: "herbal-hair-care",
      description: "Nourishing clay masks, hair butter, and botanical restorative treatments.",
      image: "/images/products/hairmask/maskbb.jpeg",
    },
  });

  // 3. Create Products
  await prisma.product.upsert({
    where: { slug: "intensive-hair-growth-oil" },
    update: {
      id: "kln-hair-oil-01",
      name: "Intensive Hair Growth Oil",
      price: 610,
      originalPrice: 799,
      discountPercent: 24,
      categoryId: hairOils.id,
    },
    create: {
      id: "kln-hair-oil-01",
      name: "Intensive Hair Growth Oil",
      slug: "intensive-hair-growth-oil",
      shortDesc: "Traditional Kshirapaka formulation with Bhringraj & Amla for root strengthening.",
      fullDesc: "Crafted through ancient Ayurvedic Kshirapaka method using pure sesame oil, Bhringraj, Amla, Brahmi, and 16 vital herbs. Deeply penetrates roots to prevent hair fall and promote thick, lustrous growth.",
      price: 610,
      originalPrice: 799,
      discountPercent: 24,
      categoryId: hairOils.id,
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

  await prisma.product.upsert({
    where: { slug: "root-fortifying-hair-fall-serum" },
    update: {
      id: "kln-hair-serum-02",
      name: "Root Fortifying Hair Fall Serum",
      price: 450,
      originalPrice: 650,
      discountPercent: 30,
      categoryId: hairFallCare.id,
    },
    create: {
      id: "kln-hair-serum-02",
      name: "Root Fortifying Hair Fall Serum",
      slug: "root-fortifying-hair-fall-serum",
      shortDesc: "Intensive botanical serum with Jatamansi and Rosemary for anti-hairfall defense.",
      fullDesc: "Targeted anti-hairfall serum infused with Jatamansi, Fenugreek, and Rosemary water. Anchors weak roots and reduces breakage noticeably within 14 days of regular use.",
      price: 450,
      originalPrice: 650,
      discountPercent: 30,
      categoryId: hairFallCare.id,
      badge: "Anti-Hairfall",
      rating: 4.9,
      reviewsCount: 215,
      inStock: true,
      stockQuantity: 200,
      isFeatured: true,
      usageInstructions: "Apply 4-5 drops directly onto scalp nightly. Massage gently till absorbed.",
      images: {
        create: [
          { url: "/images/products/hairtonic/tonicf.jpeg", isPrimary: true },
          { url: "/images/products/hairtonic/tonicb.jpeg", isPrimary: false },
        ],
      },
      ingredients: {
        create: [
          { name: "Jatamansi Root Extract", description: "Anchors hair follicles" },
          { name: "Rosemary Water" },
          { name: "Fenugreek Seed Oil" },
        ],
      },
      benefits: {
        create: [
          { name: "Fall Control" },
          { name: "Root Strengthening" },
          { name: "Scalp Nourishment" },
        ],
      },
    },
  });

  await prisma.product.upsert({
    where: { slug: "scalp-revitalizing-herbal-tonic" },
    update: {
      id: "kln-hair-tonic-03",
      name: "Scalp Revitalizing Herbal Tonic",
      price: 360,
      originalPrice: 499,
      discountPercent: 28,
      categoryId: scalpCare.id,
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

  await prisma.product.upsert({
    where: { slug: "ayurvedic-herbal-hair-cleanser" },
    update: {
      id: "kln-hair-cleanser-04",
      name: "Ayurvedic Herbal Hair Cleanser",
      price: 390,
      originalPrice: 550,
      discountPercent: 29,
      categoryId: hairCleanser.id,
    },
    create: {
      id: "kln-hair-cleanser-04",
      name: "Ayurvedic Herbal Hair Cleanser",
      slug: "ayurvedic-herbal-hair-cleanser",
      shortDesc: "Sulphate-free natural Reetha & Shikakai clarifying shampoo cleanser.",
      fullDesc: "Gentle herbal hair shampoo crafted with Reetha, Shikakai, Bhringraj, and Green Tea. Lathers mildly without stripping natural scalp oils or color.",
      price: 390,
      originalPrice: 550,
      discountPercent: 29,
      categoryId: hairCleanser.id,
      badge: "SLES Free",
      rating: 4.8,
      reviewsCount: 180,
      inStock: true,
      stockQuantity: 220,
      isFeatured: true,
      usageInstructions: "Apply to wet hair, lather gently over scalp, and rinse thoroughly.",
      images: {
        create: [
          { url: "/images/products/hairmask/maskf.jpeg", isPrimary: true },
          { url: "/images/products/hairmask/maskbb.jpeg", isPrimary: false },
        ],
      },
      ingredients: {
        create: [
          { name: "Reetha (Soapnut)", description: "Natural foaming agent" },
          { name: "Shikakai Extract", description: "pH-balanced scalp wash" },
          { name: "Aloe Vera Gel" },
        ],
      },
      benefits: {
        create: [
          { name: "Scalp Nourishment" },
          { name: "Anti-Dandruff" },
        ],
      },
    },
  });

  await prisma.product.upsert({
    where: { slug: "deep-conditioning-herbal-mask" },
    update: {
      id: "kln-hair-mask-05",
      name: "Deep Conditioning Herbal Mask",
      price: 340,
      originalPrice: 499,
      discountPercent: 32,
      categoryId: herbalHairCare.id,
    },
    create: {
      id: "kln-hair-mask-05",
      name: "Deep Conditioning Herbal Mask",
      slug: "deep-conditioning-herbal-mask",
      shortDesc: "Nourishing clay & botanical mask for silky texture and scalp hydration.",
      fullDesc: "A rich restorative hair butter mask packed with Fenugreek, Hibiscus petals, Neem, and Organic Butter. Repairs environmental damage and tames frizz.",
      price: 340,
      originalPrice: 499,
      discountPercent: 32,
      categoryId: herbalHairCare.id,
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

  // 4. Create FAQs
  await prisma.fAQ.createMany({
    data: [
      {
        question: "What makes KLN Kshirapaka formulation unique?",
        answer: "Our oils are prepared through slow thermal infusion with fresh herbal paste and milk over 72 hours, preserving all bio-active hair nutrients.",
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

  // 5. Create Sample Enterprise Offers
  const now = new Date();
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  await prisma.offer.upsert({
    where: { code: "KLN20" },
    update: {},
    create: {
      name: "Grand Hair Care Festival 20% OFF",
      description: "Get 20% OFF on all Ayurvedic hair care orders above ₹999",
      code: "KLN20",
      type: "PERCENTAGE",
      value: 20,
      maxDiscount: 500,
      minimumOrderValue: 999,
      startAt: now,
      endAt: nextMonth,
      status: "ACTIVE",
      usageLimit: 500,
      perCustomerLimit: 2,
      isActive: true,
      isFeatured: true,
    },
  });

  await prisma.offer.upsert({
    where: { code: "WELCOME200" },
    update: {},
    create: {
      name: "Welcome Flat ₹200 OFF",
      description: "Flat ₹200 OFF on your first hair care purchase above ₹1499",
      code: "WELCOME200",
      type: "FLAT",
      value: 200,
      minimumOrderValue: 1499,
      startAt: now,
      endAt: nextMonth,
      status: "ACTIVE",
      usageLimit: 1000,
      perCustomerLimit: 1,
      isActive: true,
      isFeatured: true,
    },
  });

  await prisma.offer.upsert({
    where: { code: "FREESHIP" },
    update: {},
    create: {
      name: "Free Express Shipping",
      description: "Complimentary express delivery on all hair care orders",
      code: "FREESHIP",
      type: "FREE_SHIPPING",
      value: 0,
      minimumOrderValue: 499,
      startAt: now,
      endAt: nextMonth,
      status: "ACTIVE",
      usageLimit: 5000,
      perCustomerLimit: 5,
      isActive: true,
      isFeatured: false,
    },
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
