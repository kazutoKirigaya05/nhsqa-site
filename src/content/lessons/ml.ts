import type { Lesson } from "./types";
import { lesson, mc, num, out, py, quiz, read } from "./helpers";

const FIT = `import statistics

def fit(xs, ys):
    mx = statistics.mean(xs)
    my = statistics.mean(ys)
    slope = sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / sum((x - mx) ** 2 for x in xs)
    return slope, my - slope * mx`;

export const ml: Lesson[] = [
  lesson("what-is-machine-learning", "What is machine learning?", "Programs that learn rules from examples.", [
    read("Learning from examples", [
      "In ordinary programming, a person writes the rules. In **machine learning**, a person supplies examples and the program works out the rules itself.",
      "Each example has **features** (the inputs you know) and usually a **label** (the answer you want to predict). To predict tomorrow's return, the features might be recent returns and trading volume, and the label is what the stock actually did next.",
      "A fitted **model** is the rule the program found. Linear regression, which you have already met, is the simplest machine learning model there is." ]),
    mc("A program is shown 10,000 emails, each marked spam or not spam, and learns to sort new ones. What are the labels?", ["The words in each email", "The spam or not-spam markings", "The 10,000 emails"], 1,
      "The labels are the answers supplied with the examples. The words are the features."),
    mc("A quant wants to predict whether a stock will rise tomorrow using today's return and volume. What are the features?", ["Whether the stock rises tomorrow", "Today's return and volume", "The model"], 1,
      "Features are what you know at the time of the prediction. A common and costly mistake is to let a feature contain information from the future."),
    mc("When does machine learning work best?", ["When there are few examples and the pattern keeps changing", "When there are many examples and the pattern is stable", "When there is no data"], 1,
      "Recognizing photos fits that description well. Financial markets fit it badly: limited history, weak patterns, and rules that shift. That is why ML in finance is hard, as the last lesson explains."),
  ]),

  lesson("train-and-test", "Train and test", "The one rule of machine learning you must never break.", [
    read("Do not mark your own homework", [
      "A model is fitted on examples. If you then measure it on those same examples, it will look better than it is, because it has already seen the answers.",
      "So the data is always split in two. The model learns from the **training set**. Its quality is measured on the **test set**, which it never sees while learning.",
      "With time series there is an extra rule: the test data must come **after** the training data. You cannot train on the future." ]),
    py("Split a data set", ["Use the first 80% for training and the rest for testing."],
      ["Set `train` to the first 8 items and `test` to the last 2, using slices."], `
data = [3.1, 4.9, 7.2, 9.1, 10.8, 13.2, 15.1, 16.8, 19.2, 21.0]
cut = int(len(data) * 0.8)

# Set train and test here

print(len(train), len(test), test)`, `
data = [3.1, 4.9, 7.2, 9.1, 10.8, 13.2, 15.1, 16.8, 19.2, 21.0]
cut = int(len(data) * 0.8)

train = data[:cut]
test = data[cut:]

print(len(train), len(test), test)`,
      [out(String.raw`^8 2 \[19\.2, 21\.0\]\s*$`, "The output should be: 8 2 [19.2, 21.0]")], "train = data[:cut]\ntest = data[cut:]"),
    mc("A model scores 99% on its training data and 52% on its test data. What happened?", ["It is a great model", "It memorized the training examples instead of learning a pattern that carries over", "The test data is broken"], 1,
      "That gap is overfitting. Only the test score tells you what to expect on new data."),
    mc("You tune a model again and again, checking the test score each time and keeping the best version. What is the problem?", ["None", "By choosing on the test score you have fitted the model to the test set, so it is no longer a fair test", "It takes too long"], 1,
      "Careful teams keep a third set, locked away and used once at the very end. In finance the only truly untouched test is the future."),
  ]),

  lesson("fitting-a-line", "Fitting a line", "Your first machine learning model, from scratch.", [
    read("Regression as learning", [
      "Linear regression learns two numbers from the training data: a slope and an intercept. Together they are the model. Predicting is then one multiplication and one addition." ],
      "prediction  =  slope × x + intercept"),
    py("Train the model", ["`fit` contains the formulas from the statistics track. Train on the first 8 points only."],
      ["Call `fit` on the training data and store the results in `slope` and `intercept`."], `
${FIT}

xs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
ys = [3.1, 4.9, 7.2, 9.1, 10.8, 13.2, 15.1, 16.8, 19.2, 21.0]

# Fit on xs[:8] and ys[:8]

print(round(slope, 3), round(intercept, 3))`, `
${FIT}

xs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
ys = [3.1, 4.9, 7.2, 9.1, 10.8, 13.2, 15.1, 16.8, 19.2, 21.0]

slope, intercept = fit(xs[:8], ys[:8])

print(round(slope, 3), round(intercept, 3))`,
      [out(String.raw`^1\.983 1\.1\s*$`, "The slope should be 1.983 and the intercept 1.1.")], "slope, intercept = fit(xs[:8], ys[:8])"),
    py("Predict the unseen points", ["The model has never seen x = 9 or x = 10."],
      ["Print the model's prediction for x = 9, then for x = 10, each rounded to 2 decimal places."], `
slope = 1.983
intercept = 1.1

`, `
slope = 1.983
intercept = 1.1

print(round(slope * 9 + intercept, 2))
print(round(slope * 10 + intercept, 2))`,
      [out(String.raw`^18\.95\s*$`, "The prediction for 9 should be 18.95."), out(String.raw`^20\.93\s*$`, "The prediction for 10 should be 20.93.")], "print(round(slope * 9 + intercept, 2))\nprint(round(slope * 10 + intercept, 2))"),
    mc("The true values were 19.2 and 21.0, and the model predicted 18.95 and 20.93. What does that tell you?", ["The model is useless", "The pattern it learned from the first 8 points carried over well to points it had not seen", "It memorized the answers"], 1,
      "Small errors on unseen data are what success looks like. This data is close to a clean line. Market data is never this kind."),
  ]),

  lesson("measuring-error", "Measuring error", "A single number for how wrong a model is.", [
    read("Mean squared error", [
      "To compare models you need one number for how far off their predictions are. The most common is the **mean squared error**: take each prediction's miss, square it, and average.",
      "Squaring does two things. It makes every miss positive, so they cannot cancel. And it punishes big misses far more than small ones." ],
      "mean squared error  =  average of (actual − predicted)²"),
    num("A model's predictions miss by 1, −1 and 2. What is the mean squared error?", 2, "(1 + 1 + 4) ÷ 3 = 2."),
    py("An error function", ["`zip` pairs each actual value with its prediction."],
      ["Make `mse` return the average of the squared differences."], `
def mse(actual, predicted):
    # Replace the next line
    pass

print(mse([3, 5, 7, 9], [2.5, 5.5, 7, 10]))`, `
def mse(actual, predicted):
    return sum((a - p) ** 2 for a, p in zip(actual, predicted)) / len(actual)

print(mse([3, 5, 7, 9], [2.5, 5.5, 7, 10]))`,
      [out(String.raw`^0\.375\s*$`, "The mean squared error should be 0.375.")], "return sum((a - p) ** 2 for a, p in zip(actual, predicted)) / len(actual)"),
    mc("Model A misses by 3 every time. Model B is usually exact but occasionally misses by 30. Which has the larger mean squared error if B's big miss happens one time in ten?", ["Model A (9)", "Model B (90)", "They are equal"], 1,
      "A: 3² = 9. B: 900 one time in ten averages to 90. Squared error hates rare disasters, which is often what you want in finance."),
    mc("A model's error on the test set is 0.5. Is that good?", ["Yes", "No", "It depends on what a simple baseline scores on the same data"], 2,
      "An error means nothing alone. Compare it with a baseline, such as always predicting the average. A model that cannot beat the baseline has learned nothing."),
  ]),

  lesson("memorizing-is-not-learning", "Memorizing is not learning", "Build a model that is perfect in training and useless after.", [
    read("The memorizer", [
      "Here is a model with a perfect training score: store every training example in a dictionary, and when asked about an x it has seen, return the stored y.",
      "It gets every training example exactly right. Now ask it about an x it has never seen. It has nothing. The best it can do is guess the average." ]),
    py("Score the memorizer", ["`train` and `test` map x values to y values. For an unseen x the memorizer returns the average of the training answers."],
      ["Set `test_error` to the mean squared error of the memorizer's guess on the test set: the average of (guess − value) squared over the test values."], `
import statistics

train = {1: 2.2, 2: 3.9, 3: 6.1, 4: 8.0}
test = {5: 10.1, 6: 11.8}

train_error = 0                               # it stored every training answer
guess = statistics.mean(train.values())       # all it can say about an unseen x

# Set test_error here

print(train_error, round(test_error, 2))`, `
import statistics

train = {1: 2.2, 2: 3.9, 3: 6.1, 4: 8.0}
test = {5: 10.1, 6: 11.8}

train_error = 0                               # it stored every training answer
guess = statistics.mean(train.values())       # all it can say about an unseen x

test_error = statistics.mean((guess - v) ** 2 for v in test.values())

print(train_error, round(test_error, 2))`,
      [out(String.raw`^0 35\.53\s*$`, "The output should be: 0 35.53")], "test_error = statistics.mean((guess - v) ** 2 for v in test.values())"),
    mc("Zero error in training, a huge error in testing. A straight line fitted to the same four points would have predicted the test values almost exactly. Why is the simpler model better?", [
      "It has more settings", "It captured the pattern, a steady rise, instead of the individual examples", "It was lucky"], 1,
      "A model with the freedom to store everything will store noise too. A simpler model is forced to find the pattern."),
    mc("A complicated model and a simple one score about the same on the test set. Which should you choose?", ["The complicated one", "The simple one", "Either"], 1,
      "The simpler one is easier to understand, cheaper to run and less likely to break when conditions change. Preferring the simplest thing that works is a rule quants live by."),
  ]),

  lesson("classification", "Classification", "Predicting a category instead of a number.", [
    read("Up or down", [
      "Regression predicts a number. **Classification** predicts a category: spam or not, fraud or not, up or down.",
      "The simplest classifier is a threshold: if the signal is above zero, predict up. Otherwise predict down. Its quality is measured by **accuracy**: the share of predictions that were right." ]),
    py("Score a classifier", ["`signal` is a number known the day before. `went_up` is 1 if the stock then rose and 0 if it fell."],
      ["Count the days where the prediction (1 if the signal is above 0, otherwise 0) matches what happened, and divide by the number of days."], `
signal = [0.5, -0.2, 0.8, -0.6, 0.1, -0.3, 0.9, -0.1, 0.4, -0.7]
went_up = [1, 0, 1, 0, 0, 0, 1, 1, 1, 0]
correct = 0

for s, up in zip(signal, went_up):
    prediction = 1 if s > 0 else 0
    # Count it if the prediction matches

print(correct / len(signal))`, `
signal = [0.5, -0.2, 0.8, -0.6, 0.1, -0.3, 0.9, -0.1, 0.4, -0.7]
went_up = [1, 0, 1, 0, 0, 0, 1, 1, 1, 0]
correct = 0

for s, up in zip(signal, went_up):
    prediction = 1 if s > 0 else 0
    if prediction == up:
        correct += 1

print(correct / len(signal))`,
      [out(String.raw`^0\.8\s*$`, "The accuracy should be 0.8.")], "if prediction == up:\n    correct += 1"),
    mc("A stock rose on 53% of days last year. A classifier that predicts its direction scores 53% accuracy. Is the classifier any good?", ["Yes, it beats a coin flip", "No. Always predicting up would score the same", "It is impossible to say"], 1,
      "The baseline for accuracy is the most common class. A classifier has to beat that, not 50%."),
    mc("A fraud detector is 99.9% accurate. Only 1 payment in 1,000 is fraud. What could it be doing?", ["Catching all the fraud", "Calling every payment honest", "Either. Accuracy alone cannot tell"], 2,
      "A detector that never flags anything is 99.9% accurate and useless. When one class is rare, you have to ask what share of the rare cases were caught."),
    mc("In trading, why can a classifier with 51% accuracy be valuable while one with 60% loses money?", ["It cannot", "What matters is how much is made on the right calls and lost on the wrong ones, not only how often it is right", "Accuracy is always what matters"], 1,
      "A strategy that wins small 60% of the time and loses big 40% of the time loses overall. Expected value, the first idea in this course, has the last word."),
  ]),

  lesson("nearest-neighbors", "Nearest neighbors", "Predict by finding similar examples.", [
    read("Ask the neighbors", [
      "Here is a model with no formula at all. To predict for a new x, find the training examples whose x is closest, and average their y values.",
      "This is **k nearest neighbors**, where k is how many neighbors you ask. It can follow curves and bumps that a straight line cannot." ]),
    py("Write it", ["`sorted(points, key=...)` can order the points by how far their x is from the one you want."],
      ["Sort the points by distance from `x`, take the first `k`, and return the mean of their y values."], `
import statistics

points = [(1, 2.0), (2, 4.1), (3, 5.9), (6, 12.2), (7, 13.8), (8, 16.1)]

def predict(x, k):
    # Find the k nearest points and average their y values
    pass

print(round(predict(4, 1), 2))
print(round(predict(4, 3), 2))`, `
import statistics

points = [(1, 2.0), (2, 4.1), (3, 5.9), (6, 12.2), (7, 13.8), (8, 16.1)]

def predict(x, k):
    nearest = sorted(points, key=lambda p: abs(p[0] - x))[:k]
    return statistics.mean(p[1] for p in nearest)

print(round(predict(4, 1), 2))
print(round(predict(4, 3), 2))`,
      [out(String.raw`^5\.9\s*$`, "With 1 neighbor the prediction should be 5.9."), out(String.raw`^7\.4\s*$`, "With 3 neighbors the prediction should be 7.4.")], "nearest = sorted(points, key=lambda p: abs(p[0] - x))[:k]\nreturn statistics.mean(p[1] for p in nearest)"),
    mc("With k = 1 the model copies its single closest example. What is the danger?", ["It is too slow", "One odd or noisy example decides the whole prediction", "It cannot make predictions"], 1,
      "A tiny k follows every quirk of the data, which is overfitting. Averaging over more neighbors smooths the noise away."),
    mc("With k equal to the size of the whole training set, what does the model predict?", ["A different value for every x", "The same value for every x: the overall average", "Nothing"], 1,
      "Too large a k ignores the input entirely, which is called underfitting. The right k sits between the two, and is chosen by testing on held-out data."),
    mc("A trader uses this idea on markets: find past days that looked most like today, and see what happened next. What is the main weakness?", ["Too little history that truly resembles today, and markets that change over time", "It is illegal", "It needs no data"], 0,
      "There are only a few thousand trading days to search, and the ones that look similar may come from a very different market. It is a real technique, used with caution."),
  ]),

  lesson("why-markets-are-hard", "Why markets are hard for machines", "The same methods that master images struggle with prices.", [
    read("A harder problem than it looks", [
      "Machine learning can recognize faces and translate languages. Predicting stock returns with it is far harder, for reasons worth knowing before you try.",
      "**The signal is faint.** A cat photo is almost all signal. A day's stock return is almost all noise, with a sliver of predictable pattern.",
      "**The rules change.** Cats look the same next year. Markets adapt: once enough traders exploit a pattern, it fades.",
      "**Data is scarce.** Twenty years of daily prices is about 5,000 rows. Image models train on billions." ]),
    mc("A model finds a pattern that worked from 2005 to 2015. Many funds discover the same pattern and trade on it. What is likely to happen to it?", ["It gets stronger", "It weakens or vanishes, because their trading removes the opportunity", "Nothing"], 1,
      "Markets are made of people and programs reacting to each other. A published or crowded pattern rarely survives, which no photo data set has to worry about."),
    mc("A feature in a model is the day's closing price, and the model is asked to predict whether that same day closed higher than it opened. It is 100% accurate. What went wrong?", ["Nothing", "The feature contains the answer. Information from after the prediction time leaked in", "Too little data"], 1,
      "This is called leakage, and it is the machine learning version of look-ahead bias. Results that look too good are nearly always leakage."),
    mc("Given all this, where does machine learning really help in quant finance?", ["Nowhere", "In finding small, weak patterns across huge numbers of stocks and data sources, combined with very careful testing", "In predicting next week's index level exactly"], 1,
      "Tiny edges, spread across thousands of positions and tested honestly, are how the most successful quant firms work. The skill is as much in the testing as in the model."),
    mc("What is the most valuable habit for anyone doing ML in finance?", ["Using the most complex model available", "Distrusting your own good results until they survive data the model has never seen", "Training for longer"], 1,
      "The easiest person to fool is yourself. Every track in this course has pointed at the same discipline."),
  ]),

  quiz([
    mc("In machine learning, what is a label?", ["An input to the model", "The answer the model is trying to predict", "The model's name"], 1, "Features go in, labels are what you want out."),
    mc("Why is a model tested on data it was not trained on?", ["To save time", "Because its score on training data flatters it", "Because training data is secret"], 1, "Only unseen data shows whether the pattern carries over."),
    num("A model's predictions miss by 2, 0 and −4. What is the mean squared error? (Two decimal places.)", 20 / 3, "(4 + 0 + 16) ÷ 3 = 6.67.", { tol: 0.01 }),
    mc("A stock falls on 55% of days. What accuracy must a direction classifier beat to be worth anything?", ["50%", "55%", "45%"], 1, "Always predicting down scores 55%, so that is the baseline."),
    mc("What is leakage?", ["Losing data", "Information from the future, or the answer itself, slipping into the features", "A slow model"], 1, "It produces results that are too good to be true, and are not true."),
  ]),
];
