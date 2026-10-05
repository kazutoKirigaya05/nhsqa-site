import type { Lesson } from "./types";
import { between, clang, lesson, mc, num, out, py, read, rlang, src, tryPy } from "./helpers";

// A second round of lessons for existing tracks. index.ts slots each set in before that track's quiz.

const PRICES = "prices = [100, 102, 101, 105, 107, 106, 110, 113, 111, 116]";

export const python2: Lesson[] = [
  lesson("strings-and-formatting", "Strings and formatting", "Make your output readable.", [
    read("Text is data too", [
      "A **string** is a piece of text. Tickers, dates and names all arrive as strings, so a quant handles them constantly.",
      "An **f-string** lets you drop values straight into text: put `f` before the opening quote and wrap each value in curly braces. Inside the braces, `:.2f` means show 2 decimal places." ],
      'name = "KO"\nprice = 71.5\nprint(f"{name} is at {price:.2f}")     # KO is at 71.50'),
    py("A price line", ["Reports have to be easy to read."],
      ["Use an f-string to print `AAPL closed at 187.50` from the two variables."], `
name = "AAPL"
price = 187.5

`, `
name = "AAPL"
price = 187.5

print(f"{name} closed at {price:.2f}")`,
      [src(String.raw`f["']`, "Use an f-string: print(f\"...\")"), out(String.raw`^AAPL closed at 187\.50\s*$`, "The output should be: AAPL closed at 187.50")], 'print(f"{name} closed at {price:.2f}")'),
    py("Clean up a list of tickers", ["Strings have methods. `.upper()` makes capitals and `.split(\",\")` cuts a string into a list at each comma."],
      ["Set `tickers` to the text in capitals, split at the commas."], `
text = "aapl,msft,nvda"

# Set tickers here

print(tickers)`, `
text = "aapl,msft,nvda"

tickers = text.upper().split(",")

print(tickers)`,
      [out(String.raw`^\['AAPL', 'MSFT', 'NVDA'\]\s*$`, "The output should be ['AAPL', 'MSFT', 'NVDA'].")], 'tickers = text.upper().split(",")'),
    py("Percentages", ["Inside an f-string, `:.1%` multiplies by 100 and adds a percent sign."],
      ["Print the return as a percentage with 1 decimal place."], `
ret = 0.125

`, `
ret = 0.125

print(f"{ret:.1%}")`,
      [out(String.raw`^12\.5%\s*$`, "The output should be: 12.5%")], 'print(f"{ret:.1%}")'),
    mc("What does this print?", ["KO: 71.5", "KO: 71.50", "{name}: {price:.2f}", "An error"], 1, "The f-string fills in the values, and :.2f shows two decimal places.", 'name = "KO"\nprice = 71.5\nprint(f"{name}: {price:.2f}")'),
  ]),

  lesson("handling-errors", "Handling errors", "Real data is messy. Make your code survive it.", [
    read("When things go wrong", [
      "Divide by zero, or turn the text \"n/a\" into a number, and Python stops with an error. In a script that runs every morning before the market opens, stopping is not acceptable.",
      "`try` and `except` let you catch an error and decide what to do instead." ],
      'try:\n    x = float("n/a")\nexcept ValueError:\n    x = None'),
    py("A safe division", ["A return is a division, and sometimes the starting price is missing or zero."],
      ["Make `safe_return` give back `None` instead of crashing when `start` is 0. Catch `ZeroDivisionError`."], `
def safe_return(start, end):
    return end / start - 1

print(safe_return(100, 110))
print(safe_return(0, 110))`, `
def safe_return(start, end):
    try:
        return end / start - 1
    except ZeroDivisionError:
        return None

print(safe_return(100, 110))
print(safe_return(0, 110))`,
      [src(String.raw`except\s+ZeroDivisionError`, "Catch the error with: except ZeroDivisionError:"), out(String.raw`^0\.1\d*\s*$`, "The first return should be about 0.1."), out(String.raw`^None\s*$`, "The second call should print None.")],
      "try:\n    return end / start - 1\nexcept ZeroDivisionError:\n    return None"),
    py("Skip the bad rows", ["A data file has prices as text, and some entries are broken. `float( )` raises a `ValueError` on text it cannot read."],
      ["Inside the loop, try to add `float(item)` to `total`. If that fails, add 1 to `skipped`."], `
raw = ["10.5", "n/a", "11.2", "", "12.0"]
total = 0
skipped = 0

for item in raw:
    # Add the number, or count a skip
    pass

print(round(total, 1), skipped)`, `
raw = ["10.5", "n/a", "11.2", "", "12.0"]
total = 0
skipped = 0

for item in raw:
    try:
        total += float(item)
    except ValueError:
        skipped += 1

print(round(total, 1), skipped)`,
      [out(String.raw`^33\.7 2\s*$`, "The output should be: 33.7 2")], "try:\n    total += float(item)\nexcept ValueError:\n    skipped += 1"),
    mc("Your script skipped 2 bad rows out of 5 and carried on. What should it also do?", ["Nothing", "Report how many rows it skipped, so a person can check whether something is wrong with the data", "Delete the file"], 1,
      "Silently ignoring errors hides problems. If 40% of your data is broken, someone needs to know before trading on the rest."),
  ]),

  lesson("classes", "Classes", "Bundle data with the things you can do to it.", [
    read("Your own kind of object", [
      "A position has data: a ticker, a number of shares, a cost. It also has things you want to ask it: what is it worth, what is its profit?",
      "A **class** bundles the two together. `__init__` runs when you create one and stores its data on `self`. Functions inside the class are called **methods** and can use that data." ],
      'class Position:\n    def __init__(self, ticker, shares, cost):\n        self.ticker = ticker\n        self.shares = shares\n        self.cost = cost\n\n    def value(self, price):\n        return self.shares * price'),
    py("Add a method", ["`cost` is the price paid per share."],
      ["Add a method `pnl(self, price)` that returns the shares times (price − cost)."], `
class Position:
    def __init__(self, ticker, shares, cost):
        self.ticker = ticker
        self.shares = shares
        self.cost = cost

    def value(self, price):
        return self.shares * price

    # Add pnl here

p = Position("AAPL", 20, 180.0)
print(p.value(190.0))
print(p.pnl(190.0))`, `
class Position:
    def __init__(self, ticker, shares, cost):
        self.ticker = ticker
        self.shares = shares
        self.cost = cost

    def value(self, price):
        return self.shares * price

    def pnl(self, price):
        return self.shares * (price - self.cost)

p = Position("AAPL", 20, 180.0)
print(p.value(190.0))
print(p.pnl(190.0))`,
      [src(String.raw`def\s+pnl\s*\(\s*self`, "Define the method with: def pnl(self, price):"), out(String.raw`^3800\.0\s*$`, "The value should be 3800.0."), out(String.raw`^200\.0\s*$`, "The profit should be 200.0.")],
      "def pnl(self, price):\n    return self.shares * (price - self.cost)"),
    py("A list of objects", ["Once positions are objects, a whole portfolio is just a list of them."],
      ["Set `total` to the sum of every position's `pnl` at its current price."], `
class Position:
    def __init__(self, ticker, shares, cost):
        self.ticker = ticker
        self.shares = shares
        self.cost = cost

    def pnl(self, price):
        return self.shares * (price - self.cost)

book = [Position("AAA", 10, 50.0), Position("BBB", -5, 120.0), Position("CCC", 30, 8.0)]
prices = {"AAA": 53.0, "BBB": 114.0, "CCC": 7.5}

# Set total here

print(total)`, `
class Position:
    def __init__(self, ticker, shares, cost):
        self.ticker = ticker
        self.shares = shares
        self.cost = cost

    def pnl(self, price):
        return self.shares * (price - self.cost)

book = [Position("AAA", 10, 50.0), Position("BBB", -5, 120.0), Position("CCC", 30, 8.0)]
prices = {"AAA": 53.0, "BBB": 114.0, "CCC": 7.5}

total = sum(p.pnl(prices[p.ticker]) for p in book)

print(total)`,
      [out(String.raw`^45\.0\s*$`, "The total should be 45.0: +30 on AAA, +30 on the BBB short, −15 on CCC.")], "total = sum(p.pnl(prices[p.ticker]) for p in book)"),
    mc("Why do large trading systems organize their code into classes?", ["Python requires it", "It keeps each kind of thing, such as an order or a position, together with the operations that belong to it", "It makes code run faster"], 1,
      "With thousands of lines and many programmers, keeping related data and behavior in one place is what keeps a system understandable."),
  ]),

  lesson("reading-data", "Reading data", "Turn a file of text into numbers you can use.", [
    read("Comma separated values", [
      "Market data usually arrives as **CSV**: plain text with one record per line and commas between the fields. The first line is often a header naming the columns.",
      "To read it by hand, split the text into lines, then split each line at the commas. Everything comes out as text, so numbers must be converted with `float( )`." ],
      "date,close\n2026-01-05,100.0\n2026-01-06,102.5"),
    py("Pull out a column", ["`data.split(\"\\n\")` gives the lines. `lines[1:]` skips the header."],
      ["Set `closes` to a list of the closing prices as numbers."], `
data = """date,close
2026-01-05,100.0
2026-01-06,102.5
2026-01-07,101.0
2026-01-08,104.5"""

lines = data.split("\\n")

# Set closes here

print(closes)`, `
data = """date,close
2026-01-05,100.0
2026-01-06,102.5
2026-01-07,101.0
2026-01-08,104.5"""

lines = data.split("\\n")

closes = [float(line.split(",")[1]) for line in lines[1:]]

print(closes)`,
      [out(String.raw`^\[100\.0, 102\.5, 101\.0, 104\.5\]\s*$`, "The output should be [100.0, 102.5, 101.0, 104.5].")], 'closes = [float(line.split(",")[1]) for line in lines[1:]]'),
    py("Find the best day", ["Keep the date and the price together so you can report which day it was."],
      ["Loop over the data lines and keep the date with the highest close in `best_date`."], `
data = """date,close
2026-01-05,100.0
2026-01-06,102.5
2026-01-07,101.0
2026-01-08,104.5"""

best_date = None
best_close = 0

for line in data.split("\\n")[1:]:
    date, close = line.split(",")
    # Keep the highest close and its date
    pass

print(best_date, best_close)`, `
data = """date,close
2026-01-05,100.0
2026-01-06,102.5
2026-01-07,101.0
2026-01-08,104.5"""

best_date = None
best_close = 0

for line in data.split("\\n")[1:]:
    date, close = line.split(",")
    if float(close) > best_close:
        best_close = float(close)
        best_date = date

print(best_date, best_close)`,
      [out(String.raw`^2026-01-08 104\.5\s*$`, "The output should be: 2026-01-08 104.5")], "if float(close) > best_close:\n    best_close = float(close)\n    best_date = date"),
    mc("In real projects, quants read CSV files with a library called pandas in one line. Why learn to do it by hand?", ["Libraries are unreliable", "So you understand what the library does, and can fix things when a file is not in the shape it expects", "It is faster by hand"], 1,
      "Tools save time once you know what they are doing. Real files are full of surprises: missing values, odd dates, extra commas."),
  ]),

  lesson("a-backtester", "A backtester in twenty lines", "Everything in this track, in one small program.", [
    read("Put the pieces together", [
      "You now have loops, functions, lists and conditions. That is enough to write a small but real research tool: a function that takes prices and a rule, and reports how the rule would have done.",
      "The rule is the momentum rule from the strategies track: hold the stock for the next day whenever today's price is above its average over the last `n` days." ]),
    py("Write the backtest function", ["`prices[i - n + 1:i + 1]` is the last `n` prices up to and including day `i`."],
      ["Inside the loop, if today's price is above `average`, add the next day's change to `profit`."], `
${PRICES}

def backtest(prices, n):
    profit = 0
    for i in range(n - 1, len(prices) - 1):
        average = sum(prices[i - n + 1:i + 1]) / n
        # Add tomorrow's change when the signal is on
        pass
    return profit

print(backtest(prices, 3))
print(backtest(prices, 2))`, `
${PRICES}

def backtest(prices, n):
    profit = 0
    for i in range(n - 1, len(prices) - 1):
        average = sum(prices[i - n + 1:i + 1]) / n
        if prices[i] > average:
            profit += prices[i + 1] - prices[i]
    return profit

print(backtest(prices, 3))
print(backtest(prices, 2))`,
      [out(String.raw`^2\s*\n1\s*$`, "The output should be 2 for a 3-day average and 1 for a 2-day average.")], "if prices[i] > average:\n    profit += prices[i + 1] - prices[i]"),
    tryPy("Try every setting", ["With the rule wrapped in a function, testing many versions takes one loop."],
      ["Run it. Then remember the overfitting lesson before you pick the best row."], `
${PRICES}

def backtest(prices, n):
    profit = 0
    for i in range(n - 1, len(prices) - 1):
        average = sum(prices[i - n + 1:i + 1]) / n
        if prices[i] > average:
            profit += prices[i + 1] - prices[i]
    return profit

for n in range(2, 7):
    print("average over", n, "days -> profit", backtest(prices, n))
print("buy and hold -> profit", prices[-1] - prices[0])`),
    mc("One setting of `n` gives the highest profit on these ten days. Should you trade it?", ["Yes, it is proven", "No. Picking the best of several settings on ten days of data is overfitting", "Only on Mondays"], 1,
      "The tool is real. The evidence is not. An honest test needs far more data, and a check on data the setting was not chosen from."),
    mc("What would you add next to make this backtester more realistic?", ["Brighter colors", "Trading costs, and a comparison with simply holding the stock", "More print statements"], 1,
      "Costs and a benchmark turn a toy into a research tool. Both are covered in the strategies track."),
  ]),
];

