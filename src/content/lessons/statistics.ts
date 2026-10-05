import type { Lesson } from "./types";
import { between, lesson, mc, num, out, py, quiz, read, tryPy } from "./helpers";

export const statistics: Lesson[] = [
  lesson("describing-data", "Describing data", "Boil a pile of numbers down to a few that matter.", [
    read("Center and spread", [
      "Faced with a thousand numbers, the first job is to summarize them. Two questions cover most of it: where is the middle, and how spread out are they?",
      "For the middle there is the **mean** (the average) and the **median** (the middle value when sorted). For spread there is the **range** (largest minus smallest) and the **standard deviation** (the typical distance from the mean)." ]),
    py("Four summaries", ["These are the daily percentage moves of a stock over two weeks."],
      ["Print the mean, the median, the range and the standard deviation, in that order, each rounded to 2 decimal places, with one print."], `
import statistics

moves = [0.5, -1.2, 0.8, 0.3, -0.4, 2.1, -0.9, 0.2, 0.6, -0.5]

`, `
import statistics

moves = [0.5, -1.2, 0.8, 0.3, -0.4, 2.1, -0.9, 0.2, 0.6, -0.5]

print(round(statistics.mean(moves), 2), round(statistics.median(moves), 2), round(max(moves) - min(moves), 2), round(statistics.stdev(moves), 2))`,
      [out(String.raw`^0\.15 0\.25 3\.3 0\.96\s*$`, "The output should be: 0.15 0.25 3.3 0.96")],
      "print(round(statistics.mean(moves), 2), round(statistics.median(moves), 2), round(max(moves) - min(moves), 2), round(statistics.stdev(moves), 2))"),
    mc("A data set has a mean far above its median. What does that suggest?", ["A few very large values are pulling the mean up", "The data is perfectly balanced", "The data has no spread"], 0,
      "The median ignores how extreme the largest values are and the mean does not. Incomes, company sizes and trading profits all look like this."),
    mc("Two funds both returned an average of 8% a year. Fund A's yearly returns have a standard deviation of 3%, Fund B's of 20%. What is the difference for an investor?", ["None", "Fund B's results swing far more from year to year", "Fund A is certain to do better"], 1,
      "The same center with a very different spread. A summary with only an average hides the risk."),
  ]),

  lesson("histograms", "Histograms", "See the shape of your data.", [
    read("Counting into bins", [
      "A **histogram** sorts data into ranges, called bins, and counts how many values fall in each. The picture of those counts is the data's **distribution**: where values are common and where they are rare.",
      "Looking at the distribution is the first thing a researcher does with new data, before calculating anything." ]),
    tryPy("A histogram in text", ["This rolls two dice 2,000 times and draws the totals as bars."],
      ["Run it. Which total is most common, and which are rarest?"], `
import random

counts = {}
for roll in range(2000):
    total = random.randint(1, 6) + random.randint(1, 6)
    counts[total] = counts.get(total, 0) + 1

for total in range(2, 13):
    print(str(total).rjust(2), "#" * (counts.get(total, 0) // 10), counts.get(total, 0))`),
    py("Count into bins yourself", ["`counts.get(key, 0)` reads a count, giving 0 if the key is not there yet."],
      ["Inside the loop, add 1 to the count for each grade."], `
grades = ["B", "A", "C", "B", "B", "A", "D", "B", "C", "A"]
counts = {}

for g in grades:
    # Add 1 to counts[g]
    pass

print(counts["A"], counts["B"], counts["C"], counts["D"])`, `
grades = ["B", "A", "C", "B", "B", "A", "D", "B", "C", "A"]
counts = {}

for g in grades:
    counts[g] = counts.get(g, 0) + 1

print(counts["A"], counts["B"], counts["C"], counts["D"])`,
      [out(String.raw`^3 4 2 1\s*$`, "The output should be: 3 4 2 1")], "counts[g] = counts.get(g, 0) + 1"),
    mc("The dice histogram peaks at 7 and falls away evenly on both sides. A histogram of people's incomes has a tall hump on the left and a long thin tail to the right. What is the second shape called?", ["Symmetric", "Skewed", "Flat"], 1,
      "A long tail on one side is called skew. Many financial quantities are skewed, and methods that assume a symmetric shape can be badly wrong on them."),
  ]),

  lesson("the-normal-distribution", "The normal distribution", "The bell curve, and the rule that comes with it.", [
    read("The most famous shape in statistics", [
      "Heights, measurement errors, and the totals of many dice all pile up in the same shape: a symmetric hump around the mean, thinning out on both sides. It is the **normal distribution**, or bell curve.",
      "It is described completely by two numbers: its mean and its standard deviation. And it comes with a rule worth memorizing." ],
      "within 1 standard deviation of the mean:  about 68%\nwithin 2 standard deviations:             about 95%\nwithin 3 standard deviations:             about 99.7%"),
    num("Test scores are normal with a mean of 70 and a standard deviation of 10. About what percent of students score between 50 and 90?", 95, "50 to 90 is two standard deviations either side of 70: about 95%."),
    py("Check the rule by simulation", ["`random.gauss(mean, sd)` draws one value from a normal distribution."],
      ["Count how many of 20,000 draws from a normal with mean 0 and standard deviation 1 land between −1 and 1."], `
import random

inside = 0

for i in range(20000):
    x = random.gauss(0, 1)
    # Count x if it is between -1 and 1

print(inside / 20000)`, `
import random

inside = 0

for i in range(20000):
    x = random.gauss(0, 1)
    if -1 < x < 1:
        inside += 1

print(inside / 20000)`,
      [between(0.665, 0.70, "About 0.68 of the draws should land within one standard deviation.")], "if -1 < x < 1:\n    inside += 1"),
    mc("If daily stock returns were exactly normal, a fall of 5 standard deviations would happen about once in 14,000 years. Falls that size happen every few years. What does that tell you?", [
      "The data is wrong", "Real returns have fatter tails than the normal distribution: extreme days are far more common than the bell curve says", "Nothing"], 1,
      "The normal curve is a useful first model, and a dangerous last one. Much of risk management is about the tails that it misses."),
  ]),

  lesson("z-scores", "Z-scores", "How unusual is this number?", [
    read("Distance in standard deviations", [
      "Is a 3% move in a stock big? It depends on the stock. For a sleepy utility it is huge. For a small tech company it is an ordinary day.",
      "A **z-score** puts every value on the same scale: how many standard deviations it sits from the mean." ],
      "z  =  (value − mean) ÷ standard deviation"),
    num("A stock's daily moves have a mean of 0% and a standard deviation of 1.5%. Today it rose 4.5%. What is the z-score?", 3, "(4.5 − 0) ÷ 1.5 = 3. A three standard deviation day."),
    py("Z-scores for a list", ["Compute the mean and standard deviation once, then convert every value."],
      ["Set `z` to a list holding the z-score of each value in `data`."], `
import statistics

data = [12, 15, 11, 14, 30, 13, 12, 14]
mean = statistics.mean(data)
sd = statistics.stdev(data)

# Set z here

print([round(v, 2) for v in z])`, `
import statistics

data = [12, 15, 11, 14, 30, 13, 12, 14]
mean = statistics.mean(data)
sd = statistics.stdev(data)

z = [(x - mean) / sd for x in data]

print([round(v, 2) for v in z])`,
      [out(String.raw`2\.42`, "The value 30 should have a z-score of 2.42."), out(String.raw`^\[-0\.51,`, "The first z-score should be -0.51.")], "z = [(x - mean) / sd for x in data]"),
    mc("In that list, one value has a z-score of 2.42 and the rest are between −0.7 and 0. What would a careful analyst do first?", ["Delete it without looking", "Check whether it is a real event or a data error", "Ignore it"], 1,
      "Z-scores are the standard way to flag outliers. An outlier might be a typo or the most important day in the data, and you have to look to know which."),
  ]),

  lesson("sampling", "Sampling", "Learning about everything from a small part of it.", [
    read("You never see the whole picture", [
      "A **population** is everything you care about: every trade that will ever happen, every voter, every possible market day. A **sample** is the part you actually get to see.",
      "Statistics is the craft of saying something reliable about the population from the sample. The catch: a different sample would have given a slightly different answer." ]),
    tryPy("Same population, different samples", ["Here the population is 10,000 numbers with a true mean near 50. Each sample takes 25 of them at random."],
      ["Run it. No two sample means are the same, yet all sit near 50."], `
import random, statistics

random.seed(3)
population = [random.gauss(50, 10) for i in range(10000)]
print("true mean:", round(statistics.mean(population), 2))

for s in range(8):
    sample = random.sample(population, 25)
    print("sample", s + 1, "mean:", round(statistics.mean(sample), 2))`),
    mc("You back-test a strategy on last year and it earns 12%. What is that number?", ["The strategy's true long-run return", "One sample's result, which would differ on another year", "A guarantee for next year"], 1,
      "One year is one sample. The strategy's real average could be well above or below 12%, and the next lessons show how to judge by how much."),
    mc("A poll of 1,000 people is taken only among visitors to a finance website, then used to describe the whole country. What is wrong?", ["1,000 is too few", "The sample is not representative of the population", "Nothing"], 1,
      "A biased sample gives a biased answer however large it is. In finance the classic version is studying only companies that still exist, which leaves out all the ones that failed."),
  ]),

  lesson("the-central-limit-theorem", "The central limit theorem", "Why averages are so well behaved.", [
    read("Averages become normal", [
      "Take samples from almost any distribution, even a lopsided one, and compute each sample's mean. Those means form a bell curve around the true mean. This is the **central limit theorem**, and it is why the normal distribution turns up everywhere.",
      "The spread of those sample means is called the **standard error**. It shrinks as the sample grows, but slowly: with the square root of the sample size." ],
      "standard error  =  standard deviation ÷ √(sample size)"),
    num("A population has a standard deviation of 10. What is the standard error of the mean for samples of size 25?", 2, "10 ÷ √25 = 10 ÷ 5 = 2."),
    py("Watch it happen", ["One die has a standard deviation of about 1.71. The theorem says the average of 25 dice should have a standard deviation of about 1.71 ÷ 5 = 0.34."],
      ["Inside the loop, append the mean of 25 dice rolls to `means`."], `
import random, statistics

means = []

for s in range(4000):
    # Append the average of 25 dice
    pass

print(round(statistics.mean(means), 2), round(statistics.stdev(means), 2))`, `
import random, statistics

means = []

for s in range(4000):
    means.append(statistics.mean(random.randint(1, 6) for r in range(25)))

print(round(statistics.mean(means), 2), round(statistics.stdev(means), 2))`,
      [between(0.31, 0.375, "The spread of the averages should be about 0.34.")], "means.append(statistics.mean(random.randint(1, 6) for r in range(25)))"),
    mc("To cut the standard error in half, how much more data do you need?", ["Twice as much", "Four times as much", "Ten times as much"], 1,
      "Because of the square root, halving the error takes four times the data. This is why certainty in finance is so expensive: markets only produce one new day of data per day."),
  ]),

  lesson("confidence-intervals", "Confidence intervals", "An estimate with honest error bars.", [
    read("A range instead of a point", [
      "Reporting that a strategy averaged 0.10% a day sounds precise. It hides how uncertain that figure is.",
      "A **confidence interval** reports a range. The usual one runs two standard errors either side of the sample mean, and is called a 95% confidence interval: ranges built this way contain the true mean about 95% of the time." ],
      "95% interval  ≈  sample mean ± 2 × standard error"),
    num("A sample of 100 daily returns has a mean of 0.10% and a standard deviation of 1.0%. What is the standard error, in percent?", 0.1, "1.0 ÷ √100 = 0.1%."),
    num("Using that standard error, what is the lower end of the 95% confidence interval for the mean, in percent?", -0.1, "0.10 − 2 × 0.1 = −0.10%. The interval runs from −0.10% to +0.30%."),
    mc("That interval, −0.10% to +0.30%, includes zero. What does that mean for the strategy?", ["It definitely works", "The data cannot rule out that its true average return is zero", "It definitely loses"], 1,
      "With 100 days of data you cannot tell this strategy from one with no edge. This is the honest answer to most short track records."),
    py("An interval function", ["Wrap the calculation up so it can be reused."],
      ["Make `interval` return the low and high ends: the mean minus and plus 2 standard errors."], `
import statistics, math

def interval(data):
    mean = statistics.mean(data)
    se = statistics.stdev(data) / math.sqrt(len(data))
    # Replace the next line
    pass

low, high = interval([2.1, 1.8, 2.5, 2.0, 1.6, 2.4, 2.2, 1.9, 2.3])
print(round(low, 2), round(high, 2))`, `
import statistics, math

def interval(data):
    mean = statistics.mean(data)
    se = statistics.stdev(data) / math.sqrt(len(data))
    return mean - 2 * se, mean + 2 * se

low, high = interval([2.1, 1.8, 2.5, 2.0, 1.6, 2.4, 2.2, 1.9, 2.3])
print(round(low, 2), round(high, 2))`,
      [out(String.raw`^1\.89 2\.28\s*$`, "The interval should be 1.89 to 2.28.")], "return mean - 2 * se, mean + 2 * se"),
  ]),

  lesson("hypothesis-tests", "Hypothesis tests", "Could this have happened by luck?", [
    read("Assume nothing is going on", [
      "A friend flips a coin 100 times and gets 60 heads. Is the coin unfair?",
      "The statistician's method: start by assuming the boring explanation, called the **null hypothesis**. Here, that the coin is fair. Then ask how often a fair coin would give a result at least this extreme.",
      "That probability is the **p-value**. A small one means the boring explanation is hard to believe." ]),
    py("Find the p-value by simulation", ["Flip 100 fair coins, many times over, and see how often you get 60 or more heads."],
      ["Inside the loop, count the trial in `extreme` if `heads` is 60 or more."], `
import random

trials = 5000
extreme = 0

for t in range(trials):
    heads = sum(random.random() < 0.5 for flip in range(100))
    # Count it if heads is at least 60

print(extreme / trials)`, `
import random

trials = 5000
extreme = 0

for t in range(trials):
    heads = sum(random.random() < 0.5 for flip in range(100))
    if heads >= 60:
        extreme += 1

print(extreme / trials)`,
      [between(0.017, 0.042, "The answer should be close to 0.028.")], "if heads >= 60:\n    extreme += 1"),
    mc("The p-value is about 0.03. What is the correct reading?", ["There is a 3% chance the coin is fair", "If the coin were fair, a result this extreme would happen about 3% of the time", "The coin is 97% unfair"], 1,
      "A p-value is about how surprising the data is under the null hypothesis. It is not the probability that the null hypothesis is true. This is one of the most misread numbers in science."),
    mc("A researcher tests 100 worthless trading signals and calls any with a p-value below 0.05 a discovery. About how many discoveries will they announce?", ["0", "About 5", "About 50"], 1,
      "By definition, about 5% of worthless signals pass a 0.05 test by luck. Test enough ideas and you will always find some. Quants raise the bar when they run many tests."),
  ]),

  lesson("regression", "Regression", "Fit a line and use it to predict.", [
    read("The line of best fit", [
      "Given pairs of numbers, such as hours studied and test score, **linear regression** finds the straight line that fits them best. Best means the line that makes the squared gaps between it and the points as small as possible.",
      "The line has a **slope** (how much y changes when x rises by 1) and an **intercept** (the value of y when x is 0). The slope has a neat formula." ],
      "slope  =  Σ (x − mean x)(y − mean y)  ÷  Σ (x − mean x)²\nintercept  =  mean y − slope × mean x"),
    py("Fit a line by hand", ["Five points that lie close to a line."],
      ["Set `slope` using the formula, then set `intercept`."], `
import statistics

x = [1, 2, 3, 4, 5]
y = [2.1, 3.9, 6.2, 7.8, 10.1]
mx = statistics.mean(x)
my = statistics.mean(y)

# Set slope and intercept here

print(round(slope, 2), round(intercept, 2))`, `
import statistics

x = [1, 2, 3, 4, 5]
y = [2.1, 3.9, 6.2, 7.8, 10.1]
mx = statistics.mean(x)
my = statistics.mean(y)

slope = sum((a - mx) * (b - my) for a, b in zip(x, y)) / sum((a - mx) ** 2 for a in x)
intercept = my - slope * mx

print(round(slope, 2), round(intercept, 2))`,
      [out(String.raw`^1\.99 0\.05\s*$`, "The slope should be 1.99 and the intercept 0.05.")],
      "slope = sum((a - mx) * (b - my) for a, b in zip(x, y)) / sum((a - mx) ** 2 for a in x)\nintercept = my - slope * mx"),
    num("Using the fitted line y = 1.99x + 0.05, what does it predict for x = 6?", 11.99, "1.99 × 6 + 0.05 = 11.99.", { tol: 0.011 }),
    mc("The line was fitted on x values from 1 to 5. Someone uses it to predict y at x = 500. What is the risk?", ["None, a line goes on forever", "The relationship may not hold far outside the range of the data", "The slope changes sign"], 1,
      "This is called extrapolation. A model is only tested where it has seen data. Many financial models have failed by being trusted in conditions they were never fitted on."),
    mc("A regression of a stock's daily return on the market's daily return gives a slope of 1.3. What does the slope mean?", ["The stock rises 1.3% every day", "When the market moves 1%, this stock tends to move about 1.3% in the same direction", "The stock is 30% overpriced"], 1,
      "That slope has a name, beta, and it is one of the most used numbers in investing. You will meet it properly in the portfolio track."),
  ]),

  lesson("correlation-is-not-causation", "Correlation is not causation", "The most important warning in data analysis.", [
    read("Two things moving together", [
      "Ice cream sales and drowning deaths rise and fall together through the year. Ice cream does not cause drowning. Hot weather drives both.",
      "When two things are correlated there are several possibilities: one causes the other, the other causes the one, a third thing causes both, or it is a coincidence. The data alone cannot tell you which." ]),
    mc("Cities with more police officers tend to have more crime. Which conclusion is safest?", ["Police cause crime", "Bigger cities have more of both, so the two rise together", "Crime prevents policing"], 1,
      "City size drives both numbers. A hidden cause behind two correlated things is called a confounder."),
    tryPy("Coincidences on demand", [
      "This makes one random series, then 200 more that have nothing to do with it, and finds the one that correlates best with the first.",
      "Search enough unrelated things and one will always look like a match." ],
      ["Run it a few times. The best correlation is always strong, and always meaningless."], `
import random, statistics

target = [random.gauss(0, 1) for i in range(12)]
best = 0

for s in range(200):
    other = [random.gauss(0, 1) for i in range(12)]
    best = max(best, abs(statistics.correlation(target, other)))

print("best correlation found among 200 unrelated series:", round(best, 2))`),
    mc("A blog reports that a stock index has tracked butter production in one country almost perfectly for ten years. What should you make of it?", ["Trade on it", "With thousands of statistics to search through, some will match by chance, and such matches rarely continue", "Butter drives markets"], 1,
      "This is the same effect you just simulated. A correlation found by searching, with no reason behind it, is almost always noise."),
    mc("What is the strongest way to show that one thing really causes another?", ["Find a very high correlation", "Run an experiment: change one thing on purpose, at random, and see what happens", "Collect more of the same data"], 1,
      "Randomized experiments break the link to hidden causes. Markets rarely allow them, which is why quants are so cautious about claims of cause."),
  ]),

  quiz([
    num("Values are normally distributed with a mean of 100 and a standard deviation of 15. What is the z-score of 130?", 2, "(130 − 100) ÷ 15 = 2."),
    mc("About what share of a normal distribution lies within one standard deviation of the mean?", ["50%", "68%", "95%"], 1, "The 68, 95, 99.7 rule."),
    num("A population has a standard deviation of 12. What is the standard error of the mean for samples of size 36?", 2, "12 ÷ √36 = 2."),
    mc("A test gives a p-value of 0.40. What does that say?", ["The effect is proven", "A result like this would be common even if nothing were going on", "There is a 40% effect"], 1, "A large p-value means the data is unsurprising under the null hypothesis."),
    mc("Shoe size and reading ability are strongly correlated among children. Why?", ["Big feet help reading", "Age drives both", "Reading grows feet"], 1, "Older children have bigger feet and read better. Age is the confounder."),
  ]),
];
