/**
 * Market Prices Frontend Service Abstraction
 * 
 * NOTE FOR BACKEND TEAM:
 * This service currently provides development & realistic regional mandi data.
 * When the real-time agmarknet/mandi backend API is deployed, connect the API
 * endpoints inside the async functions below without modifying the UI layer.
 */

import { Mandi, MarketCrop, CropCategory, PriceAlertConfig } from "@/types/market";

export const AVAILABLE_MANDIS: Mandi[] = [
  {
    id: "enamumala",
    name: "Enamumala Mandi, Warangal",
    district: "Warangal",
    state: "Telangana",
    distanceKm: 4,
    isPrimary: true,
  },
  {
    id: "narsampet",
    name: "Narsampet Mandi, Warangal",
    district: "Warangal",
    state: "Telangana",
    distanceKm: 28,
  },
  {
    id: "mulugu",
    name: "Mulugu Mandi, Mulugu",
    district: "Mulugu",
    state: "Telangana",
    distanceKm: 35,
  },
  {
    id: "mahabubabad",
    name: "Mahabubabad Mandi, Mahabubabad",
    district: "Mahabubabad",
    state: "Telangana",
    distanceKm: 45,
  },
  {
    id: "khammam",
    name: "Khammam Agriculture Market, Khammam",
    district: "Khammam",
    state: "Telangana",
    distanceKm: 65,
  },
  {
    id: "karimnagar",
    name: "Karimnagar Grain Market, Karimnagar",
    district: "Karimnagar",
    state: "Telangana",
    distanceKm: 72,
  },
];

// Helper to generate 30-day realistic price history terminating at basePrice
function generate30DayTrend(basePrice: number, volatility: number = 0.04): { day: number; date: string; price: number }[] {
  const points: { day: number; date: string; price: number }[] = [];
  const today = new Date();
  
  // Create a realistic upward/downward curve leading to basePrice
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dayStr = d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
    
    // Smooth random walk bounded by volatility
    const drift = Math.sin((30 - i) / 5) * volatility * 0.8;
    const factor = 1 + drift + ((30 - i) / 30) * 0.02 - 0.02;
    const price = Math.round((basePrice * (i === 0 ? 1 : factor)) / 10) * 10;
    
    points.push({
      day: 30 - i,
      date: dayStr,
      price: i === 0 ? basePrice : price,
    });
  }
  return points;
}