export const probability2: Lesson[] = [
  lesson("linearity-of-expectation", "Expected values add up", "The most useful shortcut in probability.", [
    read("Add the averages", [
      "The expected value of a sum is the sum of the expected values. Always. It does not matter whether the things are independent.",
      "One die averages 3.5, so ten dice average 35. One coin flip gives half a head on average, so fifty flips give 25. This rule, called **linearity of expectation**, turns hard problems into easy ones." ],
      "E[X + Y]  =  E[X] + E[Y]"),
    num("You roll 6 dice and add them up. What is the expected total?", 21, "6 × 3.5 = 21."),
    num("A trader makes 200 trades, each with an expected profit of $1.50. What is the expected total profit, in dollars?", 300, "200 × $1.50 = $300, however the trades are related to each other.", { prefix: "$" }),
    py("The hat problem", [
      "Ten people throw their hats in a pile and each takes one at random. On average, how many get their own hat back? Each person has a 1 in 10 chance, so the expected number is 10 × 1/10 = 1.",
      "Check it. `random.shuffle` mixes a list in place." ],
      ["Inside the loop, add to `total` the number of positions where `hats[i]` equals `i`."], `
import random

trials = 5000
total = 0

for t in range(trials):
    hats = list(range(10))
    random.shuffle(hats)
    # Count the people who got their own hat

print(total / trials)`, `
import random

trials = 5000
total = 0

for t in range(trials):
    hats = list(range(10))
    random.shuffle(hats)
    total += sum(1 for i in range(10) if hats[i] == i)

print(total / trials)`,
      [between(0.93, 1.07, "The average should be close to 1.")], "total += sum(1 for i in range(10) if hats[i] == i)"),
    mc("With 1,000 people and 1,000 hats, how many get their own hat on average?", ["About 1", "About 10", "About 100"], 0,
      "1,000 × 1/1,000 = 1. The answer is 1 whatever the size of the crowd, and linearity gets you there in one line."),
  ]),

  lesson("variance-of-sums", "How risk adds up", "Risk grows with the square root, not the count.", [
    read("Variances add, standard deviations do not", [
      "For **independent** bets, the variances add. Since standard deviation is the square root of variance, the risk of n similar independent bets added together grows with the square root of n.",
      "Make 100 bets that each win or lose $1, and the total has a standard deviation of √100 = $10, not $100." ],
      "standard deviation of the sum of n independent bets  =  σ × √n"),
    num("You make 400 independent bets, each with a standard deviation of $1. What is the standard deviation of your total, in dollars?", 20, "√400 = 20.", { prefix: "$" }),
    py("Check it by simulation", ["Add up 100 bets of plus or minus 1, and repeat that 2,000 times."],
      ["Inside the loop, append the sum of 100 random choices of 1 or -1 to `totals`."], `
import random, statistics

totals = []

for t in range(2000):
    # Append the sum of 100 bets
    pass

print(round(statistics.stdev(totals), 1))`, `
import random, statistics

totals = []

for t in range(2000):
    totals.append(sum(random.choice([1, -1]) for i in range(100)))

print(round(statistics.stdev(totals), 1))`,
      [between(9.2, 10.8, "The standard deviation of the totals should be about 10.")], "totals.append(sum(random.choice([1, -1]) for i in range(100)))"),
    num("A stock's daily returns have a standard deviation of 1%. There are about 252 trading days in a year. Treating the days as independent, what is the yearly standard deviation, in percent? (One decimal place.)", Math.sqrt(252),
      "1% × √252 ≈ 15.9%. Multiplying by the square root of 252 is how traders turn daily volatility into yearly volatility.", { tol: 0.11 }),
    mc("Your expected profit grows in proportion to the number of trades, while your risk grows only with the square root. What happens to profit relative to risk as you make more independent trades?", ["It gets worse", "It gets better", "It stays the same"], 1,
      "Profit over risk improves with the square root of the number of independent bets. This is the math behind why quant firms prefer thousands of small edges to one big one."),
  ]),

  lesson("the-law-of-large-numbers", "The law of large numbers", "Why averages can be trusted, eventually.", [
    read("Averages settle down", [
      "The **law of large numbers** says that as you repeat an experiment, the average of the results gets closer and closer to the expected value.",
      "It is the reason casinos, insurers and market makers can run a business on chance. Any one outcome is unpredictable. The average of millions is close to certain." ]),
    tryPy("Watch the average converge", ["The average of more and more dice rolls."],
      ["Run it a few times. The early averages wander. The late ones barely move from 3.5."], `
import random

total = 0
for n in range(1, 100001):
    total += random.randint(1, 6)
    if n in (10, 100, 1000, 10000, 100000):
        print(n, "rolls: average", round(total / n, 3))`),
    py("Measure the miss", ["How far is the average of 100,000 rolls from 3.5?"],
      ["Set `average` to the mean of 100,000 dice rolls."], `
import random

# Set average here

print(round(average, 2))`, `
import random

average = sum(random.randint(1, 6) for i in range(100000)) / 100000

print(round(average, 2))`,
      [between(3.46, 3.54, "The average should be within a few hundredths of 3.5.")], "average = sum(random.randint(1, 6) for i in range(100000)) / 100000"),
    mc("A roulette wheel has landed on red 8 times in a row. Does the law of large numbers mean black is now more likely?", ["Yes, it has to even out", "No. The wheel has no memory. The streak simply gets diluted by the many spins still to come", "Yes, but only slightly"], 1,
      "The law works by swamping, not by correcting. Eight reds are a big share of 10 spins and a negligible share of 10,000. Believing otherwise is the gambler's fallacy."),
    mc("A casino has a 1% edge on each bet. Why does it not worry about any single gambler winning big?", ["It bans winners", "Over millions of bets its average result is almost certain to be close to its 1% edge", "Gamblers never win"], 1,
      "The casino is the one playing the long game. A market maker earning a tiny spread on millions of trades is in the same position."),
  ]),

  lesson("markov-chains", "Markov chains", "A model where tomorrow depends only on today.", [
    read("States and transitions", [
      "A **Markov chain** describes something that moves between **states**, where the chance of the next state depends only on the current one, not on the whole history.",
      "A simple market model has two states: a calm **bull** market and a rough **bear** market. Say a bull day is followed by another bull day with probability 0.9, and a bear day by another bear day with probability 0.8." ],
      "bull → bull 0.9     bull → bear 0.1\nbear → bear 0.8     bear → bull 0.2"),
    num("Today is a bull day. What is the probability that both tomorrow and the day after are bull days?", 0.81, "0.9 × 0.9 = 0.81."),
    py("Simulate the chain", ["Run the market for 100,000 days and see what share of them are bull days."],
      ["Inside the loop: if the state is bull, switch to bear with probability 0.1. If it is bear, switch to bull with probability 0.2. Then count the day if the state is bull."], `
import random

state = "bull"
bull_days = 0
days = 100000

for day in range(days):
    # Maybe switch state, then count bull days
    pass

print(round(bull_days / days, 2))`, `
import random

state = "bull"
bull_days = 0
days = 100000

for day in range(days):
    if state == "bull":
        if random.random() < 0.1:
            state = "bear"
    else:
        if random.random() < 0.2:
            state = "bull"
    if state == "bull":
        bull_days += 1

print(round(bull_days / days, 2))`,
      [between(0.64, 0.7, "About 0.67 of the days should be bull days.")], 'if state == "bull":\n    if random.random() < 0.1:\n        state = "bear"\nelse:\n    if random.random() < 0.2:\n        state = "bull"\nif state == "bull":\n    bull_days += 1'),
    mc("The chain spends about two thirds of its time in the bull state, whatever state it started in. What is that long-run share called?", ["The transition", "The stationary distribution", "The expected value"], 1,
      "Bear markets end twice as readily as bull markets do here (0.2 against 0.1), so the chain spends twice as long in bull. Finding this long-run balance is the central question about any Markov chain."),
    mc("Quants use models like this to describe markets that switch between calm and turbulent periods. What is the hardest part in practice?", ["Writing the loop", "You cannot see the state directly. You have to infer it from prices, and by the time it is obvious it may have changed", "Choosing the names"], 1,
      "Models with states you cannot observe are called hidden Markov models, and they are a real tool in quantitative research."),
  ]),
];

