import React, { useState, useEffect, useRef } from 'react';
import { INITIAL_PRODUCTS, GOVERNORATES, getShippingFee } from './products.js';

const WHATSAPP_NUMBER = "201557857558";

const formatPrice = (n) => `${Number(n).toLocaleString("en-US")} EGP`;



const inputCls = "w-full bg-zinc-900 border border-zinc-800 focus:border-white rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-colors";

function Field({ label, optional, children }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
        {label}{optional && <span className="text-zinc-600 normal-case font-normal"> (optional)</span>}
      </span>
      {children}
    </label>
  );
}

function CheckoutForm({ items, subtotal, shipping, total, form, setForm, onSubmit, submitting, error, onBack }) {
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <button type="button" onClick={onBack} className="text-sm text-zinc-400 hover:text-white">← Back to cart</button>
        <h2 className="text-lg font-black uppercase tracking-wider">Checkout</h2>
      </div>

      <Field label="Full name">
        <input required minLength={3} maxLength={80} dir="auto" autoComplete="name" value={form.name} onChange={set('name')} className={inputCls} placeholder="Your full name" />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Phone">
          <input required type="tel" inputMode="tel" autoComplete="tel" pattern="(\+?20|0)?1[0125][0-9]{8}" title="Egyptian mobile number, e.g. 01012345678" value={form.phone} onChange={set('phone')} className={inputCls} placeholder="01XXXXXXXXX" />
        </Field>
        <Field label="Second phone" optional>
          <input type="tel" inputMode="tel" pattern="(\+?20|0)?1[0125][0-9]{8}" title="Egyptian mobile number, e.g. 01012345678" value={form.phone2} onChange={set('phone2')} className={inputCls} placeholder="01XXXXXXXXX" />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Governorate">
          <select required value={form.governorate} onChange={set('governorate')} className={inputCls}>
            <option value="" disabled>Select...</option>
            {GOVERNORATES.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </Field>
        <Field label="City / Area">
          <input required minLength={2} maxLength={60} dir="auto" value={form.city} onChange={set('city')} className={inputCls} placeholder="e.g. Mansoura" />
        </Field>
      </div>

      <Field label="Full address">
        <textarea required minLength={8} maxLength={250} rows={3} dir="auto" autoComplete="street-address" value={form.address} onChange={set('address')} className={inputCls + ' resize-none'} placeholder="Street, building, floor, apartment, landmark" />
      </Field>

      <Field label="Notes" optional>
        <textarea maxLength={300} rows={2} dir="auto" value={form.notes} onChange={set('notes')} className={inputCls + ' resize-none'} placeholder="Anything we should know?" />
      </Field>

      {/* honeypot: real customers never see or fill this */}
      <input type="text" name="hp_check" id="hp_check" tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.website} onChange={set('website')} className="absolute -left-[9999px] h-0 w-0 opacity-0" />

      <div className="border-t border-zinc-800 pt-4 space-y-2 text-sm">
        {items.map((it, i) => (
          <div key={i} className="flex justify-between gap-3 text-zinc-400">
            <span className="truncate">{it.quantity} × {it.name} ({it.color ? it.color + ' / ' : ''}{it.size})</span>
            <span className="tabular-nums shrink-0">{formatPrice(it.price * it.quantity)}</span>
          </div>
        ))}
        <div className="flex justify-between text-zinc-400">
          <span>Shipping</span>
          <span className="tabular-nums">{form.governorate ? formatPrice(shipping) : 'Select governorate'}</span>
        </div>
        <div className="flex justify-between text-lg font-black tabular-nums pt-2">
          <span>Total</span><span>{formatPrice(total)}</span>
        </div>
        <p className="text-xs text-zinc-500">Payment: cash on delivery.</p>
      </div>

      {error && (
        <div role="alert" className="text-sm text-red-300 bg-red-950/50 border border-red-900 rounded-xl px-4 py-3">{error}</div>
      )}

      <button type="submit" disabled={submitting} className="w-full bg-white text-black hover:bg-zinc-200 disabled:opacity-60 disabled:cursor-not-allowed py-4 rounded-xl font-black text-base uppercase tracking-wider transition-all active:scale-[0.98]">
        {submitting ? 'Placing order...' : 'Place Order'}
      </button>
    </form>
  );
}

