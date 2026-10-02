export const ORG = "National High School Quant Association";

export type Track = { slug: string; title: string; label: string[]; blurb: string; topics: string[] };

export const TRACKS: Track[] = [
  { slug: "what-is-a-quant", title: "What is a quant", label: ["What is", "a quant"],
    blurb: "What the job is, the kinds of quants, and how firms use math to make decisions with money on the line.",
    topics: ["Researcher, trader, developer", "How a market works", "Thinking in bets"] },
  { slug: "probability", title: "Probability and statistics", label: ["Probability"],
    blurb: "The language every quant question is asked in. Learn to put a number on how likely something is and what it is worth.",
    topics: ["Independent events", "Expected value", "Risk and spread", "Conditional probability"] },
  { slug: "game-theory", title: "Game theory", label: ["Game", "theory"],
    blurb: "How to choose when your result depends on what someone else chooses. You play each game before you learn its name.",
    topics: ["Dominant strategies", "Nash equilibrium", "Auctions", "Bluffing and signaling"] },
  { slug: "python", title: "Python", label: ["Python"],
    blurb: "The language most quant research is written in. Start from zero and finish by simulating ten thousand coin flips.",
    topics: ["Variables and loops", "Functions", "Lists and data", "Simulation"] },
  { slug: "r", title: "R", label: ["R"],
    blurb: "A language built for statistics. Summarize data, run a simulation and plot the result.",
    topics: ["Vectors", "Averages and spread", "Simulation", "Plotting"] },
  { slug: "c", title: "C", label: ["C"],
    blurb: "How a computer actually runs your code, and why a few millionths of a second matter when you are trading.",
    topics: ["Types and memory", "Loops and functions", "Arrays and pointers", "Why speed matters"] },
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