export const BASE_CROPS: MarketCrop[] = [
  {
    id: "paddy-rice-grade-a",
    name: "Paddy (Rice - Grade A)",
    variety: "Grade A / BPT 5204 (Samba Mahsuri)",
    category: "grains",
    currentPrice: 2150,
    unit: "per quintal",
    priceChange: 68,
    priceChangePercent: 3.2,
    isPositive: true,
    todayMin: 2050,
    todayMax: 2200,
    govtMsp: 2040,
    arrivals: "4,850 Quintals",
    tradingWindow: "10:00 AM – 02:00 PM",
    lastUpdated: "Today, 11:30 AM",
    recommendation: "favorable",
    recommendationTitle: "Favorable Selling Window",
    recommendationDesc: "Mill procurement is active with high demand. Current prices are ₹110 (5.4%) above Government MSP.",
    trendSummary: "Prices have trended upward by 3.2% this week due to steady festive procurement and controlled arrivals.",
    trend30Days: generate30DayTrend(2150, 0.05),
    nearbyMandis: [
      { mandiId: "enamumala", mandiName: "Enamumala Mandi", distanceKm: 4, price: 2180, priceDiff: 30 },
      { mandiId: "narsampet", mandiName: "Narsampet Mandi", distanceKm: 28, price: 2120, priceDiff: -30 },
      { mandiId: "mulugu", mandiName: "Mulugu Mandi", distanceKm: 35, price: 2100, priceDiff: -50 },
    ],
  },
  {
    id: "cotton-long-staple",
    name: "Cotton (Long Staple)",
    variety: "Bt Hybrid 28-30mm (Bunny / Brahma)",
    category: "grains",
    currentPrice: 7450,
    unit: "per quintal",
    priceChange: 180,
    priceChangePercent: 2.5,
    isPositive: true,
    todayMin: 7200,
    todayMax: 7600,
    govtMsp: 7020,
    arrivals: "3,200 Quintals",
    tradingWindow: "09:30 AM – 01:30 PM",
    lastUpdated: "Today, 10:45 AM",
    recommendation: "hold",
    recommendationTitle: "Hold Strategy Advised (3-5 Days)",
    recommendationDesc: "International lint futures show steady upward momentum. Local arrivals expected to stabilize next week.",
    trendSummary: "Firm spot bids supported by spinning mill forward bookings; weekly gains at ₹180/quintal.",
    trend30Days: generate30DayTrend(7450, 0.04),
    nearbyMandis: [
      { mandiId: "enamumala", mandiName: "Enamumala Mandi", distanceKm: 4, price: 7480, priceDiff: 30 },
      { mandiId: "narsampet", mandiName: "Narsampet Mandi", distanceKm: 28, price: 7410, priceDiff: -40 },
      { mandiId: "mulugu", mandiName: "Mulugu Mandi", distanceKm: 35, price: 7380, priceDiff: -70 },
    ],
  },
  {
    id: "red-chilli-teja",
    name: "Red Chilli (Teja)",
    variety: "Teja Stemless Grade 1",
    category: "spices",
    currentPrice: 18200,
    unit: "per quintal",
    priceChange: 650,
    priceChangePercent: 3.7,
    isPositive: true,
    todayMin: 17500,
    todayMax: 18800,
    govtMsp: 16500,
    arrivals: "1,600 Bags",
    tradingWindow: "08:30 AM – 12:30 PM",
    lastUpdated: "Today, 12:00 PM",
    recommendation: "favorable",
    recommendationTitle: "Strong Export Demand",
    recommendationDesc: "High export demand from Southeast Asia and domestic spice processors driving premium prices.",
    trendSummary: "Gains of 3.7% today; high quality lots attracting robust bidding from overseas procurement houses.",
    trend30Days: generate30DayTrend(18200, 0.06),
    nearbyMandis: [
      { mandiId: "enamumala", mandiName: "Enamumala Mandi", distanceKm: 4, price: 18350, priceDiff: 150 },
      { mandiId: "khammam", mandiName: "Khammam Mandi", distanceKm: 65, price: 18400, priceDiff: 200 },
      { mandiId: "mahabubabad", mandiName: "Mahabubabad Mandi", distanceKm: 45, price: 18050, priceDiff: -150 },
    ],
  },
  {
    id: "maize-yellow",
    name: "Maize (Yellow)",
    variety: "Hybrid Yellow Grain (Poultry Grade)",
    category: "grains",
    currentPrice: 1980,
    unit: "per quintal",
    priceChange: -30,
    priceChangePercent: 1.5,
    isPositive: false,
    todayMin: 1920,
    todayMax: 2050,
    govtMsp: 1962,
    arrivals: "5,200 Quintals",
    tradingWindow: "10:00 AM – 03:00 PM",
    lastUpdated: "Today, 01:15 PM",
    recommendation: "hold",
    recommendationTitle: "Hold for Recovery",
    recommendationDesc: "Heavy seasonal arrivals causing short-term dip. Poultry feed buyers likely to enter market next week.",
    trendSummary: "Temporary softening of 1.5% due to peak arrivals; prices expected to test ₹2,050 support shortly.",
    trend30Days: generate30DayTrend(1980, 0.03),
    nearbyMandis: [
      { mandiId: "enamumala", mandiName: "Enamumala Mandi", distanceKm: 4, price: 1990, priceDiff: 10 },
      { mandiId: "narsampet", mandiName: "Narsampet Mandi", distanceKm: 28, price: 1960, priceDiff: -20 },
      { mandiId: "mulugu", mandiName: "Mulugu Mandi", distanceKm: 35, price: 1950, priceDiff: -30 },
    ],
  },
  {
    id: "tomato-hybrid",
    name: "Tomato (Hybrid)",
    variety: "Hybrid Desi Round (Red Firm)",
    category: "vegetables",
    currentPrice: 1650,
    unit: "per quintal",
    priceChange: 120,
    priceChangePercent: 7.8,
    isPositive: true,
    todayMin: 1400,
    todayMax: 1800,
    govtMsp: 1200,
    arrivals: "2,800 Crates",
    tradingWindow: "06:00 AM – 11:00 AM",
    lastUpdated: "Today, 09:30 AM",
    recommendation: "sell_now",
    recommendationTitle: "High Spot Price — Sell Now",
    recommendationDesc: "Nearby metropolitan market demand is at weekly high; produce perishability warrants immediate dispatch.",
    trendSummary: "7.8% surge in morning trading as transport trucks from Hyderabad absorb wholesale volume.",
    trend30Days: generate30DayTrend(1650, 0.08),
    nearbyMandis: [
      { mandiId: "enamumala", mandiName: "Enamumala Mandi", distanceKm: 4, price: 1680, priceDiff: 30 },
      { mandiId: "narsampet", mandiName: "Narsampet Mandi", distanceKm: 28, price: 1620, priceDiff: -30 },
      { mandiId: "karimnagar", mandiName: "Karimnagar Mandi", distanceKm: 72, price: 1700, priceDiff: 50 },
    ],
  },
  {
    id: "onion-nashik-red",
    name: "Onion (Nashik Red)",
    variety: "Medium Red Bulbs (Grade A)",
    category: "vegetables",
    currentPrice: 2400,
    unit: "per quintal",
    priceChange: -60,
    priceChangePercent: 2.4,
    isPositive: false,
    todayMin: 2250,
    todayMax: 2550,
    govtMsp: 1850,
    arrivals: "3,100 Quintals",
    tradingWindow: "07:00 AM – 12:00 PM",
    lastUpdated: "Today, 11:00 AM",
    recommendation: "hold",
    recommendationTitle: "Steady Storage Window",
    recommendationDesc: "Adequate cold storage viability; secondary arrivals from neighboring districts stabilizing.",
    trendSummary: "Moderate dip of 2.4% following improved highway transit speeds from Maharashtra borders.",
    trend30Days: generate30DayTrend(2400, 0.05),
    nearbyMandis: [
      { mandiId: "enamumala", mandiName: "Enamumala Mandi", distanceKm: 4, price: 2420, priceDiff: 20 },
      { mandiId: "mahabubabad", mandiName: "Mahabubabad Mandi", distanceKm: 45, price: 2380, priceDiff: -20 },
      { mandiId: "karimnagar", mandiName: "Karimnagar Mandi", distanceKm: 72, price: 2450, priceDiff: 50 },
    ],
  },
  {
    id: "turmeric-salem",
    name: "Turmeric (Salem)",
    variety: "Salem Yellow Finger (Curcumin >3.5%)",
    category: "spices",
    currentPrice: 14500,
    unit: "per quintal",
    priceChange: 350,
    priceChangePercent: 2.5,
    isPositive: true,
    todayMin: 14000,
    todayMax: 15100,
    govtMsp: 12500,
    arrivals: "850 Quintals",
    tradingWindow: "09:00 AM – 01:00 PM",
    lastUpdated: "Today, 12:45 PM",
    recommendation: "favorable",
    recommendationTitle: "Firm Bullish Trend",
    recommendationDesc: "Curcumin content testing in high brackets; industrial buyers offering consistent bids.",
    trendSummary: "Sustained upward trend of 2.5% supported by pharmaceutical and food processing extractors.",
    trend30Days: generate30DayTrend(14500, 0.04),
    nearbyMandis: [
      { mandiId: "enamumala", mandiName: "Enamumala Mandi", distanceKm: 4, price: 14600, priceDiff: 100 },
      { mandiId: "khammam", mandiName: "Khammam Mandi", distanceKm: 65, price: 14650, priceDiff: 150 },
      { mandiId: "mulugu", mandiName: "Mulugu Mandi", distanceKm: 35, price: 14350, priceDiff: -150 },
    ],
  },
  {
    id: "mango-banganapalle",
    name: "Mango (Banganapalle)",
    variety: "Grade A Table Fruit (Orchard Fresh)",
    category: "fruits",
    currentPrice: 6800,
    unit: "per quintal",
    priceChange: 250,
    priceChangePercent: 3.8,
    isPositive: true,
    todayMin: 6400,
    todayMax: 7200,
    govtMsp: 5000,
    arrivals: "1,200 Crates",
    tradingWindow: "07:30 AM – 12:30 PM",
    lastUpdated: "Today, 10:15 AM",
    recommendation: "favorable",
    recommendationTitle: "Premium Seasonal Rate",
    recommendationDesc: "Early harvest consignments receiving prime bids from regional urban centers.",
    trendSummary: "Strong 3.8% rally as export grade sorting commands up to ₹7,200/quintal in active auction sessions.",
    trend30Days: generate30DayTrend(6800, 0.07),
    nearbyMandis: [
      { mandiId: "enamumala", mandiName: "Enamumala Mandi", distanceKm: 4, price: 6850, priceDiff: 50 },
      { mandiId: "narsampet", mandiName: "Narsampet Mandi", distanceKm: 28, price: 6750, priceDiff: -50 },
      { mandiId: "khammam", mandiName: "Khammam Mandi", distanceKm: 65, price: 6900, priceDiff: 100 },
    ],
  },
];

