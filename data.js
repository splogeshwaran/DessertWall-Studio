// ============================================================
//  DessertWall Studio - Central Data Store
// ============================================================

const BUSINESS = {
  name: "DessertWall Studio",
  tagline: "Every bite made with love",
  whatsapp: "7667305677",
  instagram: "https://www.instagram.com/dessertwall.studio",
  serviceArea: "Bangalore, Karnataka",
  timings: "Mon - Sat: 9 AM - 8 PM  |  Sun: 10 AM - 6 PM",
  contactText: "We love hearing from you! Reach out on WhatsApp for orders and enquiries.",
  logo: "desserts"
};

const PRODUCTS = [
  {
    id: "p1", slug: "chocolate-truffle-cake",
    name: "Chocolate Truffle Cake",
    category: "Birthday Cakes",
    description: "A decadent dark-chocolate truffle cake layered with velvety ganache, topped with fresh raspberries, gold leaf and hand-curled chocolate shards. The ultimate celebration indulgence.",
    price: 850, priceLabel: "Starting from Rs.850",
    image: "images/cake_chocolate.jpg",
    sizes: ["500g","1 kg","1.5 kg","2 kg"],
    flavours: ["Dark Chocolate","Milk Chocolate","White Chocolate"],
    eggOptions: ["Egg","Eggless"],
    customizationEnabled: true,
    preparationTime: "48 hours",
    available: true, featured: true
  },
  {
    id: "p2", slug: "vanilla-floral-birthday-cake",
    name: "Vanilla Floral Birthday Cake",
    category: "Birthday Cakes",
    description: "An elegant two-tier vanilla sponge with cloud-like white buttercream, adorned with fresh edible flowers, gold candles and delicate golden accents. Perfect for celebrations.",
    price: 1100, priceLabel: "Starting from Rs.1,100",
    image: "images/cake_birthday.jpg",
    sizes: ["1 kg","1.5 kg","2 kg","2.5 kg"],
    flavours: ["Vanilla Bean","Strawberry","Lemon Zest","Rose"],
    eggOptions: ["Egg","Eggless"],
    customizationEnabled: true,
    preparationTime: "48 hours",
    available: true, featured: true
  },
  {
    id: "p3", slug: "gourmet-brownie-box",
    name: "Gourmet Brownie Box",
    category: "Brownies",
    description: "Rich, fudgy handmade brownies topped with sea salt flakes and crunchy walnuts, beautifully presented in a kraft gift box with a ribbon. A perfect gifting dessert.",
    price: 450, priceLabel: "Starting from Rs.450",
    image: "images/brownies.jpg",
    sizes: ["Box of 6","Box of 9","Box of 12"],
    flavours: ["Classic Dark Chocolate","Nutella Swirl","Salted Caramel","Oreo"],
    eggOptions: ["Egg","Eggless"],
    customizationEnabled: false,
    preparationTime: "24 hours",
    available: true, featured: true
  },
  {
    id: "p4", slug: "assorted-cupcakes",
    name: "Assorted Cupcakes",
    category: "Cupcakes",
    description: "Six beautifully piped cupcakes with swirled buttercream frosting in a variety of flavours and colours. Decorated with edible flowers, sprinkles and handcrafted toppers.",
    price: 380, priceLabel: "Starting from Rs.380",
    image: "images/cupcakes.jpg",
    sizes: ["Box of 6","Box of 12","Box of 24"],
    flavours: ["Rose & Lychee","Chocolate Fudge","Vanilla Dream","Lavender Honey","Strawberry Swirl","Salted Caramel"],
    eggOptions: ["Egg","Eggless"],
    customizationEnabled: true,
    preparationTime: "24 hours",
    available: true, featured: true
  },
  {
    id: "p5", slug: "belgian-mirror-glaze-dessert",
    name: "Belgian Mirror Glaze Mousse",
    category: "Signature Desserts",
    description: "A showstopping Belgian chocolate mousse entremets with a flawless mirror-glaze finish, plated with berry coulis, edible gold and fresh herbs. A true signature creation.",
    price: 950, priceLabel: "Starting from Rs.950",
    image: "images/signature.jpg",
    sizes: ["Individual (150g)","4-Portion Box","8-Portion Box"],
    flavours: ["Dark Chocolate","Hazelnut Praline","Raspberry Chocolate"],
    eggOptions: ["Egg","Eggless"],
    customizationEnabled: false,
    preparationTime: "72 hours",
    available: true, featured: false
  },
  {
    id: "p6", slug: "custom-celebration-cake",
    name: "Custom Celebration Cake",
    category: "Custom Desserts",
    description: "Fully customizable celebration cake designed around your theme, colours and special message. Share your vision and we will bring it to life with premium homemade craftsmanship.",
    price: 1200, priceLabel: "Starting from Rs.1,200",
    image: "images/cake_birthday.jpg",
    sizes: ["1 kg","1.5 kg","2 kg","3 kg"],
    flavours: ["Chocolate","Vanilla","Red Velvet","Butterscotch","Black Forest"],
    eggOptions: ["Egg","Eggless"],
    customizationEnabled: true,
    preparationTime: "72 hours",
    available: true, featured: false
  },
  {
    id: "p7", slug: "red-velvet-brownies",
    name: "Red Velvet Brownies",
    category: "Brownies",
    description: "Luscious red velvet brownies swirled with cream cheese frosting. Fudgy, vibrant and irresistibly delicious. Available in gift-ready packaging.",
    price: 420, priceLabel: "Starting from Rs.420",
    image: "images/brownies.jpg",
    sizes: ["Box of 6","Box of 9","Box of 12"],
    flavours: ["Classic Red Velvet","Red Velvet Oreo"],
    eggOptions: ["Egg","Eggless"],
    customizationEnabled: false,
    preparationTime: "24 hours",
    available: true, featured: false
  },
  {
    id: "p8", slug: "christmas-yule-log",
    name: "Christmas Yule Log",
    category: "Seasonal / Special",
    description: "A festive Buche de Noel - a rich chocolate sponge rolled with whipped cream, finished with chocolate bark, meringue mushrooms and a dusting of icing sugar snow.",
    price: 799, priceLabel: "Starting from Rs.799",
    image: "images/cake_chocolate.jpg",
    sizes: ["500g","1 kg"],
    flavours: ["Chocolate & Cream","Mocha","Strawberry"],
    eggOptions: ["Egg","Eggless"],
    customizationEnabled: true,
    preparationTime: "48 hours",
    available: false, featured: false
  }
];

