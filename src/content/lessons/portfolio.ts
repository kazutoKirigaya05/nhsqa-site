import type { Lesson } from "./types";
import { lesson, mc, num, out, py, quiz, read, tryPy } from "./helpers";

const RISK_FN = `import math

def portfolio_risk(w, sd1, sd2, corr):
    variance = (w * sd1) ** 2 + ((1 - w) * sd2) ** 2 + 2 * w * (1 - w) * corr * sd1 * sd2
    return math.sqrt(variance)`;

export const portfolio: Lesson[] = [
  lesson("weights-and-returns", "Weights and returns", "Describe a portfolio by its proportions.", [
    read("Fractions of the whole", [
      "A portfolio is described by its **weights**: the fraction of the money in each asset. Put $6,000 in stocks and $4,000 in bonds, and the weights are 0.6 and 0.4. Weights always add up to 1.",
      "The portfolio's return is the weighted average of its assets' returns: each return multiplied by its weight, then added up." ],
      "portfolio return  =  w₁ × r₁ + w₂ × r₂ + ..."),
    num("A portfolio is 60% stocks and 40% bonds. Stocks return 10% and bonds return 5%. What is the portfolio's return, as a decimal?", 0.08, "0.6 × 0.10 + 0.4 × 0.05 = 0.06 + 0.02 = 0.08."),
    py("Weights from dollar amounts", ["Turn holdings in dollars into weights."],
      ["Set `weights` to a list of each amount divided by the total."], `
amounts = [5000, 3000, 2000]

# Set weights here

print(weights)`, `
amounts = [5000, 3000, 2000]

total = sum(amounts)
weights = [a / total for a in amounts]

print(weights)`,
      [out(String.raw`^\[0\.5, 0\.3, 0\.2\]\s*$`, "The weights should be [0.5, 0.3, 0.2].")], "total = sum(amounts)\nweights = [a / total for a in amounts]"),
    py("Portfolio return", ["A dot product of weights and returns."],
      ["Set `total` to the sum of each weight times its return."], `
weights = [0.5, 0.3, 0.2]
returns = [0.12, 0.04, -0.05]

# Set total here

print(round(total, 4))`, `
weights = [0.5, 0.3, 0.2]
returns = [0.12, 0.04, -0.05]

total = sum(w * r for w, r in zip(weights, returns))

print(round(total, 4))`,
      [out(String.raw`^0\.062\s*$`, "The portfolio return should be 0.062.")], "total = sum(w * r for w, r in zip(weights, returns))"),
    mc("Can a portfolio's return be higher than the return of its best asset?", ["Yes, with good weights", "No. A weighted average always lies between the lowest and highest return", "Only with three or more assets"], 1,
      "With ordinary weights between 0 and 1, the return is an average. The surprise, in the next lesson, is that risk does not average in the same way."),
  ]),

  lesson("risk-of-two-assets", "The risk of two assets", "Risk does not average. It can partly cancel.", [
    read("Where diversification comes from", [
      "A portfolio's return is the average of its assets' returns. Its risk is usually **less** than the average of their risks, because the assets do not all move together.",
      "For two assets the standard deviation follows a formula with three ingredients: each asset's weight and risk, and the **correlation** between them. The lower the correlation, the more the risks cancel." ],
      "variance  =  (w₁σ₁)² + (w₂σ₂)² + 2 · w₁ · w₂ · correlation · σ₁ · σ₂"),
    py("The formula as a function", ["`w` is the weight in the first asset, so `1 - w` is the weight in the second."],
      ["Complete the variance: add the third term, 2 × w × (1 − w) × corr × sd1 × sd2."], `
import math

def portfolio_risk(w, sd1, sd2, corr):
    variance = (w * sd1) ** 2 + ((1 - w) * sd2) ** 2
    # Add the correlation term to variance
    return math.sqrt(variance)

print(round(portfolio_risk(0.5, 0.2, 0.2, 1), 4))
print(round(portfolio_risk(0.5, 0.2, 0.2, 0), 4))`, `
${RISK_FN}

print(round(portfolio_risk(0.5, 0.2, 0.2, 1), 4))
print(round(portfolio_risk(0.5, 0.2, 0.2, 0), 4))`,
      [out(String.raw`^0\.2\s*$`, "With a correlation of 1 the risk should be 0.2."), out(String.raw`^0\.1414\s*$`, "With a correlation of 0 the risk should be 0.1414.")], "variance += 2 * w * (1 - w) * corr * sd1 * sd2"),
    mc("Two assets each have a risk of 20%. Split evenly between them, the portfolio's risk is 20% when their correlation is 1 and about 14% when it is 0. What did the lower correlation give you?", ["A lower return", "Less risk for the same return", "Nothing"], 1,
      "Same assets, same weights, same expected return, less risk. This is the mathematical heart of diversification."),
    num("Two assets each have a risk of 20% and a correlation of −1. You hold half in each. What is the portfolio's risk, in percent?", 0, "With a correlation of −1, one always moves exactly opposite to the other, and an even split cancels the risk completely."),
    mc("In real markets, assets with a correlation of −1 and positive returns basically do not exist. Why not?", ["Nobody has looked", "A riskless portfolio with a high return would be bought by everyone until the extra return disappeared", "Correlation cannot be negative"], 1,
      "It is the no-arbitrage idea again. Perfect hedges that still pay well get competed away."),
  ]),

  lesson("the-efficient-frontier", "The efficient frontier", "The best trade-offs between risk and return.", [
    read("Every mix, on one chart", [
      "Take a stock fund with high return and high risk, and a bond fund with low return and low risk. Every possible mix of the two has its own return and its own risk.",
      "Plot them all and you get a curve. The mixes on its upper edge are the ones no other mix beats: for their level of risk, nothing returns more. That edge is the **efficient frontier**.",
      "Harry Markowitz worked this out in 1952 and later won a Nobel prize for it. It turned investing into a math problem." ]),
    tryPy("Scan the mixes", ["Stocks return 10% with 20% risk. Bonds return 4% with 10% risk. Their correlation is 0.2."],
      ["Run it and find the row with the lowest risk. It is not 100% bonds."], `
${RISK_FN}

print("stocks  return  risk")
for pct in range(0, 101, 10):
    w = pct / 100
    ret = w * 0.10 + (1 - w) * 0.04
    print(str(pct).rjust(4) + "%  ", round(ret * 100, 1), "  ", round(portfolio_risk(w, 0.2, 0.1, 0.2) * 100, 2))`),
    py("Find the safest mix", ["Search every whole-percent mix for the one with the least risk."],
      ["Inside the loop, if this mix's risk is lower than `best_risk`, store the risk and the percentage."], `
${RISK_FN}

best_pct = 0
best_risk = 999

for pct in range(0, 101):
    risk = portfolio_risk(pct / 100, 0.2, 0.1, 0.2)
    # Keep the lowest risk seen so far
    pass

print(best_pct, round(best_risk, 4))`, `
${RISK_FN}

best_pct = 0
best_risk = 999

for pct in range(0, 101):
    risk = portfolio_risk(pct / 100, 0.2, 0.1, 0.2)
    if risk < best_risk:
        best_risk = risk
        best_pct = pct

print(best_pct, round(best_risk, 4))`,
      [out(String.raw`^14 0\.0956\s*$`, "The safest mix is 14% stocks, with a risk of 0.0956.")], "if risk < best_risk:\n    best_risk = risk\n    best_pct = pct"),
    mc("The safest portfolio holds 14% in the risky stock fund, and is less risky than holding only bonds. How can adding a riskier asset lower risk?", ["It cannot, the code is wrong", "The stocks often move differently from the bonds, so a small amount offsets some of the bonds' swings", "Stocks are secretly safe"], 1,
      "This is one of the least intuitive results in finance, and one of the most useful. An asset should be judged by what it does to the whole portfolio, not on its own."),
    mc("A portfolio sits below the efficient frontier. What does that mean?", ["It is illegal", "Another mix offers more return for the same risk, or less risk for the same return", "It has no risk"], 1,
      "Being below the frontier means leaving something on the table. The frontier does not say which point on it to choose. That depends on how much risk you can live with."),
  ]),

  lesson("the-sharpe-ratio-again", "Risk-free rates and the best mix", "Add a safe asset, and one risky portfolio stands out.", [
    read("The safe alternative", [
      "There is always something close to riskless you can hold instead: short-term government debt. Its return is the **risk-free rate**.",
      "So the real question about any risky investment is how much it earns **above** the risk-free rate for each unit of risk. That is the full definition of the Sharpe ratio." ],
      "Sharpe ratio  =  (return − risk-free rate) ÷ risk"),
    num("A fund returns 8% with a risk of 15%. The risk-free rate is 2%. What is its Sharpe ratio?", 0.4, "(8 − 2) ÷ 15 = 0.4."),
    py("The mix with the best Sharpe ratio", ["Stocks: 10% return, 20% risk. Bonds: 4% return, 10% risk. Correlation 0.2. Risk-free rate 2%."],
      ["Inside the loop, compute this mix's Sharpe ratio. If it beats `best_sharpe`, store it and the percentage."], `
${RISK_FN}

best_pct = 0
best_sharpe = -999

for pct in range(0, 101):
    w = pct / 100
    ret = w * 0.10 + (1 - w) * 0.04
    risk = portfolio_risk(w, 0.2, 0.1, 0.2)
    # Compute the Sharpe ratio and keep the best
    pass

print(best_pct, round(best_sharpe, 3))`, `
${RISK_FN}

best_pct = 0
best_sharpe = -999

for pct in range(0, 101):
    w = pct / 100
    ret = w * 0.10 + (1 - w) * 0.04
    risk = portfolio_risk(w, 0.2, 0.1, 0.2)
    sharpe = (ret - 0.02) / risk
    if sharpe > best_sharpe:
        best_sharpe = sharpe
        best_pct = pct

print(best_pct, round(best_sharpe, 3))`,
      [out(String.raw`^60 0\.418\s*$`, "The best mix is 60% stocks, with a Sharpe ratio of 0.418.")], "sharpe = (ret - 0.02) / risk\nif sharpe > best_sharpe:\n    best_sharpe = sharpe\n    best_pct = pct"),
    read("One portfolio for everyone", [
      "Here is the striking conclusion of the theory. Once a safe asset exists, every investor should hold the same risky mix: the one with the highest Sharpe ratio.",
      "A cautious investor holds a little of it and a lot of the safe asset. A bold one holds more of it. They differ in how much, not in which." ]),
    mc("Stocks alone have a Sharpe ratio of (10 − 2) ÷ 20 = 0.40. The best mix scored 0.418. An investor who wants high returns should:", [
      "Hold only stocks", "Hold the best mix, and take more of it, instead of abandoning the bonds", "Hold only bonds"], 1,
      "The best mix earns more per unit of risk. Scaling that up beats concentrating in the riskier asset. Many large funds are built on exactly this reasoning."),
  ]),

  lesson("beta", "Beta", "How much a stock moves when the market moves.", [
    read("Sensitivity to the market", [
      "Most stocks rise on days the market rises and fall when it falls, but by different amounts. **Beta** measures that sensitivity.",
      "A beta of 1 means the stock moves with the market. A beta of 1.5 means it tends to move 1.5% for each 1% the market moves. A beta of 0.5 means it moves half as much.",
      "Beta is the slope of a regression of the stock's returns on the market's returns." ]),
    num("A stock has a beta of 1.5. The market falls 2% in a day. What move would you expect in the stock, in percent?", -3, "1.5 × −2% = −3%."),
    py("Compute a beta", ["The regression slope formula from the statistics track, applied to six days of returns."],
      ["Set `beta` to the sum of (stock − its mean) × (market − its mean), divided by the sum of (market − its mean) squared."], `
import statistics

stock = [0.03, -0.02, 0.05, -0.04, 0.02, 0.01]
market = [0.02, -0.01, 0.03, -0.03, 0.01, 0.01]
ms = statistics.mean(stock)
mm = statistics.mean(market)

# Set beta here

print(round(beta, 2))`, `
import statistics

stock = [0.03, -0.02, 0.05, -0.04, 0.02, 0.01]
market = [0.02, -0.01, 0.03, -0.03, 0.01, 0.01]
ms = statistics.mean(stock)
mm = statistics.mean(market)

beta = sum((s - ms) * (m - mm) for s, m in zip(stock, market)) / sum((m - mm) ** 2 for m in market)

print(round(beta, 2))`,
      [out(String.raw`^1\.51\s*$`, "The beta should be 1.51.")], "beta = sum((s - ms) * (m - mm) for s, m in zip(stock, market)) / sum((m - mm) ** 2 for m in market)"),
    mc("Which company would you expect to have the lowest beta?", ["A new electric car maker", "An electricity company with steady customers", "A luxury cruise line"], 1,
      "People pay their electricity bills in good times and bad, so the company's profits barely follow the economy. Businesses that depend on confidence and spare cash tend to have high betas."),
    mc("You hold a portfolio with a beta of 1.2 and want its swings to match the market. What should you add?", ["More high-beta stocks", "Low-beta holdings or cash", "Nothing can change it"], 1,
      "A portfolio's beta is the weighted average of its holdings' betas. Mixing in low-beta assets or cash, which has a beta of zero, brings it down."),
  ]),

  lesson("capm-and-alpha", "Alpha", "Separating skill from simply taking market risk.", [
    read("What the market pays for", [
      "A famous model, the **CAPM**, says a stock's expected return depends only on its beta. You are paid for the market risk you take on, and nothing else.",
      "The amount by which the market is expected to beat the risk-free rate is the **market risk premium**." ],
      "expected return  =  risk-free rate + beta × (market return − risk-free rate)"),
    num("The risk-free rate is 2% and the market is expected to return 8%. What does the CAPM say a stock with a beta of 1.5 should return, in percent?", 11, "2 + 1.5 × (8 − 2) = 2 + 9 = 11%."),
    read("Alpha", [
      "**Alpha** is the return left over after accounting for beta: what a manager earned beyond what their market exposure alone would have given.",
      "A fund that returns 15% in a year when the market rose 20%, with a beta of 1, did not show skill. It lost 5% to the market. Alpha is what quant funds are hired to find, and it is rare." ],
      "alpha  =  actual return − CAPM expected return"),
    py("Measure alpha", ["The risk-free rate is 2% and the market returned 8%."],
      ["Make `alpha` return the actual return minus the CAPM expected return."], `
def alpha(actual, beta, risk_free=0.02, market=0.08):
    # Replace the next line
    pass

print(round(alpha(0.13, 1.5), 4))
print(round(alpha(0.07, 1.0), 4))`, `
def alpha(actual, beta, risk_free=0.02, market=0.08):
    expected = risk_free + beta * (market - risk_free)
    return actual - expected

print(round(alpha(0.13, 1.5), 4))
print(round(alpha(0.07, 1.0), 4))`,
      [out(String.raw`^0\.02\s*$`, "The first fund's alpha should be 0.02."), out(String.raw`^-0\.01\s*$`, "The second fund's alpha should be -0.01.")], "expected = risk_free + beta * (market - risk_free)\nreturn actual - expected"),
    mc("A fund boasts that it returned 16% while the market returned 8%. Its beta is 2 and the risk-free rate is 2%. Did it show skill?", ["Yes, it doubled the market", "No. With a beta of 2 it should have earned 14%, so most of the gain came from taking twice the market's risk", "It cannot be known"], 1,
      "2 + 2 × (8 − 2) = 14% expected, so the alpha is 2%. Most of the headline number was leverage on the market, which anyone can buy cheaply."),
  ]),

  lesson("index-funds", "Index funds and fees", "The cheapest strategy, and why it is so hard to beat.", [
    read("Own everything", [
      "An **index fund** simply holds every stock in an index, such as the 500 largest US companies, in proportion to their size. It does not try to pick winners. It delivers the market's return, minus a very small fee.",
      "Study after study has found that, over long periods, most professional stock pickers earn less than the index after their fees." ]),
    py("What a 1% fee costs", ["Two investors each put in $1,000 for 30 years. The market returns 7% a year. One pays almost no fee. The other pays 1% a year, leaving 6%."],
      ["Print the final value at 7%, then at 6%, each rounded to the nearest dollar."], `
start = 1000
years = 30

`, `
start = 1000
years = 30

print(round(start * 1.07 ** years))
print(round(start * 1.06 ** years))`,
      [out(String.raw`^7612\s*$`, "At 7% the result should be 7612."), out(String.raw`^5743\s*$`, "At 6% the result should be 5743.")], "print(round(start * 1.07 ** years))\nprint(round(start * 1.06 ** years))"),
    mc("A fee of 1% a year sounded small. Over 30 years it cost about a quarter of the final amount. Why so much?", ["The fee grew each year", "The fee compounds: money taken each year would itself have kept growing", "A calculation error"], 1,
      "Compounding works against you just as powerfully as for you. Costs are one of the few things about investing that you can know in advance."),
    mc("If most active managers lose to the index, why does anyone try to beat it?", ["Nobody does", "A minority do have real edge, and prices are only accurate because people keep trying to find mistakes in them", "It is required by law"], 1,
      "Markets are hard to beat because so many skilled people are trying. Quant firms are among the few groups with a record of doing it, which is why the work is so competitive."),
    mc("For someone with no special information or edge, what does the evidence suggest is the sensible way to invest?", ["Pick a few exciting stocks", "Hold a low-cost, diversified index fund for a long time", "Trade every day"], 1,
      "This is education, not personal financial advice, but it is the mainstream conclusion of decades of research, and most quants invest their own savings this way."),
  ]),

  lesson("rebalancing", "Rebalancing", "Keeping a portfolio at the weights you chose.", [
    read("Portfolios drift", [
      "You set up a portfolio at 60% stocks and 40% bonds. Stocks have a great year. Now stocks are a bigger share than you intended, and the portfolio is riskier than you chose.",
      "**Rebalancing** means trading back to the target weights: selling some of what has grown and buying what has lagged." ]),
    py("How far did it drift?", ["Start with $6,000 in stocks and $4,000 in bonds. Stocks rise 30% and bonds are flat."],
      ["Set `stock_weight` to the stocks' share of the portfolio after the move."], `
stocks = 6000 * 1.30
bonds = 4000 * 1.00

# Set stock_weight here

print(round(stock_weight, 3))`, `
stocks = 6000 * 1.30
bonds = 4000 * 1.00

stock_weight = stocks / (stocks + bonds)

print(round(stock_weight, 3))`,
      [out(String.raw`^0\.661\s*$`, "Stocks should now be 0.661 of the portfolio.")], "stock_weight = stocks / (stocks + bonds)"),
    py("The trade that fixes it", ["To get back to 60%, work out what the stock holding should be and sell the difference."],
      ["Set `to_sell` to the dollar amount of stocks to sell."], `
stocks = 7800
bonds = 4000
target = 0.60

# Set to_sell here

print(round(to_sell))`, `
stocks = 7800
bonds = 4000
target = 0.60

to_sell = stocks - target * (stocks + bonds)

print(round(to_sell))`,
      [out(String.raw`^720\s*$`, "You should sell 720 dollars of stocks.")], "to_sell = stocks - target * (stocks + bonds)"),
    mc("Rebalancing makes you sell what has just gone up and buy what has just gone down. Why is that hard for most people?", ["It is complicated math", "It feels wrong to sell a winner and buy a loser, so people tend to do the opposite", "It is not allowed"], 1,
      "A fixed rebalancing rule takes the emotion out of it. Replacing in-the-moment feelings with rules decided in advance is the basic idea of quantitative investing."),
    mc("Why not rebalance every single day?", ["It is impossible", "Each trade has costs, and frequent small trades can cost more than the drift they fix", "Weights never change that fast"], 1,
      "Every choice in portfolio management weighs a benefit against trading costs. Most investors rebalance on a schedule or when weights drift past a set limit."),
  ]),

  quiz([
    num("A portfolio is 70% stocks returning 10% and 30% bonds returning 0%. What is its return, as a decimal?", 0.07, "0.7 × 0.10 + 0.3 × 0 = 0.07."),
    mc("Combining two assets reduces risk the most when their correlation is:", ["Close to +1", "Close to 0", "Close to −1"], 2, "The more opposite their moves, the more the risks cancel."),
    num("A fund returns 9% with 14% risk when the risk-free rate is 2%. What is its Sharpe ratio?", 0.5, "(9 − 2) ÷ 14 = 0.5."),
    num("The risk-free rate is 3% and the market returns 9%. What return does the CAPM expect from a stock with a beta of 0.5, in percent?", 6, "3 + 0.5 × (9 − 3) = 6%."),
    mc("What is alpha?", ["The return from market exposure", "The return beyond what the fund's market risk explains", "The fund's fee"], 1, "It is the part of the return that beta does not account for."),
  ]),
];
