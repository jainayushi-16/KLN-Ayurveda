export const PRODUCTS = [
    {
        id: "kln-hair-oil-01",
        name: "Intensive Hair Growth Oil",
        shortDesc: "Traditional Kshirapaka formulation with Bhringraj & Amla for root strengthening.",
        fullDesc: "Crafted through ancient Ayurvedic Kshirapaka method using pure sesame oil, Bhringraj, Amla, Brahmi, and 16 vital herbs. Deeply penetrates roots to prevent hair fall and promote thick, lustrous growth.",
        category: "Hair Care",
        type: "Oil",
        benefits: ["Hair Growth", "Fall Control", "Scalp Nourishment"],
        price: 610,
        originalPrice: 799,
        discountPercent: 24,
        rating: 4.9,
        reviewsCount: 328,
        badge: "Bestseller",
        inStock: true,
        images: [
            "/images/products/hairoil/oilf.jpeg",
            "/images/products/hairoil/oilbenefit.jpeg",
            "/images/products/hairoil/oilb.jpeg",
            "/images/products/hairoil/oilp.jpeg"
        ],
        ingredients: [
            "Bhringraj (Eclipta Alba)",
            "Amla (Indian Gooseberry)",
            "Brahmi (Bacopa Monnieri)",
            "Sesame Seed Oil",
            "Coconut Oil",
            "Gunja & Rosemary Extracts"
        ],
        specs: {
            netVolume: "200 ml / 6.76 fl oz",
            form: "Cold-Pressed Herb Oil",
            shelfLife: "24 Months from MFD",
            countryOfOrigin: "India"
        },
        usageInstructions: "Gently warm oil. Massage into scalp using fingertips in small circular motions. Leave overnight or for at least 1 hour before washing with mild shampoo.",
        featured: true
    },
    {
        id: "kln-hair-mask-02",
        name: "Deep Conditioning Herbal Mask",
        shortDesc: "Nourishing clay & botanical mask for silky texture and intense scalp hydration.",
        fullDesc: "A rich restorative hair butter mask packed with Fenugreek, Hibiscus petals, Neem, and Organic Butter. Repairs environmental damage and tames frizz while soothing dry scalps.",
        category: "Hair Care",
        type: "Mask",
        benefits: ["Scalp Nourishment", "Anti-Dandruff", "Hair Growth"],
        price: 340,
        originalPrice: 499,
        discountPercent: 32,
        rating: 4.8,
        reviewsCount: 194,
        badge: "Organic",
        inStock: true,
        images: [
            "/images/products/hairmask/maskbb.jpeg",
            "/images/products/hairmask/maskf.jpeg",
            "/images/products/hairmask/maskbenefit.jpeg",
            "/images/products/hairmask/hairmask.jpeg"
        ],
        ingredients: [
            "Hibiscus Petal Extract",
            "Fenugreek (Methi) Seeds",
            "Organic Neem Powder",
            "Aloe Vera Juice",
            "Shea Butter & Jojoba Oil"
        ],
        specs: {
            netVolume: "150 g / 5.29 oz",
            form: "Botanical Hair Butter",
            shelfLife: "18 Months from MFD",
            countryOfOrigin: "India"
        },
        usageInstructions: "Apply generously to damp hair from mid-lengths to ends after shampooing. Leave on for 15-20 minutes, then rinse thoroughly with cool water.",
        featured: true
    },
    {
        id: "kln-hair-tonic-03",
        name: "Scalp Revitalizing Herbal Tonic",
        shortDesc: "Non-sticky daily spray infused with Rosemary, Brahmi, and Aloe Vera.",
        fullDesc: "A weightless daily scalp mist formulated to stimulate dormant follicles, balance oil production, and soothe itchiness. Perfect leave-in treatment for all hair types.",
        category: "Scalp Care",
        type: "Tonic",
        benefits: ["Scalp Nourishment", "Fall Control", "Anti-Dandruff"],
        price: 360,
        originalPrice: 499,
        discountPercent: 28,
        rating: 4.7,
        reviewsCount: 156,
        badge: "New",
        inStock: true,
        images: [
            "/images/products/hairtonic/tonicf.jpeg",
            "/images/products/hairtonic/tonicbenefit.jpeg",
            "/images/products/hairtonic/tonicb.jpeg",
            "/images/products/hairtonic/tonics.jpeg"
        ],
        ingredients: [
            "Pure Rosemary Water",
            "Brahmi Herb Infusion",
            "Aloe Vera Gel Extract",
            "Peppermint Essential Oil",
            "Witch Hazel & Glycerin"
        ],
        specs: {
            netVolume: "100 ml / 3.38 fl oz",
            form: "Herbal Mist Spray",
            shelfLife: "24 Months from MFD",
            countryOfOrigin: "India"
        },
        usageInstructions: "Section hair and spray directly onto scalp twice daily. Gently massage with fingertips. Do not rinse out.",
        featured: true
    }
];

export const CATEGORIES = ["All", "Hair Care", "Scalp Care", "Skin Care", "Wellness Kits"];
export const PRODUCT_TYPES = ["All", "Oil", "Mask", "Tonic", "Serum", "Elixir"];
export const BENEFITS = [
    "Hair Growth",
    "Fall Control",
    "Scalp Nourishment",
    "Anti-Dandruff",
    "Glowing Skin"
];