const GALLERY = [
  { id: "g1", image: "images/cake_chocolate.jpg",  title: "Dark Chocolate Drip Cake",      category: "Custom Cakes",                   size: "2 kg",      occasion: "Anniversary",    description: "Rich ganache drip with gold leaf and fresh raspberries." },
  { id: "g2", image: "images/cake_birthday.jpg",   title: "Floral Birthday Extravaganza",  category: "Birthday & Celebration Orders",  size: "1.5 kg",    occasion: "Birthday",       description: "Two-tier vanilla cake with fresh flowers and gold accents." },
  { id: "g3", image: "images/brownies.jpg",        title: "Walnut Brownie Gift Box",        category: "Brownies & Dessert Boxes",       size: "Box of 9",  occasion: "Corporate Gift", description: "Sea-salt walnut brownies in kraft gifting box." },
  { id: "g4", image: "images/cupcakes.jpg",        title: "Garden Party Cupcakes",          category: "Cupcakes",                       size: "Box of 12", occasion: "Baby Shower",    description: "Assorted floral cupcakes with edible flower toppers." },
  { id: "g5", image: "images/signature.jpg",       title: "Mirror Glaze Entremets",         category: "Special / Seasonal Creations",   size: "4 portions", occasion: "Fine Dining",  description: "Belgian chocolate mousse with perfect mirror-glaze finish." },
  { id: "g6", image: "images/cake_birthday.jpg",   title: "Pink Ombre Celebration",        category: "Custom Cakes",                   size: "2 kg",      occasion: "Sweet 16",       description: "Three-tier ombre buttercream with edible pearls." },
  { id: "g7", image: "images/cupcakes.jpg",        title: "Christmas Cupcake Collection",  category: "Special / Seasonal Creations",   size: "Box of 12", occasion: "Christmas",      description: "Festive cupcakes with snowflake and holly toppers." },
  { id: "g8", image: "images/brownies.jpg",        title: "Oreo Fudge Brownie Stack",      category: "Brownies & Dessert Boxes",       size: "Box of 6",  occasion: "Birthday",       description: "Triple chocolate Oreo brownie stack in gift box." }
];

