// ---------------------------------------------------------------
// Store catalog. Used by the website AND by the order API (api/order.js),
// so prices are always checked on the server and can't be tampered with.
//
// Add a product like this:
// {
//   id: 2,                                   // unique number
//   name: "Product Name",
//   price: 900,
//   images: ["/products/p2-1.jpg", "/products/p2-2.jpg"],  // files in public/products/
//   category: "Hoodies",
//   description: "وصف المنتج",
//   colors: [{ name: "Black", hex: "#0a0a0a" }],           // optional
//   sizes: ["M", "L", "XL"]
// }
// ---------------------------------------------------------------

// Shipping fees in EGP. Every governorate pays the default fee unless listed in SHIPPING_FEES.
export const DEFAULT_SHIPPING_FEE = 80;
export const SHIPPING_FEES = { Dakahlia: 50 };
export const getShippingFee = (governorate) => SHIPPING_FEES[governorate] ?? DEFAULT_SHIPPING_FEE;

export const GOVERNORATES = [
  "Cairo", "Giza", "Alexandria", "Qalyubia", "Dakahlia", "Sharqia", "Gharbia", "Menoufia",
  "Beheira", "Kafr El Sheikh", "Damietta", "Port Said", "Ismailia", "Suez", "North Sinai",
  "South Sinai", "Beni Suef", "Fayoum", "Minya", "Assiut", "Sohag", "Qena", "Luxor", "Aswan",
  "Red Sea", "New Valley", "Matrouh"
];

const SK_WHITE = ["/products/sk-white-1.jpg", "/products/sk-white-2.jpg"];
const SK_BLACK = ["/products/sk-black-1.jpg", "/products/sk-black-2.jpg"];

export const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "Attack on Titan Scout Regiment Hoodie",
    price: 800,
    images: [
      "/products/aot-scout-1.jpg",
      "/products/aot-scout-2.jpg",
      "/products/aot-scout-3.jpg",
      "/products/aot-scout-4.jpg"
    ],
    category: "Hoodies",
    description: "أضف لمسة من التميز لإطلالتك الشتوية مع هودي \"فيلق الاستطلاع\" (Scout Regiment) المستوحى من الأنمي الشهير هجوم العمالقة. تصميم عصري يجمع بين الأناقة والراحة الفائقة، ليمنحك الدفء الذي تحتاجه مع التعبير عن شخصيتك وشغفك بالأنمي.",
    colors: [
      { name: "Black", hex: "#0a0a0a" },
      { name: "Burgundy", hex: "#6d1a2b" },
      { name: "Off-White", hex: "#f2eee3" }
    ],
    sizes: ["M", "L", "XL", "XXL"]
  },
  {
    id: 2,
    name: "Street Killa Hoodie",
    price: 800,
    images: SK_WHITE,
    category: "Hoodies",
    description: 'ارتقِ بأسلوبك في أزياء الشارع (Streetwear) مع هودي "Street Killa" المميز. تصميم شبابي جريء يجمع بين الراحة اليومية والمظهر العصري، ليكون خيارك الأمثل لإطلالة شتوية دافئة تلفت الأنظار وتعبّر عن شخصيتك.',
    colors: [
      { name: "White", hex: "#f5f5f5", images: SK_WHITE },
      { name: "Black", hex: "#0a0a0a", images: SK_BLACK }
    ],
    sizes: ["M", "L", "XL", "XXL"]
  },
  {
    id: 3,
    name: "George Wassouf Hoodie",
    price: 800,
    images: ["/products/george-1.jpg", "/products/george-2.jpg"],
    category: "Hoodies",
    description: "هودي شتوي فريد يجمع بين الدفء والعاطفة، صُمم خصيصاً لعشاق الطرب الأصيل وسلطان الطرب جورج وسوف. قطعة مميزة تُعبر عن الإحساس والذوق العالي بتصميم عربي كلاسيكي وأنيق.",
    colors: [
      { name: "Black", hex: "#0a0a0a" }
    ],
    sizes: ["M", "L", "XL", "XXL"]
  },
  {
    id: 4,
    name: "Berserk Brand of Sacrifice Hoodie",
    price: 850,
    images: ["/products/berserk-1.jpg", "/products/berserk-2.jpg", "/products/berserk-3.jpg"],
    category: "Hoodies",
    description: 'عِش أجواء المانجا والأنمي الأسطوري "Berserk" مع هذا الهودي الشتوي المميز بتصميمه المظلم والغامض. صُمم خصيصاً لعشاق الأنمي والـ Graphic Hoodies الذين يبحثون عن مظهر عصري، مريح، وتفاصيل استثنائية تعبر عن شخصيتهم.',
    colors: [
      { name: "Black", hex: "#0a0a0a" }
    ],
    sizes: ["M", "L", "XL", "XXL"]
  }
];
