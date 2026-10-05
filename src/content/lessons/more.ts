import type { Lesson, Matrix } from "./types";
import { between, clang, game, lesson, mc, num, out, py, read, rlang, src, tryPy } from "./helpers";

// Extra lessons for the six foundation tracks. index.ts slots each set in before that track's quiz.

export const morePython: Lesson[] = [
  lesson("lists-and-dictionaries", "Lists and dictionaries", "The two containers almost every quant script is built from.", [
    read("Lists grow", [
      "You have used lists already. Two more things to know: `append( )` adds an item to the end, and `sum( )` and `len( )` give the total and the count.",
      "A trader's record of the day might be a list of trades: positive for shares bought, negative for shares sold." ]),
    py("Add a trade", ["The list holds three trades so far."],
      ["Append a sale of 2 shares, written as -2, to `trades`."], `
trades = [5, -3, 8]

# Append -2 here

print(sum(trades), len(trades))`, `
trades = [5, -3, 8]

trades.append(-2)

print(sum(trades), len(trades))`,
      [src(String.raw`append\(`, "Use trades.append( )."), out(String.raw`^8 4\s*$`, "After the sale there should be 4 trades adding up to 8.")], "trades.append(-2)"),
    read("Dictionaries look things up", [
      "A **dictionary** stores pairs: a key and the value that belongs to it. You write it with curly braces and look a value up with square brackets.",
      "A portfolio is a natural dictionary: the key is the stock's name and the value is how many shares you hold." ],
      'holdings = {"AAA": 10, "BBB": 4}\nprint(holdings["BBB"])     # 4'),
    py("Value a portfolio", ["A `for` loop over a dictionary gives you each key in turn. Use the key to look up the shares and the price."],
      ["Inside the loop, add shares times price for each stock to `total`."], `
holdings = {"AAA": 10, "BBB": 4, "CCC": 25}
prices = {"AAA": 50.0, "BBB": 120.0, "CCC": 8.0}
total = 0

for name in holdings:
    # Add this stock's value
    pass

print(total)`, `
holdings = {"AAA": 10, "BBB": 4, "CCC": 25}
prices = {"AAA": 50.0, "BBB": 120.0, "CCC": 8.0}
total = 0

for name in holdings:
    total += holdings[name] * prices[name]

print(total)`,
      [out(String.raw`^1180\.0\s*$`, "The portfolio should be worth 1180.0.")], "total += holdings[name] * prices[name]"),
    mc("What does this print?", ["AAA", "3", "7", "An error"], 2, "Square brackets look up the value stored under the key \"BBB\", which is 7.", 'stock = {"AAA": 3, "BBB": 7}\nprint(stock["BBB"])'),
  ]),

  lesson("while-loops-and-random-walks", "While loops and random walks", "Repeat until something happens, then use it to model a price.", [
    read("Loop until", [
      "A `for` loop repeats a set number of times. A `while` loop repeats for as long as a condition stays true, which is what you need when you do not know in advance how long something takes.",
      "Be careful: if the condition never becomes false, the loop never ends. The editor here stops runaway code after 10 seconds." ],
      "count = 0\nwhile count < 3:\n    count += 1\nprint(count)   # 3"),
    py("How long to double?", ["Money growing at 5% a year."],
      ["Use a while loop to grow `value` by 5% a year until it reaches 200, counting the years in `years`."], `
value = 100
years = 0

# Your while loop here

print(years)`, `
value = 100
years = 0

while value < 200:
    value = value * 1.05
    years += 1

print(years)`,
      [src(String.raw`while\s+`, "Use a while loop: while value < 200:"), out(String.raw`^15\s*$`, "It takes 15 years to double at 5%.")], "while value < 200:\n    value = value * 1.05\n    years += 1"),
    tryPy("A random walk", [
      "A **random walk** takes a step up or down at random, again and again. It is the simplest model of a stock price, and most serious models start from it.",
      "Here a gambler starts with 10 and bets 1 on a fair coin until reaching 20 or going broke." ],
      ["Run it several times. Notice how different each walk is, and how long some take."], `
import random

money = 10
steps = 0

while 0 < money < 20:
    money += random.choice([1, -1])
    steps += 1

print("finished with", money, "after", steps, "bets")`),
    py("How often does the gambler win?", ["Run the walk 2,000 times and count how often it ends at 20."],
      ["After the while loop, add 1 to `wins` if `money` is 20."], `
import random

wins = 0

for game in range(2000):
    money = 10
    while 0 < money < 20:
        money += random.choice([1, -1])
    # Count a win here

print(wins / 2000)`, `
import random

wins = 0

for game in range(2000):
    money = 10
    while 0 < money < 20:
        money += random.choice([1, -1])
    if money == 20:
        wins += 1

print(wins / 2000)`,
      [between(0.45, 0.55, "The gambler should win about half the time.")], "if money == 20:\n    wins += 1"),
    mc("Starting at 10, the fair-coin gambler reaches 20 half the time. If they start at 5 instead, with the same target of 20, how often do they get there?", ["1/2", "1/4", "1/10"], 1,
      "In a fair game the chance of reaching the target is your starting money divided by the target: 5 ÷ 20 = 1/4. The less you start with, the more likely you are to go broke first."),
  ]),

  lesson("the-statistics-toolkit", "The statistics toolkit", "Mean, median and the trouble with outliers.", [
    read("One import, many tools", [
      "Python comes with a `statistics` module. After `import statistics` you can call `statistics.mean( )`, `statistics.median( )` and `statistics.stdev( )` on any list of numbers.",
      "The **median** is the middle value when the numbers are sorted. Half the data is below it and half above." ]),
    py("Mean and median", ["These are the sizes of seven trades. One of them is much bigger than the rest."],
      ["Print the mean rounded to 2 decimal places, then the median, with one print."], `
import statistics

data = [2, 4, 4, 5, 7, 9, 40]

`, `
import statistics

data = [2, 4, 4, 5, 7, 9, 40]

print(round(statistics.mean(data), 2), statistics.median(data))`,
      [out(String.raw`^10\.14 5\s*$`, "The output should be: 10.14 5")], "print(round(statistics.mean(data), 2), statistics.median(data))"),
    mc("The mean is 10.14 but the median is 5. Which better describes a typical trade here?", ["The mean", "The median", "Neither"], 1,
      "Six of the seven trades are 9 or smaller. The single trade of 40 drags the mean up, while the median ignores how extreme it is."),
    py("Without the outlier", ["`data[:-1]` is the list without its last item."],
      ["Print the mean of the data with the last value left out, rounded to 2 decimal places."], `
import statistics

data = [2, 4, 4, 5, 7, 9, 40]

`, `
import statistics

data = [2, 4, 4, 5, 7, 9, 40]

print(round(statistics.mean(data[:-1]), 2))`,
      [out(String.raw`^5\.17\s*$`, "Without the 40 the mean should be 5.17.")], "print(round(statistics.mean(data[:-1]), 2))"),
    mc("One bad data point, such as a price typed with an extra zero, gets into your data. Which statistic is damaged least?", ["The mean", "The median", "The maximum"], 1,
      "Real market data is full of errors. Quants often prefer statistics like the median that one wild value cannot wreck."),
  ]),

  lesson("list-comprehensions", "List comprehensions", "Build a new list from an old one in a single line.", [
    read("A loop in one line", [
      "Building a list with a loop and `append( )` is so common that Python has a shorter way, called a **list comprehension**.",
      "Read it as: give me this expression, for each item in that list. You can add an `if` at the end to keep only some items." ],
      "nums = [1, 2, 3]\nsquares = [n * n for n in nums]          # [1, 4, 9]\nbig = [n for n in nums if n > 1]        # [2, 3]"),
    py("Double everything", ["A position list, and an instruction to double every position."],
      ["Use a list comprehension to set `doubled` to each number in `nums` times 2."], `
nums = [1, 2, 3, 4]

# Set doubled here

print(doubled)`, `
nums = [1, 2, 3, 4]

doubled = [n * 2 for n in nums]

print(doubled)`,
      [src(String.raw`\[.+\bfor\b.+\bin\b.+\]`, "Use a list comprehension: [expression for n in nums]"), out(String.raw`^\[2, 4, 6, 8\]\s*$`, "The output should be [2, 4, 6, 8].")], "doubled = [n * 2 for n in nums]"),
    py("Keep only the gains", ["Add an `if` to filter."],
      ["Use a list comprehension to set `gains` to the changes that are greater than 0."], `
changes = [2, -1, 4, 2, -1, 4, 3, -2, 5]

# Set gains here

print(gains)`, `
changes = [2, -1, 4, 2, -1, 4, 3, -2, 5]

gains = [c for c in changes if c > 0]

print(gains)`,
      [src(String.raw`\[.+\bfor\b.+\bin\b.+\bif\b.+\]`, "Use a comprehension with an if at the end: [c for c in changes if ...]"), out(String.raw`^\[2, 4, 2, 4, 3, 5\]\s*$`, "The output should be [2, 4, 2, 4, 3, 5].")], "gains = [c for c in changes if c > 0]"),
    mc("What does this print?", ["[0, 1, 2, 3]", "[0, 1, 4, 9]", "[1, 4, 9, 16]", "An error"], 1, "range(4) gives 0, 1, 2, 3, and each is multiplied by itself.", "print([n * n for n in range(4)])"),
  ]),
];

