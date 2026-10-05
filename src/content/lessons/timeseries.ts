import type { Lesson } from "./types";
import { between, lesson, mc, num, out, py, quiz, read, tryPy } from "./helpers";

const AC = `import statistics

def autocorr(x):
    return statistics.correlation(x[:-1], x[1:])`;

export const timeseries: Lesson[] = [
  lesson("what-is-a-time-series", "What is a time series?", "Data where the order matters.", [
    read("Yesterday comes before today", [
      "A **time series** is a list of measurements taken in order through time: a stock's closing price each day, a shop's sales each month, the temperature each hour.",
      "In most statistics the order of the data does not matter. Here it is the whole point. Analysts usually think of a time series as three things added together: a **trend** (the long-run direction), **seasonality** (a repeating pattern), and **noise** (everything else)." ]),
    mc("An ice cream shop's sales climb every summer and drop every winter, year after year. What is that pattern called?", ["Trend", "Seasonality", "Noise"], 1,
      "A pattern that repeats on a calendar is seasonality. A trend would be sales growing a little every year regardless of season."),
    py("Is there a trend?", ["A quick check: compare the average of the early data with the average of the late data."],
      ["Print the mean of the first four values, then the mean of the last four."], `
import statistics

sales = [20, 22, 21, 25, 27, 26, 30, 32, 31, 35, 37, 36]

`, `
import statistics

sales = [20, 22, 21, 25, 27, 26, 30, 32, 31, 35, 37, 36]

print(statistics.mean(sales[:4]))
print(statistics.mean(sales[-4:]))`,
      [out(String.raw`^22\s*$`, "The mean of the first four should be 22."), out(String.raw`^34\.75\s*$`, "The mean of the last four should be 34.75.")], "print(statistics.mean(sales[:4]))\nprint(statistics.mean(sales[-4:]))"),
    mc("You shuffle a time series into random order and compute its mean and standard deviation. What changes?", ["Both change", "Neither changes, but all the information about trend and pattern is destroyed", "Only the mean changes"], 1,
      "The mean and spread do not care about order. Everything that makes a time series interesting lives in the order, and needs its own tools."),
  ]),

  lesson("measuring-trend", "Measuring a trend", "Put a number on the direction.", [
    read("A regression against time", [
      "To measure a trend, fit a straight line to the series with time as the x value: 0 for the first observation, 1 for the second, and so on.",
      "The slope of that line is the trend: how much the series rises per period on average." ]),
    py("The slope of the sales series", ["The regression slope formula again, with time as x."],
      ["Set `slope` to the sum of (t − mean t) × (y − mean y), divided by the sum of (t − mean t) squared."], `
import statistics

sales = [20, 22, 21, 25, 27, 26, 30, 32, 31, 35, 37, 36]
t = list(range(len(sales)))
mt = statistics.mean(t)
my = statistics.mean(sales)

# Set slope here

print(round(slope, 3))`, `
import statistics

sales = [20, 22, 21, 25, 27, 26, 30, 32, 31, 35, 37, 36]
t = list(range(len(sales)))
mt = statistics.mean(t)
my = statistics.mean(sales)

slope = sum((a - mt) * (b - my) for a, b in zip(t, sales)) / sum((a - mt) ** 2 for a in t)

print(round(slope, 3))`,
      [out(String.raw`^1\.601\s*$`, "The trend should be 1.601 per period.")], "slope = sum((a - mt) * (b - my) for a, b in zip(t, sales)) / sum((a - mt) ** 2 for a in t)"),
    num("Sales are rising by about 1.6 a month. If the latest month was 36, what does the trend alone suggest for 5 months later?", 44, "36 + 5 × 1.6 = 44. A straight-line forecast simply extends the slope."),
    mc("What is the weakness of forecasting by extending a trend line?", ["It is hard to compute", "Trends end, and the line gives no warning of when", "It ignores the mean"], 1,
      "Every trend continues until it does not. Assuming a price trend will carry on forever is one of the oldest ways to lose money."),
  ]),

  lesson("autocorrelation", "Autocorrelation", "Does the series remember its own past?", [
    read("Correlation with yourself, one step back", [
      "**Autocorrelation** is the correlation between a series and a copy of itself shifted by one or more steps. It asks: when the value was high last time, does it tend to be high this time?",
      "Positive autocorrelation means moves tend to continue. Negative means they tend to reverse. Near zero means the last value tells you nothing about the next." ]),
    py("Two very different series", ["`x[:-1]` is every value except the last, and `x[1:]` is every value except the first. Their correlation is the lag-1 autocorrelation."],
      ["Make `autocorr` return the correlation between `x[:-1]` and `x[1:]`."], `
import statistics

def autocorr(x):
    # Replace the next line
    pass

steady = [1, 2, 3, 5, 6, 8, 9, 11, 12, 14]
zigzag = [5, -4, 6, -5, 4, -6, 5, -4, 6, -5]
print(round(autocorr(steady), 2))
print(round(autocorr(zigzag), 2))`, `
${AC}

steady = [1, 2, 3, 5, 6, 8, 9, 11, 12, 14]
zigzag = [5, -4, 6, -5, 4, -6, 5, -4, 6, -5]
print(round(autocorr(steady), 2))
print(round(autocorr(zigzag), 2))`,
      [out(String.raw`^0\.99\s*$`, "The steady series should give 0.99."), out(String.raw`^-0\.96\s*$`, "The zigzag series should give -0.96.")], "return statistics.correlation(x[:-1], x[1:])"),
    mc("A stock's daily returns have an autocorrelation of +0.3. If that held up, what kind of strategy would it support?", ["Momentum: buy after an up day", "Mean reversion: sell after an up day", "Neither"], 0,
      "Positive autocorrelation means up days tend to follow up days. In real markets, autocorrelation in daily returns is usually tiny, which is why easy strategies like this rarely work."),
    mc("Why would a strong, obvious autocorrelation in a big stock's returns be unlikely to last?", ["Exchanges forbid it", "Traders would exploit it, and their trading would remove it", "Stocks have no memory by law"], 1,
      "If an up day reliably predicted another, traders would buy at the close until that day's price already included the next day's rise. Predictable patterns are competed away."),
  ]),

  lesson("random-walks", "Is it a random walk?", "The test every price series has to face.", [
    read("The hardest benchmark", [
      "A **random walk** is a series where each step is random and independent of the past. Its level wanders, but its changes are pure noise.",
      "The random walk idea says stock prices behave much like this: all known information is already in the price, so the next move is news, and news is unpredictable by definition.",
      "A simple check: the prices of a random walk are highly autocorrelated, but the changes are not." ]),
    py("Prices against changes", ["`steps` is 500 random moves of +1 or −1. `prices` is the walk they produce."],
      ["Print the autocorrelation of `prices`, then of `steps`, each rounded to 2 decimal places."], `
${AC}

import random
random.seed(4)
steps = [random.choice([1, -1]) for i in range(500)]
prices = [100]
for s in steps:
    prices.append(prices[-1] + s)

`, `
${AC}

import random
random.seed(4)
steps = [random.choice([1, -1]) for i in range(500)]
prices = [100]
for s in steps:
    prices.append(prices[-1] + s)

print(round(autocorr(prices), 2))
print(round(autocorr(steps), 2))`,
      [out(String.raw`^0\.9\d\s*$`, "The prices should have an autocorrelation above 0.9."), out(String.raw`^-?0\.[01]\d?\s*$`, "The steps should have an autocorrelation close to 0.")], "print(round(autocorr(prices), 2))\nprint(round(autocorr(steps), 2))"),
    mc("The prices have an autocorrelation near 1. Does that mean tomorrow's price is easy to predict?", ["Yes, it will be close to today's, and that is useless for trading", "Yes, and it is a great strategy", "No, it will be far from today's"], 0,
      "Tomorrow's price will be near today's. What you need to predict to make money is the change, and the changes showed no pattern at all."),
    tryPy("Charts made of coin flips", ["Five random walks drawn as text. Each line is pure chance."],
      ["Run it a few times. You will see what look like trends, tops and bottoms."], `
import random

for walk in range(5):
    price = 0
    line = ""
    for step in range(60):
        price += random.choice([1, -1])
        line += "/" if price > 0 else "\\\\" if price < 0 else "-"
    print(line, " ends at", price)`),
    mc("People shown random walks often see trends and patterns in them. What is the lesson for reading price charts?", ["Charts are always right", "The eye finds patterns in pure noise, so a pattern on a chart needs a statistical test before it means anything", "Never look at charts"], 1,
      "Humans are pattern-finding machines. Quants insist on tests for exactly this reason."),
  ]),

  lesson("stationarity", "Stationarity", "Why quants model returns instead of prices.", [
    read("A series that stays the same kind of thing", [
      "A series is **stationary** if its basic behavior does not change over time: it keeps the same mean and the same spread. Statistics learned from one stretch of a stationary series still apply to the next stretch.",
      "Prices are not stationary. A stock at $20 ten years ago and $200 today has no fixed mean to speak of. Returns are much closer to stationary, which is why nearly all models are built on them." ]),
    py("First half against second half", ["A rough test for stationarity: split the series in two and compare the halves."],
      ["Print the mean of the first 6 prices and the mean of the last 6, with one print.", "Then do the same for `changes` on a second line."], `
import statistics

prices = [100, 102, 101, 104, 106, 105, 108, 110, 109, 112, 114, 113]
changes = [2, -1, 3, 2, -1, 3, 2, -1, 3, 2, -1, 3]

`, `
import statistics

prices = [100, 102, 101, 104, 106, 105, 108, 110, 109, 112, 114, 113]
changes = [2, -1, 3, 2, -1, 3, 2, -1, 3, 2, -1, 3]

print(statistics.mean(prices[:6]), statistics.mean(prices[-6:]))
print(statistics.mean(changes[:6]), statistics.mean(changes[-6:]))`,
      [out(String.raw`^103 111\s*$`, "The price halves should average 103 and 111."), out(String.raw`^1\.33\d* 1\.33\d*\s*$`, "Both halves of the changes should average about 1.33.")], "print(statistics.mean(prices[:6]), statistics.mean(prices[-6:]))\nprint(statistics.mean(changes[:6]), statistics.mean(changes[-6:]))"),
    mc("The prices' average shifted from 103 to 111, while the changes' average stayed the same. Which series is closer to stationary?", ["The prices", "The changes", "Neither"], 1,
      "The changes behave the same way in both halves. That stability is what lets you learn from the past."),
    mc("A model is trained on 2010 to 2019, a period of calm, rising markets. Why might it fail in a crisis year?", ["Models wear out", "The market's behavior changed, so patterns learned in the calm period no longer apply", "Crisis data is illegal to use"], 1,
      "Markets are only roughly stationary. Their volatility and relationships shift between calm and stressed periods, which traders call regimes."),
  ]),

  lesson("mean-reversion", "Mean reversion", "Series that get pulled back toward home.", [
    read("An elastic band", [
      "Some series act as if tied to an average by elastic: the further they stray, the harder they are pulled back. That is **mean reversion**.",
      "The simplest model: each new value is a fraction of the previous one, plus fresh noise. With a fraction of 0.5, half of any disturbance is gone after one step." ],
      "x today  =  0.5 × x yesterday  +  noise"),
    num("With that model and no further noise, a shock pushes x to 8. What is x three steps later?", 1, "8 → 4 → 2 → 1. It halves each step."),
    py("Simulate it", ["Start at 0 and run the model for 2,000 steps."],
      ["Inside the loop, update `x` to 0.5 times itself plus `random.gauss(0, 1)`, then append it to `xs`."], `
${AC}

import random
x = 0
xs = []

for i in range(2000):
    # Update x and append it
    pass

print(round(autocorr(xs), 2))`, `
${AC}

import random
x = 0
xs = []

for i in range(2000):
    x = 0.5 * x + random.gauss(0, 1)
    xs.append(x)

print(round(autocorr(xs), 2))`,
      [between(0.43, 0.57, "The autocorrelation should come out close to 0.5.")], "x = 0.5 * x + random.gauss(0, 1)\nxs.append(x)"),
    mc("A mean-reverting series is far above its average. What does a trader betting on reversion do?", ["Buy, expecting it to go higher", "Sell, expecting it to fall back toward the average", "Nothing"], 1,
      "Sell high, buy low, relative to the average. The risk is that the average itself has moved and the series never comes back."),
    mc("Which of these is most likely to mean-revert?", ["A single company's share price", "The gap between the prices of two very similar companies", "A country's population"], 1,
      "A single stock can go anywhere. The gap between two close substitutes is held in check by traders who buy the cheap one and sell the dear one. That idea is the next lesson."),
  ]),

  lesson("pairs-trading", "Pairs trading", "A classic quant strategy, built step by step.", [
    read("Trade the gap, not the stocks", [
      "Two companies in the same business tend to move together. When one gets unusually expensive relative to the other, a **pairs trade** sells the expensive one and buys the cheap one, betting that the gap closes.",
      "Because you are long one and short the other, a move in the whole market mostly cancels out. What you are left with is a bet on the **spread** between them." ]),
    py("Build the spread", ["Stock A trades at about twice the price of stock B, so the spread is A minus 2 × B."],
      ["Set `spread` to a list of a − 2 × b for each day."], `
a = [50, 51, 52, 51, 53, 54, 53, 55, 56, 60]
b = [25, 25.6, 26.1, 25.4, 26.6, 27.1, 26.4, 27.6, 28.1, 28.0]

# Set spread here

print([round(s, 1) for s in spread])`, `
a = [50, 51, 52, 51, 53, 54, 53, 55, 56, 60]
b = [25, 25.6, 26.1, 25.4, 26.6, 27.1, 26.4, 27.6, 28.1, 28.0]

spread = [x - 2 * y for x, y in zip(a, b)]

print([round(s, 1) for s in spread])`,
      [out(String.raw`4\.0\]\s*$`, "The last spread should be 4.0."), out(String.raw`^\[0(\.0)?, -0\.2, -0\.2, 0\.2`, "The spread should start [0, -0.2, -0.2, 0.2, ...")], "spread = [x - 2 * y for x, y in zip(a, b)]"),
    py("How unusual is today?", ["A z-score says how far today's spread is from its usual level."],
      ["Set `z` to the last spread minus the mean of the spreads, divided by their standard deviation."], `
import statistics

spread = [0.0, -0.2, -0.2, 0.2, -0.2, -0.2, 0.2, -0.2, -0.2, 4.0]

# Set z here

print(round(z, 2))`, `
import statistics

spread = [0.0, -0.2, -0.2, 0.2, -0.2, -0.2, 0.2, -0.2, -0.2, 4.0]

z = (spread[-1] - statistics.mean(spread)) / statistics.stdev(spread)

print(round(z, 2))`,
      [out(String.raw`^2\.82\s*$`, "The z-score should be 2.82.")], "z = (spread[-1] - statistics.mean(spread)) / statistics.stdev(spread)"),
    mc("The spread is almost 3 standard deviations above normal because stock A jumped. What is the pairs trade?", ["Buy A and sell B", "Sell A and buy B", "Buy both"], 1,
      "A is expensive relative to B, so sell A and buy B. You profit if the gap narrows, whichever way the market as a whole goes."),
    mc("What is the biggest risk in that trade?", ["The market falls", "A jumped for a real reason, such as a takeover offer, and the gap never closes", "Both stocks rise"], 1,
      "A market fall hurts both legs about equally. The danger is that the relationship itself has broken. Pairs traders set limits on how far they will let a spread run against them."),
  ]),

  lesson("judging-forecasts", "Judging a forecast", "Is your prediction better than the laziest one possible?", [
    read("The naive forecast", [
      "The simplest forecast of all: tomorrow will be the same as today. It is called the **naive forecast**, and it is the benchmark every method must beat.",
      "To compare forecasts, measure their average miss. The **mean absolute error** is the average size of the gap between what was predicted and what happened." ]),
    py("Naive against a moving average", ["Forecast each value two ways: with the previous value, and with the average of the previous three."],
      ["Inside the loop, append the absolute error of each forecast to its list. `abs( )` gives the size of a number without its sign."], `
import statistics

series = [10, 12, 11, 13, 12, 14, 13, 15, 14, 16]
naive_errors = []
average_errors = []

for i in range(3, len(series)):
    naive = series[i - 1]
    average = statistics.mean(series[i - 3:i])
    # Append both errors
    pass

print(round(statistics.mean(naive_errors), 2), round(statistics.mean(average_errors), 2))`, `
import statistics

series = [10, 12, 11, 13, 12, 14, 13, 15, 14, 16]
naive_errors = []
average_errors = []

for i in range(3, len(series)):
    naive = series[i - 1]
    average = statistics.mean(series[i - 3:i])
    naive_errors.append(abs(series[i] - naive))
    average_errors.append(abs(series[i] - average))

print(round(statistics.mean(naive_errors), 2), round(statistics.mean(average_errors), 2))`,
      [out(String.raw`^1\.57 1\.14\s*$`, "The output should be: 1.57 1.14")], "naive_errors.append(abs(series[i] - naive))\naverage_errors.append(abs(series[i] - average))"),
    mc("On this zigzag series the moving average had the smaller error. Why did it beat the naive forecast here?", ["Luck", "The series bounces up and down around a rising line, and averaging smooths out the bounce", "Moving averages always win"], 1,
      "The right method depends on how the series behaves. For a series that zigzags, averaging helps. For a random walk, nothing beats naive."),
    mc("For daily stock prices, how do sophisticated forecasts usually compare with the naive one?", ["They win easily", "They barely beat it, if at all", "They lose badly"], 1,
      "Because prices are close to a random walk, today's price is a very hard forecast to improve on. A model that wins by a hair, reliably, is worth a fortune."),
    mc("Why should a forecast be judged on data it was not built on?", ["It makes the numbers bigger", "Any method can be tuned to fit the past, so only fresh data shows whether it predicts", "It is faster"], 1,
      "It is the overfitting lesson again, and it applies to every model you will ever build."),
  ]),

  quiz([
    mc("What is the lag-1 autocorrelation of a series?", ["Its correlation with a different series", "Its correlation with itself shifted by one step", "Its average"], 1, "It measures whether the series remembers its previous value."),
    mc("In a random walk, which is unpredictable?", ["The level", "The changes", "Both are easy to predict"], 1, "The level stays near where it was, but each change is pure noise."),
    mc("Why do quants usually model returns and not prices?", ["Returns are bigger", "Returns are much closer to stationary", "Prices are secret"], 1, "A stationary series lets you learn from its past."),
    num("A mean-reverting series follows x today = 0.5 × x yesterday, with no noise. It starts at 16. What is it after 2 steps?", 4, "16 → 8 → 4."),
    mc("What is the naive forecast?", ["The average of all past values", "That the next value will equal the current one", "A straight trend line"], 1, "It is the benchmark any forecasting method has to beat."),
  ]),
];