export const gameTheory2: Lesson[] = [
  lesson("second-price-auctions", "Second-price auctions", "An auction where honesty is the best strategy.", [
    read("Pay the runner-up's bid", [
      "In a **second-price auction**, everyone bids in secret and the highest bidder wins, but pays only the second-highest bid.",
      "It sounds odd, but it has a remarkable property: your best strategy is to bid exactly what the item is worth to you. Your bid decides whether you win. It never decides what you pay." ]),
    num("An item is worth $10 to you. You bid $10. The next highest bid is $7. What is your profit, in dollars?", 3, "You win and pay the second-highest bid: $10 − $7 = $3.", { prefix: "$" }),
    mc("Same auction, but you shade your bid down to $6 to try to save money. The other bid is still $7. What happens?", ["You win and pay less", "You lose the item, and with it the $3 you would have made", "You pay $6"], 1,
      "Shading could not have lowered your price, because you never pay your own bid. All it did was lose you an auction you wanted to win."),
    py("Test it", ["The item is worth 6 to you. One rival bids a random amount between 0 and 10. Compare bidding your true value against shading to 4."],
      ["Inside the loop, add your profit to `total` when your `bid` beats the rival's: your value minus the rival's bid."], `
import random

def average_profit(bid, value=6, trials=20000):
    total = 0
    for t in range(trials):
        rival = random.uniform(0, 10)
        # If you win, add value - rival to total
        pass
    return total / trials

print(round(average_profit(6), 2))
print(round(average_profit(4), 2))`, `
import random

def average_profit(bid, value=6, trials=20000):
    total = 0
    for t in range(trials):
        rival = random.uniform(0, 10)
        if bid > rival:
            total += value - rival
    return total / trials

print(round(average_profit(6), 2))
print(round(average_profit(4), 2))`,
      [out(String.raw`^1\.[78]\d?\s*$`, "Bidding your true value of 6 should average about 1.8."), out(String.raw`^1\.[56]\d?\s*$`, "Shading to 4 should average about 1.6, which is worse.")], "if bid > rival:\n    total += value - rival"),
    mc("Why do designers of auctions like the second-price rule?", ["It raises the most money every time", "Bidders have no reason to hide what the item is really worth to them", "It is the oldest kind"], 1,
      "When honesty is the best strategy for everyone, the item goes to whoever values it most. Auctions for online advertising have used versions of this idea, and auction design is a field quants and economists work in together."),
  ]),

  lesson("backward-induction", "Thinking backwards", "Solve a game by starting at the end.", [
    read("Games with turns", [
      "When players move one after another, the way to solve the game is to start at the last move and work back. Ask what the final player would do, then what the one before would do knowing that, and so on. It is called **backward induction**.",
      "A new company is deciding whether to enter a market. If it stays out, it gets 0 and the existing company gets 10. If it enters, the existing company chooses: **accept** it, giving each of them 4, or start a price **fight**, giving the newcomer −2 and itself 1." ]),
    mc("Start at the end. The newcomer has entered. What should the existing company do?", ["Fight, to punish the newcomer", "Accept, because 4 is more than 1", "It makes no difference"], 1,
      "Once entry has happened, fighting only hurts the existing company: it gets 1 instead of 4."),
    num("Now step back. Knowing the existing company will accept, what payoff does the newcomer get by entering?", 4, "Entering leads to acceptance, which pays the newcomer 4. That beats the 0 from staying out, so it enters."),
    mc("Before the newcomer decides, the existing company announces loudly that it will fight any entrant. Should the newcomer believe it?", ["Yes, a threat is a threat", "No. When the moment comes, fighting would cost the existing company, so the threat is not credible", "Only if it is in writing"], 1,
      "A threat that would hurt the one making it is called an empty threat. Backward induction sees straight through it."),
    mc("How could the existing company make its threat believable?", ["By shouting louder", "By doing something beforehand that makes fighting its best option, such as building so much capacity that a price war costs it little", "It cannot"], 1,
      "Changing your own future incentives is called commitment. It is the same idea you met in the Standoff, and it explains a great deal of real business behavior."),
  ]),

  lesson("playing-it-safe", "Playing it safe", "The best you can guarantee against a clever opponent.", [
    read("Assume the worst", [
      "In a zero-sum game, whatever you win your opponent loses, so they will try to leave you with as little as possible. A cautious way to play: for each of your choices, find the worst that could happen, then pick the choice whose worst case is best.",
      "That is the **maximin** strategy, and what it secures is your **guaranteed** payoff. In this table your payoff comes first in each cell." ],
      "              Rival: Left   Rival: Right\nYou: A            3            −1\nYou: B            0             1"),
    num("If you choose A, what is the worst payoff you can get?", -1, "Against Right, A pays −1."),
    num("Which payoff can you guarantee by choosing the row with the better worst case?", 0, "B's worst case is 0, which beats A's worst case of −1. Choosing B guarantees at least 0."),
    py("Do better by mixing", [
      "Now choose A with probability p and B the rest of the time. If the rival plays Left you average 3p. If the rival plays Right you average −p + (1 − p).",
      "The rival will pick whichever is worse for you. Find the p that makes that worst case as good as possible." ],
      ["Inside the loop, set `worst` to the smaller of the two averages. If it beats `best`, store it and `p`."], `
best = -999
best_p = 0

for step in range(0, 101):
    p = step / 100
    if_left = 3 * p
    if_right = -p + (1 - p)
    # Find the worst case, and keep the best one
    pass

print(best_p, round(best, 2))`, `
best = -999
best_p = 0

for step in range(0, 101):
    p = step / 100
    if_left = 3 * p
    if_right = -p + (1 - p)
    worst = min(if_left, if_right)
    if worst > best:
        best = worst
        best_p = p

print(best_p, round(best, 2))`,
      [out(String.raw`^0\.2 0\.6\s*$`, "The best mix plays A 20% of the time and guarantees 0.6.")], "worst = min(if_left, if_right)\nif worst > best:\n    best = worst\n    best_p = p"),
    mc("By mixing, your guaranteed payoff rose from 0 to 0.6. Where did the extra come from?", ["Luck", "Your rival can no longer predict your move and aim at its weak point", "The table changed"], 1,
      "In 1928 John von Neumann proved that every zero-sum game has such a best guaranteed value. His minimax theorem is where game theory began."),
  ]),
];

