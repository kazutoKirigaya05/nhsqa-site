import type { Lesson } from "./types";
import { between, lesson, mc, num, out, py, quiz, read, tryPy } from "./helpers";

export const interview: Lesson[] = [
  lesson("mental-math", "Mental math", "Trading firms test it first. A few tricks go a long way.", [
    read("Why firms care", [
      "Many trading firms start their interviews with a timed arithmetic test: no calculator, dozens of questions, a few seconds each. On a trading floor you often have to judge a price before there is time to compute it.",
      "Speed comes from tricks, not from being a human calculator. The questions here have no timer. Try each one in your head before you type." ]),
    read("Three tricks", [
      "**Break percentages apart.** 15% is 10% plus half of that. So 15% of 80 is 8 + 4 = 12.",
      "**Trade factors.** 25 × 16 is the same as 100 × 4, because you can divide one number by 4 and multiply the other by 4.",
      "**Use the difference of squares.** 48 × 52 is (50 − 2) × (50 + 2), which is 50² − 2² = 2,500 − 4 = 2,496." ]),
    num("What is 15% of 240?", 36, "10% is 24 and 5% is 12. Together: 36."),
    num("What is 25 × 36?", 900, "A quarter of 36 is 9, so 25 × 36 = 100 × 9 = 900."),
    num("What is 97 × 103?", 9991, "(100 − 3) × (100 + 3) = 10,000 − 9 = 9,991."),
    num("What is 1/8 as a decimal?", 0.125, "Half of 1/4. Traders memorize the common fractions: 1/8 = 0.125, 1/6 ≈ 0.167, 1/3 ≈ 0.333.", { tol: 0.0005 }),
  ]),

  lesson("estimation", "Estimation", "Getting close to an answer nobody could look up.", [
    read("Roughly right, quickly", [
      "Interviewers ask questions like: how many tennis balls fit in a school bus? They do not know the answer either. They want to see you break a big unknown into small pieces you can estimate, then multiply.",
      "The goal is the right **order of magnitude**: is it thousands, millions or billions? An estimate within a factor of two or three is a success." ]),
    num("How many seconds are there in a day?", 86400, "24 hours × 60 minutes × 60 seconds = 86,400. Useful to remember as roughly 100,000."),
    mc("About how many times does a human heart beat in a day, at roughly 70 beats a minute?", ["About 10,000", "About 100,000", "About 1,000,000"], 1,
      "70 × 60 is about 4,000 an hour, and 4,000 × 24 is about 100,000. No exact arithmetic needed."),
    mc("A handy fact: 2 multiplied by itself 10 times is 1,024, which is about 1,000. About how big is 2 multiplied by itself 30 times?", ["About a million", "About a billion", "About a trillion"], 1,
      "Thirty doublings is three lots of ten doublings: 1,000 × 1,000 × 1,000 = a billion."),
    mc("You are asked how many pizzas are eaten in your country each year. What is the best first step?", [
      "Say you do not know", "Start from the population and estimate how many pizzas one person eats in a year", "Guess a big number confidently"], 1,
      "Anchor on something you know, then reason step by step out loud. The method is what is being marked."),
  ]),

  lesson("dice-and-cards", "Dice and cards", "The probability questions that come up again and again.", [
    num("You roll two dice. What is the probability that they add up to 7? (Three decimal places.)", 1 / 6, "Six of the 36 combinations make 7: 1+6, 2+5, 3+4, 4+3, 5+2, 6+1. That is 6/36 = 1/6, about 0.167.", { tol: 0.002 }),
    read("Waiting for a six", [
      "A common question: on average, how many rolls does it take to get a six?",
      "Each roll succeeds with probability 1/6. When something has probability p each try, the average wait is 1 ÷ p tries. So the answer is 6.",
      "The same rule says a trade that works one time in twenty needs about twenty tries on average." ]),
    num("An event has a probability of 0.25 on each try. On average, how many tries until it first happens?", 4, "1 ÷ 0.25 = 4."),
    num("You roll a die four times. What is the probability of getting at least one six? (Three decimal places.)", 1 - Math.pow(5 / 6, 4),
      "Work out the opposite. The chance of no six in four rolls is (5/6)⁴ ≈ 0.482, so the chance of at least one is about 0.518.", { tol: 0.003 }),
    py("Check it by simulation", ["When you are unsure of an answer, simulate it. `6 in rolls` is True if any of the rolls is a 6."],
      ["Inside the loop, add 1 to `hits` if any of the four rolls is a 6."], `
import random

trials = 20000
hits = 0

for t in range(trials):
    rolls = [random.randint(1, 6) for r in range(4)]
    # Count this trial if it contains a 6

print(hits / trials)`, `
import random

trials = 20000
hits = 0

for t in range(trials):
    rolls = [random.randint(1, 6) for r in range(4)]
    if 6 in rolls:
        hits += 1

print(hits / trials)`,
      [between(0.495, 0.54, "The answer should be close to 0.518.")], "if 6 in rolls:\n    hits += 1"),
  ]),

  lesson("should-you-roll-again", "Should you roll again?", "Games where the skill is knowing when to stop.", [
    read("One re-roll", [
      "You roll a die and win that many dollars. Before you collect, you may throw the result away and roll once more, but then you must keep the second roll.",
      "When should you re-roll? A fresh roll is worth $3.50 on average. So keep anything better than that, which means 4, 5 or 6, and re-roll a 1, 2 or 3." ]),
    num("Using that strategy, what is the game worth on average, in dollars?", 4.25,
      "Half the time you keep a 4, 5 or 6, which averages $5. The other half you re-roll and get $3.50 on average. 0.5 × 5 + 0.5 × 3.5 = $4.25.", { prefix: "$" }),
    py("Simulate the strategy", ["Check the answer by playing the game 20,000 times."],
      ["Inside the loop, if the first roll is 3 or less, replace `roll` with a new roll."], `
import random

total = 0

for game in range(20000):
    roll = random.randint(1, 6)
    # Re-roll here if the first roll is 3 or less
    total += roll

print(total / 20000)`, `
import random

total = 0

for game in range(20000):
    roll = random.randint(1, 6)
    if roll <= 3:
        roll = random.randint(1, 6)
    total += roll

print(total / 20000)`,
      [between(4.17, 4.33, "The average should be close to 4.25. Re-roll only when the first roll is 3 or less.")], "if roll <= 3:\n    roll = random.randint(1, 6)"),
    mc("Now you are allowed two re-rolls instead of one. On your first roll, should you still keep a 4?", ["Yes, the rule is always keep 4 or more", "No. With a re-roll still in hand, continuing is worth $4.25, so a 4 is not good enough", "It makes no difference"], 1,
      "Compare what you have with what continuing is worth. With two re-rolls left, continuing is worth $4.25, so on the first roll you keep only a 5 or 6."),
    mc("What is the general idea behind these stopping games?", ["Always stop early", "Work backwards from the last decision to find what each earlier position is worth", "Always take every roll"], 1,
      "Solving the last step first and working backwards is called backward induction. It is the same reasoning used to price options that can be exercised early."),
  ]),

  lesson("the-birthday-problem", "The birthday problem", "A famous answer that almost nobody guesses right.", [
    mc("How many people do you need in a room before there is a better than even chance that two share a birthday? Take a guess.", ["23", "92", "183", "366"], 0,
      "Only 23. Most people guess far higher. The next steps show why."),
    read("Count the pairs", [
      "The mistake is to think about your own birthday. The question is whether any two people match, and 23 people make 253 different pairs.",
      "The neat way to calculate it is to find the chance that everyone is different. The second person must miss 1 birthday: 364/365. The third must miss 2: 363/365. And so on. Multiply them all, then subtract from 1." ]),
    py("Calculate it", ["Person number `i` arrives when `i` birthdays are already taken."],
      ["Inside the loop, multiply `all_different` by the chance that person i misses all the taken birthdays."], `
people = 23
all_different = 1

for i in range(people):
    # Multiply all_different by (365 - i) / 365
    pass

print(round(1 - all_different, 4))`, `
people = 23
all_different = 1

for i in range(people):
    all_different *= (365 - i) / 365

print(round(1 - all_different, 4))`,
      [out(String.raw`^0\.5073\s*$`, "With 23 people the answer should be 0.5073.")], "all_different *= (365 - i) / 365"),
    tryPy("Try other room sizes", ["The same calculation as a function."],
      ["Run it, then add your own class size to the list."], `
def shared_birthday(people):
    all_different = 1
    for i in range(people):
        all_different *= (365 - i) / 365
    return 1 - all_different

for n in [10, 23, 30, 50, 70]:
    print(n, "people:", round(shared_birthday(n), 3))`),
    mc("Why does this matter to a quant?", ["Birthdays move markets", "With many items, coincidences between some pair become likely, so a surprising match is weaker evidence than it feels", "It does not"], 1,
      "Search through enough stocks and two will look linked by pure chance. The birthday problem is a reminder to count how many pairs you examined."),
  ]),

  lesson("monty-hall", "The Monty Hall problem", "Three doors, one prize, and a choice that fools almost everyone.", [
    read("The game", [
      "There are three doors. Behind one is a car, and behind the other two are goats. You pick a door.",
      "The host, who knows where the car is, opens one of the other two doors to show a goat. He then offers you the chance to switch to the remaining closed door." ]),
    mc("Should you switch?", ["Yes, switching wins more often", "No, staying wins more often", "It makes no difference, it is 50/50"], 0,
      "Switching wins two times in three. Nearly everyone says 50/50 the first time. Test it yourself in the next step."),
    py("Simulate it", ["You do not even need to model the host. Think about when switching wins: it wins exactly when your first pick was wrong."],
      ["Inside the loop, add 1 to `wins` if the first pick was not the car."], `
import random

trials = 20000
wins = 0

for t in range(trials):
    car = random.randint(1, 3)
    pick = random.randint(1, 3)
    # Switching wins when the first pick was not the car

print(wins / trials)`, `
import random

trials = 20000
wins = 0

for t in range(trials):
    car = random.randint(1, 3)
    pick = random.randint(1, 3)
    if pick != car:
        wins += 1

print(wins / trials)`,
      [between(0.645, 0.69, "Switching should win about 0.667 of the time.")], "if pick != car:\n    wins += 1"),
    read("Why", [
      "Your first pick is right one time in three. Nothing the host does can change that.",
      "The other two times, the car is behind one of the two doors you did not pick, and the host is forced to open the one with the goat. The door he leaves closed must be the car." ]),
    mc("What is the lesson for trading?", ["Always change your mind", "How information was revealed matters. The host's choice was not random, so it tells you something", "Never trust hosts"], 1,
      "When someone who knows more than you acts, their action carries information. A market maker thinks the same way when a well-informed customer wants to buy."),
  ]),

  lesson("make-me-a-market", "Make me a market", "The interview game where you quote a price on something you do not know.", [
    read("How the game works", [
      "The interviewer names something uncertain: the number of windows in this building, say. You must give two numbers: a **bid**, where you would buy, and an **ask**, where you would sell.",
      "The interviewer can then trade with you at either price. Afterwards the true answer is revealed. If you sold at 600 and the answer is 750, you lose 150.",
      "This is market making in miniature, and trading firms use it to see how you handle uncertainty." ]),
    mc("You know very little about the quantity. How should your bid and ask compare with those of someone who knows it well?", ["Closer together", "Further apart", "The same"], 1,
      "The less you know, the wider your market should be. A wide spread protects you from being badly wrong. A tight one is a claim that you know the answer."),
    num("You quote 400 bid, 600 ask. The interviewer buys from you at 600. The true answer turns out to be 750. How much did you lose per unit?", 150, "You sold at 600 something worth 750: a loss of 150."),
    mc("The interviewer just bought at your ask of 600. They ask you for a new market. What should you do?", ["Quote the same again", "Move both prices up", "Move both prices down"], 1,
      "They chose to buy, which suggests they think the answer is above 600. Use that information: raise your quotes. Real market makers adjust after every trade."),
    mc("An interviewer says your market of 400 to 600 is too wide and asks you to tighten it. What is a good response?", [
      "Refuse", "Tighten it a little, and say what you would need to know to tighten it more", "Quote 500 to 500"], 1,
      "They are testing whether you can commit under pressure without being reckless. Explaining your reasoning matters as much as the numbers."),
  ]),

  lesson("updating-on-evidence", "Updating on evidence", "Bayes' rule, the way interviewers like to ask it.", [
    read("The two coins", [
      "A bag holds two coins. One is fair. The other is a trick coin with heads on both sides. You take one out without looking, flip it, and see heads.",
      "What is the probability that you are holding the trick coin?" ]),
    mc("Before working it out, what does your instinct say?", ["1/2", "2/3", "3/4"], 1,
      "It is 2/3. Many people say 1/2, because there are two coins. But heads is twice as likely to come from the trick coin, and that shifts the odds."),
    read("Counting it out", [
      "Imagine doing this 400 times. About 200 times you draw the trick coin, and it shows heads every time: 200 heads. About 200 times you draw the fair coin, and it shows heads half the time: 100 heads.",
      "You see heads 300 times, and in 200 of those you hold the trick coin. So the probability is 200 ÷ 300 = 2/3.",
      "This way of reasoning is **Bayes' rule**: start with what you believed, then weigh it by how well each possibility explains what you saw." ]),
    py("Simulate the bag", ["Count how often heads appears, and how often the trick coin was behind it."],
      ["Inside the `if`, add 1 to `trick_and_heads` when the coin is the trick coin."], `
import random

heads_seen = 0
trick_and_heads = 0

for t in range(20000):
    coin = random.choice(["fair", "trick"])
    if coin == "trick":
        flip = "H"
    else:
        flip = random.choice(["H", "T"])
    if flip == "H":
        heads_seen += 1
        # Count it if the coin is the trick coin

print(trick_and_heads / heads_seen)`, `
import random

heads_seen = 0
trick_and_heads = 0

for t in range(20000):
    coin = random.choice(["fair", "trick"])
    if coin == "trick":
        flip = "H"
    else:
        flip = random.choice(["H", "T"])
    if flip == "H":
        heads_seen += 1
        if coin == "trick":
            trick_and_heads += 1

print(trick_and_heads / heads_seen)`,
      [between(0.645, 0.69, "The answer should be close to 0.667.")], "if coin == \"trick\":\n    trick_and_heads += 1"),
    num("You flip the same coin twice more and get heads both times, three heads in a row in total. Now what is the probability it is the trick coin? (Three decimal places.)", 8 / 9,
      "In 800 tries: the trick coin gives three heads all 400 times, the fair coin 1 time in 8, so 50 times. 400 ÷ 450 = 8/9, about 0.889.", { tol: 0.003 }),
    mc("How is this like trading?", ["It is not", "Each new piece of data should shift your belief by an amount that depends on how surprising it is", "Traders flip coins to decide"], 1,
      "Every trade and price change is evidence. Good traders update steadily: not ignoring new information, and not overreacting to one data point."),
  ]),

  quiz([
    num("What is 45 × 55?", 2475, "(50 − 5) × (50 + 5) = 2,500 − 25 = 2,475."),
    num("You roll two dice. What is the probability that both show the same number? (Three decimal places.)", 1 / 6, "Whatever the first die shows, the second matches it 1 time in 6: about 0.167.", { tol: 0.002 }),
    mc("In the Monty Hall problem, how often does switching win?", ["1/3", "1/2", "2/3"], 2, "Switching wins whenever your first pick was wrong, which is two times in three."),
    mc("You are asked to make a market on something you know very little about. Your spread should be:", ["Very tight, to look confident", "Wide, to reflect your uncertainty", "Zero"], 1, "Width is how you protect yourself from being wrong."),
    num("A bag has one fair coin and one two-headed coin. You pick one at random and flip heads. What is the probability it is the two-headed coin? (Three decimal places.)", 2 / 3, "Heads is twice as likely from the two-headed coin: 2/3, about 0.667.", { tol: 0.003 }),
  ]),
];