export const moreProbability: Lesson[] = [
  lesson("counting", "Counting", "How many ways can it happen? The start of every probability.", [
    read("Choosing without caring about order", [
      "Many probabilities come down to counting. How many different pairs can you pick from four people, A, B, C and D?",
      "List them: AB, AC, AD, BC, BD, CD. Six pairs. The pair AB is the same as BA, so order does not matter.",
      "The number of ways to choose k things from n is written **n choose k**. Python calculates it with `math.comb(n, k)`." ]),
    num("How many different groups of 3 can be chosen from 5 people?", 10, "5 choose 3 is 10. One way to see it: choosing 3 to include is the same as choosing 2 to leave out, and there are 10 pairs among 5 people."),
    py("Poker hands", ["A poker hand is 5 cards chosen from a deck of 52."],
      ["Print the number of different 5-card hands."], `
import math

`, `
import math

print(math.comb(52, 5))`,
      [src(String.raw`comb\(\s*52\s*,\s*5\s*\)`, "Use math.comb(52, 5)."), out(String.raw`^2598960\s*$`, "There are 2598960 different hands.")], "print(math.comb(52, 5))"),
    num("You flip a coin 4 times. There are 16 equally likely sequences, and 4 choose 2 = 6 of them contain exactly two heads. What is the probability of exactly two heads?", 0.375, "6 ÷ 16 = 0.375.", { tol: 0.001 }),
    mc("Only 4 of the 2,598,960 poker hands are a royal flush. Roughly what are the odds of being dealt one?", ["About 1 in 6,500", "About 1 in 650,000", "About 1 in 65 million"], 1,
      "2,598,960 ÷ 4 is about 650,000. Counting is how the value of every hand in poker is decided: rarer hands rank higher."),
  ]),

  lesson("the-binomial-distribution", "The binomial distribution", "The odds of k wins in n tries.", [
    read("A formula for repeated bets", [
      "You make the same bet n times, each with probability p of winning. What is the chance of winning exactly k of them?",
      "There are n choose k ways to arrange the wins. Each arrangement has probability p for every win and 1 − p for every loss. Multiply them together:" ],
      "P(k wins)  =  (n choose k) × p^k × (1 − p)^(n − k)"),
    py("Write the formula", ["In Python, `**` raises to a power, so `p ** k` is p to the power k."],
      ["Make `binomial` return the probability of exactly k wins in n tries."], `
from math import comb

def binomial(n, k, p):
    # Replace the next line
    pass

print(round(binomial(10, 5, 0.5), 4))
print(round(binomial(10, 9, 0.5) + binomial(10, 10, 0.5), 4))`, `
from math import comb

def binomial(n, k, p):
    return comb(n, k) * p ** k * (1 - p) ** (n - k)

print(round(binomial(10, 5, 0.5), 4))
print(round(binomial(10, 9, 0.5) + binomial(10, 10, 0.5), 4))`,
      [out(String.raw`^0\.2461\s*$`, "Exactly 5 heads in 10 flips should be 0.2461."), out(String.raw`^0\.0107\s*$`, "9 or 10 heads in 10 flips should be 0.0107.")], "return comb(n, k) * p ** k * (1 - p) ** (n - k)"),
    tryPy("See the shape", ["This draws the whole distribution for 10 flips as a bar chart made of text."],
      ["Run it. Then change p to 0.7 and watch the hump move."], `
from math import comb

n = 10
p = 0.5

for k in range(n + 1):
    prob = comb(n, k) * p ** k * (1 - p) ** (n - k)
    print(k, "#" * round(prob * 100), round(prob, 3))`),
    num("You flip a fair coin 5 times. What is the probability of getting no heads at all? (Three decimal places.)", 1 / 32, "Every flip must be tails: 0.5⁵ = 1/32, about 0.031.", { tol: 0.001 }),
    mc("A new trader wins 9 of their first 10 trades. If each trade were really a coin flip, that would happen about 1% of the time. What is the careful conclusion?", [
      "They are certainly skilled", "It is some evidence of skill, but in a firm of 100 traders one would do this by luck", "It proves nothing at all"], 1,
      "Unlikely is not impossible, and it matters how many people were trying. Quants weigh a result against how often chance alone would produce it."),
  ]),

  lesson("bayes-rule", "Bayes' rule", "What a positive test really tells you.", [
    read("A test that is 99% accurate", [
      "A disease affects 1 person in 100. A test for it catches 99% of people who have the disease. It also wrongly flags 5% of healthy people.",
      "You take the test and it comes back positive." ]),
    mc("Before working it out: how likely is it that you have the disease?", ["About 99%", "About 95%", "About 50%", "About 17%"], 3,
      "About 17%. Almost everyone guesses far higher. The next step shows where the number comes from."),
    read("Count the people", [
      "Imagine 10,000 people. About 100 have the disease, and the test flags 99 of them.",
      "The other 9,900 are healthy, and the test wrongly flags 5% of them: 495 people.",
      "So 594 people test positive, and only 99 of them are sick. 99 ÷ 594 is about 0.167. The disease is rare, so false alarms from the huge healthy group outnumber the real cases." ]),
    py("Bayes in code", ["The same sum with probabilities instead of people."],
      ["Set `positive` to the overall chance of testing positive: sick people who test positive plus healthy people who test positive.", "Set `answer` to the share of positives who are really sick."], `
sick = 0.01
true_positive = 0.99      # chance a sick person tests positive
false_positive = 0.05     # chance a healthy person tests positive

# Set positive and answer here

print(round(answer, 4))`, `
sick = 0.01
true_positive = 0.99      # chance a sick person tests positive
false_positive = 0.05     # chance a healthy person tests positive

positive = sick * true_positive + (1 - sick) * false_positive
answer = sick * true_positive / positive

print(round(answer, 4))`,
      [out(String.raw`^0\.1667\s*$`, "The answer should be 0.1667.")], "positive = sick * true_positive + (1 - sick) * false_positive\nanswer = sick * true_positive / positive"),
    mc("A signal correctly predicts 99% of market crashes, and also fires on 5% of normal days. Crashes are very rare. The signal fires today. What should you think?", [
      "A crash is almost certain", "Most firings are false alarms, because normal days vastly outnumber crashes", "The signal is useless"], 1,
      "It is the same sum as the medical test. Ignoring how rare something is to begin with is called base rate neglect, and it is one of the commonest mistakes in reasoning about risk."),
  ]),
];

