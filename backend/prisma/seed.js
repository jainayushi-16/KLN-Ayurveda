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
      phone: "7725820320",
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
      phone: "7725820320",
      role: "CUSTOMER",
      isEmailVerified: true,
    },
  });
  console.log("👤 Customer user created:", customer.email);

  // 2. Create Categories
  const hairOils = await prisma.category.upsert({
    where: { slug: "hair-oils" },
    update: {
      name: "Hair Oils",
      description: "Authentic Kshirapaka oils with Coconut, Olive, Argan, and Rosemary oil for deep root strengthening.",
      image: "/images/products/hairoil/oilf.jpeg",
    },
    create: {
      name: "Hair Oils",
      slug: "hair-oils",
      description: "Authentic Kshirapaka oils with Coconut, Olive, Argan, and Rosemary oil for deep root strengthening.",
      image: "/images/products/hairoil/oilf.jpeg",
    },
  });

  const scalpCare = await prisma.category.upsert({
    where: { slug: "scalp-care" },
    update: {
      name: "Scalp Care",
      slug: "scalp-care",
      description: "Natural & holistic Ayurvedic hair care tonics for healthy hair and scalp.",
      image: "/images/products/hairtonic/tonicf.jpeg",
    },
    create: {
      name: "Scalp Care",
      slug: "scalp-care",
      description: "Natural & holistic Ayurvedic hair care tonics for healthy hair and scalp.",
      image: "/images/products/hairtonic/tonicf.jpeg",
    },
  });

  const herbalHairCare = await prisma.category.upsert({
    where: { slug: "herbal-hair-care" },
    update: {
      name: "Herbal Hair Care",
      slug: "herbal-hair-care",
      description: "Pesticide-free protective hair masks with no added colors or preservatives.",
      image: "/images/products/hairmask/maskf.jpeg",
    },
    create: {
      name: "Herbal Hair Care",
      slug: "herbal-hair-care",
      description: "Pesticide-free protective hair masks with no added colors or preservatives.",
      image: "/images/products/hairmask/maskf.jpeg",
    },
  });

  // 3. Create Official Products
  await prisma.product.upsert({
    where: { id: "kln-hair-oil-01" },
    update: {
      name: "All Purpose Hair Oil",
      slug: "all-purpose-hair-oil",
      shortDesc: "Indulge in a blend of natural oils with Coconut, Olive, Argan, and Rosemary oil for deep root strengthening and scalp nourishment.",
      fullDesc: "Our goal is to protect your hair and promote stronger, thicker, healthier, and longer hair. Crafted from Ayurvedic herbs and naturally blended ingredients with no side effects. Helps control hair fall and damage, regulates scalp moisture, relieves tension and headaches, and improves texture and manageability.",
      price: 610,
      originalPrice: 799,
      discountPercent: 24,
      categoryId: hairOils.id,
      usageInstructions: "Section your hair evenly and massage the oil from the roots to the lengths of your hair. Can be used regularly or twice a week. Leave overnight and wash properly the next day. Note: Use for at least 3 to 4 months for best results. Please do not use henna on your hair.",
    },
    create: {
      id: "kln-hair-oil-01",
      name: "All Purpose Hair Oil",
      slug: "all-purpose-hair-oil",
      shortDesc: "Indulge in a blend of natural oils with Coconut, Olive, Argan, and Rosemary oil for deep root strengthening and scalp nourishment.",
      fullDesc: "Our goal is to protect your hair and promote stronger, thicker, healthier, and longer hair. Crafted from Ayurvedic herbs and naturally blended ingredients with no side effects. Helps control hair fall and damage, regulates scalp moisture, relieves tension and headaches, and improves texture and manageability.",
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
      usageInstructions: "Section your hair evenly and massage the oil from the roots to the lengths of your hair. Can be used regularly or twice a week. Leave overnight and wash properly the next day. Note: Use for at least 3 to 4 months for best results. Please do not use henna on your hair.",
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
          { name: "Coconut Oil", description: "Moisturizes and nourishes the scalp" },
          { name: "Olive Oil", description: "Strengthens hair follicles" },
          { name: "Argan Oil", description: "Rich in Vitamin E & antioxidants for dry scalp" },
          { name: "Rosemary Oil", description: "Reduces hair loss and promotes regrowth" },
          { name: "Amla & Bhringraj" },
          { name: "Shikakai & Neem" },
        ],
      },
      benefits: {
        create: [
          { name: "Hair Growth" },
          { name: "Hair Fall Control" },
          { name: "Scalp Nourishment" },
          { name: "Root Strengthening" },
        ],
      },
    },
  });

  await prisma.product.upsert({
    where: { id: "kln-hair-mask-02" },
    update: {
      name: "Protective Hair Mask",
      slug: "protective-hair-mask",
      shortDesc: "Pesticide-free botanical hair mask enriched with Coconut, Olive, Amla, Bhringraj, Neem, and Fenugreek.",
      fullDesc: "Our products are 100% pesticide-free with no added colors or preservatives. Formulated to repair environmental damage, restore natural moisture balance, and strengthen hair shafts naturally.",
      price: 430,
      originalPrice: 599,
      discountPercent: 28,
      categoryId: herbalHairCare.id,
      usageInstructions: "Mix the hair mask according to your hair length with curd, banana, honey, rose water, aloe vera gel, or rice water to make a smooth paste. Apply evenly to sections of dry hair and leave for at least 45 to 60 minutes. DO NOT USE IN ORIGINAL FORM. Note: Please do not use henna on your hair.",
    },
    create: {
      id: "kln-hair-mask-02",
      name: "Protective Hair Mask",
      slug: "protective-hair-mask",
      shortDesc: "Pesticide-free botanical hair mask enriched with Coconut, Olive, Amla, Bhringraj, Neem, and Fenugreek.",
      fullDesc: "Our products are 100% pesticide-free with no added colors or preservatives. Formulated to repair environmental damage, restore natural moisture balance, and strengthen hair shafts naturally.",
      price: 430,
      originalPrice: 599,
      discountPercent: 28,
      categoryId: herbalHairCare.id,
      badge: "Organic",
      rating: 4.8,
      reviewsCount: 210,
      inStock: true,
      stockQuantity: 200,
      isFeatured: true,
      usageInstructions: "Mix the hair mask according to your hair length with curd, banana, honey, rose water, aloe vera gel, or rice water to make a smooth paste. Apply evenly to sections of dry hair and leave for at least 45 to 60 minutes. DO NOT USE IN ORIGINAL FORM. Note: Please do not use henna on your hair.",
      images: {
        create: [
          { url: "/images/products/hairmask/maskf.jpeg", isPrimary: true },
          { url: "/images/products/hairmask/hairmask.jpeg", isPrimary: false },
          { url: "/images/products/hairmask/maskp.jpeg", isPrimary: false },
          { url: "/images/products/hairmask/maskbenefit.jpeg", isPrimary: false },
          { url: "/images/products/hairmask/maskbb.jpeg", isPrimary: false },
        ],
      },
      ingredients: {
        create: [
          { name: "Organic Neem Powder" },
          { name: "Fenugreek Seeds" },
          { name: "Amla & Bhringraj Oil" },
          { name: "Shikakai Extract" },
        ],
      },
      benefits: {
        create: [
          { name: "Scalp Nourishment" },
          { name: "Anti-Dandruff" },
          { name: "Root Strengthening" },
        ],
      },
    },
  });

  await prisma.product.upsert({
    where: { id: "kln-hair-tonic-03" },
    update: {
      name: "All Purpose Hair Tonic",
      slug: "all-purpose-hair-tonic",
      shortDesc: "Natural & holistic Ayurvedic hair care tonic enriched with 100% natural oils to strengthen roots and control dandruff.",
      fullDesc: "Formulated using ancient Ayurvedic principles to promote healthy hair and scalp. Penetrates deep into the scalp to revitalize dormant hair follicles, reduce hair fall and breakage, control dandruff, add natural shine and volume, and support the prevention of premature greying.",
      price: 350,
      originalPrice: 499,
      discountPercent: 30,
      categoryId: scalpCare.id,
      usageInstructions: "Apply a small amount of the Ayurvedic Hair Care Tonic directly onto the scalp. Gently massage in circular motions for 5–10 minutes. Leave it on for a few hours for best results. Use twice a week. Note: Please do not use henna on your hair.",
    },
    create: {
      id: "kln-hair-tonic-03",
      name: "All Purpose Hair Tonic",
      slug: "all-purpose-hair-tonic",
      shortDesc: "Natural & holistic Ayurvedic hair care tonic enriched with 100% natural oils to strengthen roots and control dandruff.",
      fullDesc: "Formulated using ancient Ayurvedic principles to promote healthy hair and scalp. Penetrates deep into the scalp to revitalize dormant hair follicles, reduce hair fall and breakage, control dandruff, add natural shine and volume, and support the prevention of premature greying.",
      price: 350,
      originalPrice: 499,
      discountPercent: 30,
      categoryId: scalpCare.id,
      badge: "100% Natural",
      rating: 4.9,
      reviewsCount: 185,
      inStock: true,
      stockQuantity: 300,
      isFeatured: true,
      usageInstructions: "Apply a small amount of the Ayurvedic Hair Care Tonic directly onto the scalp. Gently massage in circular motions for 5–10 minutes. Leave it on for a few hours for best results. Use twice a week. Note: Please do not use henna on your hair.",
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
          { name: "Pure Rosemary Extract" },
          { name: "Brahmi Herb Infusion" },
          { name: "Aloe Vera Gel Extract" },
          { name: "Peppermint Essential Oil" },
        ],
      },
      benefits: {
        create: [
          { name: "Scalp Nourishment" },
          { name: "Hair Fall Control" },
          { name: "Anti-Dandruff" },
        ],
      },
    },
  });

  // 4. Create FAQs
  await prisma.fAQ.createMany({
    data: [
      {
        question: "What makes KLN All Purpose Hair Oil unique?",
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