class MarketPriceService {
  private selectedMandiId: string = "enamumala";

  /**
   * Get all registered agricultural mandis
   */
  async getMandis(): Promise<Mandi[]> {
    // Simulate brief network latency for realistic feel
    await new Promise((resolve) => setTimeout(resolve, 80));
    return AVAILABLE_MANDIS;
  }

  /**
   * Get the current active mandi
   */
  async getActiveMandi(mandiId?: string): Promise<Mandi> {
    const targetId = mandiId || this.selectedMandiId;
    return AVAILABLE_MANDIS.find((m) => m.id === targetId) || AVAILABLE_MANDIS[0];
  }

  /**
   * Set active mandi
   */
  setActiveMandi(mandiId: string): void {
    if (AVAILABLE_MANDIS.some((m) => m.id === mandiId)) {
      this.selectedMandiId = mandiId;
    }
  }

  /**
   * Get crop price list filtered by Mandi, Category and Search term
   */
  async getMarketPrices(
    mandiId?: string,
    category: CropCategory = "all",
    searchQuery: string = ""
  ): Promise<MarketCrop[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const activeMandi = await this.getActiveMandi(mandiId);
    const mandiOffset = activeMandi.id === "enamumala" ? 0 : activeMandi.distanceKm * 0.8;

    return BASE_CROPS.map((crop) => {
      // Slightly adjust price based on distance from primary hub
      const adjustedPrice = Math.round((crop.currentPrice + (activeMandi.id === "enamumala" ? 0 : (crop.isPositive ? 1 : -1) * mandiOffset)) / 10) * 10;
      return {
        ...crop,
        currentPrice: adjustedPrice,
      };
    }).filter((crop) => {
      const matchesCategory = category === "all" || crop.category === category;
      const normalizedSearch = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !normalizedSearch ||
        crop.name.toLowerCase().includes(normalizedSearch) ||
        crop.variety.toLowerCase().includes(normalizedSearch) ||
        crop.category.toLowerCase().includes(normalizedSearch);
      return matchesCategory && matchesSearch;
    });
  }

