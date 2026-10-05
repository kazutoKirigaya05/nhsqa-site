import type { Lesson } from "./types";
import { lesson, mc, num, out, py, quiz, read, src, tryPy } from "./helpers";

export const math: Lesson[] = [
  lesson("functions", "Functions", "A rule that turns one number into another.", [
    read("A machine for numbers", [
      "A **function** is a rule: put a number in, get a number out. Mathematicians write f(x) = 2x + 3, which means: take x, double it, add 3.",
      "Quants live on functions. An option's payoff is a function of the stock price. A bond's price is a function of interest rates. A strategy's profit is a function of the market.",
      "A function in Python is the same idea written as code." ],
      "f(x) = 2x + 3\nf(4) = 2 × 4 + 3 = 11"),
    num("If f(x) = 3x − 5, what is f(6)?", 13, "3 × 6 − 5 = 13."),
    py("Write it in Python", ["`def` creates the function and `return` gives the output."],
      ["Make `f` return 3 times x, minus 5."], `
def f(x):
    # Replace the next line
    pass

print(f(6))
print(f(0))`, `
def f(x):
    return 3 * x - 5

print(f(6))
print(f(0))`,
      [out(String.raw`^13\s*$`, "f(6) should be 13."), out(String.raw`^-5\s*$`, "f(0) should be -5.")], "return 3 * x - 5"),
    tryPy("See a function as a table", ["A table of inputs and outputs shows a function's shape before you ever draw it."],
      ["Run it. Then change the rule inside `f` to `x * x` and run it again."], `
def f(x):
    return 3 * x - 5

for x in range(-2, 6):
    print(x, "->", f(x))`),
    mc("An option pays max(stock − 100, 0). Thinking of this as a function, what is the input and what is the output?", ["Input: the payoff. Output: the stock price", "Input: the stock price. Output: the payoff", "It has no input"], 1,
      "Put in a stock price, get out a payoff. Asking how the output responds when the input moves is most of what a quant does."),
  ]),

  lesson("slopes", "Slopes and rates of change", "How much the output moves when the input moves.", [
    read("Rise over run", [
      "The **slope** between two points is the change in the output divided by the change in the input. It tells you how fast something is changing.",
      "A stock that goes from $50 to $56 in 3 days has changed at a rate of $2 a day. That rate is a slope." ],
      "slope  =  (change in output) ÷ (change in input)"),
    num("A line passes through the points (1, 3) and (4, 12). What is its slope?", 3, "(12 − 3) ÷ (4 − 1) = 9 ÷ 3 = 3."),
    py("A slope function", ["Two points, (x1, y1) and (x2, y2)."],
      ["Make `slope` return the change in y divided by the change in x."], `
def slope(x1, y1, x2, y2):
    # Replace the next line
    pass

print(slope(1, 3, 4, 12))
print(slope(0, 50, 3, 56))`, `
def slope(x1, y1, x2, y2):
    return (y2 - y1) / (x2 - x1)

print(slope(1, 3, 4, 12))
print(slope(0, 50, 3, 56))`,
      [out(String.raw`^3\.0\s*$`, "The first slope should be 3.0."), out(String.raw`^2\.0\s*$`, "The second slope should be 2.0.")], "return (y2 - y1) / (x2 - x1)"),
    mc("For the straight line f(x) = 2x + 3, what is the slope?", ["2", "3", "5", "It depends on x"], 0,
      "Each time x goes up by 1, the output goes up by 2. For a straight line the slope is the same everywhere."),
    mc("An option's delta is 0.5. In the language of this lesson, what is delta?", ["The option's price", "The slope of the option's price as the stock price changes", "The stock's slope over time"], 1,
      "Delta is a slope: option dollars per stock dollar. Many of the famous quantities in finance are slopes with special names."),
  ]),

  lesson("exponential-growth", "Exponential growth", "Growth that feeds on itself.", [
    read("Adding and multiplying", [
      "**Linear** growth adds the same amount each step: 100, 110, 120, 130. **Exponential** growth multiplies by the same amount each step: 100, 110, 121, 133.1.",
      "Money grows exponentially, because interest is earned on past interest. After n years at rate r, each dollar has become (1 + r) to the power n.",
      "Powers are written with a small raised number, and in Python with `**`." ],
      "value after n years  =  start × (1 + r)ⁿ"),
    num("What is 1.1 to the power 2?", 1.21, "1.1 × 1.1 = 1.21. Two years at 10% is 21%, not 20%."),
    py("Powers in Python", ["`2 ** 10` means 2 multiplied by itself 10 times."],
      ["Print 2 to the power 10, then 1.05 to the power 20 rounded to 2 decimal places."], `
# Two prints
`, `
print(2 ** 10)
print(round(1.05 ** 20, 2))`,
      [out(String.raw`^1024\s*$`, "2 to the power 10 is 1024."), out(String.raw`^2\.65\s*$`, "1.05 to the power 20 is 2.65.")], "print(2 ** 10)\nprint(round(1.05 ** 20, 2))"),
    tryPy("Linear against exponential", ["Two accounts start at $100. One gains $10 every year. The other gains 10% every year."],
      ["Run it and watch the gap. Then change the years to 60."], `
years = 30

for year in range(0, years + 1, 5):
    linear = 100 + 10 * year
    exponential = 100 * 1.10 ** year
    print(year, round(linear), round(exponential))`),
    mc("Why does exponential growth eventually beat any linear growth?", ["It starts higher", "Its increases get bigger every step, while linear increases stay the same size", "It is measured in percent"], 1,
      "Each step multiplies a larger number. This is why starting to save early matters so much, and why small differences in return compound into large ones."),
  ]),

  lesson("logarithms", "Logarithms", "The tool that undoes a power.", [
    read("Asking the opposite question", [
      "Powers answer: 10 to the power 3 is what? A **logarithm** answers the opposite: 10 to the power what is 1,000? The answer, 3, is the log of 1,000 in base 10.",
      "Quants mostly use the **natural log**, written ln, whose base is a special number called e (about 2.718). In Python it is `math.log( )`.",
      "Logs turn multiplication into addition, which is exactly what you want when dealing with growth." ],
      "10³ = 1000      so      log₁₀(1000) = 3"),
    num("What is the base-10 log of 100,000?", 5, "10 to the power 5 is 100,000."),
    py("How long to double?", [
      "At rate r, money doubles when (1 + r)ⁿ = 2. Taking logs of both sides gives n = ln(2) ÷ ln(1 + r).",
      "Earlier you found this with a loop. Logs give the answer in one line." ],
      ["Print the number of years to double at 7%, rounded to 2 decimal places."], `
import math

`, `
import math

print(round(math.log(2) / math.log(1.07), 2))`,
      [src(String.raw`math\.log`, "Use math.log( )."), out(String.raw`^10\.24\s*$`, "The answer should be 10.24 years.")], "print(round(math.log(2) / math.log(1.07), 2))"),
    num("The rule of 72 says: years to double is about 72 divided by the percent rate. By that rule, how many years to double at 6%?", 12, "72 ÷ 6 = 12. The exact answer is 11.9, so the shortcut is very close."),
    mc("A chart of a stock over 40 years is drawn on a log scale. What does a straight line on that chart mean?", ["The price rose by the same number of dollars each year", "The price grew by the same percent each year", "The price did not change"], 1,
      "On a log scale equal distances mean equal percent changes. Long-run price charts are nearly always drawn this way."),
  ]),

  lesson("log-returns", "Log returns", "The version of returns that adds up.", [
    read("A problem with ordinary returns", [
      "Up 10% then down 10% does not get you back to the start, because ordinary returns multiply instead of adding.",
      "The **log return** fixes this. It is the natural log of the end price divided by the start price. Log returns over several days simply add up to the log return over the whole period.",
      "For small moves the two kinds of return are nearly equal: a 1% return is a log return of about 0.00995." ],
      "log return  =  ln(end price ÷ start price)"),
    py("Compute one", ["A stock goes from 100 to 110."],
      ["Print the log return, rounded to 4 decimal places."], `
import math

start = 100
end = 110

`, `
import math

start = 100
end = 110

print(round(math.log(end / start), 4))`,
      [out(String.raw`^0\.0953\s*$`, "The log return should be 0.0953.")], "print(round(math.log(end / start), 4))"),
    py("They add up", ["Three days of prices. Check that the daily log returns sum to the log return of the whole stretch."],
      ["Inside the loop, add each day's log return to `total`."], `
import math

prices = [100, 104, 99, 108]
total = 0

for i in range(1, len(prices)):
    # Add the log return for day i
    pass

print(round(total, 4))
print(round(math.log(prices[-1] / prices[0]), 4))`, `
import math

prices = [100, 104, 99, 108]
total = 0

for i in range(1, len(prices)):
    total += math.log(prices[i] / prices[i - 1])

print(round(total, 4))
print(round(math.log(prices[-1] / prices[0]), 4))`,
      [out(String.raw`^0\.077\s*\n0\.077\s*$`, "Both lines should print 0.077.")], "total += math.log(prices[i] / prices[i - 1])"),
    mc("A stock has a log return of +0.10 one day and −0.10 the next. Where does it end up?", ["Above where it started", "Exactly where it started", "Below where it started"], 1,
      "Log returns add: 0.10 − 0.10 = 0, and a total log return of 0 means no change. This tidy behavior is why most quant models are written in log returns."),
  ]),

  lesson("sums-and-series", "Sums and series", "Adding up many terms, sometimes infinitely many.", [
    read("Sigma", [
      "Mathematicians write a long sum with the Greek letter Σ (sigma). It means: add up this expression for every value in a range. A `for` loop with a running total is the same thing.",
      "There is a famous shortcut for 1 + 2 + 3 + ... + n. Pair the first with the last, the second with the second last, and so on. Every pair makes n + 1, and there are n ÷ 2 pairs." ],
      "1 + 2 + ... + n  =  n × (n + 1) ÷ 2"),
    num("Use the formula: what is 1 + 2 + 3 + ... + 200?", 20100, "200 × 201 ÷ 2 = 20,100."),
    read("A sum that never ends, but has an answer", [
      "Add 1 + 1/2 + 1/4 + 1/8 + ... forever. Each term is half the one before. The total never passes 2, and gets as close to 2 as you like.",
      "This is a **geometric series**. When each term is the previous one times r, and r is between −1 and 1, the infinite sum is the first term divided by (1 − r)." ],
      "a + a·r + a·r² + ...  =  a ÷ (1 − r)"),
    py("Watch it converge", ["Add the first 20 terms of 1 + 1/2 + 1/4 + ..."],
      ["Inside the loop, add `term` to `total`, then halve `term`."], `
total = 0
term = 1

for i in range(20):
    # Add the term, then halve it
    pass

print(round(total, 5))`, `
total = 0
term = 1

for i in range(20):
    total += term
    term = term / 2

print(round(total, 5))`,
      [out(String.raw`^2\.0\s*$`, "After 20 terms the total should round to 2.0.")], "total += term\nterm = term / 2"),
    num("A company pays you $100 a year forever. Each year's payment is worth 0.9 times the previous one in today's money, starting at $100. Using the geometric series formula, what is it all worth today, in dollars?", 1000,
      "100 ÷ (1 − 0.9) = $1,000. An endless stream of payments has a finite value, which is how stocks and some bonds are valued.", { prefix: "$" }),
  ]),

  lesson("vectors", "Vectors", "A list of numbers treated as one object.", [
    read("More than one number at a time", [
      "A **vector** is an ordered list of numbers. A portfolio's holdings are a vector. So are a day's returns across ten stocks.",
      "Two vectors of the same length are added position by position. A vector is scaled by multiplying every entry by the same number." ],
      "(1, 2, 3) + (10, 20, 30)  =  (11, 22, 33)\n2 × (1, 2, 3)  =  (2, 4, 6)"),
    py("Add two vectors", ["`zip(a, b)` walks through two lists together, giving one pair at a time."],
      ["Make `add` return a new list holding the sum of each pair."], `
def add(a, b):
    # Replace the next line
    pass

print(add([1, 2, 3], [10, 20, 30]))`, `
def add(a, b):
    return [x + y for x, y in zip(a, b)]

print(add([1, 2, 3], [10, 20, 30]))`,
      [out(String.raw`^\[11, 22, 33\]\s*$`, "The output should be [11, 22, 33].")], "return [x + y for x, y in zip(a, b)]"),
    py("Scale a vector", ["Doubling a portfolio means multiplying every holding by 2."],
      ["Make `scale` return a new list with every entry of `v` multiplied by `k`."], `
def scale(k, v):
    # Replace the next line
    pass

print(scale(2, [10, 0, 25]))`, `
def scale(k, v):
    return [k * x for x in v]

print(scale(2, [10, 0, 25]))`,
      [out(String.raw`^\[20, 0, 50\]\s*$`, "The output should be [20, 0, 50].")], "return [k * x for x in v]"),
    mc("You hold (10, 0, 25) shares of three stocks and a friend holds (5, 5, 5). What is your combined holding?", ["(15, 5, 30)", "(50, 0, 125)", "(10, 5, 25)"], 0,
      "Add position by position. Thinking of a whole portfolio as one vector is how quants handle thousands of positions with one line of math."),
  ]),

  lesson("dot-product", "The dot product", "One operation that prices portfolios and powers models.", [
    read("Multiply in pairs, then add", [
      "The **dot product** of two vectors multiplies them position by position and adds up the results. The answer is a single number.",
      "It appears constantly. Shares times prices gives a portfolio's value. Weights times returns gives a portfolio's return." ],
      "(2, 3) · (10, 5)  =  2 × 10 + 3 × 5  =  35"),
    num("What is (1, 2, 3) · (4, 5, 6)?", 32, "1 × 4 + 2 × 5 + 3 × 6 = 4 + 10 + 18 = 32."),
    py("A dot function", ["Use `zip` again."],
      ["Make `dot` return the sum of the products of each pair."], `
def dot(a, b):
    # Replace the next line
    pass

shares = [10, 4, 25]
prices = [50.0, 120.0, 8.0]
print(dot(shares, prices))`, `
def dot(a, b):
    return sum(x * y for x, y in zip(a, b))

shares = [10, 4, 25]
prices = [50.0, 120.0, 8.0]
print(dot(shares, prices))`,
      [out(String.raw`^1180\.0\s*$`, "The portfolio is worth 1180.0.")], "return sum(x * y for x, y in zip(a, b))"),
    num("Half your money is in a stock that returned 10% and half in one that returned 2%. Using weights (0.5, 0.5) and returns (0.10, 0.02), what is the portfolio's return, as a decimal?", 0.06,
      "0.5 × 0.10 + 0.5 × 0.02 = 0.06."),
    mc("A model predicts tomorrow's return as 0.5 × (signal A) + 0.3 × (signal B) − 0.2 × (signal C). What is that calculation?", ["A dot product of the weights (0.5, 0.3, −0.2) with the three signals", "A logarithm", "A slope"], 0,
      "A weighted sum is a dot product. Linear models, which are the starting point of most quant research, are dot products with weights learned from data."),
  ]),

  lesson("matrices", "Matrices", "A table of numbers, and what you can do with it.", [
    read("Rows and columns", [
      "A **matrix** is a grid of numbers. In finance the usual layout is one row per day and one column per stock, so the entry in row 2, column 3 is the third stock's return on the second day.",
      "In Python a small matrix can be a list of lists: each inner list is one row." ],
      "returns = [\n    [0.01, -0.02, 0.03],    # day 1\n    [0.00,  0.01, -0.01],   # day 2\n]"),
    mc("With that layout, what does `returns[1][0]` hold?", ["Day 1, stock 2", "Day 2, stock 1", "Day 1, stock 1"], 1,
      "Python counts from 0, so index 1 is the second row (day 2) and index 0 is the first column (stock 1): 0.00."),
    py("Portfolio return each day", ["Multiplying a matrix by a vector means taking the dot product of each row with the vector. Here that gives the portfolio's return on each day."],
      ["Inside the loop, append the dot product of `row` and `weights` to `daily`."], `
returns = [
    [0.01, -0.02, 0.03],
    [0.00, 0.01, -0.01],
    [0.02, 0.02, 0.00],
]
weights = [0.5, 0.25, 0.25]
daily = []

for row in returns:
    # Append the dot product of row and weights
    pass

print([round(d, 4) for d in daily])`, `
returns = [
    [0.01, -0.02, 0.03],
    [0.00, 0.01, -0.01],
    [0.02, 0.02, 0.00],
]
weights = [0.5, 0.25, 0.25]
daily = []

for row in returns:
    daily.append(sum(r * w for r, w in zip(row, weights)))

print([round(d, 4) for d in daily])`,
      [out(String.raw`^\[0\.0075, 0\.0, 0\.015\]\s*$`, "The output should be [0.0075, 0.0, 0.015].")], "daily.append(sum(r * w for r, w in zip(row, weights)))"),
    py("One stock's history", ["A column of the matrix is one stock through time. A list comprehension can pull it out."],
      ["Set `stock2` to the second entry of every row."], `
returns = [
    [0.01, -0.02, 0.03],
    [0.00, 0.01, -0.01],
    [0.02, 0.02, 0.00],
]

# Set stock2 here

print(stock2)`, `
returns = [
    [0.01, -0.02, 0.03],
    [0.00, 0.01, -0.01],
    [0.02, 0.02, 0.00],
]

stock2 = [row[1] for row in returns]

print(stock2)`,
      [out(String.raw`^\[-0\.02, 0\.01, 0\.02\]\s*$`, "The output should be [-0.02, 0.01, 0.02].")], "stock2 = [row[1] for row in returns]"),
    mc("A research team has returns for 3,000 stocks over 2,500 days. How big is the matrix?", ["3,000 numbers", "5,500 numbers", "7.5 million numbers"], 2,
      "2,500 rows × 3,000 columns = 7,500,000 entries. This is why quants use libraries built for fast matrix math, and why linear algebra is a core college course for the field."),
  ]),

  lesson("rates-of-change", "How fast is it changing?", "The idea behind calculus, without the formulas.", [
    read("The slope at a single point", [
      "A straight line has one slope. A curve has a different slope at every point. The slope at one exact point is called the **derivative**, and it is the central idea of calculus.",
      "You can estimate it without any calculus: move a tiny step to each side of the point, and take the slope between those two nearby points." ],
      "slope at x  ≈  (f(x + h) − f(x − h)) ÷ (2h)      for a small h"),
    py("Estimate a slope", ["Take f(x) = x². Its true slope at x = 3 is 6."],
      ["Make `slope_at` return (f(x + h) − f(x − h)) divided by (2 × h)."], `
def f(x):
    return x * x

def slope_at(x, h=0.001):
    # Replace the next line
    pass

print(round(slope_at(3), 3))
print(round(slope_at(-1), 3))`, `
def f(x):
    return x * x

def slope_at(x, h=0.001):
    return (f(x + h) - f(x - h)) / (2 * h)

print(round(slope_at(3), 3))
print(round(slope_at(-1), 3))`,
      [out(String.raw`^6\.0\s*$`, "The slope at 3 should be 6.0."), out(String.raw`^-2\.0\s*$`, "The slope at -1 should be -2.0.")], "return (f(x + h) - f(x - h)) / (2 * h)"),
    read("Where the slope is zero", [
      "At the very top of a hill the ground is flat: the slope is zero. The same is true at the bottom of a valley.",
      "So to find the input that makes a function as large as possible, look for where its slope is zero. That is **optimization**, and quants use it to choose portfolio weights, order sizes and model settings." ]),
    py("Find the best price", [
      "A shop sells 100 − 2p items when the price is p dollars, so its revenue is p × (100 − 2p). Too cheap and it earns little per item. Too dear and nobody buys.",
      "Try every whole-dollar price from 1 to 49 and keep the best." ],
      ["Inside the loop, if this price's revenue beats `best_revenue`, store the revenue and the price."], `
best_price = 0
best_revenue = 0

for p in range(1, 50):
    revenue = p * (100 - 2 * p)
    # Keep the best so far
    pass

print(best_price, best_revenue)`, `
best_price = 0
best_revenue = 0

for p in range(1, 50):
    revenue = p * (100 - 2 * p)
    if revenue > best_revenue:
        best_revenue = revenue
        best_price = p

print(best_price, best_revenue)`,
      [out(String.raw`^25 1250\s*$`, "The best price is 25, for revenue of 1250.")], "if revenue > best_revenue:\n    best_revenue = revenue\n    best_price = p"),
    mc("At the best price of $25, what is the slope of the revenue curve?", ["Steeply positive", "Zero", "Steeply negative"], 1,
      "Just below $25 revenue is still rising, and just above it is falling. At the peak it is flat. Calculus finds such points directly, without trying every value."),
  ]),

  quiz([
    num("If f(x) = 4x + 1, what is f(5)?", 21, "4 × 5 + 1 = 21."),
    num("A price goes from $20 to $32 over 4 days. What is the average rate of change, in dollars per day?", 3, "(32 − 20) ÷ 4 = 3.", { prefix: "$" }),
    mc("Which grows faster in the long run?", ["Adding $1,000 every year", "Growing by 5% every year", "They are the same"], 1, "Exponential growth always overtakes linear growth eventually."),
    num("What is (2, 0, 1) · (3, 7, 4)?", 10, "2 × 3 + 0 × 7 + 1 × 4 = 10."),
    mc("A stock's log returns on three days are 0.02, −0.01 and 0.03. What is its log return over all three days?", ["0.04", "0.0406", "0.06"], 0, "Log returns add: 0.02 − 0.01 + 0.03 = 0.04."),
  ]),
];
