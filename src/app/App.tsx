import { useState, useEffect, useRef } from "react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import sunflowerImg from "@/imports/Solei_Sunflower.jpg";
import pinkTulipImg from "@/imports/Pipecleaner_flower_bouquet___.jpg";
import mixedPastelImg from "@/imports/pipe_cleaners_bouquet.jpg";
import pinkLilyImg from "@/imports/download.jpg";
import blueDaisyImg from "@/imports/download__2_.jpg";
import blueLilyImg from "@/imports/download__1_.jpg";
import {
  ShoppingBag,
  Search,
  X,
  Menu,
  ChevronRight,
  Minus,
  Plus,
  Trash2,
  Heart,
  Star,
  MapPin,
  Phone,
  Instagram,
  Facebook,
  MessageCircle,
  Check,
  ChevronDown,
  Filter,
  Cake,
  Gem,
  HeartHandshake,
  Crown,
  Sparkles,
  Gift,
  Clock,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────── */
type Page = "home" | "flowers" | "new-arrivals" | "about" | "contact" | "product" | "cart" | "checkout" | "confirmation";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  color: string;
  flowerType: string;
  occasions: string[];
  isNewArrival: boolean;
  description: string;
  stock: boolean;
  badge?: string;
}

interface CartItem extends Product {
  qty: number;
}

/* ─── Product Data ──────────────────────────────────── */
const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Soleil Sunflower Bouquet",
    price: 2200,
    image: sunflowerImg,
    color: "Yellow",
    flowerType: "Sunflower",
    occasions: ["Birthday", "Just Because", "Mother's Day"],
    isNewArrival: true,
    description: "Three lush fuzzy-wire sunflowers paired with white daisies and trailing green vines, wrapped in kraft paper with a \"Just For You\" ribbon. A warm, cheerful bouquet that lasts forever.",
    stock: true,
    badge: "New",
  },
  {
    id: 2,
    name: "Blush Garden Bouquet",
    price: 1800,
    image: pinkTulipImg,
    color: "Pink",
    flowerType: "Tulip",
    occasions: ["Anniversary", "Valentine's Day", "Just Because"],
    isNewArrival: true,
    description: "A lush mix of soft pink tulips and daisy blooms handcrafted from chenille wire, wrapped in dreamy ivory paper with a blush satin ribbon. A gentle \"for you\" card included.",
    stock: true,
    badge: "Bestseller",
  },
  {
    id: 3,
    name: "Pastel Dream Bouquet",
    price: 2500,
    image: mixedPastelImg,
    color: "Mixed",
    flowerType: "Mixed",
    occasions: ["Wedding", "Anniversary", "Mother's Day"],
    isNewArrival: false,
    description: "Purple lilies, pink tulips, yellow tulips, and delicate white blooms — a pastel medley wrapped in lavender paper with a sheer tulle finish. Elegant enough for any occasion.",
    stock: true,
  },
  {
    id: 4,
    name: "Rose Lily Bouquet",
    price: 2000,
    image: pinkLilyImg,
    color: "Pink",
    flowerType: "Rose",
    occasions: ["Valentine's Day", "Anniversary", "Birthday"],
    isNewArrival: true,
    description: "Full pink lilies surrounded by delicate cherry blossom accents, wrapped in peach paper with pearl-trimmed tulle and an organza bow. Romance, handcrafted.",
    stock: true,
    badge: "New",
  },
  {
    id: 5,
    name: "Sky & White Daisy Bundle",
    price: 1500,
    image: blueDaisyImg,
    color: "Blue",
    flowerType: "Daisy",
    occasions: ["Birthday", "Just Because"],
    isNewArrival: false,
    description: "A cheerful cloud of blue and white chenille daisies, densely packed into a satisfying round bouquet with white organza wrap. Perfect for a friend who loves something different.",
    stock: true,
  },
  {
    id: 6,
    name: "Aqua Lily Single",
    price: 1200,
    image: blueLilyImg,
    color: "Blue",
    flowerType: "Rose",
    occasions: ["Just Because", "Birthday"],
    isNewArrival: true,
    description: "One striking aqua lily cradled in a teal cellophane wrap with a shimmer ribbon — minimal, intentional, and utterly memorable. Great as a standalone gift or add-on.",
    stock: true,
    badge: "New",
  },
  {
    id: 7,
    name: "Red Rose Bouquet",
    price: 2400,
    image: "",
    color: "Red",
    flowerType: "Rose",
    occasions: ["Valentine's Day", "Anniversary"],
    isNewArrival: false,
    description: "Classic red fuzzy-wire roses — timeless and bold. Coming soon.",
    stock: false,
    badge: "Coming Soon",
  },
  {
    id: 8,
    name: "Mixed Rainbow Bundle",
    price: 2800,
    image: "",
    color: "Mixed",
    flowerType: "Mixed",
    occasions: ["Birthday", "Just Because"],
    isNewArrival: false,
    description: "A vibrant mix of every color in our palette. Coming soon.",
    stock: false,
    badge: "Coming Soon",
  },
  {
    id: 9,
    name: "White Daisy Wreath",
    price: 1600,
    image: "",
    color: "Mixed",
    flowerType: "Daisy",
    occasions: ["Wedding", "Mother's Day"],
    isNewArrival: false,
    description: "Soft white daisies arranged in a ring — perfect for weddings and celebrations. Coming soon.",
    stock: false,
    badge: "Coming Soon",
  },
  {
    id: 10,
    name: "Yellow Tulip Bouquet",
    price: 1900,
    image: "",
    color: "Yellow",
    flowerType: "Tulip",
    occasions: ["Birthday", "Just Because", "Mother's Day"],
    isNewArrival: false,
    description: "Bright yellow tulips that radiate warmth and cheer. Coming soon.",
    stock: false,
    badge: "Coming Soon",
  },
];

const OCCASIONS = ["Birthday", "Anniversary", "Valentine's Day", "Wedding", "Just Because", "Mother's Day"];
const COLORS = ["Pink", "Red", "Blue", "Yellow", "Mixed"];
const FLOWER_TYPES = ["Tulip", "Rose", "Daisy", "Sunflower", "Mixed"];

