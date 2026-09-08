// const flavorlists = [
//   {
//     name: "Hair Oil",
//     rotation: "rotate-[-8deg]",
//     images: {
//       // background: "/images/products/hairoil/oilf.jpeg",
//       product: "/images/products/hairoil/oilf.jpeg",
//       // ingredient: "/images/products/hairoil/oilu.jpeg",
//     },
//   },
//   {
//     name: "Hair Mask",
//     rotation: "rotate-[6deg]",
//     images: {
//       // background: "/images/products/hairmask/maskbb.jpeg",
//       product: "/images/products/hairmask/maskbb.jpeg",
//       // ingredient: "/images/products/hairmask/hairmask.jpeg",
//     },
//   },
//   {
//     name: "Hair Tonic",
//     rotation: "rotate-[-5deg]",
//     images: {
//       // background: "/images/products/hairtonic/tonicf.jpeg",
//       product: "/images/products/hairtonic/tonicf.jpeg",
//       // ingredient: "/images/products/hairtonic/tonics.jpeg",
//     },
//   },
// ];
const flavorlists = [
    {
        name: "Hair Oil",
        rotation: "rotate-[-8deg]",
        video: "/videos/hairoil.mp4",
        poster: "/images/products/hairoil/oilf.jpeg",
        productId: "kln-hair-oil-01",
    },
    {
        name: "Hair Mask",
        rotation: "rotate-[6deg]",
        video: "/videos/hairmask.mp4",
        poster: "/images/products/hairmask/maskf.jpeg",
        productId: "kln-hair-mask-02",
    },
    {
        name: "Hair Tonic",
        rotation: "rotate-[-5deg]",
        video: "/videos/hairtonic.mp4",
        poster: "/images/products/hairtonic/tonicf.jpeg",
        productId: "kln-hair-tonic-03",
    },
];
const nutrientLists = [
    { label: "Bhringraj", labelHi: "भृंगराज", amount: "Hair", amountHi: "बाल" },
    { label: "Amla", labelHi: "आंवला", amount: "Care", amountHi: "देखभाल" },
    { label: "Brahmi", labelHi: "ब्राह्मी", amount: "Scalp", amountHi: "स्कैल्प" },
    { label: "Neem", labelHi: "नीम", amount: "Purify", amountHi: "शुद्धता" },
    { label: "Fenugreek", labelHi: "मेथी", amount: "Nourish", amountHi: "पोषण" },
    { label: "Coconut Oil", labelHi: "नारियल तेल", amount: "Moisture", amountHi: "नमी" },
    { label: "Mustard Oil", labelHi: "सरसों तेल", amount: "Strength", amountHi: "मजबूती" },
    { label: "Shikakai", labelHi: "शिकाकाई", amount: "Cleansing", amountHi: "सफाई" },
];
const cards = [
    {
        src: "/videos/f1.mp4",
        rotation: "rotate-z-[-10deg]",
        name: "Ananya",
        img: "/images/leaf.svg",
        translation: "translate-y-[-5%]",
    },
    {
        src: "/videos/f2.mp4",
        rotation: "rotate-z-[4deg]",
        name: "Riya",
        img: "/images/leaf.svg",
    },
    {
        src: "/videos/f3.mp4",
        rotation: "rotate-z-[-4deg]",
        name: "Meera",
        img: "/images/leaf.svg",
        translation: "translate-y-[-5%]",
    },
    {
        src: "/videos/f4.mp4",
        rotation: "rotate-z-[4deg]",
        name: "Aarav",
        img: "/images/leaf.svg",
        translation: "translate-y-[5%]",
    },
    {
        src: "/videos/f5.mp4",
        rotation: "rotate-z-[-10deg]",
        name: "Kavya",
        img: "/images/leaf.svg",
    },
    {
        src: "/videos/f6.mp4",
        rotation: "rotate-z-[4deg]",
        name: "Ishaan",
        img: "/images/leaf.svg",
        translation: "translate-y-[5%]",
    },
    {
        src: "/videos/f7.mp4",
        rotation: "rotate-z-[-3deg]",
        name: "Saanvi",
        img: "/images/leaf.svg",
        translation: "translate-y-[10%]",
    },
];
export { flavorlists, nutrientLists, cards };