const PENNIES: Matrix = { rows: ["Heads", "Tails"], cols: ["Heads", "Tails"], cells: [[[1, -1], [-1, 1]], [[-1, 1], [1, -1]]] };
const PRICE_WAR: Matrix = { rows: ["Hold", "Cut"], cols: ["Hold", "Cut"], cells: [[[3, 3], [0, 5]], [[5, 0], [1, 1]]] };

export const moreGameTheory: Lesson[] = [
  lesson("mixed-strategies", "Mixed strategies", "When the best plan is to be unpredictable.", [
    read("Matching pennies", [
      "You and a rival each secretly choose heads or tails. If the choices match, you win a point from your rival. If they differ, your rival wins a point from you.",
      "Whatever one player gains, the other loses. A game like this is called **zero-sum**. Try it." ]),
    game("Play eight rounds", ["Your points come first in each cell. Try to spot a pattern in what your rival does."], PENNIES, 8, "random",
      "There was no pattern to find. Your rival chose at random, half heads and half tails, and against that every choice you make is worth exactly 0 on average."),
    mc("Is there a cell in this game where neither player wants to change their choice?", ["Yes, Heads and Heads", "Yes, Tails and Tails", "No. In every cell, one of the players would rather switch"], 2,
      "Whoever is losing in a cell can win by switching. So no pair of fixed choices is stable. The equilibrium has to involve chance."),
    read("Mixing", [
      "A **mixed strategy** chooses at random with set probabilities. In matching pennies the equilibrium is for both players to pick heads half the time.",
      "It works because it gives the other player nothing to exploit. Any lean toward one side, even 55%, can be punished by a rival who notices." ]),
    num("Your rival plays heads 70% of the time. You notice, and play heads every time. What is your average result per round, in points?", 0.4, "You match 70% of the time (+1) and miss 30% (−1): 0.7 − 0.3 = 0.4."),
    mc("A fund always sells its shares at 3 pm on Fridays. Other traders notice. What happens?", ["Nothing", "They sell just before 3 pm and buy back cheaper afterwards, at the fund's expense", "The fund gets better prices"], 1,
      "Being predictable is expensive. Large traders deliberately randomize the timing and size of their orders, which is a mixed strategy in practice."),
  ]),

  lesson("playing-again-and-again", "Playing again and again", "How cooperation can survive when the game repeats.", [
    read("The Price War, repeated", [
      "In the Price War, cutting is the dominant strategy, and both players end up with 1 point when they could have had 3 each.",
      "But real companies do not meet once. They compete month after month, and that changes everything. Play eight months against a new rival and see how they respond to you." ]),
    game("Play eight months", ["Your points come first in each cell. Pay attention to how your rival reacts to what you did the month before."], PRICE_WAR, 8, "copycat",
      "Your rival held in the first month, then copied whatever you did the month before. Hold, and they hold. Cut, and they punish you next month."),
    num("Against this copycat rival, you hold in all 8 months. How many points do you score in total?", 24, "Both hold every month: 3 points × 8 months = 24."),
    num("Against the same rival, you cut in all 8 months. How many points do you score in total?", 12, "You score 5 in the first month, when they hold. After that they cut too, and you score 1 a month for 7 months: 5 + 7 = 12."),
    read("Tit for tat", [
      "The copycat strategy is called **tit for tat**: start by cooperating, then do whatever the other player did last time. It is friendly, it punishes cheating at once, and it forgives as soon as the other side comes back.",
      "In a famous computer tournament of strategies for this game, this very simple rule beat far more complicated ones." ]),
    mc("Why can cooperation last in a repeated game when it fails in a single one?", ["Players become nicer", "Cheating today costs you the other player's cooperation in every future round", "The payoffs change"], 1,
      "The future is what enforces good behavior. It is also why reputation matters so much between firms that trade with each other every day."),
  ]),
];