/* ─── Helpers ───────────────────────────────────────── */
const fmt = (n: number) => `Rs. ${n.toLocaleString("en-NP")}`;

/* ─── Subcomponents ─────────────────────────────────── */
function ProductCard({
  product,
  onView,
  onAddToCart,
}: {
  product: Product;
  onView: (p: Product) => void;
  onAddToCart: (p: Product) => void;
}) {
  return (
    <div
      className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
      onClick={() => onView(product)}
    >
      <div className="relative overflow-hidden bg-[#F5E8EE] aspect-[3/4]">
        {product.image ? (
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-[#F5E8EE]">
            <Clock size={28} className="text-[#D1748C]/40" />
            <span className="text-xs text-[#8A7A72] font-medium text-center px-4 leading-snug" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Photo coming soon
            </span>
          </div>
        )}
        {product.badge && (
          <span
            className={`absolute top-3 left-3 text-xs font-medium px-3 py-1 rounded-full ${product.badge === "Coming Soon" ? "bg-[#F5E8EE] text-[#D1748C] border border-[#D1748C]/30" : "bg-[#1A1A1A] text-[#FFF8F3]"}`}
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {product.badge}
          </span>
        )}
        {product.image && !product.stock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-[#8A7A72] font-medium text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>Out of Stock</span>
          </div>
        )}
        {product.image && (
          <button
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            onClick={(e) => { e.stopPropagation(); }}
          >
            <Heart size={14} className="text-[#D1748C]" />
          </button>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-[#8A7A72] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>{product.flowerType} · {product.color}</p>
        <h3 className="font-semibold text-[#2B2B2B] leading-tight mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem" }}>{product.name}</h3>
        <div className="flex items-center justify-between">
          <span className="text-[#D1748C] font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>{fmt(product.price)}</span>
          <button
            className="text-xs bg-[#1A1A1A] text-[#FFF8F3] px-3 py-1.5 rounded-full hover:bg-[#D1748C] transition-colors disabled:opacity-40"
            disabled={!product.stock}
            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main App ──────────────────────────────────────── */
export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterColor, setFilterColor] = useState<string>("All");
  const [filterFlower, setFilterFlower] = useState<string>("All");
  const [filterOccasion, setFilterOccasion] = useState<string>("All");
  const [sortBy, setSortBy] = useState("Newest");
  const [heroSlide, setHeroSlide] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);
  const [qty, setQty] = useState(1);

  // Checkout form
  const [form, setForm] = useState({ name: "", phone: "", address: "", zone: "inside", note: "" });
  const [orderPlaced, setOrderPlaced] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  useEffect(() => {
    const timer = setInterval(() => setHeroSlide((s) => (s + 1) % PRODUCTS.length), 3500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    document.body.style.overflow = cartOpen || mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [cartOpen, mobileMenuOpen]);

  /* Cart helpers */
  const addToCart = (product: Product, q = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + q } : i);
      return [...prev, { ...product, qty: q }];
    });
    setCartOpen(true);
  };
  const updateQty = (id: number, delta: number) => {
    setCart((prev) => prev.map((i) => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  };
  const removeItem = (id: number) => setCart((prev) => prev.filter((i) => i.id !== id));
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  /* Search results */
  const searchResults = searchQuery.length > 1
    ? PRODUCTS.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.color.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.flowerType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.occasions.some((o) => o.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  /* Filtered products */
  const filteredProducts = PRODUCTS
    .filter((p) => filterColor === "All" || p.color === filterColor)
    .filter((p) => filterFlower === "All" || p.flowerType === filterFlower)
    .filter((p) => filterOccasion === "All" || p.occasions.includes(filterOccasion))
    .sort((a, b) => {
      if (sortBy === "Price Low-High") return a.price - b.price;
      if (sortBy === "Price High-Low") return b.price - a.price;
      return b.id - a.id;
    });

  const navigate = (p: Page, product?: Product) => {
    if (product) setSelectedProduct(product);
    setPage(p);
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  /* ── HEADER ── */
  const Header = () => (
    <header className="sticky top-0 z-50 bg-[#FFF8F3]/95 backdrop-blur-sm border-b border-[rgba(216,170,185,0.3)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <button
          onClick={() => navigate("home")}
          className="flex-shrink-0"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          <span className="text-2xl font-bold text-[#2B2B2B] tracking-wide">Roselle</span>
          <span className="text-[#D1748C] text-2xl">.</span>
        </button>

        {/* Nav — desktop */}
        <nav className="hidden md:flex items-center gap-6">
          {(["home", "new-arrivals", "flowers", "about", "contact"] as Page[]).map((p) => (
            <button
              key={p}
              onClick={() => navigate(p)}
              className={`text-sm transition-colors ${page === p ? "text-[#D1748C] font-medium" : "text-[#2B2B2B] hover:text-[#D1748C]"}`}
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {p === "new-arrivals" ? "New Arrivals" : p === "home" ? "Home" : p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearchOpen((v) => !v)}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#F5E8EE] transition-colors"
          >
            <Search size={18} className="text-[#2B2B2B]" />
          </button>
          <button
            onClick={() => setCartOpen(true)}
            className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#F5E8EE] transition-colors"
          >
            <ShoppingBag size={18} className="text-[#2B2B2B]" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#D1748C] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          <button
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#F5E8EE] transition-colors"
            onClick={() => setMobileMenuOpen((v) => !v)}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Search bar */}
      {searchOpen && (
        <div className="border-t border-[rgba(216,170,185,0.3)] bg-[#FFF8F3] px-4 sm:px-6 py-3">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-2 bg-white border border-[rgba(216,170,185,0.4)] rounded-full px-4 py-2">
              <Search size={16} className="text-[#8A7A72] flex-shrink-0" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search by flower, color, occasion…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm text-[#2B2B2B] placeholder:text-[#8A7A72]"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")}><X size={14} className="text-[#8A7A72]" /></button>
              )}
            </div>
            {searchQuery.length > 1 && (
              <div className="mt-2 bg-white border border-[rgba(216,170,185,0.3)] rounded-2xl overflow-hidden shadow-lg">
                {searchResults.length === 0 ? (
                  <div className="p-4 text-center">
                    <p className="text-sm text-[#8A7A72] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>No results for "{searchQuery}"</p>
                    <p className="text-xs text-[#8A7A72] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>Popular bouquets:</p>
                    <div className="flex gap-2 justify-center flex-wrap">
                      {PRODUCTS.slice(0, 3).map((p) => (
                        <button key={p.id} onClick={() => { navigate("product", p); setSearchOpen(false); setSearchQuery(""); }}
                          className="text-xs bg-[#F5E8EE] text-[#D1748C] px-3 py-1 rounded-full hover:bg-[#E8A0B4] hover:text-white transition-colors"
                          style={{ fontFamily: "'Poppins', sans-serif" }}>
                          {p.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  searchResults.map((p) => (
                    <button
                      key={p.id}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#FFF8F3] transition-colors border-b border-[rgba(216,170,185,0.2)] last:border-0"
                      onClick={() => { navigate("product", p); setSearchOpen(false); setSearchQuery(""); }}
                    >
                      <ImageWithFallback src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-lg" />
                      <div className="text-left">
                        <p className="text-sm font-medium text-[#2B2B2B]" style={{ fontFamily: "'Poppins', sans-serif" }}>{p.name}</p>
                        <p className="text-xs text-[#D1748C]" style={{ fontFamily: "'Poppins', sans-serif" }}>{fmt(p.price)}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[rgba(216,170,185,0.3)] bg-[#FFF8F3] px-6 py-4 space-y-4">
          {(["home", "new-arrivals", "flowers", "about", "contact"] as Page[]).map((p) => (
            <button
              key={p}
              onClick={() => navigate(p)}
              className={`block w-full text-left text-sm py-2 border-b border-[rgba(216,170,185,0.2)] ${page === p ? "text-[#D1748C] font-medium" : "text-[#2B2B2B]"}`}
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {p === "new-arrivals" ? "New Arrivals" : p === "home" ? "Home" : p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      )}
    </header>
  );

  /* ── CART DRAWER ── */
  const CartDrawer = () => (
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={() => setCartOpen(false)} />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-[#FFF8F3] z-50 flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(216,170,185,0.3)]">
          <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl font-semibold text-[#2B2B2B]">Your Basket</h2>
          <button onClick={() => setCartOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F5E8EE]"><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingBag size={48} className="text-[#E8A0B4]" />
              <p className="text-[#8A7A72]" style={{ fontFamily: "'Poppins', sans-serif" }}>Your basket is empty</p>
              <button onClick={() => { setCartOpen(false); navigate("flowers"); }}
                className="text-sm bg-[#1A1A1A] text-[#FFF8F3] px-6 py-2 rounded-full hover:bg-[#D1748C] transition-colors"
                style={{ fontFamily: "'Poppins', sans-serif" }}>
                Shop Now
              </button>
            </div>
          ) : cart.map((item) => (
            <div key={item.id} className="flex gap-3 bg-white p-3 rounded-xl border border-[rgba(216,170,185,0.2)]">
              <ImageWithFallback src={item.image} alt={item.name} className="w-20 h-24 object-cover rounded-lg flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-[#2B2B2B] leading-tight mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>{item.name}</p>
                <p className="text-xs text-[#8A7A72] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>{item.color} · {item.flowerType}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-[#F5E8EE] rounded-full px-2 py-1">
                    <button onClick={() => updateQty(item.id, -1)} className="w-5 h-5 flex items-center justify-center hover:text-[#D1748C]"><Minus size={12} /></button>
                    <span className="text-sm font-medium w-4 text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="w-5 h-5 flex items-center justify-center hover:text-[#D1748C]"><Plus size={12} /></button>
                  </div>
                  <span className="text-sm font-semibold text-[#D1748C]" style={{ fontFamily: "'Poppins', sans-serif" }}>{fmt(item.price * item.qty)}</span>
                  <button onClick={() => removeItem(item.id)} className="text-[#8A7A72] hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <div className="px-6 py-4 border-t border-[rgba(216,170,185,0.3)]">
            <div className="flex justify-between mb-4">
              <span className="text-sm text-[#8A7A72]" style={{ fontFamily: "'Poppins', sans-serif" }}>Subtotal</span>
              <span className="font-semibold text-[#2B2B2B]" style={{ fontFamily: "'Poppins', sans-serif" }}>{fmt(cartTotal)}</span>
            </div>
            <p className="text-xs text-[#8A7A72] mb-3 text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>Delivery costs confirmed at checkout</p>
            <button
              onClick={() => { setCartOpen(false); navigate("checkout"); }}
              className="w-full bg-[#1A1A1A] text-[#FFF8F3] py-3 rounded-full font-medium hover:bg-[#D1748C] transition-colors"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );

  /* ── FOOTER ── */
  const Footer = () => (
    <footer className="bg-[#2B2B2B] text-[#FFF8F3] pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              <span className="text-2xl font-bold">Roselle</span><span className="text-[#E8A0B4] text-2xl">.</span>
            </div>
            <p className="text-sm text-[#8A7A72] leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>Handmade flowers that never fade.</p>
            <div className="flex gap-3 mt-4">
              {[Instagram, Facebook, MessageCircle].map((Icon, i) => (
                <button key={i} className="w-8 h-8 bg-[#3D3D3D] rounded-full flex items-center justify-center hover:bg-[#D1748C] transition-colors">
                  <Icon size={14} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4 text-[#E8A0B4]" style={{ fontFamily: "'Poppins', sans-serif" }}>Quick Links</h4>
            <div className="space-y-2">
              {(["home", "new-arrivals", "flowers", "about", "contact"] as Page[]).map((p) => (
                <button key={p} onClick={() => navigate(p)} className="block text-sm text-[#8A7A72] hover:text-[#E8A0B4] transition-colors" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {p === "new-arrivals" ? "New Arrivals" : p === "home" ? "Home" : p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4 text-[#E8A0B4]" style={{ fontFamily: "'Poppins', sans-serif" }}>Contact</h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Phone size={13} className="text-[#E8A0B4] mt-0.5 flex-shrink-0" />
                <span className="text-sm text-[#8A7A72]" style={{ fontFamily: "'Poppins', sans-serif" }}>9769695263</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin size={13} className="text-[#E8A0B4] mt-0.5 flex-shrink-0" />
                <span className="text-sm text-[#8A7A72]" style={{ fontFamily: "'Poppins', sans-serif" }}>Rambazar, Pokhara, Nepal</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4 text-[#E8A0B4]" style={{ fontFamily: "'Poppins', sans-serif" }}>Delivery</h4>
            <p className="text-sm text-[#8A7A72] leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>Cash on Delivery inside Pokhara Valley. Outside the valley, delivery cost depends on the route — we'll confirm with you before shipping.</p>
          </div>
        </div>
        <div className="border-t border-[rgba(255,255,255,0.08)] pt-6 text-center">
          <p className="text-xs text-[#8A7A72]" style={{ fontFamily: "'Poppins', sans-serif" }}>© 2026 Roselle. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );

  /* ── HOME PAGE ── */
  const HomePage = () => (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#F5E8EE] min-h-[85vh] flex items-center">
        <div className="absolute inset-0">
          {PRODUCTS.map((p, i) => (
            <div
              key={p.id}
              className="absolute inset-0 transition-opacity duration-1000"
              style={{ opacity: heroSlide === i ? 1 : 0 }}
            >
              <ImageWithFallback
                src={p.image}
                alt={p.name}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#FFF8F3]/90 via-[#FFF8F3]/60 to-transparent" />
            </div>
          ))}
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="max-w-lg">
            <span className="inline-block text-xs font-medium text-[#D1748C] tracking-widest uppercase mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Rambazar, Pokhara
            </span>
            <h1
              className="text-5xl sm:text-6xl md:text-7xl font-bold text-[#2B2B2B] leading-tight mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Handmade<br />
              <em className="text-[#D1748C]">Flowers</em> That<br />
              Never Fade.
            </h1>
            <p className="text-base text-[#5A5A5A] mb-8 leading-relaxed max-w-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Soft fuzzy-wire bouquets handcrafted in Pokhara — tulips, roses, daisies, and sunflowers that last forever.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate("flowers")}
                className="bg-[#1A1A1A] text-[#FFF8F3] px-8 py-3 rounded-full font-medium hover:bg-[#D1748C] transition-colors flex items-center gap-2"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Explore Bouquets <ChevronRight size={16} />
              </button>
              <button
                onClick={() => navigate("about")}
                className="border border-[#2B2B2B] text-[#2B2B2B] px-8 py-3 rounded-full font-medium hover:border-[#D1748C] hover:text-[#D1748C] transition-colors"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Our Story
              </button>
            </div>
          </div>
        </div>
        {/* Slide dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {PRODUCTS.map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroSlide(i)}
              className={`rounded-full transition-all ${heroSlide === i ? "w-6 h-2 bg-[#D1748C]" : "w-2 h-2 bg-[#D1748C]/30"}`}
            />
          ))}
        </div>
      </section>

      {/* Trust icons */}
      <section className="bg-white border-y border-[rgba(216,170,185,0.3)] py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: "✦", label: "100% Handmade", sub: "Every petal crafted by hand" },
            { icon: "♾", label: "Never Wilts", sub: "Lasts a lifetime" },
            { icon: "🎨", label: "Custom Colors", sub: "Pick your palette" },
            { icon: "📦", label: "Valley Delivery", sub: "COD inside Pokhara" },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center text-center gap-1 py-2">
              <span className="text-2xl mb-1">{item.icon}</span>
              <p className="text-sm font-semibold text-[#2B2B2B]" style={{ fontFamily: "'Poppins', sans-serif" }}>{item.label}</p>
              <p className="text-xs text-[#8A7A72]" style={{ fontFamily: "'Poppins', sans-serif" }}>{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs text-[#D1748C] font-medium tracking-widest uppercase" style={{ fontFamily: "'Poppins', sans-serif" }}>Fresh Picks</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#2B2B2B] mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>New Arrivals</h2>
          </div>
          <button onClick={() => navigate("new-arrivals")} className="text-sm text-[#D1748C] hover:underline flex items-center gap-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
            View all <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {PRODUCTS.filter((p) => p.isNewArrival).map((p) => (
            <ProductCard key={p.id} product={p} onView={(pr) => navigate("product", pr)} onAddToCart={addToCart} />
          ))}
        </div>
      </section>

      {/* Shop by Occasion */}
      <section className="bg-[#F5E8EE]/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-xs text-[#D1748C] font-medium tracking-widest uppercase" style={{ fontFamily: "'Poppins', sans-serif" }}>Shop by Occasion</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#2B2B2B] mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>Find the Perfect Bouquet</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { occ: "Birthday", Icon: Cake },
              { occ: "Anniversary", Icon: Gem },
              { occ: "Valentine's Day", Icon: HeartHandshake },
              { occ: "Wedding", Icon: Crown },
              { occ: "Just Because", Icon: Gift },
              { occ: "Mother's Day", Icon: Sparkles },
            ].map(({ occ, Icon }) => (
              <button
                key={occ}
                onClick={() => { setFilterOccasion(occ); navigate("flowers"); }}
                className="bg-white border border-[rgba(216,170,185,0.3)] rounded-2xl p-4 text-center hover:border-[#D1748C] hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 bg-[#F5E8EE] rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-[#D1748C] transition-colors">
                  <Icon size={18} className="text-[#D1748C] group-hover:text-white transition-colors" />
                </div>
                <p className="text-xs font-medium text-[#2B2B2B] group-hover:text-[#D1748C] transition-colors" style={{ fontFamily: "'Poppins', sans-serif" }}>{occ}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2x2 grid + CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="text-xs text-[#D1748C] font-medium tracking-widest uppercase" style={{ fontFamily: "'Poppins', sans-serif" }}>Crafted with Love</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#2B2B2B] mt-2 mb-4 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Every Petal, Shaped by Hand</h2>
            <p className="text-[#5A5A5A] mb-6 leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Each Roselle bouquet is handcrafted from soft chenille stem wire — no two are exactly alike, and none of them ever wilt. Add a little color to your home, your desk, or someone's day.
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              {["Tulip", "Rose", "Daisy", "Sunflower"].map((f) => (
                <span key={f} className="text-xs bg-[#F5E8EE] text-[#D1748C] px-4 py-1.5 rounded-full" style={{ fontFamily: "'Poppins', sans-serif" }}>{f}</span>
              ))}
            </div>
            <button
              onClick={() => navigate("flowers")}
              className="bg-[#1A1A1A] text-[#FFF8F3] px-8 py-3 rounded-full font-medium hover:bg-[#D1748C] transition-colors"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Shop Now
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {PRODUCTS.slice(0, 4).map((p) => (
              <button key={p.id} onClick={() => navigate("product", p)} className="group overflow-hidden rounded-2xl aspect-square bg-[#F5E8EE]">
                <ImageWithFallback src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* About teaser */}
      <section className="bg-[#2B2B2B] py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-xs text-[#E8A0B4] font-medium tracking-widest uppercase" style={{ fontFamily: "'Poppins', sans-serif" }}>About Roselle</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#FFF8F3] mt-2 mb-5" style={{ fontFamily: "'Playfair Display', serif" }}>A New Shop, a Whole Lot of Care</h2>
          <p className="text-[#8A7A72] leading-relaxed mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Roselle is a new, home-grown flower shop based in Rambazar, Pokhara. Every bouquet we make is handcrafted from soft fuzzy wire — no wilting, no fading, just lasting beauty. We're just getting started, but we put real care into every petal and every order.
          </p>
          <button onClick={() => navigate("about")} className="border border-[#E8A0B4] text-[#E8A0B4] px-8 py-3 rounded-full font-medium hover:bg-[#E8A0B4] hover:text-[#2B2B2B] transition-colors" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Read More
          </button>
        </div>
      </section>

      {/* WhatsApp/Instagram banner */}
      <section className="bg-[#F5E8EE] py-10">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p className="text-sm text-[#D1748C] font-medium mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>Stay in the loop</p>
          <h2 className="text-2xl font-bold text-[#2B2B2B] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Follow for New Drops</h2>
          <p className="text-sm text-[#8A7A72] mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>Follow us on Instagram or WhatsApp to be the first to see new bouquets and special offers.</p>
          <div className="flex justify-center gap-4">
            <button className="flex items-center gap-2 bg-[#1A1A1A] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#D1748C] transition-colors" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <Instagram size={16} /> Instagram
            </button>
            <button className="flex items-center gap-2 bg-[#25D366] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <MessageCircle size={16} /> WhatsApp
            </button>
          </div>
        </div>
      </section>
    </div>
  );

  /* ── FLOWERS PAGE ── */
  const FlowersPage = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#2B2B2B] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>All Bouquets</h1>
        <p className="text-[#8A7A72] text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>{filteredProducts.length} bouquets</p>
      </div>
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <button
          onClick={() => setFilterOpen((v) => !v)}
          className="flex items-center gap-2 text-sm border border-[rgba(216,170,185,0.5)] px-4 py-2 rounded-full hover:border-[#D1748C] transition-colors"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          <Filter size={14} /> Filters
        </button>
        {/* Color filter */}
        <select
          value={filterColor}
          onChange={(e) => setFilterColor(e.target.value)}
          className="text-sm border border-[rgba(216,170,185,0.5)] px-4 py-2 rounded-full bg-white focus:outline-none focus:border-[#D1748C]"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          <option value="All">All Colors</option>
          {COLORS.map((c) => <option key={c}>{c}</option>)}
        </select>
        {/* Flower type filter */}
        <select
          value={filterFlower}
          onChange={(e) => setFilterFlower(e.target.value)}
          className="text-sm border border-[rgba(216,170,185,0.5)] px-4 py-2 rounded-full bg-white focus:outline-none focus:border-[#D1748C]"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          <option value="All">All Flowers</option>
          {FLOWER_TYPES.map((f) => <option key={f}>{f}</option>)}
        </select>
        {/* Occasion filter */}
        <select
          value={filterOccasion}
          onChange={(e) => setFilterOccasion(e.target.value)}
          className="text-sm border border-[rgba(216,170,185,0.5)] px-4 py-2 rounded-full bg-white focus:outline-none focus:border-[#D1748C]"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          <option value="All">All Occasions</option>
          {OCCASIONS.map((o) => <option key={o}>{o}</option>)}
        </select>
        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="text-sm border border-[rgba(216,170,185,0.5)] px-4 py-2 rounded-full bg-white focus:outline-none focus:border-[#D1748C] ml-auto"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {["Newest", "Price Low-High", "Price High-Low"].map((s) => <option key={s}>{s}</option>)}
        </select>
        {(filterColor !== "All" || filterFlower !== "All" || filterOccasion !== "All") && (
          <button
            onClick={() => { setFilterColor("All"); setFilterFlower("All"); setFilterOccasion("All"); }}
            className="text-xs text-[#D1748C] hover:underline flex items-center gap-1"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            <X size={12} /> Clear
          </button>
        )}
      </div>
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-[#8A7A72] text-lg mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>No bouquets found</p>
          <button onClick={() => { setFilterColor("All"); setFilterFlower("All"); setFilterOccasion("All"); }} className="text-sm text-[#D1748C] hover:underline" style={{ fontFamily: "'Poppins', sans-serif" }}>Clear filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} onView={(pr) => navigate("product", pr)} onAddToCart={addToCart} />
          ))}
        </div>
      )}
    </div>
  );

  /* ── NEW ARRIVALS PAGE ── */
  const NewArrivalsPage = () => {
    const newProducts = PRODUCTS.filter((p) => p.isNewArrival);
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <span className="text-xs text-[#D1748C] font-medium tracking-widest uppercase" style={{ fontFamily: "'Poppins', sans-serif" }}>Fresh from the workshop</span>
          <h1 className="text-4xl font-bold text-[#2B2B2B] mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>New Arrivals</h1>
        </div>
        {newProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#8A7A72] text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>New bouquets coming soon — check back!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {newProducts.map((p) => (
              <ProductCard key={p.id} product={p} onView={(pr) => navigate("product", pr)} onAddToCart={addToCart} />
            ))}
          </div>
        )}
      </div>
    );
  };

  /* ── PRODUCT DETAIL ── */
  const ProductPage = () => {
    const product = selectedProduct;
    if (!product) return null;
    const related = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <button onClick={() => navigate("flowers")} className="flex items-center gap-1 text-sm text-[#8A7A72] hover:text-[#D1748C] mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
          ← Back to Flowers
        </button>
        <div className="grid md:grid-cols-2 gap-10 mb-16">
          <div className="bg-[#F5E8EE] rounded-3xl overflow-hidden aspect-[4/5]">
            <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col justify-center">
            {product.badge && (
              <span className="inline-block mb-3 text-xs bg-[#1A1A1A] text-[#FFF8F3] px-3 py-1 rounded-full w-fit" style={{ fontFamily: "'Poppins', sans-serif" }}>{product.badge}</span>
            )}
            <h1 className="text-3xl sm:text-4xl font-bold text-[#2B2B2B] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{product.name}</h1>
            <p className="text-2xl text-[#D1748C] font-semibold mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>{fmt(product.price)}</p>
            <div className="flex gap-2 mb-4 flex-wrap">
              <span className="text-xs bg-[#F5E8EE] text-[#D1748C] px-3 py-1 rounded-full" style={{ fontFamily: "'Poppins', sans-serif" }}>{product.color}</span>
              <span className="text-xs bg-[#F5E8EE] text-[#D1748C] px-3 py-1 rounded-full" style={{ fontFamily: "'Poppins', sans-serif" }}>{product.flowerType}</span>
              {product.occasions.map((o) => (
                <span key={o} className="text-xs bg-[#EDF4EE] text-[#4F6F52] px-3 py-1 rounded-full" style={{ fontFamily: "'Poppins', sans-serif" }}>{o}</span>
              ))}
            </div>
            <p className="text-[#5A5A5A] leading-relaxed mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>{product.description}</p>
            <div className="bg-[#EDF4EE] border border-[rgba(79,111,82,0.2)] rounded-xl p-3 mb-6 flex items-start gap-2">
              <span className="text-[#4F6F52] text-sm">♾</span>
              <p className="text-xs text-[#4F6F52]" style={{ fontFamily: "'Poppins', sans-serif" }}>Wipe clean, never fades, reusable forever. Fuzzy-wire construction — no water needed.</p>
            </div>
            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-3 bg-[#F5E8EE] rounded-full px-4 py-2">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))}><Minus size={14} /></button>
                <span className="w-6 text-center font-medium" style={{ fontFamily: "'Poppins', sans-serif" }}>{qty}</span>
                <button onClick={() => setQty((q) => q + 1)}><Plus size={14} /></button>
              </div>
              <button
                onClick={() => { addToCart(product, qty); setQty(1); }}
                disabled={!product.stock}
                className="flex-1 bg-[#1A1A1A] text-[#FFF8F3] py-3 rounded-full font-medium hover:bg-[#D1748C] transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <ShoppingBag size={16} /> Add to Cart
              </button>
            </div>
            <div className="flex gap-3 text-xs text-[#8A7A72]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <span className="flex items-center gap-1"><Check size={12} className="text-[#4F6F52]" /> 100% Handmade</span>
              <span className="flex items-center gap-1"><Check size={12} className="text-[#4F6F52]" /> Cash on Delivery</span>
              <span className="flex items-center gap-1"><Check size={12} className="text-[#4F6F52]" /> Pokhara Delivery</span>
            </div>
          </div>
        </div>
        {/* Related */}
        <div>
          <h2 className="text-2xl font-bold text-[#2B2B2B] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>You Might Also Love</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} onView={(pr) => navigate("product", pr)} onAddToCart={addToCart} />
            ))}
          </div>
        </div>
      </div>
    );
  };

  /* ── CHECKOUT ── */
  const CheckoutPage = () => {
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setOrderPlaced(true);
      navigate("confirmation");
    };
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-3xl font-bold text-[#2B2B2B] mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>Checkout</h1>
        <div className="grid md:grid-cols-5 gap-8">
          <form onSubmit={handleSubmit} className="md:col-span-3 space-y-4">
            <h2 className="text-lg font-semibold text-[#2B2B2B]" style={{ fontFamily: "'Playfair Display', serif" }}>Delivery Details</h2>
            {[
              { key: "name", label: "Full Name", type: "text", placeholder: "Your name" },
              { key: "phone", label: "Phone Number", type: "tel", placeholder: "98XXXXXXXX" },
              { key: "address", label: "Delivery Address", type: "text", placeholder: "Street, area, landmark" },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-[#2B2B2B] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>{label} *</label>
                <input
                  type={type}
                  required
                  placeholder={placeholder}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  className="w-full border border-[rgba(216,170,185,0.4)] rounded-xl px-4 py-2.5 bg-white focus:outline-none focus:border-[#D1748C] text-sm"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-[#2B2B2B] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>Delivery Zone *</label>
              <div className="space-y-2">
                {[
                  { value: "inside", label: "Inside Pokhara Valley", sub: "Cash on Delivery" },
                  { value: "outside", label: "Outside Pokhara Valley", sub: "Delivery cost confirmed by us based on route" },
                ].map(({ value, label, sub }) => (
                  <label key={value} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${form.zone === value ? "border-[#D1748C] bg-[#F5E8EE]" : "border-[rgba(216,170,185,0.3)] bg-white hover:border-[#E8A0B4]"}`}>
                    <input type="radio" name="zone" value={value} checked={form.zone === value} onChange={() => setForm((f) => ({ ...f, zone: value }))} className="mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-[#2B2B2B]" style={{ fontFamily: "'Poppins', sans-serif" }}>{label}</p>
                      <p className="text-xs text-[#8A7A72]" style={{ fontFamily: "'Poppins', sans-serif" }}>{sub}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2B2B2B] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Gift Message (optional)</label>
              <textarea
                rows={3}
                placeholder="Add a personal note for the recipient…"
                value={form.note}
                onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                className="w-full border border-[rgba(216,170,185,0.4)] rounded-xl px-4 py-2.5 bg-white focus:outline-none focus:border-[#D1748C] text-sm resize-none"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#1A1A1A] text-[#FFF8F3] py-3 rounded-full font-medium hover:bg-[#D1748C] transition-colors mt-2"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Place Order
            </button>
          </form>

          {/* Order summary */}
          <div className="md:col-span-2">
            <div className="bg-white border border-[rgba(216,170,185,0.3)] rounded-2xl p-5 sticky top-20">
              <h2 className="text-lg font-semibold text-[#2B2B2B] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Order Summary</h2>
              <div className="space-y-3 mb-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <ImageWithFallback src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[#2B2B2B] truncate" style={{ fontFamily: "'Poppins', sans-serif" }}>{item.name}</p>
                      <p className="text-xs text-[#8A7A72]" style={{ fontFamily: "'Poppins', sans-serif" }}>×{item.qty}</p>
                    </div>
                    <span className="text-xs font-medium text-[#D1748C]" style={{ fontFamily: "'Poppins', sans-serif" }}>{fmt(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-[rgba(216,170,185,0.3)] pt-3">
                <div className="flex justify-between">
                  <span className="text-sm text-[#8A7A72]" style={{ fontFamily: "'Poppins', sans-serif" }}>Subtotal</span>
                  <span className="text-sm font-semibold text-[#2B2B2B]" style={{ fontFamily: "'Poppins', sans-serif" }}>{fmt(cartTotal)}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-sm text-[#8A7A72]" style={{ fontFamily: "'Poppins', sans-serif" }}>Delivery</span>
                  <span className="text-sm text-[#4F6F52]" style={{ fontFamily: "'Poppins', sans-serif" }}>Confirmed later</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ── ORDER CONFIRMATION ── */
  const ConfirmationPage = () => (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <div className="w-16 h-16 bg-[#EDF4EE] rounded-full flex items-center justify-center mx-auto mb-6">
          <Check size={28} className="text-[#4F6F52]" />
        </div>
        <h1 className="text-3xl font-bold text-[#2B2B2B] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Thank You!</h1>
        <p className="text-[#5A5A5A] mb-2 leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Your order has been placed. We'll call you on <strong>{form.phone || "your number"}</strong> to confirm your order and delivery cost.
        </p>
        <p className="text-sm text-[#8A7A72] mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>Roselle · Rambazar, Pokhara · 9769695263</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => {
              const msg = `Hi! I just placed an order on Roselle.\n\nItems: ${cart.map((i) => `${i.name} ×${i.qty}`).join(", ")}\nTotal: ${fmt(cartTotal)}\nName: ${form.name}\nPhone: ${form.phone}\nAddress: ${form.address}`;
              window.open(`https://wa.me/9779769695263?text=${encodeURIComponent(msg)}`);
            }}
            className="flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            <MessageCircle size={16} /> Confirm via WhatsApp
          </button>
          <button
            onClick={() => { setCart([]); navigate("home"); }}
            className="border border-[#1A1A1A] text-[#1A1A1A] px-6 py-3 rounded-full font-medium hover:bg-[#1A1A1A] hover:text-white transition-colors"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );

  /* ── ABOUT PAGE ── */
  const AboutPage = () => (
    <div>
      <div className="bg-[#F5E8EE] py-16 text-center">
        <span className="text-xs text-[#D1748C] font-medium tracking-widest uppercase" style={{ fontFamily: "'Poppins', sans-serif" }}>Our Story</span>
        <h1 className="text-5xl font-bold text-[#2B2B2B] mt-2" style={{ fontFamily: "'Playfair Display', serif" }}>About Roselle</h1>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="grid grid-cols-2 gap-3">
            {[sunflowerImg, pinkTulipImg, mixedPastelImg, pinkLilyImg].map((img, i) => (
              <div key={i} className={`bg-[#F5E8EE] rounded-2xl overflow-hidden ${i === 0 ? "aspect-[4/5]" : i === 1 ? "aspect-square mt-6" : i === 2 ? "aspect-square" : "aspect-[4/5] -mt-6"}`}>
                <ImageWithFallback src={img} alt="Roselle bouquet" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <div>
            <h2 className="text-3xl font-bold text-[#2B2B2B] mb-5 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Made by Hand,<br />Loved Forever</h2>
            <p className="text-[#5A5A5A] leading-relaxed mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Roselle is a new, home-grown flower shop based in Rambazar, Pokhara. Every bouquet we make is handcrafted from soft fuzzy wire — no wilting, no fading, just lasting beauty you can keep forever.
            </p>
            <p className="text-[#5A5A5A] leading-relaxed mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
              We're just getting started, but we put real care into every petal and every order. Whether it's a birthday, an anniversary, or just because — we'd love to add a little color to your day.
            </p>
            <div className="space-y-3">
              {[
                { icon: <MapPin size={14} />, text: "Rambazar, Pokhara, Nepal" },
                { icon: <Phone size={14} />, text: "9769695263" },
                { icon: <Check size={14} />, text: "Cash on Delivery inside Pokhara Valley" },
              ].map(({ icon, text }, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-[#5A5A5A]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  <span className="text-[#D1748C]">{icon}</span> {text}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { n: "100%", l: "Handmade" },
            { n: "∞", l: "Never wilts" },
            { n: "6+", l: "Bouquet styles" },
            { n: "COD", l: "Pokhara delivery" },
          ].map(({ n, l }) => (
            <div key={l} className="bg-[#F5E8EE] rounded-2xl p-6 text-center">
              <p className="text-3xl font-bold text-[#D1748C] mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>{n}</p>
              <p className="text-sm text-[#8A7A72]" style={{ fontFamily: "'Poppins', sans-serif" }}>{l}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  /* ── CONTACT PAGE ── */
  const ContactPage = () => {
    const [msg, setMsg] = useState({ name: "", contact: "", message: "" });
    const [sent, setSent] = useState(false);
    return (
      <div>
        <div className="bg-[#F5E8EE] py-16 text-center">
          <span className="text-xs text-[#D1748C] font-medium tracking-widest uppercase" style={{ fontFamily: "'Poppins', sans-serif" }}>Get in Touch</span>
          <h1 className="text-5xl font-bold text-[#2B2B2B] mt-2" style={{ fontFamily: "'Playfair Display', serif" }}>Contact Us</h1>
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-[#2B2B2B] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>Send a Message</h2>
              {sent ? (
                <div className="bg-[#EDF4EE] rounded-2xl p-6 text-center">
                  <Check size={32} className="text-[#4F6F52] mx-auto mb-3" />
                  <p className="font-medium text-[#2B2B2B]" style={{ fontFamily: "'Poppins', sans-serif" }}>Message sent! We'll be in touch soon.</p>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
                  {[
                    { key: "name", label: "Name", type: "text", placeholder: "Your name" },
                    { key: "contact", label: "Phone / Email", type: "text", placeholder: "Your contact info" },
                  ].map(({ key, label, type, placeholder }) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-[#2B2B2B] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>{label}</label>
                      <input type={type} required placeholder={placeholder} value={msg[key as keyof typeof msg]}
                        onChange={(e) => setMsg((m) => ({ ...m, [key]: e.target.value }))}
                        className="w-full border border-[rgba(216,170,185,0.4)] rounded-xl px-4 py-2.5 bg-white focus:outline-none focus:border-[#D1748C] text-sm"
                        style={{ fontFamily: "'Poppins', sans-serif" }} />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-medium text-[#2B2B2B] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Message</label>
                    <textarea required rows={4} placeholder="How can we help?" value={msg.message}
                      onChange={(e) => setMsg((m) => ({ ...m, message: e.target.value }))}
                      className="w-full border border-[rgba(216,170,185,0.4)] rounded-xl px-4 py-2.5 bg-white focus:outline-none focus:border-[#D1748C] text-sm resize-none"
                      style={{ fontFamily: "'Poppins', sans-serif" }} />
                  </div>
                  <button type="submit" className="w-full bg-[#1A1A1A] text-[#FFF8F3] py-3 rounded-full font-medium hover:bg-[#D1748C] transition-colors" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Send Message
                  </button>
                </form>
              )}
            </div>
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#2B2B2B]" style={{ fontFamily: "'Playfair Display', serif" }}>Shop Info</h2>
              <div className="bg-white border border-[rgba(216,170,185,0.3)] rounded-2xl p-6 space-y-4">
                {[
                  { icon: <Phone size={16} />, label: "Phone", value: "9769695263" },
                  { icon: <MapPin size={16} />, label: "Location", value: "Rambazar, Pokhara, Nepal" },
                  { icon: <Star size={16} />, label: "Hours", value: "Open daily · Hours vary" },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[#F5E8EE] rounded-full flex items-center justify-center flex-shrink-0 text-[#D1748C]">{icon}</div>
                    <div>
                      <p className="text-xs text-[#8A7A72]" style={{ fontFamily: "'Poppins', sans-serif" }}>{label}</p>
                      <p className="text-sm font-medium text-[#2B2B2B]" style={{ fontFamily: "'Poppins', sans-serif" }}>{value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-[#FFF3E8] border border-[rgba(216,170,185,0.2)] rounded-2xl p-5">
                <p className="text-sm font-semibold text-[#2B2B2B] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Delivery Policy</p>
                <p className="text-sm text-[#5A5A5A] leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>Cash on Delivery inside Pokhara Valley. Outside the valley, delivery cost depends on the route — we'll confirm with you before shipping.</p>
              </div>
              {/* Map placeholder */}
              <div className="bg-[#F5E8EE] rounded-2xl h-48 flex items-center justify-center border border-[rgba(216,170,185,0.3)]">
                <div className="text-center">
                  <MapPin size={24} className="text-[#D1748C] mx-auto mb-2" />
                  <p className="text-sm text-[#8A7A72]" style={{ fontFamily: "'Poppins', sans-serif" }}>Rambazar, Pokhara, Nepal</p>
                </div>
              </div>
              <div className="flex gap-3">
                {[
                  { Icon: Instagram, label: "Instagram" },
                  { Icon: Facebook, label: "Facebook" },
                  { Icon: MessageCircle, label: "WhatsApp" },
                ].map(({ Icon, label }) => (
                  <button key={label} className="flex items-center gap-2 border border-[rgba(216,170,185,0.4)] px-4 py-2 rounded-full text-sm text-[#2B2B2B] hover:border-[#D1748C] hover:text-[#D1748C] transition-colors" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <Icon size={14} /> {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ── RENDER ── */
  return (
    <div className="min-h-screen bg-[#FFF8F3]" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <Header />
      {cartOpen && <CartDrawer />}

      {page === "home" && <HomePage />}
      {page === "flowers" && <FlowersPage />}
      {page === "new-arrivals" && <NewArrivalsPage />}
      {page === "product" && <ProductPage />}
      {page === "checkout" && <CheckoutPage />}
      {page === "confirmation" && <ConfirmationPage />}
      {page === "about" && <AboutPage />}
      {page === "contact" && <ContactPage />}

      {page !== "confirmation" && <Footer />}
    </div>
  );
}
