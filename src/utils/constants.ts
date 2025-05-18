// Database table names
export const SYS_USERS_TABLE = "SYS_USERS";
export const FINANCES_TABLE = "FINANCES";

// Tracker table labels
export const TRACKER_TABLE_LABELS = {
  platform: "Platform",
  type: "Type",
  owner: "Owner",
  investedAmount: "Invested Amount",
  currentAmount: "Current Amount",
  absReturn: "Abs Return",
  absReturnPercentage: "Abs Return %",
  lastUpdated: "Last updated",
  actions: "Actions",
};

// Color definitions with descriptive names
export const TEAL_BLUE = "#57B4BA";
export const DARK_TEAL = "#015551";
export const SEA_GREEN = "#328E6E";
export const SKY_BLUE = "#60B5FF";
export const LIGHT_BROWN = "#BF9264";
export const ORANGE = "#FFA955";
export const RUBY_RED = "#CF0F47";
export const DARK_RED = "#8E1616";
export const PINK = "#D50B8B";
export const GOLD = "#DDA853";
export const DARK_ORANGE = "#E78B48";
export const DARK_PURPLE = "#604652";
export const PLUM = "#4F1C51";
export const LAVENDER = "#B399FF";
export const MINT_GREEN = "#4DCCA7";
export const CORAL = "#FF7F50";
export const MUSTARD = "#FFDB58";
export const DARK_BLUE = "#003366";
export const LILAC = "#C8A2C8";
export const OLIVE_GREEN = "#6B8E23";
export const PEACH = "#FFDAB9";
export const STEEL_BLUE = "#4682B4";
export const SALMON = "#FA8072";
export const FOREST_GREEN = "#228B22";
export const MAUVE = "#E0B0FF";
export const TURQUOISE = "#40E0D0";
export const BRICK_RED = "#B22222";
export const SAND = "#F4A460";
export const PERIWINKLE = "#CCCCFF";
export const EMERALD = "#50C878";
export const RUST = "#B7410E";
export const LIGHT_PINK = "#FFB6C1";
export const DARK_GREEN = "#006400";
export const VIOLET = "#8A2BE2";
export const TAN = "#D2B48C";
export const CERULEAN = "#007BA7";
export const MAROON = "#800000";
export const LIME = "#00FF00";
export const INDIGO = "#4B0082";
export const WHEAT = "#F5DEB3";
export const AQUA = "#00FFFF";
export const CRIMSON = "#DC143C";
export const KHAKI = "#C3B091";
export const SLATE_GRAY = "#708090";
export const MAGENTA = "#FF00FF";
export const NAVY = "#000080";
export const CHOCOLATE = "#D2691E";
export const SILVER = "#C0C0C0";
export const HOT_PINK = "#FF69B4";
export const DARK_SLATE_BLUE = "#483D8B";
export const CYAN = "#00FFFF";
export const DEEP_PINK = "#FF1493";
export const SIENNA = "#A0522D";

// Chart colors array using the declared variables
export const CHART_COLORS = [
  TEAL_BLUE,
  DARK_TEAL,
  SEA_GREEN,
  SKY_BLUE,
  LIGHT_BROWN,
  ORANGE,
  RUBY_RED,
  DARK_RED,
  PINK,
  GOLD,
  DARK_ORANGE,
  DARK_PURPLE,
  PLUM,
  LAVENDER,
  MINT_GREEN,
  CORAL,
  MUSTARD,
  DARK_BLUE,
  LILAC,
  OLIVE_GREEN,
  PEACH,
  STEEL_BLUE,
  SALMON,
  FOREST_GREEN,
  MAUVE,
  TURQUOISE,
  BRICK_RED,
  SAND,
  PERIWINKLE,
  EMERALD,
  RUST,
  LIGHT_PINK,
  DARK_GREEN,
  VIOLET,
  TAN,
  CERULEAN,
  MAROON,
  LIME,
  INDIGO,
  WHEAT,
  AQUA,
  CRIMSON,
  KHAKI,
  SLATE_GRAY,
  MAGENTA,
  NAVY,
  CHOCOLATE,
  SILVER,
  HOT_PINK,
  DARK_SLATE_BLUE,
  CYAN,
  DEEP_PINK,
  SIENNA
];