const OFFERS = [
  {
    id: "o1",
    title: "Festive Season Special",
    badge: "15% OFF",
    icon: "🎉",
    description: "Celebrate the festive season with delicious treats! Get 15% off on all cake orders above Rs.1,000.",
    discountText: "15% OFF on cake orders above ₹1,000 • Code: SWEET15",
    linkText: "Order Cakes",
    linkCategory: "Birthday Cakes",
    active: true, featured: true,
    startDate: "2026-09-01", endDate: "2026-10-31"
  },
  {
    id: "o2",
    title: "Birthday Month Special",
    badge: "FREE TOPPER",
    icon: "🎂",
    description: "Celebrating your birthday this month? Get a complimentary personalised gold topper on any custom or birthday cake.",
    discountText: "Free custom acrylic topper with every Birthday Cake!",
    linkText: "View Birthday Cakes",
    linkCategory: "Birthday Cakes",
    active: true, featured: true,
    startDate: "2026-09-01", endDate: "2026-11-30"
  },
  {
    id: "o3",
    title: "Free Express Delivery",
    badge: "FREE DELIVERY",
    icon: "🚚",
    description: "Enjoy zero delivery charges across Bangalore on all orders above ₹499.",
    discountText: "Zero Delivery Fee on all gourmet boxes & cakes above ₹499",
    linkText: "Browse Menu",
    linkCategory: "All",
    active: true, featured: false,
    startDate: "2026-09-10", endDate: "2026-12-31"
  },
  {
    id: "o4",
    title: "Weekend Sweet Box Deal",
    badge: "BUY & SAVE",
    icon: "🧁",
    description: "Order any Box of 6 Cupcakes and get 2 Fudgy Walnut Brownies absolutely free.",
    discountText: "Weekend Special: Get 2 Free Walnut Brownies with any 6 Cupcakes Box!",
    linkText: "Order Cupcakes",
    linkCategory: "Cupcakes",
    active: true, featured: false,
    startDate: "2026-09-15", endDate: "2026-10-15"
  }
];

const SAMPLE_ORDERS = [
  {
    id: "ORD-2026-101",
    date: "2026-09-24 14:15",
    customer: {
      name: "Ananya Deshmukh",
      phone: "+91 98450 12345",
      email: "ananya.d@example.com",
      address: "Flat 402, Green Glen Layout, Bellandur, Bangalore 560103",
      deliveryType: "delivery",
      preferredDate: "2026-09-26",
      timeSlot: "Afternoon (1 PM - 4 PM)"
    },
    items: [
      {
        id: "p1",
        name: "Chocolate Truffle Cake",
        size: "1 kg",
        flavour: "Dark Chocolate",
        egg: "Eggless",
        price: 850,
        quantity: 1,
        customMessage: "Happy 25th Birthday Rhea!",
        specialNotes: "Please add extra chocolate shavings on top."
      }
    ],
    subtotal: 850,
    deliveryFee: 0,
    discount: 0,
    total: 850,
    paymentMethod: "UPI (Paid Online)",
    status: "Preparing"
  },
  {
    id: "ORD-2026-102",
    date: "2026-09-24 11:30",
    customer: {
      name: "Vikram Sengupta",
      phone: "+91 97412 88990",
      email: "vikram.s@example.com",
      address: "Direct Studio Pickup",
      deliveryType: "pickup",
      preferredDate: "2026-09-25",
      timeSlot: "Evening (5 PM - 7 PM)"
    },
    items: [
      {
        id: "p3",
        name: "Gourmet Brownie Box",
        size: "Box of 9",
        flavour: "Nutella Swirl",
        egg: "Egg",
        price: 600,
        quantity: 2,
        customMessage: "Best Wishes Team Alpha",
        specialNotes: "Gift packaging with golden ribbon please."
      }
    ],
    subtotal: 1200,
    deliveryFee: 0,
    discount: 180,
    total: 1020,
    paymentMethod: "Cash on Pickup",
    status: "Confirmed"
  },
  {
    id: "ORD-2026-103",
    date: "2026-09-24 09:45",
    customer: {
      name: "Dr. Meera Nambiar",
      phone: "+91 99001 54321",
      email: "meera.nam@example.com",
      address: "Villa 18, Palm Meadows, Whitefield, Bangalore 560066",
      deliveryType: "delivery",
      preferredDate: "2026-09-27",
      timeSlot: "Morning (10 AM - 12 PM)"
    },
    items: [
      {
        id: "p2",
        name: "Vanilla Floral Birthday Cake",
        size: "1.5 kg",
        flavour: "Rose",
        egg: "Eggless",
        price: 1550,
        quantity: 1,
        customMessage: "Happy Anniversary Amma & Appa",
        specialNotes: "Pink and cream edible flowers only."
      },
      {
        id: "p4",
        name: "Assorted Cupcakes",
        size: "Box of 6",
        flavour: "Rose & Lychee",
        egg: "Eggless",
        price: 380,
        quantity: 1,
        customMessage: "",
        specialNotes: ""
      }
    ],
    subtotal: 1930,
    deliveryFee: 0,
    discount: 289,
    total: 1641,
    paymentMethod: "UPI (Google Pay)",
    status: "Pending"
  },
  {
    id: "ORD-2026-098",
    date: "2026-09-23 16:20",
    customer: {
      name: "Karan Johar",
      phone: "+91 98860 33441",
      email: "karan@example.com",
      address: "12, 4th Main, Indiranagar, Bangalore 560038",
      deliveryType: "delivery",
      preferredDate: "2026-09-23",
      timeSlot: "Immediate Delivery"
    },
    items: [
      {
        id: "p5",
        name: "Belgian Mirror Glaze Mousse",
        size: "4-Portion Box",
        flavour: "Dark Chocolate",
        egg: "Eggless",
        price: 950,
        quantity: 1,
        customMessage: "",
        specialNotes: ""
      }
    ],
    subtotal: 950,
    deliveryFee: 0,
    discount: 0,
    total: 950,
    paymentMethod: "Credit Card (Online)",
    status: "Completed"
  }
];