export const r2: Lesson[] = [
  lesson("data-frames", "Data frames", "R's table of data, where the real work happens.", [
    read("A table with named columns", [
      "A **data frame** is a table: each column is a vector with a name, and each row is one record. It is the shape nearly all data analysis happens in.",
      "You build one with `data.frame( )`, and pick out a column with a dollar sign: `df$price`." ],
      'df <- data.frame(ticker = c("AAA", "BBB"), price = c(50, 120))\ndf$price\n# [1]  50 120'),
    rlang("Add a column", ["A new column can be calculated from existing ones in a single line."],
      ["Add a column `value` equal to price times shares.", "Print the total of the value column."], `
df <- data.frame(
  ticker = c("AAA", "BBB", "CCC"),
  price = c(50, 120, 8),
  shares = c(10, 4, 25)
)

`, `
df <- data.frame(
  ticker = c("AAA", "BBB", "CCC"),
  price = c(50, 120, 8),
  shares = c(10, 4, 25)
)

df$value <- df$price * df$shares
sum(df$value)`,
      [src(String.raw`df\$value\s*(<-|=)`, "Create the column with: df$value <- ..."), out(String.raw`\[1\] 1180\s*$`, "The total value should be [1] 1180.")], "df$value <- df$price * df$shares\nsum(df$value)"),
    rlang("Filter rows", ["Square brackets take a row test, then a comma, then the columns you want."],
      ["Print the tickers of the rows whose price is above 40."], `
df <- data.frame(
  ticker = c("AAA", "BBB", "CCC"),
  price = c(50, 120, 8),
  shares = c(10, 4, 25)
)

`, `
df <- data.frame(
  ticker = c("AAA", "BBB", "CCC"),
  price = c(50, 120, 8),
  shares = c(10, 4, 25)
)

df[df$price > 40, "ticker"]`,
      [out(String.raw`\[1\] "AAA" "BBB"\s*$`, 'The output should be [1] "AAA" "BBB".')], 'df[df$price > 40, "ticker"]'),
    mc("What does `nrow(df)` give for that data frame?", ["[1] 3", "[1] 9", "[1] 2", "An error"], 0, "nrow counts the rows. There are three records."),
  ]),

  lesson("simulation-in-r", "Simulation in R", "Thousands of experiments in a line or two.", [
    read("Built for random numbers", [
      "R has a function for drawing from every common distribution. `rnorm(n, mean, sd)` draws n values from a normal distribution.",
      "`replicate(n, expression)` runs an expression n times and collects the results. Together they make simulation almost effortless." ]),
    rlang("A year of returns", ["Draw 10,000 daily returns with a mean of 0.001 and a standard deviation of 0.02."],
      ["Use `rnorm` to create `x`, then print its mean."], `
set.seed(1)

# Create x here

mean(x)`, `
set.seed(1)

x <- rnorm(10000, mean = 0.001, sd = 0.02)

mean(x)`,
      [src(String.raw`rnorm\(`, "Use rnorm( ) to draw the values."), between(0.0003, 0.0017, "The mean should be close to 0.001.")], "x <- rnorm(10000, mean = 0.001, sd = 0.02)"),
    rlang("Many experiments at once", ["Each experiment plays the coin bet 100 times and adds up the winnings."],
      ["Use `replicate` to run it 2,000 times and store the totals in `sims`, then print their mean."], `
set.seed(1)

# Create sims here

mean(sims)`, `
set.seed(1)

sims <- replicate(2000, sum(sample(c(12, -4), 100, replace = TRUE)))

mean(sims)`,
      [src(String.raw`replicate\(`, "Use replicate( ) to repeat the experiment."), between(385, 415, "The average total should be close to 400: 100 flips at 4 each.")], "sims <- replicate(2000, sum(sample(c(12, -4), 100, replace = TRUE)))"),
    rlang("Picture the results", ["`hist( )` draws a histogram."],
      ["Draw a histogram of `sims`."], `
set.seed(1)
sims <- replicate(2000, sum(sample(c(12, -4), 100, replace = TRUE)))

`, `
set.seed(1)
sims <- replicate(2000, sum(sample(c(12, -4), 100, replace = TRUE)))

hist(sims)`,
      [src(String.raw`hist\(\s*sims`, "Call hist(sims)."), { plot: true, msg: "No chart appeared. Check your hist( ) line." }], "hist(sims)"),
    mc("The histogram is a bell shape centered near 400. Each single flip is just +12 or −4. Why is the total bell-shaped?", ["R smooths it", "Sums of many independent results pile up into a normal shape, which is the central limit theorem", "Coins are normally distributed"], 1,
      "You are looking at the central limit theorem. It is why so much of statistics, and so many financial models, start from the normal distribution."),
  ]),
];

