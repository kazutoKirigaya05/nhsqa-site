import type { Lesson } from "./types";
import { between, lesson, mc, num, out, py, quiz, read, src } from "./helpers";

const P = "prices = [100, 102, 101, 105, 107, 106, 110, 113, 111, 116]";

export const strategies: Lesson[] = [
  lesson("prices-as-data", "Prices as data", "Load ten days of prices and ask them questions.", [
    read("The raw material", [
      "Every trading strategy starts as a list of past prices. Before testing an idea, a quant gets comfortable with the data.",
      "This track uses ten days of closing prices for one made-up stock. Ten days is far too few to trust any result, but it is small enough to check every number by hand." ]),
    py("First look", ["`max( )` and `min( )` work on lists. `prices[-1]` is the last item."],
      ["Print the highest price, the lowest price and the last price, in that order, with one print."], `
${P}

`, `
${P}

print(max(prices), min(prices), prices[-1])`,
      [out(String.raw`^116 100 116\s*$`, "The output should be: 116 100 116")], "print(max(prices), min(prices), prices[-1])"),
    py("Day to day changes", ["The change on day i is that day's price minus the price the day before."],
      ["Inside the loop, append each day's change to `changes`."], `
${P}
changes = []

for i in range(1, len(prices)):
    # Append the change from day i-1 to day i
    pass

print(changes)`, `
${P}
changes = []

for i in range(1, len(prices)):
    changes.append(prices[i] - prices[i - 1])

print(changes)`,
      [out(String.raw`\[2, -1, 4, 2, -1, 4, 3, -2, 5\]`, "The output should be [2, -1, 4, 2, -1, 4, 3, -2, 5].")], "changes.append(prices[i] - prices[i - 1])"),
    py("Count the up days", ["A quick first statistic: how often did the stock rise?"],
      ["Count how many of the changes are greater than 0 and store it in `ups`."], `
changes = [2, -1, 4, 2, -1, 4, 3, -2, 5]
ups = 0

# Your loop here

print(ups)`, `
changes = [2, -1, 4, 2, -1, 4, 3, -2, 5]
ups = 0

for c in changes:
    if c > 0:
        ups += 1

print(ups)`,
      [out(String.raw`^6\s*$`, "Six of the nine changes are positive.")], "for c in changes:\n    if c > 0:\n        ups += 1"),
    mc("The stock rose on 6 of 9 days. Does that prove it tends to go up?", ["Yes, 6 of 9 is a clear majority", "No. Nine days is far too little data to tell a pattern from luck", "Yes, as long as the last day was up"], 1,
      "Flip a fair coin 9 times and you get 6 or more heads about a quarter of the time. Always ask how much data is behind a claim."),
  ]),

  lesson("daily-returns", "Daily returns", "Convert prices to returns, the form every strategy works in.", [
    read("Why returns", [
      "A $2 move means something different on a $20 stock than on a $200 stock. Returns put every day and every stock on the same scale.",
      "The return on day i is that day's price divided by the previous day's price, minus 1." ]),
    py("Build the returns list", ["Same loop shape as before."],
      ["Inside the loop, append each day's return to `returns`."], `
${P}
returns = []

for i in range(1, len(prices)):
    # Append the return for day i
    pass

print([round(r, 4) for r in returns])`, `
${P}
returns = []

for i in range(1, len(prices)):
    returns.append(prices[i] / prices[i - 1] - 1)

print([round(r, 4) for r in returns])`,
      [out(String.raw`\[0\.02, -0\.0098, 0\.0396, 0\.019,`, "The list should start [0.02, -0.0098, 0.0396, 0.019, ...")], "returns.append(prices[i] / prices[i - 1] - 1)"),
    py("The average day", ["`sum( )` adds up a list and `len( )` counts it."],
      ["Set `average` to the mean of the returns."], `
returns = [0.02, -0.0098, 0.0396, 0.019, -0.0093, 0.0377, 0.0273, -0.0177, 0.045]

# Set average here

print(round(average, 4))`, `
returns = [0.02, -0.0098, 0.0396, 0.019, -0.0093, 0.0377, 0.0273, -0.0177, 0.045]

average = sum(returns) / len(returns)

print(round(average, 4))`,
      [between(0.0165, 0.0173, "The average daily return should be about 0.0169.")], "average = sum(returns) / len(returns)"),
    num("The stock went from $100 to $116 over the whole period. What is the total return, as a decimal?", 0.16, "($116 − $100) ÷ $100 = 0.16."),
    mc("Nine days averaging about 1.7% each would add up to about 15%, but the total return was 16%. Why is it higher?", ["A rounding error", "Compounding: later gains are earned on a price that has already grown", "The first day counts twice"], 1,
      "Returns multiply rather than add. Over a few days the gap is small. Over years it becomes enormous."),
  ]),

  lesson("moving-averages", "Moving averages", "Smooth out the noise to see the trend.", [
    read("The average of the last few days", [
      "Prices jump around from day to day. A **moving average** replaces each day's price with the average of the last few days, which smooths the jumps and shows the direction underneath.",
      "A 3-day moving average today is the mean of today's price and the two before it. In Python, `prices[-3:]` is a slice holding the last three items." ]),
    py("A moving average function", ["`n` is how many days to average over."],
      ["Make `sma` return the average of the last `n` prices."], `
${P}

def sma(prices, n):
    # Replace the next line
    pass

print(round(sma(prices, 3), 2))
print(round(sma(prices, 5), 2))`, `
${P}

def sma(prices, n):
    return sum(prices[-n:]) / n

print(round(sma(prices, 3), 2))
print(round(sma(prices, 5), 2))`,
      [out(String.raw`^113\.33\s*$`, "The 3-day average should be 113.33."), out(String.raw`^111\.2\s*$`, "The 5-day average should be 111.2.")], "return sum(prices[-n:]) / n"),
    py("The whole series", ["To follow the average through time, compute it for every day that has two days before it. `prices[i-2:i+1]` holds days i − 2, i − 1 and i."],
      ["Inside the loop, append the 3-day average ending on day i."], `
${P}
averages = []

for i in range(2, len(prices)):
    # Append the average of prices[i-2:i+1]
    pass

print([round(a, 2) for a in averages])`, `
${P}
averages = []

for i in range(2, len(prices)):
    averages.append(sum(prices[i-2:i+1]) / 3)

print([round(a, 2) for a in averages])`,
      [out(String.raw`\[101\.0, 102\.67, 104\.33, 106\.0,`, "The list should start [101.0, 102.67, 104.33, 106.0, ...")], "averages.append(sum(prices[i-2:i+1]) / 3)"),
    mc("You switch from a 3-day to a 50-day moving average. What changes?", ["The line gets smoother but reacts more slowly to new moves", "The line gets jumpier", "Nothing changes"], 0,
      "More days means each new price counts for less. That is the basic trade-off in every signal: smooth and slow, or quick and noisy."),
  ]),

  lesson("a-trading-rule", "A trading rule", "Turn an idea into something a computer can follow.", [
    read("Momentum", [
      "Here is a simple idea: stocks that have been rising tend to keep rising for a while. Traders call it **momentum**.",
      "To test an idea, it has to become an exact rule. Ours: if today's price is above its 3-day moving average, hold the stock tomorrow. Otherwise, hold nothing.",
      "A rule like this is called a **signal**: True means be in the market, False means stay out." ]),
    py("Generate the signals", ["The comparison `a > b` gives True or False, which you can append directly."],
      ["Inside the loop, append True if today's price is above the average, and False otherwise."], `
${P}
signals = []

for i in range(2, len(prices)):
    average = sum(prices[i-2:i+1]) / 3
    # Append the signal for day i
    pass

print(signals)`, `
${P}
signals = []

for i in range(2, len(prices)):
    average = sum(prices[i-2:i+1]) / 3
    signals.append(prices[i] > average)

print(signals)`,
      [out(String.raw`\[False, True, True, False, True, True, False, True\]`, "The output should be [False, True, True, False, True, True, False, True].")], "signals.append(prices[i] > average)"),
    py("Time in the market", ["Python counts True as 1, so `sum( )` of a list of signals tells you how many are True."],
      ["Set `days_in` to the number of True signals."], `
signals = [False, True, True, False, True, True, False, True]

# Set days_in here

print(days_in)`, `
signals = [False, True, True, False, True, True, False, True]

days_in = sum(signals)

print(days_in)`,
      [out(String.raw`^5\s*$`, "Five of the eight signals are True.")], "days_in = sum(signals)"),
    mc("A different trader believes the opposite: prices that rise above their average tend to fall back. What would their rule do?", ["Buy when the price is above the average", "Buy when the price is below the average", "Never trade"], 1,
      "That idea is called mean reversion. Momentum and mean reversion are the two oldest families of trading strategy, and which one works depends on the market and the time scale."),
  ]),

  lesson("backtesting", "Backtesting", "Run the rule on the past and count the money.", [
    read("A time machine", [
      "A **backtest** applies your rule to past data as if you had traded it at the time. It is the main tool for deciding whether an idea deserves real money.",
      "The discipline is strict: on each day you may only use information that was available on that day. Our rule decides on day i and earns the price change from day i to day i + 1." ]),
    py("Backtest the momentum rule", ["When the signal is on, we hold one share overnight and collect the next day's change."],
      ["Inside the `if`, add the change from day i to day i + 1 to `profit`."], `
${P}
profit = 0

for i in range(2, len(prices) - 1):
    average = sum(prices[i-2:i+1]) / 3
    if prices[i] > average:
        # Add tomorrow's change to profit
        pass

print(profit)`, `
${P}
profit = 0

for i in range(2, len(prices) - 1):
    average = sum(prices[i-2:i+1]) / 3
    if prices[i] > average:
        profit += prices[i + 1] - prices[i]

print(profit)`,
      [src(String.raw`prices\[i\s*\+\s*1\]`, "Tomorrow's price is prices[i + 1]."), out(String.raw`^2\s*$`, "The rule should make a total of 2.")], "profit += prices[i + 1] - prices[i]"),
    num("Over the same days, someone who simply bought on day 2 at $101 and held to the end at $116 made how much per share, in dollars?", 15, "$116 − $101 = $15.", { prefix: "$" }),
    mc("The rule made $2 and buy-and-hold made $15. What should you conclude?", ["Momentum never works", "On these ten days the rule did worse, and ten days cannot settle anything", "The code must be wrong"], 1,
      "A backtest always needs a benchmark to compare against, and enough data to mean something. Real backtests use years of prices across many stocks."),
    mc("A backtest uses tomorrow's price to decide what to do today. The results look amazing. What went wrong?", ["Nothing, that is a great strategy", "It used information from the future, which no real trader has", "It traded too rarely"], 1,
      "This is look-ahead bias, the most common backtesting mistake. If a backtest looks too good, assume a bug before you assume genius."),
  ]),

  lesson("measuring-performance", "Measuring performance", "Return alone is not enough. Meet the Sharpe ratio.", [
    read("Return for the risk taken", [
      "Two strategies both made 10% last year. One crept up steadily. The other swung wildly and happened to finish up. Most people would rather own the first.",
      "The **Sharpe ratio** captures that. It divides the average return by the standard deviation of returns: how much you earned for each unit of risk you took. Higher is better." ],
      "Sharpe ratio  =  average return ÷ standard deviation of returns"),
    py("Mean and spread", ["Python's `statistics` module has `mean( )` and `stdev( )` built in."],
      ["Set `average` to the mean of the returns and `spread` to their standard deviation."], `
import statistics

returns = [0.01, -0.02, 0.015, 0.03, -0.01, 0.02, -0.005, 0.01]

# Set average and spread here

print(round(average, 4), round(spread, 4))`, `
import statistics

returns = [0.01, -0.02, 0.015, 0.03, -0.01, 0.02, -0.005, 0.01]

average = statistics.mean(returns)
spread = statistics.stdev(returns)

print(round(average, 4), round(spread, 4))`,
      [out(String.raw`^0\.0062 0\.0166\s*$`, "The output should be: 0.0062 0.0166")], "average = statistics.mean(returns)\nspread = statistics.stdev(returns)"),
    py("A Sharpe function", ["Put the two together."],
      ["Make `sharpe` return the mean of the returns divided by their standard deviation."], `
import statistics

def sharpe(returns):
    # Replace the next line
    pass

print(round(sharpe([0.01, -0.02, 0.015, 0.03, -0.01, 0.02, -0.005, 0.01]), 2))`, `
import statistics

def sharpe(returns):
    return statistics.mean(returns) / statistics.stdev(returns)

print(round(sharpe([0.01, -0.02, 0.015, 0.03, -0.01, 0.02, -0.005, 0.01]), 2))`,
      [out(String.raw`^0\.38\s*$`, "The Sharpe ratio should be 0.38.")], "return statistics.mean(returns) / statistics.stdev(returns)"),
    mc("Strategy A averages 1% a month with a standard deviation of 1%. Strategy B averages 2% with a standard deviation of 5%. Which has the higher Sharpe ratio?", ["A", "B", "They are equal"], 0,
      "A's ratio is 1 ÷ 1 = 1.0. B's is 2 ÷ 5 = 0.4. B earns more, but A earns far more per unit of risk, and risk can be scaled up with borrowed money."),
    read("How firms use it", [
      "Quant firms compare strategies mostly by Sharpe ratio, usually scaled to a full year. A strategy with a steady, high Sharpe is more valuable than one with bigger but shakier returns.",
      "The full definition also subtracts the return you could earn with no risk at all, such as interest at a bank. We have left that out to keep the idea clear." ]),
  ]),

  lesson("drawdown", "Drawdown", "How far you fell from your best point, and why it matters.", [
    read("The worst stretch", [
      "A **drawdown** is the drop from the highest value your account has reached to where it is now, as a fraction of that high.",
      "The **maximum drawdown** is the worst such drop in the whole history. It answers the question every investor really asks: how bad did it get?" ]),
    num("An account grows from $100 to $120, then falls to $90. What is the drawdown from the peak, as a decimal?", 0.25, "It fell $30 from a peak of $120: 30 ÷ 120 = 0.25."),
    py("Maximum drawdown", ["Walk through the values, remembering the highest one seen so far."],
      ["Inside the loop, update `peak` when `v` is a new high.", "Then work out the drawdown from the peak and keep the largest in `worst`."], `
values = [100, 110, 105, 120, 96, 108, 126, 113]
peak = values[0]
worst = 0

for v in values:
    # Update peak, then update worst
    pass

print(round(worst, 2))`, `
values = [100, 110, 105, 120, 96, 108, 126, 113]
peak = values[0]
worst = 0

for v in values:
    peak = max(peak, v)
    worst = max(worst, (peak - v) / peak)

print(round(worst, 2))`,
      [out(String.raw`^0\.2\s*$`, "The maximum drawdown should be 0.2: the fall from 120 to 96.")], "peak = max(peak, v)\nworst = max(worst, (peak - v) / peak)"),
    mc("An account suffers a 50% drawdown. What return does it need to reach its old peak?", ["50%", "100%", "150%"], 1,
      "Half of the money is gone, so what is left has to double. This asymmetry is why professionals fear large drawdowns more than they chase large gains."),
    mc("Two strategies have the same average return. One has a maximum drawdown of 10% and the other of 60%. Why might a firm shut down the second?", [
      "Because it trades too often", "Because few investors, or bosses, will sit through losing 60% and wait", "Because drawdowns are illegal"], 1,
      "A strategy only works if you can keep running it. Many good ideas have been abandoned at the bottom of a drawdown."),
  ]),

  lesson("overfitting", "Overfitting", "How to fool yourself with a backtest.", [
    read("Try enough ideas and one will work", [
      "Suppose you test 200 different trading rules on the same data and keep the best one. Its backtest looks great. Is it a real discovery?",
      "Probably not. With 200 tries, some will fit the past by luck alone. Mistaking that luck for a pattern is called **overfitting**, and it is the main way quant strategies fail." ]),
    py("200 strategies with no skill at all", [
      "Here the market is pure random noise, so there is nothing to find. Each strategy decides by coin flip whether to be in the market each day.",
      "Find the profit of the best one." ],
      ["After the inner loop, keep the largest profit seen so far in `best`."], `
import random

random.seed(1)
market = [random.gauss(0, 1) for day in range(250)]    # one year of random daily moves

best = -999

for strategy in range(200):
    profit = 0
    for change in market:
        if random.random() < 0.5:      # in the market today, or not, by coin flip
            profit += change
    # Update best here

print(round(best, 1))`, `
import random

random.seed(1)
market = [random.gauss(0, 1) for day in range(250)]    # one year of random daily moves

best = -999

for strategy in range(200):
    profit = 0
    for change in market:
        if random.random() < 0.5:      # in the market today, or not, by coin flip
            profit += change
    best = max(best, profit)

print(round(best, 1))`,
      [between(10, 90, "The best profit should be a large positive number, around 30. Use best = max(best, profit).")], "best = max(best, profit)"),
    mc("The best of the 200 coin-flip strategies made a large profit. If you traded it next year, what would you expect?", ["The same profit", "About zero, because its past success was luck", "A guaranteed loss"], 1,
      "It has no edge. Its record came from being the luckiest of 200. Next year its coin flips are as good as anyone's."),
    read("How quants protect themselves", [
      "**Hold data back.** Build the rule on one period, then test it on a later period it has never seen. This is called an out-of-sample test.",
      "**Keep it simple.** A rule with many adjustable settings can be bent to fit any past.",
      "**Ask why.** A pattern with a sensible reason behind it is far more likely to continue than one found by searching." ]),
    mc("You design a strategy using data from 2015 to 2020. Which is the honest test?", ["Run it again on 2015 to 2020", "Run it on 2021 to 2024, which you never looked at while designing it", "Adjust it until 2015 to 2020 looks even better"], 1,
      "Only data the strategy has never seen can tell you whether it found something real."),
  ]),

  quiz([
    num("A stock goes from $50 to $53 in a day. What is the day's return, as a decimal?", 0.06, "($53 − $50) ÷ $50 = 0.06."),
    num("The last three prices are 20, 23 and 26. What is the 3-day moving average?", 23, "(20 + 23 + 26) ÷ 3 = 23."),
    mc("What is look-ahead bias?", ["Trading too far into the future", "A backtest using information that was not available at the time", "Holding a position for too long"], 1, "It makes backtests look better than any real trading could be."),
    num("A strategy has an average return of 0.6% and a standard deviation of 2%. What is its Sharpe ratio?", 0.3, "0.6 ÷ 2 = 0.3."),
    mc("You test 500 rules and pick the one with the best backtest. What is the main danger?", ["It will be too slow", "It may have fit the past by luck and have no real edge", "It will trade too little"], 1, "This is overfitting. The honest check is data the rule has never seen."),
  ]),
];
