export const ORG = "National High School Quant Association";

export type Track = { slug: string; title: string; label: string[]; blurb: string; topics: string[]; group: Group };
export type Group = "Foundations" | "Quant skills" | "Going further";
export const GROUPS: { name: Group; blurb: string }[] = [
  { name: "Foundations", blurb: "The math and the code" },
  { name: "Quant skills", blurb: "What the job is made of" },
  { name: "Going further", blurb: "Sharper tools, and getting hired" },
];

export const TRACKS: Track[] = [
  { slug: "what-is-a-quant", title: "What is a quant", label: ["What is", "a quant"],
    blurb: "What the job is, the kinds of quants, and how firms use math to make decisions with money on the line.",
    topics: ["Researcher, trader, developer", "How a market works", "Thinking in bets"], group: "Foundations" },
  { slug: "math", title: "Math for quants", label: ["Math for", "quants"], group: "Foundations",
    blurb: "The handful of math ideas everything else leans on: functions, growth, logs, vectors and rates of change.",
    topics: ["Functions and slopes", "Exponential growth", "Logarithms", "Vectors and matrices", "Rates of change"] },
  { slug: "probability", title: "Probability", label: ["Probability"],
    blurb: "The language every quant question is asked in. Learn to put a number on how likely something is and what it is worth.",
    topics: ["Independent events", "Expected value", "Risk and spread", "Conditional probability"], group: "Foundations" },
  { slug: "statistics", title: "Statistics", label: ["Statistics"], group: "Foundations",
    blurb: "Learn what data can and cannot tell you: the bell curve, sampling, confidence, testing and regression.",
    topics: ["The normal distribution", "Sampling", "Confidence intervals", "Hypothesis tests", "Regression"] },
  { slug: "game-theory", title: "Game theory", label: ["Game", "theory"],
    blurb: "How to choose when your result depends on what someone else chooses. You play each game before you learn its name.",
    topics: ["Dominant strategies", "Nash equilibrium", "Auctions", "Bluffing and signaling"], group: "Foundations" },
  { slug: "python", title: "Python", label: ["Python"],
    blurb: "The language most quant research is written in. Start from zero and finish by simulating ten thousand coin flips.",
    topics: ["Variables and loops", "Functions", "Lists and data", "Simulation"], group: "Foundations" },
  { slug: "r", title: "R", label: ["R"],
    blurb: "A language built for statistics. Summarize data, run a simulation and plot the result.",
    topics: ["Vectors", "Averages and spread", "Simulation", "Plotting"], group: "Foundations" },
  { slug: "c", title: "C", label: ["C"],
    blurb: "How a computer actually runs your code, and why a few millionths of a second matter when you are trading.",
    topics: ["Types and memory", "Loops and functions", "Arrays and pointers", "Why speed matters"], group: "Foundations" },
  { slug: "markets", title: "Markets and trading", label: ["Markets"], group: "Quant skills",
    blurb: "How trading actually works: order books, market makers, going long and short, returns and arbitrage.",
    topics: ["The order book", "Market making", "Long and short", "Returns", "Arbitrage"] },
  { slug: "bonds", title: "Bonds and interest rates", label: ["Bonds and", "rates"], group: "Quant skills",
    blurb: "Why a dollar today beats a dollar tomorrow, how bonds are priced, and why interest rates move every market.",
    topics: ["Present value", "Bond pricing", "Yield", "Duration", "The yield curve"] },
  { slug: "options", title: "Options and pricing", label: ["Options"], group: "Quant skills",
    blurb: "The contracts quants are famous for pricing. Build payoffs in code, then price an option three different ways.",
    topics: ["Calls and puts", "Put-call parity", "The binomial model", "Monte Carlo", "Delta hedging"] },
  { slug: "portfolio", title: "Portfolio theory", label: ["Portfolios"], group: "Quant skills",
    blurb: "How to combine investments: weights, the efficient frontier, beta, and what the market pays you for.",
    topics: ["Portfolio weights", "The efficient frontier", "Beta", "CAPM and alpha", "Index funds"] },
  { slug: "risk", title: "Risk and portfolios", label: ["Risk"], group: "Quant skills",
    blurb: "Staying in the game matters more than any single win. Measure risk, spread it out, and size your bets.",
    topics: ["Volatility", "Diversification", "Correlation", "Kelly sizing", "Value at risk"] },
  { slug: "strategies", title: "Strategies and backtesting", label: ["Strategies"], group: "Quant skills",
    blurb: "Turn an idea into a trading rule in Python, test it on past prices, and learn how a backtest can fool you.",
    topics: ["Moving averages", "Trading rules", "Backtesting", "Sharpe ratio", "Overfitting"] },
  { slug: "timeseries", title: "Time series", label: ["Time", "series"], group: "Quant skills",
    blurb: "Data that arrives in order has its own rules. Find trends, test for random walks, and trade mean reversion.",
    topics: ["Trend and noise", "Autocorrelation", "Random walks", "Mean reversion", "Pairs trading"] },
  { slug: "algorithms", title: "Algorithms and speed", label: ["Algorithms"], group: "Going further",
    blurb: "Write code that stays fast as the data grows: searching, sorting, hashing, recursion and a tiny order book.",
    topics: ["Counting steps", "Binary search", "Sorting", "Recursion", "Heaps"] },
  { slug: "ml", title: "Machine learning", label: ["Machine", "learning"], group: "Going further",
    blurb: "Teach a program to find patterns, measure whether it really learned, and see why markets are a hard case.",
    topics: ["Training and testing", "Fitting a line", "Measuring error", "Classification", "Nearest neighbors"] },
  { slug: "psychology", title: "Trading psychology", label: ["Psychology"], group: "Going further",
    blurb: "The mistakes every human trader makes, why quants build rules to avoid them, and how to judge your own decisions.",
    topics: ["Loss aversion", "Overconfidence", "Anchoring", "Herds and bubbles", "Process over outcome"] },
  { slug: "interview", title: "Quant interview problems", label: ["Interview", "problems"], group: "Going further",
    blurb: "The puzzles trading firms really ask: mental math, dice, Monty Hall, and making a market on the spot.",
    topics: ["Mental math", "Estimation", "Dice and cards", "Monty Hall", "Make me a market"] },
  { slug: "careers", title: "Getting there", label: ["Getting", "there"], group: "Going further",
    blurb: "The firms, the roles, what to study, what to build, how hiring works, and the rules every trader must follow.",
    topics: ["Kinds of firms", "What to study", "Projects", "The interview process", "Ethics and rules"] },
];