export const moreR: Lesson[] = [
  lesson("writing-functions", "Writing functions", "Give a calculation a name so you can reuse it.", [
    read("function( )", [
      "In R you create a function with the word `function`, list its inputs in brackets, and then write what it should calculate. You store it under a name with `<-`, like any other value.",
      "The result of the last line is what the function gives back." ],
      "double <- function(x) x * 2\ndouble(21)\n# [1] 42"),
    rlang("An expected value function", ["Every bet in this course has a win amount, a loss amount and a probability of winning."],
      ["Define `ev` as a function of `win`, `lose` and `p` that returns p × win + (1 − p) × lose."], `
# Define ev here


ev(12, -4, 0.5)
ev(100, -10, 0.1)`, `
ev <- function(win, lose, p) p * win + (1 - p) * lose

ev(12, -4, 0.5)
ev(100, -10, 0.1)`,
      [src(String.raw`ev\s*(<-|=)\s*function\s*\(`, "Start with: ev <- function(win, lose, p)"), out(String.raw`\[1\] 4\s*$`, "The coin bet should give [1] 4."), out(String.raw`\[1\] 1\s*$`, "The second bet should give [1] 1.")],
      "ev <- function(win, lose, p) p * win + (1 - p) * lose"),
    rlang("Returns from prices", [
      "`diff(p)` gives the change from each value to the next. `head(p, -1)` gives every value except the last. Dividing one by the other gives each day's return.",
      "A longer function goes inside curly braces." ],
      ["Inside the function, divide `diff(p)` by `head(p, -1)`."], `
prices <- c(100, 102, 99, 105)

daily_returns <- function(p) {
  # Your calculation here
}

round(daily_returns(prices), 4)`, `
prices <- c(100, 102, 99, 105)

daily_returns <- function(p) {
  diff(p) / head(p, -1)
}

round(daily_returns(prices), 4)`,
      [src(String.raw`diff\(`, "Use diff(p) for the changes."), out(String.raw`0\.0200\s+-0\.0294\s+0\.0606`, "The returns should be 0.0200, -0.0294 and 0.0606.")],
      "diff(p) / head(p, -1)"),
    mc("Why did that function need no loop?", ["R functions cannot contain loops", "diff, head and division all work on a whole vector at once", "The data was too small to need one"], 1,
      "Working on whole vectors at once is how R is meant to be used. It is shorter to write and faster to run."),
  ]),

  lesson("comparing-two-stocks", "Comparing two stocks", "Risk, relationship and a picture, in three lines of R.", [
    read("The questions a researcher asks first", [
      "Given the returns of two assets, a researcher wants to know three things straight away. How risky is each one? Do they move together? And what does the relationship look like?",
      "R answers each with one function: `sd( )` for risk, `cor( )` for correlation, and `plot( )` for the picture." ]),
    rlang("Which is riskier?", ["Daily returns for a tech stock and for gold."],
      ["Print the standard deviation of `tech`, then of `gold`, each rounded to 4 decimal places."], `
tech <- c(0.02, -0.01, 0.03, -0.02, 0.01)
gold <- c(-0.01, 0.012, -0.015, 0.02, -0.004)

`, `
tech <- c(0.02, -0.01, 0.03, -0.02, 0.01)
gold <- c(-0.01, 0.012, -0.015, 0.02, -0.004)

round(sd(tech), 4)
round(sd(gold), 4)`,
      [out(String.raw`\[1\] 0\.0207\s*$`, "The standard deviation of tech should be 0.0207."), out(String.raw`\[1\] 0\.0149\s*$`, "The standard deviation of gold should be 0.0149.")],
      "round(sd(tech), 4)\nround(sd(gold), 4)"),
    rlang("Do they move together?", ["`cor(a, b)` gives the correlation between two vectors, from −1 to +1."],
      ["Print the correlation of `tech` with `chip`, rounded to 2 decimal places."], `
tech <- c(0.02, -0.01, 0.03, -0.02, 0.01)
chip <- c(0.025, -0.015, 0.02, -0.03, 0.015)

`, `
tech <- c(0.02, -0.01, 0.03, -0.02, 0.01)
chip <- c(0.025, -0.015, 0.02, -0.03, 0.015)

round(cor(tech, chip), 2)`,
      [src(String.raw`cor\(`, "Use cor(tech, chip)."), out(String.raw`\[1\] 0\.95\s*$`, "The correlation should be 0.95.")],
      "round(cor(tech, chip), 2)"),
    rlang("See it", ["Giving `plot( )` two vectors draws one against the other, a point for each day."],
      ["Plot `tech` against `chip`."], `
tech <- c(0.02, -0.01, 0.03, -0.02, 0.01)
chip <- c(0.025, -0.015, 0.02, -0.03, 0.015)

`, `
tech <- c(0.02, -0.01, 0.03, -0.02, 0.01)
chip <- c(0.025, -0.015, 0.02, -0.03, 0.015)

plot(tech, chip)`,
      [src(String.raw`plot\(\s*tech\s*,\s*chip`, "Call plot(tech, chip)."), { plot: true, msg: "No chart appeared. Check your plot( ) line." }],
      "plot(tech, chip)"),
    mc("The points run in a rising line from bottom left to top right. What does that show?", ["The two stocks tend to rise and fall on the same days", "The two stocks are unrelated", "One stock always beats the other"], 0,
      "A rising line of points is what a correlation near +1 looks like. Researchers plot before they calculate, because a picture shows problems a single number hides."),
  ]),
];

