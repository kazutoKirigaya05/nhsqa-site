import type { Lesson, Matrix } from "./types";

const PRICE_WAR: Matrix = { rows: ["Hold", "Cut"], cols: ["Hold", "Cut"], cells: [[[3, 3], [0, 5]], [[5, 0], [1, 1]]] };
const STANDOFF: Matrix = { rows: ["Back down", "Push"], cols: ["Back down", "Push"], cells: [[[2, 2], [1, 4]], [[4, 1], [-3, -3]]] };

export const gameTheory: Lesson[] = [
  { slug: "the-price-war", title: "The Price War", summary: "Why two smart players can both end up worse off.",
    steps: [
      { kind: "read", title: "Your result depends on them", body: [
        "In probability, you play against luck. In **game theory**, you play against someone who is thinking about you.",
        "You run a company. So does your rival. You sell the same thing. Each month you both secretly choose: **hold** your price, or **cut** it.",
        "If you both hold, you both do well. If one cuts, that company grabs the customers. If you both cut, you both earn less. Play it before we analyze it." ] },
      { kind: "game", title: "Play five months", matrix: PRICE_WAR, rounds: 5, bot: "second", body: [
        "Each cell shows your points first, then your rival's. Choose, and your rival's choice is revealed at the same time." ],
        debrief: "Your rival cut every month. Look at the table: whatever you do, cutting earns the rival more (5 beats 3, and 1 beats 0). The same is true for you." },
      { kind: "mc", q: "Your rival holds. What earns you more?", options: ["Hold, for 3 points", "Cut, for 5 points"], answer: 1, explain: "5 beats 3. And if your rival cuts, cutting gets you 1 instead of 0. Cutting is better either way." },
      { kind: "read", title: "Dominant strategies", body: [
        "A choice that is best no matter what the other player does is a **dominant strategy**. In the Price War, cutting is dominant for both companies.",
        "So both cut, and both get 1 point, when they could have had 3 each by holding. Each player did the smart thing and the pair ended up worse off. This is the famous **prisoner's dilemma**." ] },
      { kind: "pick", title: "Find where it settles", q: "Click the cell where neither company can do better by changing its own choice alone.", matrix: PRICE_WAR, answers: [[1, 1]],
        explain: "At Cut and Cut, switching to Hold drops you from 1 to 0. Nobody wants to move. That is a Nash equilibrium: a set of choices where no player gains by changing alone." },
    ] },
  { slug: "the-standoff", title: "The Standoff", summary: "A game with no single best move.",
    steps: [
      { kind: "read", title: "Two traders, one deal", body: [
        "Two traders want the same deal. Each can **back down** or **push**.",
        "If one pushes and the other backs down, the pusher gets most of it. If both back down, they share. If both push, the deal collapses and both lose badly.",
        "This game is known as **chicken**. Try it." ] },
      { kind: "game", title: "Play six rounds", matrix: STANDOFF, rounds: 6, bot: "alternate", body: [
        "Your points come first in each cell. Watch what your rival does and see if you can use it." ],
        debrief: "Your rival took turns pushing and backing down. Your best reply was the opposite of whatever they did: back down when they push, push when they back down." },
      { kind: "mc", q: "Does either player have a dominant strategy in the Standoff?", options: ["Yes, push", "Yes, back down", "No, the best move depends on what the other does"], answer: 2,
        explain: "If they push, you should back down (1 beats −3). If they back down, you should push (4 beats 2). No single move is always best." },
      { kind: "pick", title: "Find both equilibria", q: "This game has two Nash equilibria. Click both cells where neither player gains by changing alone.", matrix: STANDOFF, answers: [[0, 1], [1, 0]],
        explain: "One pushes, the other backs down. The backer would lose more by pushing (−3), and the pusher would earn less by backing down (2 instead of 4)." },
      { kind: "mc", q: "Before the game, you convince your rival that you will push no matter what. What is their best move?", options: ["Push too", "Back down", "It makes no difference"], answer: 1,
        explain: "If they believe you, backing down (1) beats a crash (−3). Making a commitment the other side believes can win the game before it starts. Traders call this credibility." },
    ] },
  { slug: "auctions", title: "Auctions and offers", summary: "How much to bid, and when a fair split beats a clever one.",
    steps: [
      { kind: "read", title: "The sealed bid", body: [
        "In a **sealed-bid auction**, everyone writes down a bid in secret. The highest bid wins and pays what it bid.",
        "Say the item is worth $10 to you. Your profit if you win is $10 minus your bid.",
        "Bid higher and you win more often but keep less. Bid lower and you keep more but win less often. Choosing the balance is called **bid shading**." ] },
      { kind: "num", q: "The item is worth $10 to you. You bid $10 and win. What is your profit, in dollars?", answer: 0, prefix: "$",
        explain: "$10 − $10 = $0. Bidding your full value means winning gets you nothing." },
      { kind: "num", q: "Same item, worth $10 to you. You bid $7, and you think that wins 60% of the time. What is your expected profit, in dollars?", answer: 1.8, tol: 0.01, prefix: "$",
        explain: "You make $3 when you win, and you win 0.6 of the time: 0.6 × $3 = $1.80. Shading your bid turned $0 into a positive expected profit." },
      { kind: "mc", q: "Ten people bid on a jar of coins. Nobody knows the exact total and everyone guesses. Who is most likely to win?", options: [
        "The person whose guess was closest", "The person whose guess was too high", "The person who guessed lowest" ], answer: 1,
        explain: "The winner is whoever bid most, which usually means whoever overestimated most. Winning can be bad news. Quants call this the winner's curse and bid lower to allow for it." },
      { kind: "read", title: "The Split", body: [
        "One more game. You get 10 chips and must offer some to another player. If they accept, you both keep your shares. If they reject, you both get nothing.",
        "Cold logic says they should accept even 1 chip, since 1 is better than 0. So you should offer 1 and keep 9.",
        "In real experiments, people regularly reject low offers. They would rather get nothing than accept something unfair." ] },
      { kind: "mc", q: "Knowing that people often reject unfair offers, what is the smart offer?", options: ["1 chip, as the logic says", "Something closer to an even split", "All 10 chips"], answer: 1,
        explain: "A good strategy is built for the players you actually face, not for perfectly logical ones. Models of real behavior beat pure theory." },
    ] },
  { slug: "quiz", title: "Track quiz", summary: "Five questions. Get four right to finish the track.", quiz: true,
    steps: [
      { kind: "mc", q: "What is a dominant strategy?", options: ["The move that gives the highest score in the whole table", "A move that is best for you whatever the other player does", "The move the other player least expects"], answer: 1,
        explain: "Dominant means best against every possible choice by the other side." },
      { kind: "mc", q: "What is true at a Nash equilibrium?", options: ["Both players get their highest possible score", "No player can do better by changing only their own choice", "Both players made the same choice"], answer: 1,
        explain: "It is a resting point. It does not have to be a good outcome, as the Price War shows." },
      { kind: "mc", q: "In the Price War, both companies cut and score 1 each, even though both holding would score 3 each. Why?", options: ["They made a mistake", "Cutting is better for each one whatever the other does", "Holding is against the rules"], answer: 1,
        explain: "Each is following its dominant strategy. That is what makes it a dilemma." },
      { kind: "num", q: "An item is worth $20 to you. You bid $14 and expect to win half the time. What is your expected profit, in dollars?", answer: 3, prefix: "$", explain: "0.5 × ($20 − $14) = $3." },
      { kind: "mc", q: "What is the winner's curse?", options: ["Winning an auction usually means you overestimated the item's value", "The winner has to pay a fee", "The highest bidder always loses the next auction"], answer: 0,
        explain: "The highest bid tends to come from the highest overestimate." },
    ] },
];
