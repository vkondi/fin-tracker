import "server-only";

export const INSTRUMENTS = {
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