const INSTRUMENTS = {
  STOCKS: "Stocks",
  MUTUAL_FUNDS: "Mutual Funds",
  ETFS: "ETFs",
  FIXED_DEPOSITS: "Fixed Deposits",
  BONDS: "Bonds",
  DEBENTURES: "Debentures",
  GOVT_SECURITIES: "Government Securities",
  FUTURES_OPTIONS: "Futures & Options (F&O)",
  IPOS: "IPOs",
  US_STOCKS: "US Stocks",
  THEMATIC_INVESTING: "Thematic Investing",
  ROBO_ADVISORY: "Robo-Advisory",
  CRYPTO: "Crypto",
  ALT_FIXED_INCOME: "Alternative Fixed Income",
  PMS: "Portfolio Management Services (PMS)",
  AIF: "Alternative Investment Funds (AIF)",
  PRIVATE_BANKING: "Private Banking",
  WEALTH_ADVISORY: "Wealth Advisory",
  TAX_PLANNING: "Tax Planning",
  GOAL_BASED_INVESTING: "Goal-Based Investing",
  MICRO_INVESTING: "Micro-Investing",
  SOCIAL_INVESTING: "Social Investing",
  COPY_TRADING: "Copy Trading",
  PASSIVE_INVESTING: "Passive Investing",
};

const PLATFORM_CATEGORIES = {
  INVESTMENT_APP: "Investment App",
  TRADING: "Trading Platform",
  CRYPTO_EXCHANGE: "Crypto Exchange",
  BANK_WM: "Bank - Wealth Management",
  WM_FIRM: "Wealth Management Firm",
  MF_GOAL: "MF/Goal-Based App",
  MF_US_STOCKS: "MF/US Stocks",
  THEMATIC_INVESTING: "Thematic Investing",
  US_INVEST: "US Investing",
};

