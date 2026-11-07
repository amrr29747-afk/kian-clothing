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

// Fixed shipping fee in EGP added to every order (0 = no shipping line shown).
export const SHIPPING_FEE = 0;

export const GOVERNORATES = [
  "Cairo", "Giza", "Alexandria", "Qalyubia", "Dakahlia", "Sharqia", "Gharbia", "Menoufia",
  "Beheira", "Kafr El Sheikh", "Damietta", "Port Said", "Ismailia", "Suez", "North Sinai",
  "South Sinai", "Beni Suef", "Fayoum", "Minya", "Assiut", "Sohag", "Qena", "Luxor", "Aswan",
  "Red Sea", "New Valley", "Matrouh"
];

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
  }
];