  /**
   * Get detailed price information for a specific crop
   */
  async getCropPriceDetail(cropId: string, mandiId?: string): Promise<MarketCrop | null> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const activeMandi = await this.getActiveMandi(mandiId);
    const crop = BASE_CROPS.find((c) => c.id === cropId);
    if (!crop) return null;

    const mandiOffset = activeMandi.id === "enamumala" ? 0 : activeMandi.distanceKm * 0.8;
    const adjustedPrice = Math.round((crop.currentPrice + (activeMandi.id === "enamumala" ? 0 : (crop.isPositive ? 1 : -1) * mandiOffset)) / 10) * 10;

    return {
      ...crop,
      currentPrice: adjustedPrice,
      trend30Days: generate30DayTrend(adjustedPrice, 0.04),
    };
  }

  /**
   * Price Alert Persistence in Browser LocalStorage
   */
  getPriceAlert(cropId: string): PriceAlertConfig | null {
    if (typeof window === "undefined") return null;
    try {
      const data = localStorage.getItem(`rs360_price_alert_${cropId}`);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  savePriceAlert(config: PriceAlertConfig): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(`rs360_price_alert_${config.cropId}`, JSON.stringify(config));
    } catch {
      // Storage unavailable
    }
  }

  togglePriceAlert(cropId: string, defaultTargetPrice: number, cropName: string): boolean {
    const existing = this.getPriceAlert(cropId);
    const newState = !existing?.enabled;
    this.savePriceAlert({
      cropId,
      cropName,
      targetPrice: existing?.targetPrice || defaultTargetPrice,
      enabled: newState,
      mandiId: this.selectedMandiId,
    });
    return newState;
  }
}

export const marketPriceService = new MarketPriceService();
export default marketPriceService;
