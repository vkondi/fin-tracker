import "server-only";

export const INSTRUMENTS = {
  // Equity Instruments
  STOCKS: "Stocks",
  US_STOCKS: "US Stocks",
  IPOS: "IPOs",
  FUTURES_OPTIONS: "Futures & Options (F&O)",

  // Funds & Managed Investments
  MUTUAL_FUNDS: "Mutual Funds",
  ETFS: "ETFs",
  INDEX_FUNDS: "Index Funds",
  PMS: "Portfolio Management Services (PMS)",
  AIF: "Alternative Investment Funds (AIF)",
  REITS: "Real Estate Investment Trusts (REITs)",
  INVITS: "Infrastructure Investment Trusts (InvITs)",

  // Fixed Income Instruments
  BONDS: "Bonds",
  DEBENTURES: "Debentures",
  GOVT_SECURITIES: "Government Securities",
  CORPORATE_BONDS: "Corporate Bonds",
  T_BILLS: "Treasury Bills",
  COMMERCIAL_PAPER: "Commercial Paper",
  CERTIFICATE_OF_DEPOSIT: "Certificate of Deposit",
  ALT_FIXED_INCOME: "Alternative Fixed Income",

  // Deposit Instruments (Added missing ones)
  FIXED_DEPOSITS: "Fixed Deposits",
  RECURRING_DEPOSITS: "Recurring Deposits",
  FLEXI_DEPOSITS: "Flexi Deposits",
  SWEEP_IN_FDS: "Sweep-in FDs",
  TAX_SAVING_FDS: "Tax-Saving FDs",
  SENIOR_CITIZEN_FDS: "Senior Citizen FDs",

  // Alternative Investments
  CRYPTO: "Crypto",
  COMMODITIES: "Commodities",
  FOREX: "Forex",
  PRIVATE_EQUITY: "Private Equity",
  VENTURE_CAPITAL: "Venture Capital",
  HEDGE_FUNDS: "Hedge Funds",
  ART: "Art Investments",
  WINE: "Fine Wine Investments",
  COLLECTIBLES: "Collectibles",

  // Advisory & Specialized Services
  ROBO_ADVISORY: "Robo-Advisory",
  PRIVATE_BANKING: "Private Banking",
  WEALTH_ADVISORY: "Wealth Advisory",
  TAX_PLANNING: "Tax Planning",

  // Thematic/Specialized Investing
  THEMATIC_INVESTING: "Thematic Investing",
  ESG_INVESTING: "ESG Investing",
  SECTORAL_INVESTING: "Sectoral Investing",

  // Modern Investing Approaches
  GOAL_BASED_INVESTING: "Goal-Based Investing",
  MICRO_INVESTING: "Micro-Investing",
  SOCIAL_INVESTING: "Social Investing",
  COPY_TRADING: "Copy Trading",
  PASSIVE_INVESTING: "Passive Investing",
  QUANT_INVESTING: "Quantitative Investing",

  // Insurance-Linked (Added)
  ULIPS: "Unit Linked Insurance Plans (ULIPs)",
  ENDOWMENT_PLANS: "Endowment Plans",

  // Retirement Specific
  NPS: "National Pension System (NPS)",
  ANNUITIES: "Annuities",

  // Others
  GOLD: "Gold Investments",
  SILVER: "Silver Investments",
  P2P_LENDING: "Peer-to-Peer Lending",
  FRACTIONAL_REAL_ESTATE: "Fractional Real Estate",
};

export const PLATFORM_CATEGORIES = {
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
      INSTRUMENTS.NPS,
    ],
  },
  {
    name: "Share Market",
    category: PLATFORM_CATEGORIES.INVESTMENT_APP,
    instruments: [
      INSTRUMENTS.STOCKS,
      INSTRUMENTS.ETFS,
      INSTRUMENTS.IPOS,
      INSTRUMENTS.FUTURES_OPTIONS,
    ],
  },
  {
    name: "PhonePe",
    category: PLATFORM_CATEGORIES.INVESTMENT_APP,
    instruments: [INSTRUMENTS.MUTUAL_FUNDS, INSTRUMENTS.GOLD, INSTRUMENTS.NPS],
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
      INSTRUMENTS.PRIVATE_BANKING,
      INSTRUMENTS.WEALTH_ADVISORY,
      INSTRUMENTS.PMS,
      INSTRUMENTS.MUTUAL_FUNDS,
      INSTRUMENTS.FIXED_DEPOSITS,
      INSTRUMENTS.RECURRING_DEPOSITS,
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
      INSTRUMENTS.RECURRING_DEPOSITS,
      INSTRUMENTS.FIXED_DEPOSITS,
    ],
  },
  {
    name: "ICICI Bank",
    category: PLATFORM_CATEGORIES.BANK_WM,
    instruments: [
      INSTRUMENTS.PRIVATE_BANKING,
      INSTRUMENTS.WEALTH_ADVISORY,
      INSTRUMENTS.AIF,
      INSTRUMENTS.GOAL_BASED_INVESTING,
      INSTRUMENTS.RECURRING_DEPOSITS,
      INSTRUMENTS.FIXED_DEPOSITS,
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
  {
    name: "Midas Wealth Advisory Pvt. Ltd",
    category: PLATFORM_CATEGORIES.WM_FIRM,
    instruments: [
      INSTRUMENTS.MUTUAL_FUNDS,
      INSTRUMENTS.PMS,
      INSTRUMENTS.AIF,
      INSTRUMENTS.WEALTH_ADVISORY,
    ],
  },
];