export const c2: Lesson[] = [
  lesson("functions-and-pointers", "Functions that change things", "Why C functions need pointers to modify your variables.", [
    read("Copies, not originals", [
      "When you pass a variable to a C function, the function gets a **copy**. Changing the copy does nothing to the original.",
      "To let a function change your variable, pass its **address** instead. The function receives a pointer and reaches through it with `*`." ],
      'void add_one(int *p) {\n    *p = *p + 1;\n}\n\nint x = 5;\nadd_one(&x);     // x is now 6'),
    clang("Double it", ["`value` here is a pointer to a double."],
      ["Make `double_it` multiply the number that `value` points to by 2."], `
#include <stdio.h>

void double_it(double *value) {
    // Change what value points to
}

int main() {
    double position = 150.0;
    double_it(&position);
    printf("%.1f\\n", position);
    return 0;
}`, `
#include <stdio.h>

void double_it(double *value) {
    *value = *value * 2;
}

int main() {
    double position = 150.0;
    double_it(&position);
    printf("%.1f\\n", position);
    return 0;
}`,
      [out(String.raw`^300\.0\s*$`, "The position should print as 300.0.")], "*value = *value * 2;"),
    clang("Swap two values", ["A classic. Swapping needs a temporary variable to hold one value while you overwrite it."],
      ["Make `swap` exchange the values that `a` and `b` point to."], `
#include <stdio.h>

void swap(int *a, int *b) {
    // Exchange *a and *b
}

int main() {
    int bid = 3;
    int ask = 7;
    swap(&bid, &ask);
    printf("%d %d\\n", bid, ask);
    return 0;
}`, `
#include <stdio.h>

void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main() {
    int bid = 3;
    int ask = 7;
    swap(&bid, &ask);
    printf("%d %d\\n", bid, ask);
    return 0;
}`,
      [out(String.raw`^7 3\s*$`, "After the swap the output should be: 7 3")], "int temp = *a;\n*a = *b;\n*b = temp;"),
    mc("What does this print?", ["5", "6", "An address", "An error"], 0, "The function received a copy of x and changed only the copy. The original is still 5.", 'void bump(int n) { n = n + 1; }\n\nint x = 5;\nbump(x);\nprintf("%d\\n", x);'),
    mc("A function needs to work on an array of a million prices. Why is passing a pointer better than passing a copy?", ["Pointers are prettier", "Copying a million values on every call wastes time and memory, and a pointer is just one address", "Copies are not allowed"], 1,
      "Avoiding needless copying is a large part of writing fast code, and one reason trading systems are written in C and C++."),
  ]),

  lesson("simulation-in-c", "Simulation in C", "Random numbers and a Monte Carlo loop, close to the metal.", [
    read("Where random numbers come from", [
      "A computer cannot roll dice. It makes **pseudo-random** numbers with a formula: take the last number, multiply, add, and keep the remainder after dividing. The results look random, but the same starting **seed** always gives the same sequence.",
      "That is useful. A simulation that can be repeated exactly can be checked and debugged." ],
      "seed = (seed * 75 + 74) % 65537;"),
    clang("A random number generator", ["`%` gives the remainder after division."],
      ["Make `next_random` update `seed` with the formula above and return it."], `
#include <stdio.h>

int seed = 1;

int next_random() {
    // Update seed and return it
    return 0;
}

int main() {
    printf("%d\\n", next_random());
    printf("%d\\n", next_random());
    printf("%d\\n", next_random());
    return 0;
}`, `
#include <stdio.h>

int seed = 1;

int next_random() {
    seed = (seed * 75 + 74) % 65537;
    return seed;
}

int main() {
    printf("%d\\n", next_random());
    printf("%d\\n", next_random());
    printf("%d\\n", next_random());
    return 0;
}`,
      [out(String.raw`^149\s*\n11249\s*\n57305\s*$`, "The first three numbers should be 149, 11249 and 57305.")], "seed = (seed * 75 + 74) % 65537;\nreturn seed;"),
    clang("Monte Carlo in C", ["Use the generator as a coin: an even number is heads and wins 12, an odd number is tails and loses 4."],
      ["Inside the loop, add 12 to `total` when `r` is even and subtract 4 when it is odd."], `
#include <stdio.h>

int seed = 1;

int next_random() {
    seed = (seed * 75 + 74) % 65537;
    return seed;
}

int main() {
    double total = 0.0;
    int flips = 10000;

    for (int i = 0; i < flips; i++) {
        int r = next_random();
        // Win 12 or lose 4
    }

    printf("%.2f\\n", total / flips);
    return 0;
}`, `
#include <stdio.h>

int seed = 1;

int next_random() {
    seed = (seed * 75 + 74) % 65537;
    return seed;
}

int main() {
    double total = 0.0;
    int flips = 10000;

    for (int i = 0; i < flips; i++) {
        int r = next_random();
        if (r % 2 == 0) {
            total += 12.0;
        } else {
            total -= 4.0;
        }
    }

    printf("%.2f\\n", total / flips);
    return 0;
}`,
      [between(3.6, 4.4, "The average should come out close to 4.")], "if (r % 2 == 0) {\n    total += 12.0;\n} else {\n    total -= 4.0;\n}"),
    mc("You run that program twice. What do you get?", ["Two different answers", "Exactly the same answer both times", "An error the second time"], 1,
      "The seed starts at 1 both times, so the sequence is identical. To get a different run you would start from a different seed."),
    mc("A bank runs a risk simulation with millions of paths every night. Why might it be written in C or C++ instead of Python?", ["Python cannot do loops", "Compiled code can run simple loops like this far faster", "C is easier to read"], 1,
      "When a calculation must finish before the market opens, raw speed decides which language is used. Many firms explore ideas in Python and run the heavy work in C++."),
  ]),
];