export const moreC: Lesson[] = [
  lesson("while-loops-and-decisions", "While loops and decisions", "Repeat until a condition changes, and choose between paths.", [
    read("while and if", [
      "A `while` loop repeats its block for as long as the condition in its brackets is true. An `if` runs its block only when its condition is true, and `else` covers the other case.",
      "Conditions use `<`, `>`, `<=`, `>=`, `==` for equal and `!=` for not equal." ],
      'int count = 0;\nwhile (count < 3) {\n    count++;\n}\nif (count == 3) {\n    printf("done\\n");\n}'),
    clang("How long to double?", ["Money growing at 5% a year."],
      ["Use a while loop to grow `value` by 5% a year until it reaches 200, counting the years."], `
#include <stdio.h>

int main() {
    double value = 100.0;
    int years = 0;

    // Your while loop here

    printf("%d\\n", years);
    return 0;
}`, `
#include <stdio.h>

int main() {
    double value = 100.0;
    int years = 0;

    while (value < 200.0) {
        value = value * 1.05;
        years++;
    }

    printf("%d\\n", years);
    return 0;
}`,
      [src(String.raw`while\s*\(`, "Use a while loop: while (value < 200.0) { ... }"), out(String.raw`^15\s*$`, "It takes 15 years to double at 5%.")],
      "while (value < 200.0) {\n    value = value * 1.05;\n    years++;\n}"),
    clang("Play or pass", ["The quant's rule again: take a bet when its expected value is above zero."],
      ["If `ev` is greater than 0, print `play`. Otherwise print `pass`. End each with a new line."], `
#include <stdio.h>

int main() {
    double ev = 0.5 * 12.0 + 0.5 * (-4.0);

    // Your if and else here

    return 0;
}`, `
#include <stdio.h>

int main() {
    double ev = 0.5 * 12.0 + 0.5 * (-4.0);

    if (ev > 0) {
        printf("play\\n");
    } else {
        printf("pass\\n");
    }

    return 0;
}`,
      [src(String.raw`if\s*\(\s*ev\s*>\s*0`, "Start with: if (ev > 0) {"), src(String.raw`else`, "Add an else branch that prints pass."), out(String.raw`^play\s*$`, "With this ev the output should be: play")],
      'if (ev > 0) {\n    printf("play\\n");\n} else {\n    printf("pass\\n");\n}'),
    clang("Count the wins", ["An `if` inside a `for` loop lets you count the items that pass a test."],
      ["Count how many values in `results` are greater than 0 and store the count in `wins`."], `
#include <stdio.h>

int main() {
    int results[8] = {12, -4, -4, 12, 12, -4, 12, -4};
    int wins = 0;

    // Your loop here

    printf("%d\\n", wins);
    return 0;
}`, `
#include <stdio.h>

int main() {
    int results[8] = {12, -4, -4, 12, 12, -4, 12, -4};
    int wins = 0;

    for (int i = 0; i < 8; i++) {
        if (results[i] > 0) {
            wins++;
        }
    }

    printf("%d\\n", wins);
    return 0;
}`,
      [out(String.raw`^4\s*$`, "Four of the eight results are wins.")],
      "for (int i = 0; i < 8; i++) {\n    if (results[i] > 0) {\n        wins++;\n    }\n}"),
    mc("What does this loop do?", ["Runs once", "Runs 10 times", "Never stops, because x never changes"], 2, "The condition x < 10 stays true forever, since nothing inside the loop changes x. Every loop needs something that eventually makes its condition false.", "int x = 0;\nwhile (x < 10) {\n    printf(\"hi\\n\");\n}"),
  ]),
];
