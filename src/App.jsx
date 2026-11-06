import React, { useState, useEffect, useRef } from 'react';

const WHATSAPP_NUMBER = "201557857558";

const formatPrice = (n) => `${Number(n).toLocaleString("en-US")} EGP`;

// Add your products here. Each product looks like this:
// {
//   id: 1,
//   name: "Product Name",
//   price: 900,
//   image: "/products/product-1.jpg",   // put the file in public/products/
//   category: "Hoodies",
//   description: "وصف المنتج",
//   sizes: ["S", "M", "L", "XL", "2XL"]
// }
const INITIAL_PRODUCTS = [
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

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('L');
  const [selectedColor, setSelectedColor] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const touchStartX = useRef(null);
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('kian_cart_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('kian_favorites_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState({ details: false, care: false });

  useEffect(() => {
    try {
      localStorage.setItem('kian_cart_v2', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('kian_favorites_v2', JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  // Browser/mobile back button works: product page is tied to the URL hash
  useEffect(() => {
    const syncFromHash = () => {
      const match = window.location.hash.match(/^#product-(\d+)$/);
      const product = match ? INITIAL_PRODUCTS.find(p => p.id === Number(match[1])) : null;
      setSelectedProduct(product || null);
      if (product) {
        setSelectedColor(product.colors?.[0]?.name ?? null);
        setActiveImage(0);
      }
      window.scrollTo(0, 0);
    };
    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, []);

  // Lock background scroll while the cart is open + close it with Escape
  useEffect(() => {
    document.body.style.overflow = isCartOpen ? 'hidden' : '';
    const onKey = (e) => { if (e.key === 'Escape') setIsCartOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  const goToImage = (dir) => {
    if (!selectedProduct) return;
    const n = selectedProduct.images.length;
    setActiveImage(i => (i + dir + n) % n);
  };

  const openProduct = (product) => { window.location.hash = `product-${product.id}`; };
  const closeProduct = () => { window.location.hash = ''; };

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const addToCart = (product, size, color) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.size === size && item.color === color);
      if (existing) {
        return prev.map(item => 
          (item.id === product.id && item.size === size && item.color === color)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, size, color, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id, size, color, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id && item.size === size && item.color === color) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const getWhatsAppMessage = (items) => {
    let text = "Hello KIAN Clothing, I would like to place the following order:\n\n";
    let total = 0;
    items.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
      text += `${index + 1}. *${item.name}*\n- Size: ${item.size}\n${item.color ? `- Color: ${item.color}\n` : ''}- Quantity: ${item.quantity}\n- Price: ${formatPrice(itemTotal)}\n\n`;
    });
    text += `*Total:* ${formatPrice(total)}\n\nPlease confirm the order and shipping details!`;
    return encodeURIComponent(text);
  };

  const getSingleProductWhatsAppMessage = (product, size, color) => {
    const text = `Hello KIAN Clothing, I would like to order this item:\n\n- *Product:* ${product.name}\n- *Size:* ${size}\n${color ? `- *Color:* ${color}\n` : ''}- *Price:* ${formatPrice(product.price)}\n\nPlease confirm availability and shipping details!`;
    return encodeURIComponent(text);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between selection:bg-white selection:text-black">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-zinc-800 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="w-10" />

          <img
            src="/logo.png"
            alt="KIAN Clothing"
            onClick={closeProduct}
            className="h-11 sm:h-12 w-auto cursor-pointer select-none hover:opacity-80 transition-opacity"
          />

          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <button 
              onClick={() => setIsCartOpen(true)}
              aria-label="Shopping cart"
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
            <section className="relative overflow-hidden rounded-3xl border border-zinc-800 mb-12 px-6 py-14 sm:py-24 text-center bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.12),_transparent_65%)]">
              <img
                src="/logo.png"
                alt="KIAN Clothing"
                className="mx-auto w-64 sm:w-[28rem] max-w-full h-auto drop-shadow-[0_0_40px_rgba(255,255,255,0.18)]"
              />
              <p className="mt-8 text-zinc-400 tracking-[0.35em] text-xs sm:text-sm uppercase">New Streetwear Collection</p>
              <button
                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                className="mt-8 bg-white text-black px-10 py-3 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-zinc-200 transition-all active:scale-[0.98]"
              >
                Shop Now
              </button>
            </section>
            <div id="products" className="scroll-mt-24 flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-zinc-800">
              <div>
                <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight">Products</h1>
                <p className="text-zinc-400 text-sm mt-2">The new streetwear collection by KIAN CLOTHING</p>
              </div>
              <span className="text-sm text-zinc-500 mt-4 md:mt-0 tabular-nums">{INITIAL_PRODUCTS.length} Items</span>
            </div>

            {INITIAL_PRODUCTS.length === 0 && (
              <div className="border border-dashed border-zinc-800 rounded-2xl py-24 text-center">
                <p className="text-zinc-300 font-bold tracking-widest uppercase">Coming Soon</p>
                <p className="text-zinc-500 text-sm mt-2">New products are on the way.</p>
              </div>
            )}

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
              {INITIAL_PRODUCTS.map((product) => (
                <div 
                  key={product.id}
                  onClick={() => openProduct(product)}
                  className="group cursor-pointer flex flex-col bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden hover:border-zinc-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(255,255,255,0.18)]"
                >
                  <div className="relative aspect-[3/4] bg-zinc-900 overflow-hidden">
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                    />
                    {product.images[1] && (
                      <img
                        src={product.images[1]}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      />
                    )}
                    <button 
                      onClick={(e) => toggleFavorite(product.id, e)}
                      aria-label="Add to favorites"
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
                    <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-1">{product.category}</span>
                    <h3 className="font-bold text-sm sm:text-base text-zinc-100 group-hover:text-white line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-black text-sm sm:text-lg text-white tabular-nums">
                        {formatPrice(product.price)}
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
              onClick={closeProduct}
              className="flex items-center space-x-2 rtl:space-x-reverse text-zinc-400 hover:text-white mb-6 transition-colors font-medium text-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to store</span>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              <div className="space-y-4">
                <div
                  className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl select-none"
                  onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
                  onTouchEnd={(e) => {
                    if (touchStartX.current === null) return;
                    const dx = e.changedTouches[0].clientX - touchStartX.current;
                    touchStartX.current = null;
                    if (Math.abs(dx) > 40) goToImage(dx < 0 ? 1 : -1);
                  }}
                >
                  {selectedProduct.images.map((src, i) => (
                    <img
                      key={src}
                      src={src}
                      alt={`${selectedProduct.name} - view ${i + 1}`}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${i === activeImage ? 'opacity-100' : 'opacity-0'}`}
                    />
                  ))}
                  {selectedProduct.images.length > 1 && (
                    <>
                      <button
                        aria-label="Previous image"
                        onClick={() => goToImage(-1)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 hover:bg-black/80 transition-all flex items-center justify-center"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                      </button>
                      <button
                        aria-label="Next image"
                        onClick={() => goToImage(1)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 hover:bg-black/80 transition-all flex items-center justify-center"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                      </button>
                      <span className="absolute bottom-3 right-3 text-xs tabular-nums bg-black/50 backdrop-blur-md border border-white/10 rounded-full px-3 py-1">
                        {activeImage + 1} / {selectedProduct.images.length}
                      </span>
                    </>
                  )}
                </div>

                {selectedProduct.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-3">
                    {selectedProduct.images.map((src, i) => (
                      <button
                        key={src}
                        onClick={() => setActiveImage(i)}
                        aria-label={`View image ${i + 1}`}
                        className={`aspect-[3/4] rounded-lg overflow-hidden border transition-all ${i === activeImage ? 'border-white' : 'border-zinc-800 opacity-60 hover:opacity-100'}`}
                      >
                        <img src={src} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col space-y-6">
                <div>
                  <span className="text-xs uppercase tracking-widest text-zinc-500 font-bold">{selectedProduct.category}</span>
                  <h1 className="text-3xl font-black mt-1 text-white">{selectedProduct.name}</h1>
                  <p className="text-2xl tabular-nums font-bold mt-2 text-white">{formatPrice(selectedProduct.price)}</p>
                </div>

                {selectedProduct.colors?.length > 0 && (
                  <div className="space-y-3 border-t border-zinc-800 pt-6">
                    <label className="text-sm font-bold text-zinc-300 block">
                      Color: <span className="text-white">{selectedColor}</span>
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {selectedProduct.colors.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => setSelectedColor(c.name)}
                          aria-label={c.name}
                          title={c.name}
                          style={{ backgroundColor: c.hex }}
                          className={`w-10 h-10 rounded-full border transition-all transform active:scale-95 ${selectedColor === c.name ? 'ring-2 ring-white ring-offset-2 ring-offset-black border-transparent' : 'border-zinc-600 hover:border-zinc-400'}`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3 border-t border-zinc-800 pt-6">
                  <label className="text-sm font-bold text-zinc-300 block">Size:</label>
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
                    onClick={() => addToCart(selectedProduct, selectedSize, selectedColor)}
                    className="w-full bg-white text-black hover:bg-zinc-200 py-4 rounded-xl font-black text-base uppercase tracking-wider transition-all transform active:scale-[0.98] shadow-xl"
                  >
                    Add to Cart
                  </button>

                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${getSingleProductWhatsAppMessage(selectedProduct, selectedSize, selectedColor)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-xl font-bold text-base flex items-center justify-center space-x-2 rtl:space-x-reverse transition-all transform active:scale-[0.98] shadow-xl"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.005 3.67 3.748-.983z"/>
                    </svg>
                    <span>Order via WhatsApp</span>
                  </a>
                </div>

                <div className="border-t border-zinc-800 pt-6 space-y-4">
                  <div className="border border-zinc-900 rounded-xl overflow-hidden bg-zinc-950">
                    <button 
                      onClick={() => setIsAccordionOpen(p => ({ ...p, details: !p.details }))}
                      className="w-full p-4 flex justify-between items-center text-start font-bold text-sm text-zinc-300"
                    >
                      <span>PRODUCT DETAILS</span>
                      <span>{isAccordionOpen.details ? '-' : '+'}</span>
                    </button>
                    {isAccordionOpen.details && (
                      <div className="p-4 border-t border-zinc-900 text-xs text-zinc-400 space-y-2 leading-relaxed">
                        <p dir="rtl">{selectedProduct.description}</p>
                        <p>• Ultra-soft cotton fabric, shrink resistant.</p>
                      </div>
                    )}
                  </div>

                  <div className="border border-zinc-900 rounded-xl overflow-hidden bg-zinc-950">
                    <button 
                      onClick={() => setIsAccordionOpen(p => ({ ...p, care: !p.care }))}
                      className="w-full p-4 flex justify-between items-center text-start font-bold text-sm text-zinc-300"
                    >
                      <span>CARE & MAINTENANCE</span>
                      <span>{isAccordionOpen.care ? '-' : '+'}</span>
                    </button>
                    {isAccordionOpen.care && (
                      <div className="p-4 border-t border-zinc-900 text-xs text-zinc-400 space-y-2 leading-relaxed">
                        <p>• Wash in cold water (30°C).</p>
                        <p>• Do not use bleach.</p>
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
                  <h2 className="text-xl font-black uppercase tracking-wider">Shopping Cart</h2>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    aria-label="Close"
                    className="p-2 text-zinc-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="mt-6 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                  {cart.length === 0 ? (
                    <p className="text-zinc-500 text-center py-10">Your cart is empty.</p>
                  ) : (
                    cart.map((item, idx) => (
                      <div key={`${item.id}-${item.size}-${item.color}-${idx}`} className="flex items-center space-x-4 rtl:space-x-reverse bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                        <img src={item.images[0]} alt={item.name} className="w-16 h-20 object-cover rounded-lg" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm text-white truncate">{item.name}</h4>
                          <p className="text-xs text-zinc-400 mt-1">Size: <span className="text-white font-bold">{item.size}</span>{item.color && <> · Color: <span className="text-white font-bold">{item.color}</span></>}</p>
                          <p className="text-sm font-bold tabular-nums text-zinc-200 mt-1">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse border border-zinc-700 rounded-lg p-1 bg-black">
                          <button onClick={() => updateQuantity(item.id, item.size, item.color, -1)} className="px-2 py-1 text-xs font-bold text-zinc-400 hover:text-white">-</button>
                          <span className="text-xs font-bold tabular-nums px-1">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.size, item.color, 1)} className="px-2 py-1 text-xs font-bold text-zinc-400 hover:text-white">+</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {cart.length > 0 && (
                <div className="border-t border-zinc-800 pt-6 space-y-4">
                  <div className="flex justify-between items-center text-lg font-black tabular-nums">
                    <span>Total:</span>
                    <span>{formatPrice(cartTotal)}</span>
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
                    <span>Checkout via WhatsApp</span>
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
            <img src="/logo.png" alt="KIAN Clothing" className="h-10 w-auto" />
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