export const whatIsAQuant2: Lesson[] = [
  lesson("a-day-on-a-trading-desk", "A day on a trading desk", "What the hours actually look like.", [
    read("Before the open", [
      "A trading desk's day starts early. Before the market opens, the team checks what happened overnight in Asia and Europe, reads any company news, and makes sure every system is running.",
      "Researchers review how yesterday's strategies did compared with what the models predicted. A gap between the two is a clue that something has changed." ]),
    read("While the market is open", [
      "From the opening bell the systems trade automatically, thousands of times a minute. People do not place those trades by hand. Their job is to watch: are the strategies behaving as designed, is risk within limits, is anything unusual happening?",
      "When something odd appears, such as a sudden price jump or a data feed that stops, someone has to decide within seconds whether to keep trading or switch a strategy off." ]),
    mc("A strategy that usually makes a little money every hour has lost a large amount in ten minutes, and nobody knows why. What is the sensible first move?", ["Double its size to win the money back", "Reduce or stop it, then find out what happened", "Ignore it until the close"], 1,
      "Stop the bleeding first and investigate second. Firms give traders the authority, and the duty, to turn things off."),
    read("After the close", [
      "When trading ends, the day's results are checked against the firm's records, and the team reviews what went well and badly. Then comes the part many quants like best: research.",
      "Evenings and quiet hours are for testing new ideas, improving code and reading. The firms that do well are the ones that keep learning." ]),
    mc("Which of these best describes the working day at an automated trading firm?", ["Shouting orders across a room", "Mostly watching systems, managing risk and doing research, with short bursts of urgent decisions", "Waiting for one big trade a year"], 1,
      "The crowded, shouting trading floor of old films has mostly been replaced by quiet rooms of screens and code."),
  ]),

  lesson("a-short-history-of-quants", "A short history of quants", "Where the field came from, in six moments.", [
    read("From a thesis to a formula", [
      "**1900.** A French student, Louis Bachelier, wrote a thesis modeling stock prices as a random walk. Almost nobody noticed for fifty years.",
      "**The 1960s.** A math professor, Edward Thorp, used probability to beat casino blackjack, published how, and then turned the same thinking on the stock market.",
      "**1973.** Fischer Black, Myron Scholes and Robert Merton published a formula for pricing options. In the same year, the first modern options exchange opened in Chicago." ]),
    mc("What did Bachelier's 1900 thesis propose?", ["That prices always rise", "That price changes behave like a random walk", "That options are worthless"], 1,
      "It was the first mathematical model of prices, decades ahead of its time."),
    read("Triumphs and warnings", [
      "**The 1980s onward.** Jim Simons, a mathematician, founded Renaissance Technologies and hired scientists instead of financiers. Its main fund became one of the most successful in history.",
      "**1987.** On one October day the US stock market fell by more than 20%. Automated selling strategies that many funds were using at once were widely blamed for making it worse.",
      "**1998.** A fund called Long-Term Capital Management, whose partners included two Nobel prize winners, lost almost everything in a few weeks when markets moved in ways its models said were nearly impossible." ]),
    mc("What is the lesson usually drawn from the 1998 collapse of Long-Term Capital Management?", ["Models are useless", "Even brilliant models fail when they underestimate rare events and use too much borrowed money", "Nobel prizes are bad luck"], 1,
      "The models were clever, and the positions were far too large for the true risk. It is the standard case study in why risk management matters."),
    mc("Looking across this history, what has changed least?", ["The technology", "The core ideas: probability, careful testing and respect for risk", "The speed of trading"], 1,
      "Computers got millions of times faster. The thinking you are learning in these tracks is the same thinking that started the field."),
  ]),
];

export const markets2: Lesson[] = [
  lesson("indexes-and-funds", "Indexes and funds", "How the market as a whole is measured and bought.", [
    read("One number for the whole market", [
      "An **index** tracks a basket of stocks to summarize the market. The best known US index follows about 500 of the largest companies.",
      "Most indexes are **weighted by size**: a company worth ten times as much counts ten times as much. So a few giant companies can drive the index.",
      "A fund that holds everything in an index and trades on an exchange like a stock is called an **ETF**. The funds in the Trading floor, such as SPY, are ETFs." ]),
    py("A size-weighted index", ["Three companies, with their sizes in billions of dollars and their returns today."],
      ["Set `index_return` to the sum of size times return, divided by the total size."], `
sizes = [300, 100, 50]
returns = [0.01, 0.03, -0.02]

# Set index_return here

print(round(index_return, 4))`, `
sizes = [300, 100, 50]
returns = [0.01, 0.03, -0.02]

index_return = sum(s * r for s, r in zip(sizes, returns)) / sum(sizes)

print(round(index_return, 4))`,
      [out(String.raw`^0\.0111\s*$`, "The index return should be 0.0111.")], "index_return = sum(s * r for s, r in zip(sizes, returns)) / sum(sizes)"),
    num("The simple average of those three returns (1%, 3% and −2%) is what, in percent? (Two decimal places.)", 2 / 3, "(1 + 3 − 2) ÷ 3 = 0.67%. The size-weighted answer, 1.11%, is higher because the biggest company had a decent day.", { tol: 0.01 }),
    mc("An index is weighted by size, and its five largest companies make up a quarter of it. What does that mean for someone who owns the index fund?", ["They are equally spread across all 500 companies", "A large part of their result depends on a handful of giant companies", "They own only five companies"], 1,
      "Owning an index is diversified, but less evenly than the number 500 suggests. It is worth knowing what is really inside a fund."),
    mc("Why would a trader buy an ETF like SPY instead of 500 separate stocks?", ["It is the only legal way", "One trade gives exposure to the whole basket, cheaply", "ETFs cannot fall"], 1,
      "ETFs made owning the whole market as easy as buying one share. They can fall just as far as what they hold."),
  ]),

  lesson("futures", "Futures", "Agreeing a price today for a trade later.", [
    read("A deal about the future", [
      "A **futures contract** is an agreement to buy or sell something at a set price on a set date. A farmer can lock in a price for wheat months before harvest. An airline can lock in a price for fuel.",
      "Futures trade on exchanges and exist for oil, gold, wheat, interest rates and stock indexes. You do not pay the full price up front. You post a deposit called **margin**, and gains and losses are settled every day." ]),
    num("You buy one oil futures contract, covering 1,000 barrels, at $80 a barrel. The price rises to $83. What is your profit, in dollars?", 3000, "$3 a barrel on 1,000 barrels is $3,000.", { prefix: "$" }),
    num("That contract controlled $80,000 of oil, and you posted $8,000 of margin. Your $3,000 profit is what percentage return on your margin?", 37.5,
      "3,000 ÷ 8,000 = 37.5%, from a price move of under 4%. That magnifying effect is called leverage, and it works equally well in reverse."),
    mc("A wheat farmer sells futures before the harvest. What is the farmer doing?", ["Gambling on prices", "Hedging: locking in a price to remove the risk of it falling", "Arbitrage"], 1,
      "The farmer gives up the chance of a higher price in exchange for certainty. Futures markets began as a way for producers to do exactly this."),
    mc("If the farmer is hedging, who is usually on the other side of the trade?", ["Nobody", "A buyer who needs wheat, or a trader willing to carry the price risk in the hope of profit", "The government"], 1,
      "Markets move risk from those who do not want it to those who are willing to hold it, at a price. Much of quant trading is the business of holding and managing those risks."),
  ]),

  lesson("crashes", "Crashes and circuit breakers", "What happens when everyone sells at once.", [
    read("When the market breaks", [
      "Usually there are buyers for every seller. Occasionally fear takes over, everyone wants to sell at once, and prices fall with almost no buyers in sight.",
      "On 19 October 1987, US stocks fell more than 20% in a single day. On 6 May 2010, in what became known as the flash crash, the market dropped several percent within minutes and then bounced most of the way back. Automated trading played a part in both." ]),
    mc("In a crash, market makers often widen their spreads enormously or stop quoting. Why?", ["They are on holiday", "Prices are moving so fast that standing ready to buy means almost certain losses", "They are required to"], 1,
      "It is adverse selection at its most extreme. When market makers step back, there is even less buying, which makes the fall steeper."),
    read("Circuit breakers", [
      "After 1987, exchanges introduced **circuit breakers**: rules that pause trading when prices fall too far, too fast. In the US, if the main index falls 7% in a day, trading stops for 15 minutes. There are further thresholds at 13% and 20%.",
      "The idea is to give people time to think, check their systems and let buyers gather." ]),
    mc("What is the argument for pausing trading during a sharp fall?", ["It guarantees prices recover", "It interrupts panic and faulty programs, and gives time for information and buyers to arrive", "It makes money for the exchange"], 1,
      "A pause cannot change what a company is worth. It can stop a feedback loop of selling that feeds on itself."),
    mc("A quant's model says a 20% fall in one day should happen less than once in the lifetime of the universe. It has happened. What should the quant conclude?", ["The fall was a mistake", "The model's assumptions about extreme events are wrong", "Nothing"], 1,
      "When reality contradicts the model, reality wins. Planning for events worse than anything in your data is the first rule of risk management."),
  ]),
];

const BS = `import math

def N(x):
    return 0.5 * (1 + math.erf(x / math.sqrt(2)))

def call_price(S, K, T, vol):
    d1 = (math.log(S / K) + 0.5 * vol ** 2 * T) / (vol * math.sqrt(T))
    d2 = d1 - vol * math.sqrt(T)
    return S * N(d1) - K * N(d2)`;

