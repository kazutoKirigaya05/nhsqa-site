import type { Lesson } from "./types";

export const probability: Lesson[] = [
  { slug: "chance-as-a-number", title: "Chance as a number", summary: "Putting a number between 0 and 1 on how likely something is.",
    steps: [
      { kind: "read", title: "Count the ways", body: [
        "A **probability** is a number from 0 (never) to 1 (always). When every outcome is equally likely, you find it by counting:",
        "A die has six faces. Two of them, 5 and 6, are greater than 4. So the probability of rolling more than 4 is 2/6, or about 0.33.",
        "Quants write probabilities as decimals, so that is how you will answer here." ],
        example: "probability  =  outcomes you want  ÷  all possible outcomes" },
      { kind: "num", q: "You roll one die. What is the probability of rolling an even number?", answer: 0.5, explain: "Three even faces (2, 4, 6) out of six: 3/6 = 0.5." },
      { kind: "read", title: "And means multiply", body: [
        "Two events are **independent** when one has no effect on the other. Two coin flips are independent: the coin has no memory.",
        "For independent events, the probability that both happen is the two probabilities multiplied together.",
        "Two heads in a row: 0.5 × 0.5 = 0.25." ] },
      { kind: "num", q: "You roll two dice. What is the probability that both show a six? (Three decimal places.)", answer: 1 / 36, tol: 0.002, explain: "1/6 × 1/6 = 1/36, about 0.028." },
      { kind: "num", q: "You flip two coins. What is the probability of getting at least one head?", answer: 0.75,
        explain: "The only way to fail is two tails, which has probability 0.25. So the answer is 1 − 0.25 = 0.75. Working out the opposite and subtracting from 1 is a trick quants use constantly." },
      { kind: "mc", q: "A fair coin has landed heads five times in a row. What is the probability the next flip is heads?", options: ["Less than 0.5, tails is due", "Exactly 0.5", "More than 0.5, heads is on a streak"], answer: 1,
        explain: "The flips are independent. Believing tails is 'due' is called the gambler's fallacy, and it costs people real money." },
    ] },
  { slug: "expected-value", title: "Expected value", summary: "What a bet is worth on average.",
    steps: [
      { kind: "read", title: "The weighted average", body: [
        "To find an **expected value**, multiply each outcome by its probability, then add everything up.",
        "For one roll of a die, each face has probability 1/6:",
        "You can never actually roll 3.5. EV is not what will happen once. It is the average over many tries." ],
        example: "(1 + 2 + 3 + 4 + 5 + 6) ÷ 6  =  3.5" },
      { kind: "sim", title: "See it happen", win: 12, lose: 4, need: 100, body: [
        "Heads wins $12, tails loses $4. The expected value is 0.5 × 12 − 0.5 × 4 = $4 a flip.",
        "Flip at least 100 times and watch the average close in on the dashed line." ] },
      { kind: "num", q: "A game costs $3 to play. You roll one die and win that many dollars. What is your expected profit per game, in dollars?", answer: 0.5, prefix: "$",
        explain: "You expect to win $3.50 and you paid $3, so the expected profit is $0.50." },
      { kind: "mc", q: "Should you play that $3 dice game if you can play as many times as you like?", options: ["Yes, the expected profit is positive", "No, you lose half the time", "It makes no difference"], answer: 0,
        explain: "You lose on rolls of 1 and 2 and break even on 3, but over many games the +$0.50 average wins out." },
      { kind: "num", q: "A raffle ticket costs $2. One ticket in 100 wins $150. What is the expected value of buying a ticket, in dollars?", answer: -0.5, prefix: "$",
        explain: "0.01 × $150 = $1.50 in expected winnings, minus the $2 price: −$0.50. The raffle makes money, not you." },
    ] },
  { slug: "risk", title: "Risk and spread", summary: "Why two bets with the same average are not the same bet.",
    steps: [
      { kind: "read", title: "Same average, different ride", body: [
        "Bet A: flip a coin, win $1 or lose $1. Bet B: flip a coin, win $1,000 or lose $1,000.",
        "Both have an expected value of $0. But they are clearly not the same bet. B can wipe you out in a few flips.",
        "The size of the swings is the **risk**. Quants measure it with **variance** and its square root, **standard deviation**: roughly, how far a typical result lands from the average." ] },
      { kind: "mc", q: "Two bets both have an EV of +$5. Bet X always pays exactly $5. Bet Y pays $105 half the time and −$95 the other half. Which is riskier?", options: ["Bet X", "Bet Y", "They are equally risky"], answer: 1,
        explain: "Same average, but Y's results land $100 away from it every time. X has no spread at all." },
      { kind: "num", q: "You have $20. A bet wins or loses $10 on a coin flip. How many losses in a row would leave you with nothing?", answer: 2, explain: "$20 − $10 − $10 = $0. Two losses in a row happens one time in four." },
      { kind: "read", title: "Why size matters", body: [
        "Even a bet with positive EV can ruin you if you bet too much of your money on each try. Run out of money and you cannot keep playing, so you never reach the long-run average.",
        "This is why quants think about **bet sizing**: how much to risk each time so that a streak of bad luck is survivable." ] },
      { kind: "mc", q: "A bet has positive EV. You can take it many times. What is the smartest way to bet?", options: [
        "Everything you have, every time", "A small part of your money each time", "Nothing, it is too risky" ], answer: 1,
        explain: "Small bets let the long-run average work for you. Betting everything means one loss ends the game." },
    ] },
  { slug: "conditional-probability", title: "When information changes the odds", summary: "Conditional probability: updating once you know something.",
    steps: [
      { kind: "read", title: "Given that", body: [
        "A **conditional probability** is the chance of something given that you already know something else.",
        "A deck has 52 cards and 4 aces. The chance the first card is an ace is 4/52.",
        "Now suppose the first card was an ace and it stays out of the deck. There are 51 cards left and only 3 aces. The chance the second card is an ace, given the first was, is 3/51.",
        "Markets work the same way. Every new piece of information changes the odds, and quants update." ] },
      { kind: "num", q: "A bag holds 3 red marbles and 2 blue. You draw one and it is red. You keep it out. What is the probability the next one is red?", answer: 0.5,
        explain: "Four marbles are left, and two are red: 2/4 = 0.5." },
      { kind: "num", q: "Same bag, starting fresh: 3 red and 2 blue. What is the probability of drawing two reds in a row without putting the first back?", answer: 0.3,
        explain: "3/5 for the first red, then 2/4 for the second: 0.6 × 0.5 = 0.3." },
      { kind: "mc", q: "You roll a die without looking. A friend tells you the result is even. What is the probability it is a six?", options: ["1/6", "1/3", "1/2"], answer: 1,
        explain: "Knowing it is even leaves three possibilities: 2, 4 and 6. One of them is a six, so 1/3." },
    ] },
  { slug: "quiz", title: "Track quiz", summary: "Five questions. Get four right to finish the track.", quiz: true,
    steps: [
      { kind: "num", q: "You roll one die. What is the probability of rolling a 1 or a 2? (Two decimal places.)", answer: 1 / 3, tol: 0.01, explain: "Two faces out of six: 2/6, about 0.33." },
      { kind: "num", q: "You flip three coins. What is the probability that all three are heads?", answer: 0.125, tol: 0.001, explain: "0.5 × 0.5 × 0.5 = 0.125." },
      { kind: "num", q: "A bet pays $20 with probability 0.25 and loses $4 otherwise. What is its expected value, in dollars?", answer: 2, prefix: "$", explain: "0.25 × $20 + 0.75 × (−$4) = $5 − $3 = $2." },
      { kind: "mc", q: "Two bets have the same expected value. What makes one riskier than the other?", options: ["It has a higher average", "Its results are more spread out", "It takes longer to play"], answer: 1,
        explain: "Risk is about how far results land from the average." },
      { kind: "num", q: "A deck has 52 cards, 13 of them hearts. The first card drawn is a heart and stays out. What is the probability the second is a heart? (Three decimal places.)", answer: 12 / 51, tol: 0.002,
        explain: "12 hearts left among 51 cards: 12/51, about 0.235." },
    ] },
];