function OrderSuccess({ orderId, onClose }) {
  return (
    <div className="flex flex-col items-center text-center gap-5 py-16">
      <div className="w-16 h-16 rounded-full border border-white/30 flex items-center justify-center">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
      </div>
      <h2 className="text-2xl font-black uppercase tracking-wider">Order Placed</h2>
      <p className="text-zinc-400 text-sm max-w-xs">Thank you for shopping with KIAN. We will contact you on your phone number to confirm your order and arrange delivery.</p>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-6 py-3">
        <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Order number</p>
        <p className="font-black tracking-widest tabular-nums">{orderId}</p>
      </div>
      <button onClick={onClose} className="mt-2 bg-white text-black hover:bg-zinc-200 px-10 py-3 rounded-full font-bold text-sm uppercase tracking-widest transition-all active:scale-[0.98]">Continue Shopping</button>
    </div>
  );
}

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('L');
  const [selectedColor, setSelectedColor] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const touchStartX = useRef(null);
  const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart' | 'form' | 'done'
  const [form, setForm] = useState({ name: '', phone: '', phone2: '', governorate: '', city: '', address: '', notes: '', website: '' });
  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [orderId, setOrderId] = useState('');
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
    setCheckoutStep('cart');
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


  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const shippingFee = form.governorate ? getShippingFee(form.governorate) : 0;
  const grandTotal = cartTotal + shippingFee;

  const closeCart = () => {
    setIsCartOpen(false);
    setCheckoutStep('cart');
    setOrderError('');
  };

  const submitOrder = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setOrderError('');
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: form,
          website: form.website,
          items: cart.map(i => ({ id: i.id, size: i.size, color: i.color, quantity: i.quantity })),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Server error (${res.status}). Please try again or contact us on WhatsApp.`);
      setOrderId(data.orderId);
      setCart([]);
      setCheckoutStep('done');
    } catch (err) {
      setOrderError(err.message || 'Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

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
              onClick={() => { setCheckoutStep('cart'); setIsCartOpen(true); }}
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

                  <button
                    onClick={() => { addToCart(selectedProduct, selectedSize, selectedColor); setCheckoutStep('form'); }}
                    className="w-full border border-white/30 hover:bg-white/10 text-white py-4 rounded-xl font-bold text-base uppercase tracking-wider transition-all transform active:scale-[0.98]"
                  >
                    Buy Now
                  </button>
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
            onClick={closeCart} 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-zinc-950 border-l border-zinc-800 text-white p-6 flex flex-col justify-between shadow-2xl overflow-y-auto">
              {checkoutStep === 'form' && (
                <CheckoutForm
                  items={cart}
                  subtotal={cartTotal}
                  shipping={shippingFee}
                  total={grandTotal}
                  form={form}
                  setForm={setForm}
                  onSubmit={submitOrder}
                  submitting={submitting}
                  error={orderError}
                  onBack={() => { setCheckoutStep('cart'); setOrderError(''); }}
                />
              )}
              {checkoutStep === 'done' && <OrderSuccess orderId={orderId} onClose={closeCart} />}
              {checkoutStep === 'cart' && (
              <>
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-zinc-800">
                  <h2 className="text-xl font-black uppercase tracking-wider">Shopping Cart</h2>
                  <button 
                    onClick={closeCart}
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
                    <span>Subtotal:</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>

                  <button
                    onClick={() => setCheckoutStep('form')}
                    className="w-full bg-white text-black hover:bg-zinc-200 py-4 rounded-xl font-black text-base uppercase tracking-wider shadow-xl transition-all active:scale-[0.98]"
                  >
                    Checkout
                  </button>
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${getWhatsAppMessage(cart)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center text-xs text-zinc-500 hover:text-white underline underline-offset-4 transition-colors"
                  >
                    or order via WhatsApp
                  </a>
                </div>
              )}
              </>
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