const TESTIMONIALS = [
  { id: "t1", name: "Priya Sharma",  review: "The chocolate truffle cake was absolutely divine! The ganache was silky smooth and the presentation was stunning. Will definitely order again.", rating: 5 },
  { id: "t2", name: "Arjun Mehta",   review: "Ordered the brownie gift box for my team and everyone loved it. The packaging was premium and brownies were perfectly fudgy. Highly recommend!", rating: 5 },
  { id: "t3", name: "Sneha Pillai",  review: "The cupcakes for my daughter's baby shower were a hit! Each one was beautifully decorated and tasted incredible. So personal and thoughtful.", rating: 5 },
  { id: "t4", name: "Rohan Gupta",   review: "Amazing quality, fresh ingredients and delivered right on time! The custom floral cake matched our vision perfectly. 10/10!", rating: 5 }
];

// -- Admin & Storage helpers --
function loadAdminData() {
  try {
    const s = localStorage.getItem("hds_admin_data");
    if (s) {
      const parsed = JSON.parse(s);
      // Ensure offers have new structure if older cache exists
      if (!parsed.offers || parsed.offers.length === 0) parsed.offers = OFFERS;
      return parsed;
    }
  } catch(e) {}
  return null;
}

function saveAdminData(data) {
  try { localStorage.setItem("hds_admin_data", JSON.stringify(data)); } catch(e) {}
}

let appData = loadAdminData();
if (!appData) {
  appData = { products: PRODUCTS, gallery: GALLERY, offers: OFFERS, testimonials: TESTIMONIALS, business: { ...BUSINESS } };
  saveAdminData(appData);
}

// -- Orders Storage --
function getOrders() {
  try {
    const s = localStorage.getItem("hds_orders");
    if (s) return JSON.parse(s);
  } catch(e) {}
  // Default to sample orders
  try { localStorage.setItem("hds_orders", JSON.stringify(SAMPLE_ORDERS)); } catch(e) {}
  return SAMPLE_ORDERS;
}

function saveOrders(orders) {
  try { localStorage.setItem("hds_orders", JSON.stringify(orders)); } catch(e) {}
}

function addOrder(orderData) {
  const orders = getOrders();
  orders.unshift(orderData);
  saveOrders(orders);
  return orderData;
}

function updateOrderStatus(orderId, newStatus) {
  const orders = getOrders();
  const order = orders.find(o => o.id === orderId);
  if (order) {
    order.status = newStatus;
    saveOrders(orders);
    return true;
  }
  return false;
}

