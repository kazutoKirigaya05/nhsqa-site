import type { Lesson } from "./types";
import { between, lesson, mc, num, out, py, quiz, read, src, tryPy } from "./helpers";

export const risk: Lesson[] = [
  lesson("volatility", "Volatility", "The most used number in risk: how much returns jump around.", [
    read("A number for nervousness", [
      "**Volatility** is the standard deviation of an asset's returns. A calm stock has low volatility. A stock that leaps and crashes has high volatility.",
      "It is the everyday measure of risk on a trading floor. Options are priced with it, positions are sized with it, and news channels quote an index of it." ]),
    py("Two stocks, same average", ["Both of these stocks returned 1% a day on average. Compare how they got there."],
      ["Print the standard deviation of `steady`, then of `wild`, each rounded to 4 decimal places."], `
import statistics

steady = [0.01, 0.012, 0.008, 0.011, 0.009]
wild = [0.06, -0.05, 0.08, -0.07, 0.03]

`, `
import statistics

steady = [0.01, 0.012, 0.008, 0.011, 0.009]
wild = [0.06, -0.05, 0.08, -0.07, 0.03]

print(round(statistics.stdev(steady), 4))
print(round(statistics.stdev(wild), 4))`,
      [out(String.raw`^0\.0016\s*$`, "The steady stock's volatility should be 0.0016."), out(String.raw`^0\.0667\s*$`, "The wild stock's volatility should be 0.0667.")],
      "print(round(statistics.stdev(steady), 4))\nprint(round(statistics.stdev(wild), 4))"),
    mc("Both stocks averaged 1% a day. Which would let you sleep better, and why?", ["The wild one, because it has bigger up days", "The steady one, because its results stay close to the average", "No difference"], 1,
      "The wild stock is about 40 times as volatile. Over a longer stretch its bad days could wipe you out before the average shows up."),
    mc("Before a big announcement, traders expect large moves in either direction. What happens to option prices?", ["They fall", "They rise", "They do not change"], 1,
      "Options gain from big moves and have limited downside, so higher expected volatility makes them worth more. Much of options trading is really trading volatility."),
  ]),

  lesson("diversification", "Diversification", "Why many small bets beat one big one.", [
    read("Spread it out", [
      "Suppose you have a good bet available. You can put all your money on it once, or split your money across ten separate bets just like it.",
      "The average result is the same. But the luck in separate bets partly cancels: some win while others lose. Your overall result lands much closer to the average.",
      "This is **diversification**, and it is the closest thing in finance to a free benefit." ]),
    py("One bet against ten", [
      "`one_bet()` wins or loses 1 on a coin flip. `single` holds 5,000 results of making one bet.",
      "Build `spread`: 5,000 results of averaging ten separate bets." ],
      ["Inside the loop, append the average of 10 calls to `one_bet()`."], `
import random, statistics

def one_bet():
    return random.choice([1, -1])

single = [one_bet() for i in range(5000)]
spread = []

for i in range(5000):
    # Append the average of 10 separate bets
    pass

print(round(statistics.stdev(single), 2))
print(round(statistics.stdev(spread), 2))`, `
import random, statistics

def one_bet():
    return random.choice([1, -1])

single = [one_bet() for i in range(5000)]
spread = []

for i in range(5000):
    spread.append(sum(one_bet() for j in range(10)) / 10)

print(round(statistics.stdev(single), 2))
print(round(statistics.stdev(spread), 2))`,
      [between(0.27, 0.37, "The second number should be about 0.32. Average 10 bets: sum(one_bet() for j in range(10)) / 10")],
      "spread.append(sum(one_bet() for j in range(10)) / 10)"),
    mc("Risk fell from about 1.0 to about 0.32 with ten bets. What would it be with 100 separate bets?", ["About 0.10", "About 0.032", "About 0.5"], 0,
      "Risk shrinks with the square root of the number of independent bets: 1 ÷ √100 = 0.1. Going from 10 to 100 bets cuts risk by about three, not ten."),
    mc("You split your money across ten oil companies. Why is that poor diversification?", ["Ten is too few", "They all rise and fall together with the price of oil", "Oil companies are too big"], 1,
      "Diversification only works when the bets are independent. Ten bets on the same thing are really one bet."),
  ]),

  lesson("correlation", "Correlation", "Measuring how two things move together.", [
    read("From −1 to +1", [
      "**Correlation** is a number between −1 and +1 that says how closely two series move together.",
      "Near +1 they rise and fall together. Near 0 they are unrelated. Near −1, one rises when the other falls.",
      "It is what decides whether adding a new position to a portfolio spreads the risk or piles more of the same risk on top." ]),
    py("Measure it", ["`statistics.correlation(a, b)` does the calculation. Here are daily returns for a tech stock, a chip maker and gold."],
      ["Print the correlation of `tech` with `chip`, then of `tech` with `gold`, each rounded to 2 decimal places."], `
import statistics

tech = [0.02, -0.01, 0.03, -0.02, 0.01]
chip = [0.025, -0.015, 0.02, -0.03, 0.015]
gold = [-0.01, 0.012, -0.015, 0.02, -0.004]

`, `
import statistics

tech = [0.02, -0.01, 0.03, -0.02, 0.01]
chip = [0.025, -0.015, 0.02, -0.03, 0.015]
gold = [-0.01, 0.012, -0.015, 0.02, -0.004]

print(round(statistics.correlation(tech, chip), 2))
print(round(statistics.correlation(tech, gold), 2))`,
      [out(String.raw`^0\.95\s*$`, "The correlation of tech with chip should be 0.95."), out(String.raw`^-(0\.9\d|1\.0)\s*$`, "The correlation of tech with gold should be close to -1.")],
      "print(round(statistics.correlation(tech, chip), 2))\nprint(round(statistics.correlation(tech, gold), 2))"),
    mc("You already own the tech stock. Which addition reduces your risk more?", ["The chip maker", "Gold", "More of the tech stock"], 1,
      "The chip maker moves almost exactly with tech, so it adds more of the same risk. In this data gold tends to rise when tech falls, which cushions the portfolio."),
    mc("In a market panic, almost everything falls together. What does that do to diversification?", ["It works better than ever", "It weakens exactly when you need it most", "Nothing"], 1,
      "Correlations measured in calm times often jump toward +1 in a crisis. Risk managers plan for that instead of trusting the calm numbers."),
  ]),

  lesson("bet-sizing", "How much to bet", "The Kelly rule: grow fast without going broke.", [
    read("Edge is not enough", [
      "You have a bet that wins 60% of the time and pays even money. Clearly you should take it. But how much of your money should go on each bet?",
      "Bet too little and you grow slowly. Bet too much and one bad streak wipes you out. In 1956 John Kelly found the fraction that grows your money fastest over the long run.",
      "For an even-money bet that wins with probability p, the **Kelly fraction** is 2p − 1." ],
      "Kelly fraction  =  2 × (probability of winning) − 1"),
    num("A bet pays even money and wins 60% of the time. What fraction of your bankroll does Kelly say to bet, as a decimal?", 0.2, "2 × 0.6 − 1 = 0.2. Bet 20% of what you have each time."),
    py("Bet Kelly a thousand times", ["Start with $100 and bet 20% of your current bankroll on each of 1,000 bets."],
      ["Inside the loop, add `stake` to `bankroll` with probability `p`, and subtract it otherwise."], `
import random

bankroll = 100
p = 0.6
f = 0.2

for bet in range(1000):
    stake = f * bankroll
    # Win or lose the stake here

print(round(bankroll))`, `
import random

bankroll = 100
p = 0.6
f = 0.2

for bet in range(1000):
    stake = f * bankroll
    if random.random() < p:
        bankroll += stake
    else:
        bankroll -= stake

print(round(bankroll))`,
      [src(String.raw`random\.random\(\)\s*<\s*p`, "Decide each bet with: if random.random() < p:"), between(101, 1e60, "After 1,000 Kelly bets the bankroll should have grown enormously. Check that you add the stake on a win and subtract it on a loss.")],
      "if random.random() < p:\n    bankroll += stake\nelse:\n    bankroll -= stake"),
    tryPy("Now bet too much", ["The same game, with the fraction as something you can change. It prints the bankroll along the way."],
      ["Run it with f = 0.2. Then try f = 0.5 and f = 0.9 and watch what happens to the same winning bet."], `
import random

f = 0.2          # try 0.5, then 0.9
p = 0.6
bankroll = 100

for bet in range(1, 1001):
    stake = f * bankroll
    if random.random() < p:
        bankroll += stake
    else:
        bankroll -= stake
    if bet in (10, 100, 500, 1000):
        print("after", bet, "bets:", round(bankroll, 2))`),
    mc("With f = 0.9 the bankroll collapses toward zero, even though the bet wins 60% of the time. Why?", ["The simulation cheats", "Each loss takes away 90% of your money, and wins cannot make that back fast enough", "60% is not really an edge"], 1,
      "After one loss and one win at 90% you have 0.1 × 1.9 = 0.19 of what you started with. A good bet sized badly is a bad bet. Many real traders bet half of Kelly to be safe."),
  ]),

  lesson("value-at-risk", "Value at risk", "One number for how bad a normal bad day gets.", [
    read("How much could we lose?", [
      "A trading desk's boss wants one number for how much the desk might lose tomorrow. The usual answer is **value at risk**, or VaR.",
      "A 95% one-day VaR of $176 means: on 95 days out of 100 we expect to lose less than $176. On the other 5, we expect to lose more.",
      "One simple way to estimate it is to take a long history of daily results, sort them from worst to best, and read off the day that sits 5% of the way in." ]),
    py("Find the VaR", ["`pnl` holds 1,000 days of profit and loss, sorted from worst to best. Five percent of 1,000 is 50, so the 50th worst day marks the line. Remember that lists count from 0."],
      ["Set `var` to the 50th worst day's result."], `
import random

random.seed(5)
pnl = [random.gauss(0, 100) for day in range(1000)]    # daily profit or loss, in dollars
pnl.sort()

# Set var here

print(round(var))`, `
import random

random.seed(5)
pnl = [random.gauss(0, 100) for day in range(1000)]    # daily profit or loss, in dollars
pnl.sort()

var = pnl[49]

print(round(var))`,
      [src(String.raw`pnl\[49\]`, "The 50th item of a list is at position 49, because positions start at 0."), between(-200, -135, "The result should be a loss of roughly 165 to 180 dollars.")],
      "var = pnl[49]"),
    mc("The 95% VaR is $176. What does that tell you about the worst 5% of days?", ["Losses on those days are exactly $176", "Losses on those days are at least $176, with no limit stated", "Those days never happen"], 1,
      "VaR marks where the bad tail begins. It says nothing about how far the tail goes, and that is its best-known weakness."),
    mc("A desk reports a tiny VaR for years, then loses a fortune in one week. Which explanation fits best?", [
      "VaR was calculated on calm years and missed how bad a rare event could be", "VaR is always wrong", "The desk had too little risk"], 0,
      "A VaR built from quiet history will not contain a crisis. Good risk managers also ask what happens in scenarios worse than anything in the data."),
  ]),

  lesson("hedging", "Hedging", "Taking a second position to cancel a risk you do not want.", [
    read("Keep the bet you want, remove the rest", [
      "A **hedge** is a position taken to offset the risk of another one. You saw one already: an option seller buying shares to cancel the option's delta.",
      "Hedging lets a trader isolate the one thing they have a view on. Someone who thinks one car maker is better run than another can buy the first and short the second. If the whole car industry falls, the two roughly cancel, and what is left is the difference between the companies." ]),
    num("You hold $10,000 of shares that follow the overall market. You short $10,000 of a contract that also follows the market. The market falls 5%. What is your total P&L, in dollars?", 0,
      "The shares lose $500 and the short gains $500. A perfect hedge leaves you with $0.", { prefix: "$" }),
    py("Portfolio P&L", ["`positions` holds how many shares you have of each stock, with negative numbers for shorts. `changes` holds how much each price moved today."],
      ["Inside the loop, add each position's profit or loss to `total`."], `
positions = {"AAA": 100, "BBB": -50, "CCC": 200}
changes = {"AAA": -2.0, "BBB": -3.0, "CCC": 0.5}
total = 0

for name in positions:
    # Add this position's P&L
    pass

print(total)`, `
positions = {"AAA": 100, "BBB": -50, "CCC": 200}
changes = {"AAA": -2.0, "BBB": -3.0, "CCC": 0.5}
total = 0

for name in positions:
    total += positions[name] * changes[name]

print(total)`,
      [out(String.raw`^50\.0\s*$`, "The total should be 50.0: -200 on AAA, +150 on the BBB short, +100 on CCC.")], "total += positions[name] * changes[name]"),
    mc("AAA fell $2 and cost you $200, but the day still ended up $50. What helped most?", ["The short position in BBB, which gained when BBB fell", "Luck", "AAA recovering"], 0,
      "Being short BBB turned its $3 fall into a $150 gain. Shorts are a basic tool for building portfolios that do not depend on the whole market rising."),
    mc("Why not hedge away every risk?", ["It is not allowed", "Hedging costs money and also removes the chance of gain, so with no risk left there is no return left either", "Hedges never work"], 1,
      "Returns are payment for bearing risk. The skill is choosing which risks you are paid well to hold and removing the ones you are not."),
  ]),

  quiz([
    mc("What does volatility measure?", ["The average return", "How much returns vary around their average", "The highest price reached"], 1, "It is the standard deviation of returns."),
    mc("Diversification reduces risk most when the positions are:", ["Highly correlated", "Uncorrelated or negatively correlated", "All in the same industry"], 1, "Independent bets cancel some of each other's luck. Correlated ones do not."),
    num("An even-money bet wins 55% of the time. What is the Kelly fraction, as a decimal?", 0.1, "2 × 0.55 − 1 = 0.10."),
    mc("A desk has a 95% one-day VaR of $1 million. On how many trading days out of 100 should it expect to lose more than that?", ["0", "About 5", "About 95"], 1, "The 5% of days beyond the VaR line."),
    num("You are long 100 shares of X and short 100 shares of Y. X falls $1 and Y falls $4. What is your total P&L, in dollars?", 300, "X costs you $100. The short in Y gains $400. Total: +$300.", { prefix: "$" }),
  ]),
];