export const options2: Lesson[] = [
  lesson("black-scholes", "The Black-Scholes formula", "The most famous equation in finance.", [
    read("From one step to infinitely many", [
      "The binomial model let the stock make a single jump. Chop time into more and more, smaller and smaller steps, and the price it gives settles on one formula. That is the **Black-Scholes formula**, published in 1973.",
      "It needs the stock price S, the strike K, the time to expiry T in years, and the stock's **volatility**. With interest rates set to zero it reads:",
      "N is the normal distribution's running total: the probability that a standard normal value falls below x." ],
      "call  =  S × N(d1) − K × N(d2)\n\nd1 = (ln(S ÷ K) + ½ × vol² × T) ÷ (vol × √T)\nd2 = d1 − vol × √T"),
    py("Code the formula", ["`N` is provided, using a function called erf from Python's math module."],
      ["Complete `call_price` by returning S × N(d1) − K × N(d2)."], `
import math

def N(x):
    return 0.5 * (1 + math.erf(x / math.sqrt(2)))

def call_price(S, K, T, vol):
    d1 = (math.log(S / K) + 0.5 * vol ** 2 * T) / (vol * math.sqrt(T))
    d2 = d1 - vol * math.sqrt(T)
    # Replace the next line
    pass

print(round(call_price(100, 100, 1, 0.2), 2))
print(round(call_price(100, 100, 1, 0.4), 2))`, `
${BS}

print(round(call_price(100, 100, 1, 0.2), 2))
print(round(call_price(100, 100, 1, 0.4), 2))`,
      [out(String.raw`^7\.97\s*$`, "With 20% volatility the call should cost 7.97."), out(String.raw`^15\.85\s*$`, "With 40% volatility the call should cost 15.85.")], "return S * N(d1) - K * N(d2)"),
    mc("Doubling the volatility from 20% to 40% roughly doubled the option's price. Why does volatility matter so much?", ["It changes the strike", "Bigger swings mean bigger possible payoffs, while the loss is still capped at the premium", "It lowers the stock price"], 1,
      "For an option at the strike, price is almost proportional to volatility. Trading options is largely trading volatility."),
    tryPy("Explore the formula", ["Price the same option at different times to expiry."],
      ["Run it. Then change the volatility, or move the strike to 110, and see what happens."], `
${BS}

for months in [1, 3, 6, 12, 24]:
    print(months, "months:", round(call_price(100, 100, months / 12, 0.2), 2))`),
    mc("The option is worth more with 24 months left than with 1 month left. Why?", ["Options earn interest", "More time gives the stock more chance to move a long way", "The strike rises over time"], 1,
      "An option loses value as time passes, all else equal. Traders call that time decay, and it is the price of holding the option."),
  ]),

  lesson("implied-volatility", "Implied volatility", "Reading the market's forecast out of an option's price.", [
    read("Run the formula backwards", [
      "Every input to Black-Scholes can be looked up, except volatility, which is a guess about the future. So traders turn the question around: given the price the option is trading at, what volatility would the formula need to produce it?",
      "That number is the **implied volatility**. It is the market's own estimate of how much the stock will move, and options are usually quoted in it instead of in dollars." ]),
    py("Solve for it", [
      "There is no formula for the answer, but the price rises steadily with volatility, so you can home in on it by repeatedly halving a range. This method is called bisection.",
      "An option on a $100 stock, with a strike of 100 and a year to run, trades at $10." ],
      ["Inside the loop: if the price at `mid` is below 10, raise `low` to `mid`. Otherwise lower `high` to `mid`."], `
${BS}

low, high = 0.01, 1.0

for step in range(40):
    mid = (low + high) / 2
    # Narrow the range toward the volatility that gives a price of 10
    pass

print(round(mid, 3))`, `
${BS}

low, high = 0.01, 1.0

for step in range(40):
    mid = (low + high) / 2
    if call_price(100, 100, 1, mid) < 10:
        low = mid
    else:
        high = mid

print(round(mid, 3))`,
      [between(0.249, 0.254, "The implied volatility should come out at about 0.251.")], "if call_price(100, 100, 1, mid) < 10:\n    low = mid\nelse:\n    high = mid"),
    mc("An option's implied volatility jumps from 25% to 50% overnight, though the stock price has not moved. What has the market decided?", ["The stock will rise", "A large move is expected soon, in one direction or the other", "The option has expired"], 1,
      "Implied volatility often climbs before company results or major announcements. It measures the expected size of the move, not its direction."),
    mc("You believe a stock will be much calmer than its options' implied volatility suggests. What trade expresses that view?", ["Buy options", "Sell options, and hedge the stock exposure", "Buy the stock"], 1,
      "If options are priced for more movement than actually happens, their sellers profit. It is a real strategy, with a real risk: the rare time the stock moves enormously."),
  ]),

  lesson("option-strategies", "Combining options", "Build new payoffs out of calls, puts and the stock.", [
    read("Options as building blocks", [
      "A single call or put is a bet with one shape. Combine them and you can build almost any payoff you like.",
      "A **straddle** is a call and a put with the same strike. It pays when the stock moves a long way in either direction. A **covered call** is owning the stock and selling a call against it, which collects a premium and gives up some of the upside." ]),
    py("A straddle", ["Add the two payoffs."],
      ["Make `straddle` return the call payoff plus the put payoff at the same strike."], `
def straddle(stock, strike):
    # Replace the next line
    pass

for stock in [80, 100, 125]:
    print(stock, straddle(stock, 100))`, `
def straddle(stock, strike):
    return max(stock - strike, 0) + max(strike - stock, 0)

for stock in [80, 100, 125]:
    print(stock, straddle(stock, 100))`,
      [out(String.raw`^80 20\s*$`, "At 80 the straddle should pay 20."), out(String.raw`^100 0\s*$`, "At 100 it should pay 0."), out(String.raw`^125 25\s*$`, "At 125 it should pay 25.")], "return max(stock - strike, 0) + max(strike - stock, 0)"),
    mc("You buy a straddle for a total premium of $8. What are you betting on?", ["The stock rising", "The stock falling", "The stock moving more than $8 away from the strike, either way"], 2,
      "A straddle is a pure bet on movement. It is how a trader buys volatility without having a view on direction."),
    py("A covered call", ["You bought the stock at 100, and sold a call with a strike of 110 for a premium of 3."],
      ["Make `covered_call` return the stock's gain, minus what the call you sold costs you, plus the premium."], `
def covered_call(stock, bought=100, strike=110, premium=3):
    # Replace the next line
    pass

for stock in [90, 105, 120]:
    print(stock, covered_call(stock))`, `
def covered_call(stock, bought=100, strike=110, premium=3):
    return (stock - bought) - max(stock - strike, 0) + premium

for stock in [90, 105, 120]:
    print(stock, covered_call(stock))`,
      [out(String.raw`^90 -7\s*$`, "At 90 the result should be -7."), out(String.raw`^105 8\s*$`, "At 105 the result should be 8."), out(String.raw`^120 13\s*$`, "At 120 the result should be 13.")], "return (stock - bought) - max(stock - strike, 0) + premium"),
    mc("With the covered call, the profit is 13 whether the stock ends at 120 or at 200. What did the seller trade away?", ["Nothing", "All gains above the strike, in exchange for the premium", "The stock itself"], 1,
      "The premium is paid for giving up the big upside. Every option strategy is a trade of one piece of the payoff for another, and none of them is free."),
  ]),
];