export const LATER_STOPS = [
  { slug: "seminars", label: ["Monthly", "seminar"] },
  { slug: "mentorship", label: ["Request", "mentorship"] },
];

export const KIT = {
  name: "The Market Game",
  costs: [
    { item: "Scenario card deck", cost: 0.75 },
    { item: "Poker-style chips", cost: 1.5 },
    { item: "Pair of dice", cost: 0.25 },
    { item: "Bid tokens", cost: 0.5 },
    { item: "Drawstring bag", cost: 0.85 },
    { item: "Laminated rules card", cost: 0.25 },
  ],
  parts: [
    { name: "Scenario cards", text: "A deck of short games. Each card sets up a situation, shows what every choice pays, and takes a few minutes to play." },
    { name: "Poker-style chips", text: "Your score, and your stake. You bid them in auctions and win or lose them every round." },
    { name: "Two dice", text: "For rounds where luck matters. A roll can trigger a market shock that changes what every choice is worth." },
    { name: "Bid tokens", text: "Write your choice, place it face down, and flip at the same time as everyone else. Nobody gets to react." },
    { name: "Drawstring bag", text: "Holds the kit and doubles as a blind draw for picking the next scenario." },
    { name: "Rules card", text: "One laminated page: how to play each game in a few sentences, and how it connects to real trading." },
    { name: "Debrief questions", text: "After each round the card asks what happened and why. That conversation is where the learning is." },
  ],
  box: { manufacture: "7 × 5 × 2.5 in", inner: "6.3701 × 4.9213 × 2.4213 in", outer: "7.0787 × 5.1575 × 2.5787 in", thickness: "0.0787 in" },
};

export const KIT_COST = KIT.costs.reduce((s, c) => s + c.cost, 0);

export type Scenario = {
  name: string; kind: string; how: string; teaches: string;
  table?: { rows: [string, string]; cols: [string, string]; cells: [[string, string], [string, string]] };
};

export const SCENARIOS: Scenario[] = [
  { name: "The Price War", kind: "Prisoner's dilemma",
    how: "Two companies sell the same thing. Each secretly chooses to hold its price or cut it, then both reveal.",
    table: { rows: ["Hold", "Cut"], cols: ["Hold", "Cut"], cells: [["3, 3", "0, 5"], ["5, 0", "1, 1"]] },
    teaches: "Cutting is better for you whatever the rival does, so both cut and both end up worse off. That resting point is a Nash equilibrium." },
  { name: "The Standoff", kind: "Chicken",
    how: "Two traders want the same deal. Each chooses to back down or push. If both push, both lose big.",
    table: { rows: ["Back down", "Push"], cols: ["Back down", "Push"], cells: [["2, 2", "1, 4"], ["4, 1", "−3, −3"]] },
    teaches: "There is no single best move. Convincing the other side you will not back down can be the winning play." },
  { name: "The Auction", kind: "Sealed-bid auction",
    how: "Everyone draws a secret value for the item, then bids chips face down. The highest bid wins and pays what it bid. Your score is your value minus your bid.",
    teaches: "Bid your full value and you win nothing even when you win. Quants call the fix bid shading, and the trap the winner's curse." },
  { name: "The Split", kind: "Ultimatum game",
    how: "One player proposes how to split 10 chips. The other accepts, or rejects so that both get nothing.",
    teaches: "Pure logic says accept any offer above zero. Real people reject unfair ones, and a good strategy plans for that." },
  { name: "The Tip-Off", kind: "Signaling game",
    how: "One player peeks at a hidden card that says whether the market goes up or down, then tells the other player something. It might be true.",
    teaches: "Information is only worth what its source is worth. You learn to ask what the other player gains if you believe them." },
];

export const STATES = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","District of Columbia","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming","Outside the US"];
