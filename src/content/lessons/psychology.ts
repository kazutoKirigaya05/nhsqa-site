import type { Lesson } from "./types";
import { between, lesson, mc, num, out, py, quiz, read, tryPy } from "./helpers";

export const psychology: Lesson[] = [
  lesson("loss-aversion", "Loss aversion", "Why losing $100 hurts more than winning $100 feels good.", [
    mc("You are offered a coin flip. Heads you win $110, tails you lose $100. Would you take it? Answer honestly.", ["Yes", "No"], 0,
      "The bet has a positive expected value of +$5, so the answer a quant would give is yes. But most people say no, and experiments suggest they need to win about twice what they might lose before they will play."),
    read("Losses loom larger", [
      "Two psychologists, Daniel Kahneman and Amos Tversky, showed in the 1970s that people do not weigh gains and losses equally. A loss hurts roughly twice as much as a gain of the same size pleases. They called it **loss aversion**.",
      "It is not stupidity. It is how human minds are built. But in markets it leads to predictable mistakes, and the people on the other side of those mistakes profit from them." ]),
    num("What is the expected value of that coin flip (heads +$110, tails −$100), in dollars?", 5, "0.5 × 110 − 0.5 × 100 = +$5.", { prefix: "$" }),
    tryPy("Take the bet a thousand times", ["One flip is frightening. A thousand flips is a different thing."],
      ["Run it several times. How often does the total come out negative?"], `
import random

total = 0
for flip in range(1000):
    total += 110 if random.random() < 0.5 else -100

print("after 1000 flips:", total)`),
    mc("A trader refuses many small positive-expected-value bets because each one might lose. Over a year, what has the fear of losing cost them?", ["Nothing", "The total of all the expected gains they turned down", "Their salary"], 1,
      "Each refusal feels safe. Added up, they are a large and invisible loss. Quants judge a bet as one of thousands, which takes the sting out of any single result."),
  ]),

  lesson("overconfidence", "Overconfidence", "Most people think they are above average. They cannot all be right.", [
    read("Too sure, too often", [
      "Ask a room of drivers whether they are better than average and most hands go up. The same happens with investors.",
      "**Overconfidence** shows up in two ways. People think their knowledge is more precise than it is. And they think their past wins were skill while their losses were bad luck." ]),
    mc("Without looking it up: are you at least 90% sure that the Nile is longer than 5,000 kilometers?", ["Yes, I am at least 90% sure", "No, I am less sure than that"], 0,
      "It is about 6,650 km, so yes is right. The interesting question is how often your 90% sure answers turn out to be correct. For most people it is closer to 70%. Being right as often as you claim is called being well calibrated."),
    read("What it does to traders", [
      "Studies of ordinary investors' accounts find that the people who trade the most tend to earn the least, after costs. Each trade felt like a good idea at the time.",
      "Confidence drives trading, trading has costs, and markets do not pay for confidence." ]),
    py("The cost of trading too much", ["Two investors both pick stocks no better than chance, so before costs each earns the market's 7% a year. One makes 4 trades a year, the other 100. Each trade costs 0.05% of the account."],
      ["Print each investor's return after costs, in percent, rounded to 2 decimal places: 7 minus the number of trades times 0.05."], `
market_return = 7.0
cost_per_trade = 0.05

`, `
market_return = 7.0
cost_per_trade = 0.05

print(round(market_return - 4 * cost_per_trade, 2))
print(round(market_return - 100 * cost_per_trade, 2))`,
      [out(String.raw`^6\.8\s*$`, "The careful investor keeps 6.8%."), out(String.raw`^2\.0\s*$`, "The busy investor keeps 2.0%.")], "print(round(market_return - 4 * cost_per_trade, 2))\nprint(round(market_return - 100 * cost_per_trade, 2))"),
    mc("How do quant firms guard against overconfidence in a new strategy?", ["They trust the researcher's instinct", "They demand evidence from data the strategy has never seen, and start it with small amounts of money", "They avoid new strategies"], 1,
      "Belief is not evidence. The whole apparatus of testing exists because every researcher is sure about their own idea."),
  ]),

  lesson("anchoring-and-recency", "Anchoring and recency", "Two shortcuts your mind takes with numbers.", [
    read("Anchoring", [
      "In a famous experiment, people watched a wheel of fortune stop on a random number, then guessed what percentage of United Nations countries are in Africa. Those who saw a high number guessed much higher than those who saw a low one.",
      "The first number you see becomes an **anchor**, and your later judgment stays tied to it even when it is irrelevant." ]),
    mc("You bought a stock at $50. It is now $30. You tell yourself you will sell when it gets back to $50. What is $50 to the market?", ["An important price", "Nothing. Only you know or care what you paid", "A legal limit"], 1,
      "Your purchase price is an anchor. The stock's future depends on the company, not on where you happened to buy. The right question is always: would I buy it today at this price?"),
    read("Recency", [
      "People give too much weight to what happened most recently. After a long rise, risk feels low and everyone wants in. After a crash, risk feels enormous and everyone wants out.",
      "That is the opposite of what the numbers say. Prices are highest, and so future returns lowest, exactly when things feel safest." ]),
    mc("Markets have risen strongly for three years and a friend says stocks only go up. Which bias is that?", ["Anchoring", "Recency", "Loss aversion"], 1,
      "The recent past is being treated as the permanent state of the world. Long histories exist to correct exactly this."),
    mc("An interviewer asks you to estimate a quantity, and mentions that the last candidate said 10,000. What should you do?", ["Start from 10,000 and adjust", "Build your own estimate from scratch, then compare", "Say 10,000"], 1,
      "The mention may even be a deliberate test. Reason from what you know, and treat other people's numbers as one piece of evidence, not a starting point."),
  ]),

  lesson("the-disposition-effect", "Selling winners, keeping losers", "The most documented mistake in investing.", [
    read("Backwards", [
      "Look at ordinary investors' accounts and a pattern jumps out. They sell the stocks that have gone up, to enjoy the gain. They hold the stocks that have gone down, to avoid admitting the loss.",
      "It is called the **disposition effect**, and it follows directly from loss aversion: selling a loser makes the loss real, so people put it off." ]),
    mc("You hold two stocks. One is up 30% and one is down 30%. You need to sell one to raise cash. Which does the disposition effect push you to sell?", ["The winner", "The loser", "Neither"], 0,
      "Most people sell the winner. Whether that is right depends only on which stock has the better future, and what you paid tells you nothing about that."),
    py("Cut losses or let them run", ["Two traders each make 100 trades. Trader A lets winners run to +10 and cuts losers at −5. Trader B grabs winners at +5 and lets losers run to −10. Both pick winners 55% of the time."],
      ["Set `a` and `b` to each trader's expected profit per trade."], `
p_win = 0.55

# Trader A: wins 10, loses 5.  Trader B: wins 5, loses 10.

print(round(a, 2), round(b, 2))`, `
p_win = 0.55

# Trader A: wins 10, loses 5.  Trader B: wins 5, loses 10.
a = p_win * 10 - (1 - p_win) * 5
b = p_win * 5 - (1 - p_win) * 10

print(round(a, 2), round(b, 2))`,
      [out(String.raw`^3\.25 -1\.75\s*$`, "The output should be: 3.25 -1.75")], "a = p_win * 10 - (1 - p_win) * 5\nb = p_win * 5 - (1 - p_win) * 10"),
    mc("Both traders are right 55% of the time. Trader A makes money and Trader B loses it. What made the difference?", ["A is luckier", "The size of the wins compared with the size of the losses", "B trades more"], 1,
      "Being right more often than wrong is not enough. Trader B's behavior, small wins and big losses, is exactly what the disposition effect produces."),
    mc("What is a simple defense against holding losers too long?", ["Never look at prices", "Decide your exit point before you enter the trade, and stick to it", "Only buy stocks that go up"], 1,
      "A rule made in advance, with a clear head, beats a decision made while watching a loss grow. This is the logic behind stop-loss rules, and behind systematic trading in general."),
  ]),

  lesson("herds-and-bubbles", "Herds and bubbles", "When everyone believes the same thing at once.", [
    read("Following the crowd", [
      "For most of history, doing what everyone else did was a good survival strategy. In markets it creates **bubbles**: prices that rise because they have been rising, as buyers pile in for fear of missing out.",
      "In the Netherlands in the 1630s, rare tulip bulbs briefly sold for more than a skilled worker earned in years, then collapsed. In the late 1990s, internet companies with no profits were valued in the billions. The Nasdaq index then fell by more than three quarters between 2000 and 2002." ]),
    mc("During a bubble, why is it so hard to stay out?", ["It is not hard", "Everyone around you appears to be getting rich, and skeptics look foolish for years", "Brokers require you to buy"], 1,
      "A bubble can run far longer than seems possible. Doubting it early and loudly is painful, which is part of why bubbles keep happening."),
    mc("A cautious fund manager refuses to buy overpriced internet stocks in 1998. The bubble does not burst until 2000. What probably happens to the manager in between?", ["They are praised", "They lag the market badly and lose clients, even though they are eventually proved right", "Nothing"], 1,
      "Being early looks exactly like being wrong. Knowing a price is too high does not tell you when it will fall, which makes betting against a bubble dangerous."),
    tryPy("A bubble in code", [
      "A toy model. Each day, buyers pile in if the price rose yesterday, pushing it up further. With a small chance each day, confidence breaks and everyone sells.",
      "Nothing about the company changes at any point." ],
      ["Run it several times. Every run has the same value underneath. Only the crowd differs."], `
import random

price = 100.0
for day in range(1, 61):
    if random.random() < 0.04:
        price = price * 0.45           # confidence breaks
        print("day", day, "CRASH to", round(price, 1))
    else:
        price = price * 1.03           # the crowd keeps buying
    if day % 10 == 0:
        print("day", day, "price", round(price, 1))`),
    mc("What does a quant take from the history of bubbles?", ["That prices are always right", "That prices can drift far from value for a long time, so position sizes must allow for being wrong for longer than expected", "That bubbles are easy to trade"], 1,
      "The trader's saying is that markets can stay irrational longer than you can stay solvent. Risk limits exist because being right eventually is no help if you run out of money first."),
  ]),

  lesson("process-over-outcome", "Process over outcome", "Judge decisions by how they were made, not how they turned out.", [
    read("Good decision, bad result", [
      "You take a bet with an 80% chance of winning. It loses. Was it a bad decision? No. It was a good decision that hit its 20%.",
      "Judging a decision by its result is called **resulting**. It teaches the wrong lessons: you abandon good strategies after bad luck, and repeat bad ones after good luck.",
      "Professionals grade the **process**: what did I know, what were the odds, and did I size it sensibly?" ]),
    mc("A friend puts all their savings into one stock on a tip, and it doubles. Was that a good decision?", ["Yes, it doubled", "No. It was a reckless decision that happened to work", "It cannot be judged"], 1,
      "A result does not rescue a bad process. Had the same bet gone the other way, they would have lost everything, and the decision would have been just as bad."),
    py("How often does the better strategy lose?", ["Strategy A wins each trade with probability 0.55. Strategy B wins with probability 0.45. Over just 20 trades, how often does B, the worse one, finish with more wins?"],
      ["Inside the loop, count the trial in `upsets` if B has more wins than A."], `
import random

trials = 5000
upsets = 0

for t in range(trials):
    a = sum(random.random() < 0.55 for i in range(20))
    b = sum(random.random() < 0.45 for i in range(20))
    # Count it if b beat a

print(upsets / trials)`, `
import random

trials = 5000
upsets = 0

for t in range(trials):
    a = sum(random.random() < 0.55 for i in range(20))
    b = sum(random.random() < 0.45 for i in range(20))
    if b > a:
        upsets += 1

print(upsets / trials)`,
      [between(0.17, 0.26, "The worse strategy should come out ahead roughly 21% of the time.")], "if b > a:\n    upsets += 1"),
    mc("About one time in five, the worse strategy looks better over 20 trades. What does that say about judging a trader on a month of results?", ["A month is plenty", "Short records are dominated by luck, so you must look at the reasoning or wait for much more data", "Results never matter"], 1,
      "Results do matter, over enough trades. Over a few, they mostly measure luck."),
    read("Keep a trading journal", [
      "The practical tool is a **journal**. Before each trade on the Trading floor, write down what you expect to happen and why, how much you are risking, and what would make you exit.",
      "Later, compare what happened with what you wrote. It is the only way to tell your good decisions from your lucky ones, and it is how professional traders improve." ]),
  ]),

  quiz([
    mc("What is loss aversion?", ["Avoiding all risk", "Feeling a loss more strongly than a gain of the same size", "Selling too early"], 1, "Losses weigh roughly twice as much as equal gains."),
    mc("Holding a losing stock until it gets back to what you paid is an example of:", ["Anchoring on the purchase price", "Diversification", "Calibration"], 0, "The market does not know or care what you paid."),
    mc("The disposition effect is the tendency to:", ["Buy at the top", "Sell winners too early and hold losers too long", "Trade too rarely"], 1, "It turns a good hit rate into small wins and large losses."),
    num("A trader wins $8 on 60% of trades and loses $15 on the other 40%. What is the expected profit per trade, in dollars?", -1.2, "0.6 × 8 − 0.4 × 15 = 4.8 − 6 = −$1.20.", { prefix: "$", tol: 0.011 }),
    mc("You make a careful, well-sized bet with good odds, and it loses. What should you conclude?", ["The process was bad", "Nothing yet. One outcome says little about a decision", "Never bet again"], 1, "Judge the process, and let many outcomes speak."),
  ]),
];
