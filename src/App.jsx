import React, { useState, useEffect } from 'react';

const WHATSAPP_NUMBER = "201557857558";

const INITIAL_PRODUCTS = [
  {
  },
  {
    id: 2,
    name: "Billie Eilish Oversized Hoodie",
    price: 850,
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=60",
    category: "Hoodies",
    description: "تصميم أوفرسايز مميز مع طباعة خلفية عصرية ومقاومة للغسيل المتكرر.",
    sizes: ["S", "M", "L", "XL", "2XL"]
  },
  {
    id: 3,
    name: "BUBBLES HOODIE - Stronger",
    price: 850,
    image: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&auto=format&fit=crop&q=60",
    category: "Hoodies",
    description: "هودي أنيق باللون الرمادي الداكن مع تطريز عالي الدقة وتصميم عصري حاد.",
    sizes: ["S", "M", "L", "XL", "2XL"]
  },
  {
    id: 4,
    name: "ETHNIC Burgundy Hoodie",
    price: 999,
    image: "https://images.unsplash.com/photo-1513782192234-580d437b6798?w=800&auto=format&fit=crop&q=60",
    category: "Hoodies",
    description: "هودي باللون النبيذي الفخم مع طباعة عرقية وعبارة تحفيزية مميزة على الظهر.",
    sizes: ["S", "M", "L", "XL", "2XL"]
  },
  {
    id: 5,
    name: "Plain Premium Everyday Hoodie",
    price: 700,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=60",
    category: "Basic",
    description: "هودي سادة عالي الجودة مناسب للاستخدام اليومي بتلبيس مريح ومقاسات مظبوطة.",
    sizes: ["S", "M", "L", "XL", "2XL"]
  },
  {
    id: 6,
    name: "BATMAN Minimalist Hoodie",
    price: 1200,
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop&q=60",
    category: "Limited Edition",
    description: "إصدار محدود بتصميم باتمان اللامع ومبسط على الصدر والمقاسات مريحة جداً.",
    sizes: ["S", "M", "L", "XL", "2XL"]
  }
];

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('L');
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('kian_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [favorites, setFavorites] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState({ details: false, care: false });

  useEffect(() => {
    try {
      localStorage.setItem('kian_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const addToCart = (product, size) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.size === size);
      if (existing) {
        return prev.map(item => 
          (item.id === product.id && item.size === size)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, size, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id, size, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id && item.size === size) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const getWhatsAppMessage = (items) => {
    let text = "أهلاً KIAN Clothing، حابب أطلب الطلب التالي:\n\n";
    let total = 0;
    items.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
      text += `${index + 1}. *${item.name}*\n- المقاس: ${item.size}\n- العدد: ${item.quantity}\n- السعر: ${itemTotal} LE\n\n`;
    });
    text += `*الإجمالي:* ${total} LE EGP\n\nبرجاء تأكيد الطلب وتحديد بيانات الشحن!`;
    return encodeURIComponent(text);
  };

  const getSingleProductWhatsAppMessage = (product, size) => {
    const text = `أهلاً KIAN Clothing، حابب أطلب المنتج ده:\n\n- *اسم المنتج:* ${product.name}\n- *المقاس:* ${size}\n- *السعر:* ${product.price} LE EGP\n\nبرجاء تأكيد التوفر وبيانات الشحن!`;
    return encodeURIComponent(text);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between font-sans selection:bg-white selection:text-black">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-zinc-800 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <button className="p-2 hover:opacity-70 transition-opacity">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          <div 
            onClick={() => setSelectedProduct(null)} 
            className="cursor-pointer flex items-center space-x-3 rtl:space-x-reverse group"
          >
            <div className="w-9 h-9 rounded-full border border-zinc-700 flex items-center justify-center bg-zinc-900 group-hover:border-white transition-all">
              <span className="font-extrabold text-lg text-white">K</span>
            </div>
            <span className="font-black text-2xl tracking-widest text-white uppercase">KIAN</span>
          </div>

          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:opacity-70 transition-all transform active:scale-95"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-black font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                  {totalCartItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {!selectedProduct ? (
          <div>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-zinc-800">
              <div>
                <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight">Products</h1>
                <p className="text-zinc-400 text-sm mt-2">تشكيلة الستريت وير الجديدة لـ KIAN CLOTHING</p>
              </div>
              <span className="text-sm text-zinc-500 mt-4 md:mt-0 font-mono">{INITIAL_PRODUCTS.length} Items</span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
              {INITIAL_PRODUCTS.map((product) => (
                <div 
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="group cursor-pointer flex flex-col bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden hover:border-zinc-700 transition-all duration-300 hover:shadow-2xl"
                >
                  <div className="relative aspect-[3/4] bg-zinc-900 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <button 
                      onClick={(e) => toggleFavorite(product.id, e)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-black/80 transition-all"
                    >
                      <svg 
                        className={`w-5 h-5 ${favorites.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                  <div className="p-4 flex flex-col justify-between flex-1">
                    <h3 className="font-bold text-sm sm:text-base text-zinc-100 group-hover:text-white line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-black text-sm sm:text-lg text-white font-mono">
                        LE {product.price.toFixed(2)} EGP
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-blur-zoom max-w-5xl mx-auto">
            <button 
              onClick={() => setSelectedProduct(null)}
              className="flex items-center space-x-2 rtl:space-x-reverse text-zinc-400 hover:text-white mb-6 transition-colors font-medium text-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>الرجوع للمتجر</span>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              <div className="space-y-4">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl">
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-6">
                <div>
                  <span className="text-xs uppercase tracking-widest text-zinc-500 font-bold">{selectedProduct.category}</span>
                  <h1 className="text-3xl font-black mt-1 text-white">{selectedProduct.name}</h1>
                  <p className="text-2xl font-mono font-bold mt-2 text-white">LE {selectedProduct.price.toFixed(2)} EGP</p>
                </div>

                <div className="space-y-3 border-t border-zinc-800 pt-6">
                  <label className="text-sm font-bold text-zinc-300 block">المقاس (Size):</label>
                  <div className="flex flex-wrap gap-3">
                    {selectedProduct.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-5 py-3 rounded-lg border font-bold text-sm transition-all transform active:scale-95 ${
                          selectedSize === size
                            ? 'bg-white text-black border-white shadow-lg'
                            : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-600'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <button
                    onClick={() => addToCart(selectedProduct, selectedSize)}
                    className="w-full bg-white text-black hover:bg-zinc-200 py-4 rounded-xl font-black text-base uppercase tracking-wider transition-all transform active:scale-98 shadow-xl"
                  >
                    Add to Cart
                  </button>

                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${getSingleProductWhatsAppMessage(selectedProduct, selectedSize)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-xl font-bold text-base flex items-center justify-center space-x-2 rtl:space-x-reverse transition-all transform active:scale-98 shadow-xl"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.005 3.67 3.748-.983z"/>
                    </svg>
                    <span>اطلب الآن عبر واتساب</span>
                  </a>
                </div>

                <div className="border-t border-zinc-800 pt-6 space-y-4">
                  <div className="border border-zinc-900 rounded-xl overflow-hidden bg-zinc-950">
                    <button 
                      onClick={() => setIsAccordionOpen(p => ({ ...p, details: !p.details }))}
                      className="w-full p-4 flex justify-between items-center text-left font-bold text-sm text-zinc-300"
                    >
                      <span>PRODUCT DETAILS</span>
                      <span>{isAccordionOpen.details ? '-' : '+'}</span>
                    </button>
                    {isAccordionOpen.details && (
                      <div className="p-4 border-t border-zinc-900 text-xs text-zinc-400 space-y-2 leading-relaxed">
                        <p>{selectedProduct.description}</p>
                        <p>• خامة قطنية فائقة النعومة مقاوِمة للانكماش.</p>
                      </div>
                    )}
                  </div>

                  <div className="border border-zinc-900 rounded-xl overflow-hidden bg-zinc-950">
                    <button 
                      onClick={() => setIsAccordionOpen(p => ({ ...p, care: !p.care }))}
                      className="w-full p-4 flex justify-between items-center text-left font-bold text-sm text-zinc-300"
                    >
                      <span>CARE & MAINTENANCE</span>
                      <span>{isAccordionOpen.care ? '-' : '+'}</span>
                    </button>
                    {isAccordionOpen.care && (
                      <div className="p-4 border-t border-zinc-900 text-xs text-zinc-400 space-y-2 leading-relaxed">
                        <p>• يُغسل بماء بارد (30 درجة مئوية).</p>
                        <p>• تجنب استخدام المبيضات.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div 
            onClick={() => setIsCartOpen(false)} 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-zinc-950 border-l border-zinc-800 text-white p-6 flex flex-col justify-between shadow-2xl">
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-zinc-800">
                  <h2 className="text-xl font-black uppercase tracking-wider">سلة المشتريات</h2>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="p-2 text-zinc-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="mt-6 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                  {cart.length === 0 ? (
                    <p className="text-zinc-500 text-center py-10">سلة المشتريات فارغة حالياً.</p>
                  ) : (
                    cart.map((item, idx) => (
                      <div key={`${item.id}-${item.size}-${idx}`} className="flex items-center space-x-4 rtl:space-x-reverse bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                        <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded-lg" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm text-white truncate">{item.name}</h4>
                          <p className="text-xs text-zinc-400 mt-1">المقاس: <span className="text-white font-bold">{item.size}</span></p>
                          <p className="text-sm font-bold font-mono text-zinc-200 mt-1">LE {item.price * item.quantity} EGP</p>
                        </div>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse border border-zinc-700 rounded-lg p-1 bg-black">
                          <button onClick={() => updateQuantity(item.id, item.size, -1)} className="px-2 py-1 text-xs font-bold text-zinc-400 hover:text-white">-</button>
                          <span className="text-xs font-bold font-mono px-1">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.size, 1)} className="px-2 py-1 text-xs font-bold text-zinc-400 hover:text-white">+</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {cart.length > 0 && (
                <div className="border-t border-zinc-800 pt-6 space-y-4">
                  <div className="flex justify-between items-center text-lg font-black font-mono">
                    <span>الإجمالي:</span>
                    <span>LE {cartTotal.toFixed(2)} EGP</span>
                  </div>

                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${getWhatsAppMessage(cart)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-xl font-bold text-base flex items-center justify-center space-x-2 rtl:space-x-reverse shadow-xl transition-all"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.005 3.67 3.748-.983z"/>
                    </svg>
                    <span>إتمام الطلب عبر واتساب</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-zinc-950 border-t border-zinc-900 py-10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <span className="font-black tracking-widest text-lg">KIAN CLOTHING</span>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-500 text-xs">© 2026 Kian. All rights reserved.</span>
          </div>

          <div className="flex items-center space-x-6 rtl:space-x-reverse">
            <a 
              href="https://www.facebook.com/share/19xoFp4QoS/?mibextid=wwXIfr" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-zinc-400 hover:text-white text-sm font-medium transition-colors"
            >
              Facebook
            </a>
            <a 
              href="https://www.instagram.com/kian_brand_?srtk=MXcyN2s2bGt0MjB3ZA==" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-zinc-400 hover:text-white text-sm font-medium transition-colors"
            >
              Instagram
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
