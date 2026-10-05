import type { Lesson } from "./types";
import { between, lesson, mc, num, out, py, quiz, read, src, tryPy } from "./helpers";

export const markets: Lesson[] = [
  lesson("what-gets-traded", "What gets traded", "Stocks, bonds, currencies and the contracts built on top of them.", [
    read("A market is a meeting place", [
      "A **market** is anywhere buyers and sellers meet to trade. Today most of them are computers in data centers, matching millions of orders a day.",
      "**Stocks** are small pieces of ownership in a company. **Bonds** are loans you can buy and sell. **Currencies** are traded against each other. **Commodities** are physical things like oil, gold and wheat.",
      "**Derivatives** are contracts whose value depends on the price of something else. Options, which get their own track, are the most famous kind." ]),
    mc("You buy one share of a company. What do you own?", ["A loan to the company", "A small piece of the company", "A promise the price will rise", "A product the company makes"], 1,
      "A share is a slice of ownership. If the company becomes more valuable, so does your slice."),
    read("Why prices move", [
      "A price is simply the last amount a buyer and a seller agreed on. Nobody sets it.",
      "When news makes people think a company is worth more, buyers are willing to pay more and sellers ask for more, so the next trade happens higher. Prices are the market's running estimate of value." ]),
    num("You buy 20 shares at $15 each and later sell all of them at $18. What is your profit, in dollars?", 60, "You made $3 on each of 20 shares: 20 × $3 = $60.", { prefix: "$" }),
    mc("A company reports profits far above what everyone expected. What most likely happens to its share price?", ["It falls, because the good news is over", "It rises, because buyers will now pay more", "Nothing, because prices are set once a year"], 1,
      "The market's estimate of the company's value just went up. Notice the word expected: prices move on surprises, not on news everyone already knew."),
  ]),

  lesson("the-order-book", "The order book", "The list of who wants to buy and sell, and at what price.", [
    read("Every offer, in one list", [
      "An exchange keeps an **order book**: every offer to buy (a **bid**) and every offer to sell (an **ask**), sorted by price. The size is how many shares are on offer at that price.",
      "The **best bid** is the highest price anyone will pay. The **best ask** is the lowest price anyone will sell at. The gap between them is the **spread**." ],
      "        price    size\nasks    10.06    300\n        10.05    200\n        10.04    100   <- best ask\n\nbids    10.02    150   <- best bid\n        10.01    400\n        10.00    250"),
    num("Look at that book again: asks at 10.06, 10.05 and 10.04, and bids at 10.02, 10.01 and 10.00. What is the spread, in dollars?", 0.02, "Best ask 10.04 minus best bid 10.02 is $0.02.", { tol: 0.001, prefix: "$" }),
    py("Read a book in code", ["A book is just data. Python's `max( )` and `min( )` find the largest and smallest values in a list."],
      ["Set `best_bid` to the highest bid and `best_ask` to the lowest ask.", "Set `spread` to the gap between them."], `
bids = [10.02, 10.01, 10.00]
asks = [10.04, 10.05, 10.06]

# Set best_bid, best_ask and spread here

print(best_bid, best_ask, round(spread, 2))`, `
bids = [10.02, 10.01, 10.00]
asks = [10.04, 10.05, 10.06]

best_bid = max(bids)
best_ask = min(asks)
spread = best_ask - best_bid

print(best_bid, best_ask, round(spread, 2))`,
      [src(String.raw`max\(`, "Use max(bids) to find the best bid."), src(String.raw`min\(`, "Use min(asks) to find the best ask."), out(String.raw`^10\.02 10\.04 0\.02\s*$`, "The output should be: 10.02 10.04 0.02")],
      "best_bid = max(bids)\nbest_ask = min(asks)\nspread = best_ask - best_bid"),
    mc("You want to buy right now, at whatever price is available. Which price do you pay?", ["The best bid", "The best ask", "Halfway between them"], 1,
      "To buy immediately you must accept a seller's offer, and the cheapest one is the best ask. Crossing the spread is the cost of being in a hurry."),
    mc("The price halfway between the best bid and best ask is called the mid. With a bid of 10.02 and an ask of 10.04, why do quants treat 10.03 as the fair price?", [
      "Because it is the last price that traded", "Because it sits between what buyers will pay and what sellers will accept", "Because exchanges publish it as the official price"], 1,
      "Nobody will pay more than 10.02 and nobody will sell below 10.04, so the true value is somewhere between. The mid is the simplest estimate."),
  ]),

  lesson("orders", "Market and limit orders", "Two ways to trade: take a price now, or name your price and wait.", [
    read("Now, or at my price", [
      "A **market order** says: trade now, at the best price available. You are certain to trade, but not certain of the price.",
      "A **limit order** says: trade only at this price or better. You are certain of the price, but you might never trade. Limit orders that cannot trade yet wait in the order book. They are the book." ]),
    mc("The best ask is 10.04. You send a limit order to buy at 10.00. What happens?", ["You buy at 10.04", "You buy at 10.00 straight away", "Your order waits in the book as a bid at 10.00"], 2,
      "Nobody is selling at 10.00 right now, so your order joins the bids and waits for a seller willing to come down to it."),
    num("The asks are: 100 shares at $10.00, 100 at $10.05 and 200 at $10.10. You send a market order to buy 300 shares. What is the total cost, in dollars?", 3015,
      "You take 100 at $10.00 ($1,000), 100 at $10.05 ($1,005) and 100 at $10.10 ($1,010). Total: $3,015.", { prefix: "$" }),
    read("Slippage", [
      "The best ask was $10.00, but you paid $3,015 for 300 shares, an average of $10.05. That gap is called **slippage**.",
      "Big orders eat through the book and move the price against themselves. A whole branch of quant work, called execution, is about buying large amounts without paying for it." ]),
    py("Walk the book", ["This loop buys from the cheapest ask first, then the next, until the order is filled."],
      ["Inside the loop, add the cost of the shares taken to `cost`.", "Then reduce `want` by the shares taken."], `
asks = [(10.00, 100), (10.05, 100), (10.10, 200)]   # (price, shares on offer)
want = 300
cost = 0

for price, size in asks:
    take = min(size, want)
    # Add to cost and reduce want here

print(round(cost, 2))`, `
asks = [(10.00, 100), (10.05, 100), (10.10, 200)]   # (price, shares on offer)
want = 300
cost = 0

for price, size in asks:
    take = min(size, want)
    cost += take * price
    want -= take

print(round(cost, 2))`,
      [src(String.raw`want\s*(-=|=\s*want\s*-)`, "Reduce want by the shares you took, or you will buy too many."), out(String.raw`^3015\.0\s*$`, "The total cost should be 3015.0.")],
      "cost += take * price\nwant -= take"),
  ]),

  lesson("making-a-market", "Making a market", "How the firms in the middle earn a living, and what can go wrong.", [
    read("Buy low, sell slightly higher, repeat", [
      "A **market maker** posts a bid and an ask at the same time and trades with whoever shows up. It is not betting on the price going up or down. It wants to buy at the bid and sell at the ask, over and over, and keep the spread.",
      "Many of the best-known quant firms are market makers." ]),
    num("You post a bid of $19.98 and an ask of $20.02. You buy 500 shares at your bid and sell 500 at your ask. What is your profit, in dollars?", 20, "You earn the 4 cent spread on 500 shares: 500 × $0.04 = $20.", { prefix: "$" }),
    tryPy("A thousand customers", [
      "This simulates 1,000 customers. Each one either sells to you at your bid or buys from you at your ask, at random.",
      "At the end, any shares you are left holding are valued at the mid price." ],
      ["Run it several times. The leftover shares change. What happens to the profit?"], `
import random

bid, ask = 19.98, 20.02
cash = 0
shares = 0

for customer in range(1000):
    if random.random() < 0.5:
        cash -= bid          # a customer sells to us at our bid
        shares += 1
    else:
        cash += ask          # a customer buys from us at our ask
        shares -= 1

mid = (bid + ask) / 2
print("shares left over:", shares)
print("profit:", round(cash + shares * mid, 2))`),
    read("Why it was always $20", [
      "Every trade happens 2 cents away from the mid, in your favor. A thousand trades at 2 cents each is $20, however the customers arrive.",
      "So where is the risk? In the leftover shares. The simulation valued them at a mid that never moved. Real prices move." ]),
    py("Inventory risk", ["Suppose you end the day holding 40 shares, and overnight the mid drops from $20.00 to $19.50."],
      ["Set `change` to how much the value of your leftover shares changed."], `
shares = 40
old_mid = 20.00
new_mid = 19.50

# Set change here

print(change)`, `
shares = 40
old_mid = 20.00
new_mid = 19.50

change = shares * (new_mid - old_mid)

print(change)`,
      [src(String.raw`change\s*=.*shares`, "Work it out from the shares variable."), out(String.raw`^-20\.0\s*$`, "The value should change by -20.0: 40 shares each lost 50 cents.")],
      "change = shares * (new_mid - old_mid)"),
    mc("That one move wiped out the whole day's $20. A trader who knows bad news is coming sells you a large amount just before the price drops. What should a market maker learn from this?", [
      "Stop trading altogether", "Some customers know more than you, so the spread must be wide enough to cover them", "Always hold as many shares as possible"], 1,
      "This is called adverse selection. Market makers lose to informed traders and earn from everyone else, and setting the spread is about balancing the two."),
  ]),

  lesson("long-and-short", "Long, short and profit", "Making money when prices rise, and when they fall.", [
    read("Going long", [
      "To be **long** is to own something. You profit if the price rises and lose if it falls.",
      "Your profit or loss is called **P&L**. For a long position it is the number of shares times the change in price." ]),
    num("You are long 200 shares bought at $30.00. The price rises to $33.50. What is your P&L, in dollars?", 700, "200 × ($33.50 − $30.00) = $700.", { prefix: "$" }),
    read("Going short", [
      "You can also profit from a falling price. To go **short**, you borrow shares and sell them now. Later you buy them back and return them.",
      "If the price fell in between, you bought back for less than you sold for, and you keep the difference. If it rose, you lose." ]),
    num("You short 100 shares at $50 and later buy them back at $44. What is your profit, in dollars?", 600, "You sold at $50 and bought at $44: $6 a share on 100 shares is $600.", { prefix: "$" }),
    py("One formula for both", ["Quants write a short position as a negative number of shares. Then one formula covers long and short."],
      ["Make `pnl` return the number of shares times the change in price."], `
def pnl(shares, entry, exit):
    # Replace the next line
    pass

print(pnl(200, 30.00, 33.50))    # long 200
print(pnl(-100, 50, 44))         # short 100`, `
def pnl(shares, entry, exit):
    return shares * (exit - entry)

print(pnl(200, 30.00, 33.50))    # long 200
print(pnl(-100, 50, 44))         # short 100`,
      [src("return", "Use return to hand back the answer."), out(String.raw`^700\.0\s*$`, "The long position should make 700.0."), out(String.raw`^600(\.0)?\s*$`, "The short position should make 600. Check the order: exit minus entry.")],
      "return shares * (exit - entry)"),
    mc("Which position can lose more than the money you put in?", ["Long, because the price can fall to zero", "Short, because there is no limit to how high a price can rise", "Neither"], 1,
      "A long position can lose at most what you paid. A short position loses more with every dollar the price climbs, and there is no ceiling."),
  ]),

  lesson("returns", "Returns", "Measuring gains in percent, and the surprise of compounding.", [
    read("Percent, not dollars", [
      "Making $10 on a $100 stock is very different from making $10 on a $10,000 stock. So quants measure **returns**: the change as a fraction of where you started.",
      "A stock that goes from $100 to $110 has a return of 0.10, or 10%." ],
      "return  =  (end price − start price) ÷ start price"),
    num("A stock goes from $80 to $92. What is its return, as a decimal?", 0.15, "($92 − $80) ÷ $80 = 0.15, or 15%."),
    num("A $100 stock rises 10%, then falls 10%. What is the overall return, as a decimal?", -0.01,
      "It rises to $110, then loses 10% of $110, which is $11, ending at $99. Overall: −0.01. Gains and losses of the same percent do not cancel."),
    py("Returns from a list of prices", ["`prices[i]` is the price on day i, and `prices[i - 1]` is the day before."],
      ["Inside the loop, append the return from day i − 1 to day i."], `
prices = [100, 102, 99, 105]
returns = []

for i in range(1, len(prices)):
    # Append the day's return here
    pass

print([round(r, 4) for r in returns])`, `
prices = [100, 102, 99, 105]
returns = []

for i in range(1, len(prices)):
    returns.append(prices[i] / prices[i - 1] - 1)

print([round(r, 4) for r in returns])`,
      [src(String.raw`append\(`, "Use returns.append( ) inside the loop."), out(String.raw`\[0\.02, -0\.0294, 0\.0606\]`, "The output should be [0.02, -0.0294, 0.0606].")],
      "returns.append(prices[i] / prices[i - 1] - 1)"),
    py("Compounding", ["When gains are left invested, each year's return is earned on a bigger amount. This is **compounding**."],
      ["Grow `value` by 7% a year for 10 years using a loop."], `
value = 1000

# Your loop here

print(round(value, 2))`, `
value = 1000

for year in range(10):
    value = value * 1.07

print(round(value, 2))`,
      [src(String.raw`for\s+\w+\s+in\s+range`, "Use a for loop over range(10)."), out(String.raw`^1967\.15\s*$`, "After 10 years the value should be 1967.15.")],
      "for year in range(10):\n    value = value * 1.07"),
    mc("A stock falls 50%. What return does it need to get back to where it started?", ["50%", "75%", "100%"], 2,
      "From $100 it falls to $50. Getting back to $100 means doubling, a return of 100%. Big losses are much harder to recover from than they look."),
  ]),

  lesson("arbitrage", "Arbitrage", "When the same thing has two prices at once.", [
    read("A free lunch, briefly", [
      "Sometimes the same stock trades on two exchanges at slightly different prices. If you can buy on the cheaper one and sell on the dearer one at the same moment, you lock in a profit with no risk.",
      "This is **arbitrage**. It is as close to free money as markets get, which is exactly why it rarely lasts more than a moment." ]),
    num("A stock can be bought at $10.00 on one exchange and sold at $10.03 on another. You do both at once with 100 shares. What is your profit, in dollars?", 3, "100 × $0.03 = $3, with no risk.", { prefix: "$" }),
    py("Scan three exchanges", ["An arbitrage exists when the highest bid anywhere is above the lowest ask anywhere."],
      ["Inside the loop, keep the highest bid seen in `best_bid` and the lowest ask seen in `best_ask`."], `
quotes = {
    "Exchange A": (10.01, 10.03),   # (bid, ask)
    "Exchange B": (10.05, 10.07),
    "Exchange C": (10.00, 10.02),
}

best_bid = 0
best_ask = 999

for name, (bid, ask) in quotes.items():
    # Update best_bid and best_ask here
    pass

print(round(best_bid - best_ask, 2))`, `
quotes = {
    "Exchange A": (10.01, 10.03),   # (bid, ask)
    "Exchange B": (10.05, 10.07),
    "Exchange C": (10.00, 10.02),
}

best_bid = 0
best_ask = 999

for name, (bid, ask) in quotes.items():
    best_bid = max(best_bid, bid)
    best_ask = min(best_ask, ask)

print(round(best_bid - best_ask, 2))`,
      [out(String.raw`^0\.03\s*$`, "The gap should be 0.03: buy on Exchange C at 10.02 and sell on Exchange B at 10.05.")],
      "best_bid = max(best_bid, bid)\nbest_ask = min(best_ask, ask)"),
    mc("Why do arbitrage gaps close so quickly?", ["Exchanges ban them", "Traders buying the cheap one push its price up, and selling the dear one push its price down", "The government fixes prices"], 1,
      "The act of taking the arbitrage removes it. Firms compete to be first, which is one reason speed matters so much in trading."),
    read("The idea behind all pricing", [
      "Because arbitrage gets taken so fast, quants assume that in a working market it should not exist. This **no-arbitrage** rule sounds modest, but it is powerful.",
      "If two things always pay the same amount, they must cost the same today. You will use exactly that argument to price an option in the next track." ]),
  ]),

  lesson("beating-the-market", "Can you beat the market?", "Edge, costs, and how luck can look like skill.", [
    read("Edge", [
      "Prices already reflect what most people know. To profit reliably you need an **edge**: something that makes your trades right slightly more often, or by slightly more, than chance.",
      "Edges are small. A good one might earn a cent or two per share. And every trade has costs: the spread, fees, and slippage." ]),
    num("Your strategy earns an average of $0.02 per share before costs. Trading costs you $0.03 per share. What is your average profit per share, in dollars?", -0.01,
      "$0.02 − $0.03 = −$0.01. An edge smaller than your costs is a reliable way to lose money.", { tol: 0.001, prefix: "$" }),
    py("A thousand lucky guessers", [
      "Imagine 1,000 people who each guess, by flipping a coin, whether the market goes up or down each week for 10 weeks. None of them has any skill.",
      "How many will be right all 10 times?" ],
      ["After the inner loop, add 1 to `perfect` if this picker was right all 10 weeks."], `
import random

perfect = 0

for picker in range(1000):
    right = 0
    for week in range(10):
        if random.random() < 0.5:
            right += 1
    # Count this picker if right is 10

print(perfect)`, `
import random

perfect = 0

for picker in range(1000):
    right = 0
    for week in range(10):
        if random.random() < 0.5:
            right += 1
    if right == 10:
        perfect += 1

print(perfect)`,
      [src(String.raw`if\s+right\s*==\s*10`, "Add: if right == 10: then increase perfect."), src(String.raw`perfect\s*(\+=\s*1|=\s*perfect\s*\+\s*1)`, "Add 1 to perfect when a picker is right all 10 weeks."), between(0, 9, "The count should be small, usually 0 to 3.")],
      "if right == 10:\n    perfect += 1"),
    mc("Run it a few times and you will often see one or two perfect records out of 1,000. Those people look like geniuses. What is the lesson?", [
      "Coin flipping is a good strategy", "With enough people trying, some will have great records by luck alone", "The simulation is broken"], 1,
      "This is survivorship bias: we notice the winners and forget the 999 who dropped out. Quants ask whether a track record is longer than luck could explain."),
    mc("Which of these is NOT a real source of edge for a quant firm?", ["Faster systems", "Better models of how prices behave", "Data that others do not have or have not studied", "A strong feeling that a stock is due to go up"], 3,
      "Speed, models and data can all be tested. A feeling cannot, and the market does not care what anyone thinks is due."),
  ]),

  quiz([
    num("The best bid is $25.10 and the best ask is $25.16. What is the mid price, in dollars?", 25.13, "Halfway between: ($25.10 + $25.16) ÷ 2 = $25.13.", { tol: 0.001, prefix: "$" }),
    mc("Which order guarantees your price but not that you will trade?", ["A market order", "A limit order", "Both", "Neither"], 1, "A limit order names the price and waits. A market order trades now at whatever is available."),
    num("You short 50 shares at $20 and buy them back at $23. What is your P&L, in dollars?", -150, "The price rose $3 against you on 50 shares: −$150.", { prefix: "$" }),
    num("A stock rises 20%, then falls 20%. What is the overall return, as a decimal?", -0.04, "1.20 × 0.80 = 0.96, so the overall return is −0.04."),
    mc("What does a market maker mainly earn?", ["A fee from the exchange", "The spread between its bid and its ask", "Dividends on shares it holds", "Interest on customers' money"], 1,
      "It buys at its bid and sells at its ask, and the gap is its income for taking the risk of holding inventory."),
  ]),
];