export const PLATFORMS = [
  {
    name: "Groww",
    category: PLATFORM_CATEGORIES.INVESTMENT_APP,
    instruments: [
      INSTRUMENTS.STOCKS,
      INSTRUMENTS.MUTUAL_FUNDS,
      INSTRUMENTS.ETFS,
      INSTRUMENTS.FUTURES_OPTIONS,
      INSTRUMENTS.IPOS,
    ],
  },
  {
    name: "ET Money",
    category: PLATFORM_CATEGORIES.MF_GOAL,
    instruments: [
      INSTRUMENTS.MUTUAL_FUNDS,
      INSTRUMENTS.TAX_PLANNING,
      INSTRUMENTS.GOAL_BASED_INVESTING,
    ],
  },
  {
    name: "Kuvera",
    category: PLATFORM_CATEGORIES.MF_US_STOCKS,
    instruments: [
      INSTRUMENTS.MUTUAL_FUNDS,
      INSTRUMENTS.FIXED_DEPOSITS,
      INSTRUMENTS.US_STOCKS,
      INSTRUMENTS.GOAL_BASED_INVESTING,
    ],
  },
  {
    name: "Scripbox",
    category: PLATFORM_CATEGORIES.MF_GOAL,
    instruments: [
      INSTRUMENTS.MUTUAL_FUNDS,
      INSTRUMENTS.ROBO_ADVISORY,
      INSTRUMENTS.GOAL_BASED_INVESTING,
    ],
  },
  {
    name: "Paytm Money",
    category: PLATFORM_CATEGORIES.INVESTMENT_APP,
    instruments: [
      INSTRUMENTS.STOCKS,
      INSTRUMENTS.MUTUAL_FUNDS,
      INSTRUMENTS.ETFS,
      INSTRUMENTS.IPOS,
    ],
  },
  {
    name: "INDmoney",
    category: PLATFORM_CATEGORIES.WM_FIRM,
    instruments: [
      INSTRUMENTS.US_STOCKS,
      INSTRUMENTS.MUTUAL_FUNDS,
      INSTRUMENTS.AIF,
      INSTRUMENTS.TAX_PLANNING,
    ],
  },
  {
    name: "WealthDesk",
    category: PLATFORM_CATEGORIES.THEMATIC_INVESTING,
    instruments: [
      INSTRUMENTS.THEMATIC_INVESTING,
      INSTRUMENTS.STOCKS,
      INSTRUMENTS.ETFS,
    ],
  },
  {
    name: "5paisa",
    category: PLATFORM_CATEGORIES.TRADING,
    instruments: [
      INSTRUMENTS.STOCKS,
      INSTRUMENTS.MUTUAL_FUNDS,
      INSTRUMENTS.FUTURES_OPTIONS,
      INSTRUMENTS.ROBO_ADVISORY,
    ],
  },
  {
    name: "Smallcase",
    category: PLATFORM_CATEGORIES.THEMATIC_INVESTING,
    instruments: [
      INSTRUMENTS.THEMATIC_INVESTING,
      INSTRUMENTS.STOCKS,
      INSTRUMENTS.ETFS,
    ],
  },
  {
    name: "Coin by Zerodha",
    category: PLATFORM_CATEGORIES.MF_GOAL,
    instruments: [INSTRUMENTS.MUTUAL_FUNDS, INSTRUMENTS.PASSIVE_INVESTING],
  },
  {
    name: "Zerodha",
    category: PLATFORM_CATEGORIES.TRADING,
    instruments: [
      INSTRUMENTS.STOCKS,
      INSTRUMENTS.ETFS,
      INSTRUMENTS.FUTURES_OPTIONS,
      INSTRUMENTS.IPOS,
      INSTRUMENTS.MUTUAL_FUNDS,
    ],
  },
  {
    name: "Upstox",
    category: PLATFORM_CATEGORIES.TRADING,
    instruments: [
      INSTRUMENTS.STOCKS,
      INSTRUMENTS.MUTUAL_FUNDS,
      INSTRUMENTS.FUTURES_OPTIONS,
      INSTRUMENTS.IPOS,
    ],
  },
  {
    name: "Angel One",
    category: PLATFORM_CATEGORIES.TRADING,
    instruments: [
      INSTRUMENTS.STOCKS,
      INSTRUMENTS.MUTUAL_FUNDS,
      INSTRUMENTS.IPOS,
      INSTRUMENTS.FUTURES_OPTIONS,
    ],
  },
  {
    name: "ICICI Direct",
    category: PLATFORM_CATEGORIES.TRADING,
    instruments: [
      INSTRUMENTS.STOCKS,
      INSTRUMENTS.MUTUAL_FUNDS,
      INSTRUMENTS.BONDS,
      INSTRUMENTS.IPOS,
    ],
  },
  {
    name: "HDFC Sky",
    category: PLATFORM_CATEGORIES.BANK_WM,
    instruments: [
      INSTRUMENTS.STOCKS,
      INSTRUMENTS.MUTUAL_FUNDS,
      INSTRUMENTS.IPOS,
    ],
  },
  {
    name: "Kotak Stock Trader",
    category: PLATFORM_CATEGORIES.BANK_WM,
    instruments: [
      INSTRUMENTS.STOCKS,
      INSTRUMENTS.MUTUAL_FUNDS,
      INSTRUMENTS.IPOS,
    ],
  },
  {
    name: "WazirX",
    category: PLATFORM_CATEGORIES.CRYPTO_EXCHANGE,
    instruments: [INSTRUMENTS.CRYPTO],
  },
  {
    name: "CoinDCX",
    category: PLATFORM_CATEGORIES.CRYPTO_EXCHANGE,
    instruments: [INSTRUMENTS.CRYPTO],
  },
  {
    name: "GoldenPi",
    category: PLATFORM_CATEGORIES.INVESTMENT_APP,
    instruments: [
      INSTRUMENTS.BONDS,
      INSTRUMENTS.DEBENTURES,
      INSTRUMENTS.GOVT_SECURITIES,
    ],
  },
  {
    name: "Vested",
    category: PLATFORM_CATEGORIES.US_INVEST,
    instruments: [INSTRUMENTS.US_STOCKS, INSTRUMENTS.ETFS],
  },
  {
    name: "HDFC Bank – Private Banking & Wealth Management",
    category: PLATFORM_CATEGORIES.BANK_WM,
    instruments: [
      INSTRUMENTS.WEALTH_ADVISORY,
      INSTRUMENTS.PMS,
      INSTRUMENTS.MUTUAL_FUNDS,
      INSTRUMENTS.FIXED_DEPOSITS,
    ],
  },
  {
    name: "Axis Bank – Burgundy Private & Wealth Services",
    category: PLATFORM_CATEGORIES.BANK_WM,
    instruments: [
      INSTRUMENTS.PRIVATE_BANKING,
      INSTRUMENTS.WEALTH_ADVISORY,
      INSTRUMENTS.AIF,
    ],
  },
  {
    name: "State Bank of India",
    category: PLATFORM_CATEGORIES.BANK_WM,
    instruments: [
      INSTRUMENTS.PRIVATE_BANKING,
      INSTRUMENTS.WEALTH_ADVISORY,
      INSTRUMENTS.AIF,
    ],
  },
  {
    name: "ICICI Bank",
    category: PLATFORM_CATEGORIES.BANK_WM,
    instruments: [
      INSTRUMENTS.PRIVATE_BANKING,
      INSTRUMENTS.WEALTH_ADVISORY,
      INSTRUMENTS.AIF,
    ],
  },
  {
    name: "IIFL Wealth",
    category: PLATFORM_CATEGORIES.WM_FIRM,
    instruments: [
      INSTRUMENTS.PMS,
      INSTRUMENTS.AIF,
      INSTRUMENTS.WEALTH_ADVISORY,
    ],
  },
];
