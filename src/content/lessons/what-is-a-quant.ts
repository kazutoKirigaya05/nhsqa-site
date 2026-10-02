import type { Lesson } from "./types";

export const whatIsAQuant: Lesson[] = [
  { slug: "what-quants-do", title: "What quants do", summary: "The job, and the three kinds of people who do it.",
    steps: [
      { kind: "read", title: "Decisions with numbers", body: [
        "A **quant** (short for quantitative analyst) uses math, statistics and code to make decisions about money.",
        "Most people decide with a feeling: this stock seems good, that price seems high. A quant asks for the number. How likely is it? What is it worth? How bad is the worst case?",
        "Trading firms, banks and investment funds hire quants because a small edge, repeated millions of times, adds up." ] },
      { kind: "mc", q: "Which of these is a quant-style question?", options: [
        "Which company has the coolest logo?",
        "If I make this bet 1,000 times, how much do I expect to win?",
        "Which stock are my friends talking about?",
        "What will be on the news tomorrow?" ], answer: 1,
        explain: "Quants turn decisions into questions with numeric answers, then check those answers against data." },
      { kind: "read", title: "Three kinds of quant", body: [
        "**Quant researchers** look for patterns in data and test whether they are real. The work is close to science.",
        "**Quant traders** make the decisions, often in seconds, with real money on the line.",
        "**Quant developers** build the fast, reliable systems that everything else runs on.",
        "On small teams one person may do all three. All of them share the same base: probability, programming and clear thinking under pressure." ] },
      { kind: "mc", q: "A firm's trading system is too slow and keeps missing prices. Who fixes it?", options: ["A quant researcher", "A quant trader", "A quant developer"], answer: 2,
        explain: "Developers build and speed up the systems. Researchers find the ideas and traders act on them." },
      { kind: "mc", q: "A researcher finds that a stock went up on the last 5 Mondays. What should they do next?", options: [
        "Buy it every Monday from now on", "Test whether the pattern holds over many years of data", "Tell the traders it is a sure thing" ], answer: 1,
        explain: "Five Mondays could easily be luck. A researcher's job is to tell a real pattern from a coincidence before anyone risks money on it." },
    ] },
  { slug: "how-a-market-works", title: "How a market works", summary: "Bids, asks and the people in the middle.",
    steps: [
      { kind: "read", title: "Two prices, not one", body: [
        "A market is a place where buyers and sellers meet. Every item being traded has two prices at any moment.",
        "The **bid** is the most any buyer will pay right now. The **ask** is the least any seller will accept.",
        "The gap between them is the **spread**. If the bid is $9.90 and the ask is $10.10, the spread is 20 cents." ] },
      { kind: "num", q: "A stock has a bid of $24.95 and an ask of $25.05. What is the spread, in dollars?", answer: 0.1, tol: 0.001, prefix: "$",
        explain: "$25.05 − $24.95 = $0.10." },
      { kind: "read", title: "Market makers", body: [
        "A **market maker** stands in the middle. It offers to buy at the bid and sell at the ask, all day, to anyone.",
        "When it buys at $9.90 and sells at $10.10, it keeps the 20 cents. That is its pay for always being there.",
        "The risk: the price can move while it is holding what it bought. Much of quant trading is working out how wide the spread must be to cover that risk." ] },
      { kind: "num", q: "A market maker buys 100 shares at $9.90 and sells all 100 at $10.10. How much does it make, in dollars?", answer: 20, prefix: "$",
        explain: "It earns the 20 cent spread on each of 100 shares: 100 × $0.20 = $20." },
      { kind: "mc", q: "Big news is about to come out and nobody knows if it is good or bad. What does a market maker do with its spread?", options: [
        "Makes it narrower, to attract more trades", "Makes it wider, because the price could jump either way", "Leaves it exactly the same" ], answer: 1,
        explain: "More uncertainty means more risk of being caught on the wrong side, so the market maker charges more for standing in the middle." },
    ] },
  { slug: "thinking-in-bets", title: "Thinking in bets", summary: "Expected value, the idea behind almost every quant decision.",
    steps: [
      { kind: "read", title: "Expected value", body: [
        "Here is a bet. Flip a fair coin. Heads, you win $12. Tails, you lose $4.",
        "Any single flip is luck. But if you flipped a thousand times, about half would win $12 and half would lose $4. Your average result per flip would settle near:",
        "That average is the **expected value**, or EV. A quant takes bets with positive EV and avoids bets with negative EV." ],
        example: "0.5 × $12  +  0.5 × (−$4)  =  +$4" },
      { kind: "sim", title: "Watch it settle", win: 12, lose: 4, need: 100, body: [
        "Flip the coin and watch your average winnings per flip. Early on it jumps around. Keep going and it closes in on the dashed line at $4.",
        "Flip at least 100 times to continue." ] },
      { kind: "num", q: "You roll one die. A six wins you $6. Anything else loses $1. What is the expected value of one roll, in dollars? (Two decimal places is fine.)", answer: 1 / 6, tol: 0.01, prefix: "$",
        explain: "1/6 × $6 + 5/6 × (−$1) = $1 − $0.83 = about $0.17 a roll. Small, but positive." },
      { kind: "mc", q: "You take the coin bet once and it lands tails. You lose $4. Was taking the bet a mistake?", options: [
        "Yes, because you lost money", "No. It was a good decision with a bad outcome", "It depends on how you feel about it" ], answer: 1,
        explain: "Quants judge the decision, not the result of one flip. A bet with positive EV is worth taking again, as long as you can afford the losses along the way." },
    ] },
  { slug: "quiz", title: "Track quiz", summary: "Five questions. Get four right to finish the track.", quiz: true,
    steps: [
      { kind: "mc", q: "What does a quant mainly use to make decisions?", options: ["Gut feeling and news headlines", "Math, statistics and code", "Tips from other traders", "Company logos and slogans"], answer: 1,
        explain: "Quant is short for quantitative: decisions made with numbers." },
      { kind: "num", q: "The bid is $49.80 and the ask is $50.30. What is the spread, in dollars?", answer: 0.5, tol: 0.001, prefix: "$", explain: "$50.30 − $49.80 = $0.50." },
      { kind: "mc", q: "Which kind of quant spends most of their time testing whether patterns in data are real?", options: ["Quant researcher", "Quant trader", "Quant developer"], answer: 0,
        explain: "Researchers look for patterns and test them." },
      { kind: "num", q: "A fair coin. Heads wins you $10, tails loses you $6. What is the expected value of one flip, in dollars?", answer: 2, prefix: "$", explain: "0.5 × $10 + 0.5 × (−$6) = $2." },
      { kind: "mc", q: "A bet has an expected value of −$1. What should a quant do?", options: ["Take it, they might get lucky", "Take it once to see what happens", "Pass, because on average it loses money"], answer: 2,
        explain: "Negative EV means that over many tries you expect to lose." },
    ] },
];