export const strategies2: Lesson[] = [
  lesson("transaction-costs", "Transaction costs", "The quiet reason most strategies fail.", [
    read("Every trade has a price", [
      "A backtest that ignores costs is a fantasy. Each trade pays the spread, and often a fee, and large trades move the price against themselves.",
      "A strategy that trades often needs a bigger edge per trade just to break even. Many ideas that look brilliant before costs are worthless after them." ]),
    py("Add costs to a backtest", ["These are the profits of four trades before costs. Each trade costs 0.50 to get into and out of."],
      ["Set `net` to the total profit minus the cost of every trade."], `
trades = [2, -1, 3, -2]
cost_per_trade = 0.50

# Set net here

print(net)`, `
trades = [2, -1, 3, -2]
cost_per_trade = 0.50

net = sum(trades) - cost_per_trade * len(trades)

print(net)`,
      [out(String.raw`^0\.0\s*$`, "After costs the strategy makes 0.0.")], "net = sum(trades) - cost_per_trade * len(trades)"),
    num("A strategy earns an average of $0.04 per share before costs. The spread costs $0.01 and fees cost $0.005 per share. What is left per share, in dollars?", 0.025, "0.04 − 0.01 − 0.005 = $0.025.", { tol: 0.0006, prefix: "$" }),
    mc("Two strategies each make 10% a year before costs. One trades twice a year, the other twice a day. Which is more likely to survive real trading?", ["The one trading twice a day", "The one trading twice a year", "They are equal"], 1,
      "The frequent trader pays costs hundreds of times over. How much a strategy trades, called its turnover, is one of the first things a researcher checks."),
    mc("A fund manages a very large amount of money. Why are its trading costs higher than a small investor's, per share?", ["It pays higher fees by law", "Its orders are big enough to move the price against itself as it trades", "It trades slower"], 1,
      "This is called market impact. It limits how much money any strategy can handle, and it is why successful funds sometimes stop accepting new investors."),
  ]),

  lesson("paper-trading", "Paper trading", "Practice with pretend money before risking the real thing.", [
    read("A flight simulator for traders", [
      "**Paper trading** means trading with pretend money at real prices. It is how professionals test a strategy in live conditions, and it is exactly what the Trading floor on this site lets you do.",
      "A backtest tells you what would have happened in the past. Paper trading shows you something a backtest cannot: how you behave when prices are moving and you do not know what comes next." ]),
    mc("What is the most useful way to use a paper trading account?", ["Make huge bets, since the money is not real", "Trade the way you would with real money, following a plan and recording your reasons", "Check it once a year"], 1,
      "Wild bets with pretend money teach nothing, and a lucky one teaches the wrong thing. Practice is only worth as much as it resembles the real task."),
    py("Size a position", [
      "A common rule: never risk more than 1% of your account on one trade. You decide in advance the price at which you will give up and sell, called a stop.",
      "Your account is $100,000. You want to buy a stock at $50 and would sell if it fell to $45." ],
      ["Set `shares` to the number you can buy so that hitting the stop loses 1% of the account: the money at risk divided by the loss per share."], `
account = 100000
risk_fraction = 0.01
entry = 50
stop = 45

# Set shares here

print(int(shares))`, `
account = 100000
risk_fraction = 0.01
entry = 50
stop = 45

shares = account * risk_fraction / (entry - stop)

print(int(shares))`,
      [out(String.raw`^200\s*$`, "You can buy 200 shares: $1,000 at risk, divided by $5 a share.")], "shares = account * risk_fraction / (entry - stop)"),
    mc("With that rule, how many losing trades in a row would it take to lose about 10% of the account?", ["1", "About 10", "About 100"], 1,
      "Each loss costs about 1%. Sizing positions so that a bad streak is survivable is the practical form of everything in the risk track."),
    read("Your first plan", [
      "Before your next trade on the Trading floor, write down four things: why you expect the price to move, how many shares and why, the price at which you would admit you were wrong, and the price at which you would take your profit.",
      "After the trade is closed, read what you wrote. Over twenty trades, that record will teach you more than any single result, and it makes a real project to show a mentor." ]),
  ]),
];

export const risk2: Lesson[] = [
  lesson("leverage", "Leverage", "Borrowed money magnifies everything.", [
    read("Trading with more than you have", [
      "**Leverage** means controlling more than your own money by borrowing. With $10,000 of your own and $10,000 borrowed, you hold $20,000 of stock. That is leverage of 2.",
      "Every gain and every loss on the whole position lands on your $10,000. A 10% rise becomes a 20% gain. A 10% fall becomes a 20% loss." ],
      "your return  ≈  leverage × the asset's return"),
    num("You use leverage of 3. The asset rises 5%. Roughly what is your return, in percent?", 15, "3 × 5% = 15%."),
    py("How far can it fall?", ["With leverage of L, you are wiped out when the asset falls by 1 ÷ L."],
      ["Print the percentage fall that wipes out an investor with leverage of 2, then 5, then 20."], `
# Three prints
`, `
print(100 / 2)
print(100 / 5)
print(100 / 20)`,
      [out(String.raw`^50\.0\s*$`, "With leverage of 2, a 50% fall wipes you out."), out(String.raw`^20\.0\s*$`, "With leverage of 5, it takes a 20% fall."), out(String.raw`^5\.0\s*$`, "With leverage of 20, it takes only a 5% fall.")], "print(100 / 2)\nprint(100 / 5)\nprint(100 / 20)"),
    tryPy("Good bet, too much leverage", ["An asset that gains 0.05% a day on average, with daily swings of about 1.5%. Run a year at different levels of leverage."],
      ["Run it several times, then raise the leverage to 10 and to 30."], `
import random

leverage = 3
account = 100.0
day = 0

for day in range(1, 253):
    asset_return = random.gauss(0.0005, 0.015)
    account = account * (1 + leverage * asset_return)
    if account <= 0:
        account = 0
        break

print("leverage", leverage, "| ended on day", day, "| account:", round(account, 2))`),
    mc("A fund's lender demands more money when the fund's positions fall, and the fund has none to give. What happens?", ["Nothing", "The lender sells the fund's positions, at whatever price they fetch", "The loan is forgiven"], 1,
      "It is called a margin call, and the forced selling often comes at the worst possible prices. Leverage takes away your ability to wait for a recovery."),
    mc("Why did Long-Term Capital Management, run by brilliant people, collapse in 1998?", ["Bad math", "Sensible trades held with enormous leverage, so that a rare market move was enough to destroy it", "Fraud"], 1,
      "The lesson that has outlived the fund: being right eventually is no use if leverage forces you out first."),
  ]),
];

export const interview2: Lesson[] = [
  lesson("more-brain-teasers", "More brain teasers", "Four classics, and what each is really testing.", [
    num("Ten people are in a room and everyone shakes hands with everyone else exactly once. How many handshakes are there?", 45,
      "Each of 10 people shakes 9 hands, which counts every handshake twice: 10 × 9 ÷ 2 = 45. This is 10 choose 2, and it tests whether you spot the double counting."),
    mc("You have two ropes. Each takes exactly 60 minutes to burn, but burns unevenly. How do you measure 45 minutes?", [
      "Cut one rope into quarters", "Light the first rope at both ends and the second at one end. When the first is gone, light the other end of the second", "It cannot be done"], 1,
      "The first rope, lit at both ends, burns out in 30 minutes. The second then has 30 minutes left, and lighting its other end halves that to 15. Total: 45. It tests whether you can use a constraint creatively."),
    read("Waiting for two heads", [
      "A harder one: on average, how many flips of a fair coin does it take to get two heads in a row?",
      "Many people say 4. The trick is that a tail sends you back to the start. Working it through with expected values gives 6. When the algebra is slippery, simulate it." ]),
    py("Simulate it", ["Keep flipping until the last two flips were both heads, and count the flips."],
      ["Inside the while loop: flip a coin. If it is heads, add 1 to `streak`. Otherwise reset `streak` to 0. Add 1 to `flips` either way."], `
import random

total = 0
trials = 20000

for t in range(trials):
    streak = 0
    flips = 0
    while streak < 2:
        # Flip, update streak, count the flip
        break
    total += flips

print(total / trials)`, `
import random

total = 0
trials = 20000

for t in range(trials):
    streak = 0
    flips = 0
    while streak < 2:
        if random.random() < 0.5:
            streak += 1
        else:
            streak = 0
        flips += 1
    total += flips

print(total / trials)`,
      [between(5.8, 6.2, "The average should be close to 6.")], "if random.random() < 0.5:\n    streak += 1\nelse:\n    streak = 0\nflips += 1"),
    mc("An interviewer asks a puzzle you have heard before. What should you do?", ["Pretend to work it out slowly", "Say you have seen it, and offer to explain it or take a different one", "Refuse to answer"], 1,
      "Interviewers usually notice a recited answer, and they value honesty highly. Saying so costs you nothing and often earns respect."),
  ]),
];
