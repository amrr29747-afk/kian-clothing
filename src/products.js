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

const CL_WHITE = ["/products/collage-white-1.jpg", "/products/collage-white-2.jpg"];
const CL_BURGUNDY = ["/products/collage-burgundy-1.jpg", "/products/collage-burgundy-2.jpg"];

const WASHED = ["/products/washed-1.jpg", "/products/washed-2.jpg"];

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
  },
  {
    id: 5,
    name: "Arabic Collage Hoodie",
    price: 750,
    images: CL_WHITE,
    category: "Hoodies",
    description: "احصل على الدفء والأناقة معاً في شتاء هذا العام مع هودي كولاج الجريء والمميز. تصميم مفعم بالإحساس والعبارات الشبابية العصرية، ليمنحك مظهراً لافتاً ومختلفاً يجمع بين الفن العربي وأزياء الشارع (Streetwear).",
    colors: [
      { name: "White", hex: "#f5f5f5", images: CL_WHITE },
      { name: "Burgundy", hex: "#6d1a2b", images: CL_BURGUNDY }
    ],
    sizes: ["M", "L", "XL", "XXL"]
  },
  {
    id: 6,
    name: "Washed Vintage Hoodie",
    price: 750,
    images: WASHED,
    category: "Hoodies",
    description: "أضف لمسة غامضة وجريئة لمظهرك الشتوي مع هودي المغسول بتأثير الـ Vintage الأنيق. قطعة استثنائية صُممت بعناية لعشاق أزياء الشارع (Streetwear)، تجمع بين العبارات العربية المعبرة وتصميم الكولاج الفني الرائع على الظهر.",
    colors: [
      { name: "Washed Black", hex: "#2b2b2b" }
    ],
    sizes: ["M", "L", "XL", "XXL"]
  },
  {
    id: 7,
    name: "Wegz Al-Hazz Collage Hoodie",
    price: 800,
    images: ["/products/wegz-1.jpg", "/products/wegz-2.jpg"],
    category: "Hoodies",
    description: "إصدار مميز ومخصص لعشاق الراب المصري ونجم الجيل ويجز! هودي شتوي بأعلى جودة يجمع بين العبارات الأيقونية وتصميم الكولاج الجرافيكي الجريء، ليمنحك مظهر ستريت وير (Streetwear) شبابي وعصري في شتاء هذا العام.",
    colors: [
      { name: "Black", hex: "#0a0a0a" }
    ],
    sizes: ["M", "L", "XL", "XXL"]
  },
  {
    id: 8,
    name: "Tommy Graphic Collage Hoodie",
    price: 750,
    images: ["/products/tommy-1.jpg", "/products/tommy-2.jpg"],
    category: "Hoodies",
    description: "إصدار شتوي متميز يدمج بين مشاعر النوستالجيا وأسلوب الجرافيك الـ Streetwear العصري. تصميم يعبر عن الكلمات الصادقة والإحساس العالي، ليكون إضافتك المثالية لإطلالة شتوية لافتة ودافئة.",
    colors: [
      { name: "Black", hex: "#0a0a0a" }
    ],
    sizes: ["M", "L", "XL", "XXL"]
  },
  {
    id: 9,
    name: "Bugs Bunny Stay Cool Hoodie",
    price: 750,
    images: ["/products/bugs-burgundy.jpg"],
    category: "Hoodies",
    description: "أضف لمسة مرحة وعصرية لإطلالتك الشتوية مع هودي باجز باني الكرتوني المميز! قطعة تجمع بين الستايل الشبابي الجذاب والراحة الفائقة، لتمنحك مظهراً كاجوال لافتاً ومناسباً للخروج اليومي والجامعة.",
    colors: [
      { name: "Burgundy", hex: "#6d1a2b", images: ["/products/bugs-burgundy.jpg"] },
      { name: "Black", hex: "#0a0a0a", images: ["/products/bugs-black.jpg"] },
      { name: "Light Grey", hex: "#b9bab6", images: ["/products/bugs-grey.jpg"] }
    ],
    sizes: ["M", "L", "XL", "XXL"]
  },
  {
    id: 10,
    name: "Amr Diab Tamally Ma3ak Hoodie",
    price: 800,
    images: ["/products/amr-1.jpg", "/products/amr-2.jpg"],
    category: "Hoodies",
    description: 'عبّر عن ذوقك الاستثنائي وحبك للهضبة عمرو دياب مع هذا الهودي الشتوي الفخم. تصميم كولاج عالي الجودة يوثق إحدى أشهر أيقونات الموسيقى العربية "تملي معاك"، ليمنحك مظهر ستريت وير (Streetwear) عصري ومفعم بالنوستالجيا والأناقة.',
    colors: [
      { name: "Black", hex: "#0a0a0a" }
    ],
    sizes: ["M", "L", "XL", "XXL"]
  },
  {
    id: 11,
    name: "Amr Diab Music Player Hoodie",
    price: 800,
    images: ["/products/amr-player-white.jpg"],
    category: "Hoodies",
    description: "إصدار شتوي أنيق ومودرن مخصص لعشاق الهضبة عمرو دياب! يتميز بتصميم هادئ وجمالي يدمج بين بساطة الخطوط من الأمام وروعة تفاصيل كلمات الأغاني وصور الألبومات من الظهر بأسلوب مشغل الموسيقى (Music Player Style)، ليمنحك مظهر كاجوال مفعم بالدفء والذوق الرفيع.",
    colors: [
      { name: "White", hex: "#f5f5f5", images: ["/products/amr-player-white.jpg"] },
      { name: "Black", hex: "#0a0a0a", images: ["/products/amr-player-black.jpg"] }
    ],
    sizes: ["M", "L", "XL", "XXL"]
  },
  {
    id: 12,
    name: "Mousa Sam Khayr W Shar Hoodie",
    price: 750,
    images: ["/products/mousa-1.jpg", "/products/mousa-2.jpg"],
    category: "Hoodies",
    description: "إصدار شتوي مغسول (Washed Vintage) مميز مخصص لعشاق موسى سام وأغانيه الفلسفية العميقة. قطعة فنية تعبر عن الجرأة والقوة، تجمع بين القماش المغسول الفخم وتصميم الجرافيك الكولاج الغني بالعبارات المعبرة لإطلالة ستريت وير (Streetwear) غير تقليدية.",
    colors: [
      { name: "Washed Black", hex: "#2b2b2b" }
    ],
    sizes: ["M", "L", "XL", "XXL"]
  }
];
