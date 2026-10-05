import type { Lesson } from "./types";
import { between, lesson, mc, num, out, py, quiz, read, src, tryPy } from "./helpers";

export const options: Lesson[] = [
  lesson("what-is-an-option", "What is an option?", "A contract that gives you a choice, and why a choice is worth money.", [
    read("The right, but not the duty", [
      "A **call option** is a contract that gives you the right to buy a stock at a fixed price, called the **strike**, on a set date, called the **expiry**. You do not have to. If buying would lose you money, you walk away.",
      "Because a choice can only help you, it is worth something. The price you pay for an option is called the **premium**.",
      "Working out what that premium should be is one of the classic jobs of a quant." ]),
    mc("You hold a call with a strike of $100. At expiry the stock is at $90. What do you do?", ["Buy at $100 anyway, because you have to", "Nothing. Buying at $100 when the market price is $90 would lose money", "Sell the stock at $100"], 1,
      "An option is a right, not an obligation. Here it expires worthless and you lose only the premium you paid."),
    read("The payoff", [
      "At expiry a call is worth the stock price minus the strike, if that is positive. Otherwise it is worth zero.",
      "With a strike of $100: if the stock ends at $112 you can buy at $100 and sell at $112, so the call pays $12. If the stock ends at $95, it pays $0." ],
      "call payoff  =  the larger of (stock price − strike) and 0"),
    num("A call has a strike of $50. The stock ends at $57. What is the payoff, in dollars?", 7, "$57 − $50 = $7.", { prefix: "$" }),
    num("A call has a strike of $50. The stock ends at $41. What is the payoff, in dollars?", 0, "The stock is below the strike, so you would not use the option. It pays $0.", { prefix: "$" }),
    mc("You pay a $3 premium for a call. What is the most you can lose?", ["$3", "The strike price", "There is no limit"], 0,
      "The worst case is that the option expires worthless. You lose what you paid and nothing more. That limited downside is a big part of why people buy options."),
  ]),

  lesson("payoffs-in-code", "Payoffs in code", "Turn the payoff rule into a function and see its shape.", [
    py("A call payoff function", ["Python's `max(a, b)` returns the larger of two values, which is exactly what a payoff needs."],
      ["Make `call_payoff` return the larger of `stock - strike` and 0."], `
def call_payoff(stock, strike):
    # Replace the next line
    pass

print(call_payoff(112, 100))
print(call_payoff(95, 100))`, `
def call_payoff(stock, strike):
    return max(stock - strike, 0)

print(call_payoff(112, 100))
print(call_payoff(95, 100))`,
      [src(String.raw`max\(`, "Use max( ) to choose the larger of the two values."), out(String.raw`^12\s*$`, "With the stock at 112 the payoff should be 12."), out(String.raw`^0\s*$`, "With the stock at 95 the payoff should be 0.")],
      "return max(stock - strike, 0)"),
    tryPy("The hockey stick", ["This prints the payoff of a call with a strike of 100 for a range of final stock prices, with a bar to show the size."],
      ["Run it. Then change the strike to 90 or 110 and run it again to see the bend move."], `
def call_payoff(stock, strike):
    return max(stock - strike, 0)

strike = 100

for stock in range(70, 135, 5):
    payoff = call_payoff(stock, strike)
    print(stock, "#" * payoff, payoff)`),
    read("Payoff is not profit", [
      "You paid a premium to own the option, so your **profit** is the payoff minus the premium.",
      "With a strike of $100 and a premium of $5, the stock must end above $105 before you actually make money. That price is the **breakeven**." ]),
    num("A call has a strike of $40 and costs $2.50. What is the breakeven stock price, in dollars?", 42.5, "Strike plus premium: $40 + $2.50 = $42.50.", { prefix: "$" }),
    py("Profit", ["Build profit on top of the payoff function."],
      ["Make `call_profit` return the payoff minus the premium."], `
def call_payoff(stock, strike):
    return max(stock - strike, 0)

def call_profit(stock, strike, premium):
    # Replace the next line
    pass

print(call_profit(112, 100, 5))
print(call_profit(95, 100, 5))`, `
def call_payoff(stock, strike):
    return max(stock - strike, 0)

def call_profit(stock, strike, premium):
    return call_payoff(stock, strike) - premium

print(call_profit(112, 100, 5))
print(call_profit(95, 100, 5))`,
      [out(String.raw`^7\s*$`, "With the stock at 112 the profit should be 7."), out(String.raw`^-5\s*$`, "With the stock at 95 you lose the premium: -5.")],
      "return call_payoff(stock, strike) - premium"),
  ]),

  lesson("puts", "Puts", "The option that pays when prices fall.", [
    read("The right to sell", [
      "A **put option** is the mirror image of a call. It gives you the right to sell a stock at the strike.",
      "A put is valuable when the stock ends below the strike: you can sell at the strike something that is worth less." ],
      "put payoff  =  the larger of (strike − stock price) and 0"),
    num("A put has a strike of $50. The stock ends at $42. What is the payoff, in dollars?", 8, "$50 − $42 = $8.", { prefix: "$" }),
    py("A put payoff function", ["Same shape as the call, flipped."],
      ["Make `put_payoff` return the larger of `strike - stock` and 0."], `
def put_payoff(stock, strike):
    # Replace the next line
    pass

print(put_payoff(42, 50))
print(put_payoff(61, 50))`, `
def put_payoff(stock, strike):
    return max(strike - stock, 0)

print(put_payoff(42, 50))
print(put_payoff(61, 50))`,
      [out(String.raw`^8\s*$`, "With the stock at 42 the put should pay 8."), out(String.raw`^0\s*$`, "With the stock at 61 the put should pay 0.")],
      "return max(strike - stock, 0)"),
    read("Insurance", [
      "Suppose you own a stock at $50 and worry it might crash. You buy a put with a strike of $50 for $2.",
      "Now however far the stock falls, you can still sell at $50. The put works like an insurance policy, and the premium is what the insurance costs." ]),
    num("You own a share worth $50 and a put with a strike of $50 that cost you $2. The stock crashes to $30. Counting the premium, what is your total loss per share, in dollars?", 2,
      "The share lost $20, but the put pays $20. All you are out is the $2 premium.", { prefix: "$" }),
    mc("Why might someone who owns a stock choose not to buy a put?", ["Puts are illegal for owners", "The premium is a certain cost, paid whether or not the crash comes", "Puts only pay when the stock rises"], 1,
      "Insurance is never free. Paying premiums month after month drags on returns, so it is a real trade-off."),
  ]),

  lesson("put-call-parity", "Put-call parity", "A rule that ties calls, puts and the stock together.", [
    read("Two ways to get the same thing", [
      "Take a call and a put on the same stock, with the same strike and the same expiry. Buy the call and sell the put.",
      "If the stock ends above the strike, your call pays stock minus strike. If it ends below, the put you sold costs you strike minus stock. Either way you end up with exactly **stock minus strike**.",
      "Owning the stock and owing the strike gives the same result. Two things with the same payoff must cost the same, or there would be an arbitrage. With interest rates ignored, that gives:" ],
      "call price − put price  =  stock price − strike"),
    num("A stock is at $100. A call with a strike of $100 costs $6. What must the put with the same strike cost, in dollars?", 6,
      "Stock minus strike is $0, so the call and the put must cost the same: $6.", { prefix: "$" }),
    num("A stock is at $105. A call with a strike of $100 costs $9. What must the put cost, in dollars?", 4,
      "Call − put must equal $105 − $100 = $5. So the put costs $9 − $5 = $4.", { prefix: "$" }),
    py("A mispricing detector", ["Traders scan for prices that break parity. The gap is how far out of line they are."],
      ["Make `parity_gap` return (call − put) minus (stock − strike)."], `
def parity_gap(call, put, stock, strike):
    # Replace the next line
    pass

print(parity_gap(9, 4, 105, 100))      # prices in line
print(parity_gap(9, 3, 105, 100))      # put too cheap`, `
def parity_gap(call, put, stock, strike):
    return (call - put) - (stock - strike)

print(parity_gap(9, 4, 105, 100))      # prices in line
print(parity_gap(9, 3, 105, 100))      # put too cheap`,
      [out(String.raw`^0\s*$`, "When prices are in line the gap should be 0."), out(String.raw`^1\s*$`, "With the put at 3 the gap should be 1.")],
      "return (call - put) - (stock - strike)"),
    mc("The gap is $1. What does that tell a trader?", ["Nothing, small gaps are normal", "There may be a risk-free profit of about $1 per share, before costs", "The stock is about to rise by $1"], 1,
      "Parity says nothing about where the stock is going. It says these prices are inconsistent with each other, and that can be traded whatever the stock does."),
  ]),

  lesson("pricing-by-expected-value", "A first price: expected payoff", "Use what you know about expected value to put a number on an option.", [
    read("What is a choice worth?", [
      "You already know how to value an uncertain payoff: multiply each outcome by its probability and add them up.",
      "Try it on an option. A stock is at $100 today. Suppose it will end at either $120 or $80, each with probability 0.5. A call with a strike of $100 pays $20 or $0.",
      "Its expected payoff is 0.5 × $20 + 0.5 × $0 = $10. That is a sensible first guess at its price." ]),
    num("A stock will end at $130 with probability 0.25, or at $90 with probability 0.75. What is the expected payoff of a call with a strike of $100, in dollars?", 7.5,
      "The call pays $30 a quarter of the time and nothing otherwise: 0.25 × $30 = $7.50.", { prefix: "$" }),
    py("Many scenarios", ["Real models use thousands of scenarios. The method is the same loop."],
      ["Inside the loop, add probability times payoff to `value`."], `
scenarios = [(80, 0.25), (100, 0.50), (120, 0.25)]   # (final price, probability)
strike = 100
value = 0

for price, prob in scenarios:
    # Add this scenario's share of the value
    pass

print(value)`, `
scenarios = [(80, 0.25), (100, 0.50), (120, 0.25)]   # (final price, probability)
strike = 100
value = 0

for price, prob in scenarios:
    value += prob * max(price - strike, 0)

print(value)`,
      [src(String.raw`max\(`, "Use max(price - strike, 0) for the payoff."), out(String.raw`^5\.0\s*$`, "The value should be 5.0: only the 120 scenario pays, 20 with probability 0.25.")],
      "value += prob * max(price - strike, 0)"),
    mc("In this model, what happens to the call's value if the stock becomes more volatile, ending at 140 or 60 instead of 120 or 80?", ["It falls", "It stays the same", "It rises"], 2,
      "The call now pays $40 half the time, so its expected payoff doubles to $20. Bigger swings help an option holder, because the downside is capped at zero. This is why options cost more when markets are nervous."),
    read("A warning", [
      "This method needs probabilities, and nobody knows the true probability that a stock goes up. Two traders with different guesses would get different prices.",
      "The next lesson shows the idea that made options pricing famous: a way to find the price without knowing the probabilities at all." ]),
  ]),

  lesson("the-binomial-model", "The binomial model", "Price an option by building a portfolio that cannot lose or win.", [
    read("Remove the risk", [
      "A stock is at $100 and will end at $120 or $80. A call with a strike of $100 pays $20 or $0.",
      "Suppose you **sell** one call and **buy** half a share. If the stock ends at $120, your half share is worth $60 and you owe $20 on the call: $40. If it ends at $80, your half share is worth $40 and you owe nothing: $40.",
      "You end with $40 either way. The risk is gone." ]),
    read("So what must the call cost?", [
      "A portfolio that is certain to be worth $40 later must be worth $40 today (we are ignoring interest). Anything else would be an arbitrage.",
      "Half a share costs $50 today. You received the call's price when you sold it. So $50 − call price = $40, and the call must cost **$10**.",
      "The half is called the **delta**. It is the spread of the option's payoffs divided by the spread of the stock's prices: (20 − 0) ÷ (120 − 80) = 0.5." ]),
    num("A stock will end at $130 or $90. A call with a strike of $100 pays $30 or $0. What is the delta?", 0.75, "(30 − 0) ÷ (130 − 90) = 30 ÷ 40 = 0.75."),
    py("A pricing function", [
      "The hedged portfolio is `delta` shares minus one call. In the down case it is worth `delta * down - payoff_down`, and it is worth the same in the up case.",
      "Today it costs `delta * stock` minus the call's price. Set those equal and solve for the call." ],
      ["Return the price the call must have today."], `
def binomial_call(stock, up, down, strike):
    payoff_up = max(up - strike, 0)
    payoff_down = max(down - strike, 0)
    delta = (payoff_up - payoff_down) / (up - down)
    safe_value = delta * down - payoff_down
    # Replace the next line
    pass

print(binomial_call(100, 120, 80, 100))
print(binomial_call(100, 130, 90, 100))`, `
def binomial_call(stock, up, down, strike):
    payoff_up = max(up - strike, 0)
    payoff_down = max(down - strike, 0)
    delta = (payoff_up - payoff_down) / (up - down)
    safe_value = delta * down - payoff_down
    return delta * stock - safe_value

print(binomial_call(100, 120, 80, 100))
print(binomial_call(100, 130, 90, 100))`,
      [out(String.raw`^10\.0\s*$`, "The first call should cost 10.0."), out(String.raw`^7\.5\s*$`, "The second call should cost 7.5: delta 0.75, safe value 67.5.")],
      "return delta * stock - safe_value"),
    mc("Look back at the method. Where did the probability of the stock going up appear?", ["In the delta", "In the safe value", "Nowhere"], 2,
      "It never appeared. Because the hedge removes the risk, the price does not depend on anyone's opinion of where the stock is going. That insight, extended to many small steps, is the heart of the Black-Scholes model that won a Nobel prize."),
  ]),

  lesson("monte-carlo", "Monte Carlo pricing", "When the math gets hard, simulate.", [
    read("Thousands of possible futures", [
      "Real stocks do not make one jump. They move a little every day. Quants handle that with **Monte Carlo** simulation: generate thousands of random price paths, work out the option's payoff on each, and take the average.",
      "The method is named after the casino. It works for options far too complicated to price with a formula." ]),
    tryPy("One random path", ["This stock starts at 100 and moves up or down by 2 each day for 20 days."],
      ["Run it a few times and watch where the path ends."], `
import random

price = 100
path = [price]

for day in range(20):
    price += random.choice([2, -2])
    path.append(price)

print(path)
print("ends at", price)`),
    py("Price a call by simulation", ["`end_price()` runs one path and returns where it ends. Average the payoff of a call with a strike of 100 over 10,000 paths."],
      ["Inside the loop, add the call's payoff for one simulated end price to `total`."], `
import random

def end_price():
    price = 100
    for day in range(20):
        price += random.choice([2, -2])
    return price

trials = 10000
total = 0

for t in range(trials):
    # Add one simulated payoff here
    pass

print(round(total / trials, 2))`, `
import random

def end_price():
    price = 100
    for day in range(20):
        price += random.choice([2, -2])
    return price

trials = 10000
total = 0

for t in range(trials):
    total += max(end_price() - 100, 0)

print(round(total / trials, 2))`,
      [src(String.raw`end_price\(\)`, "Call end_price() inside the loop to get one simulated ending price."), between(3.2, 3.85, "The average payoff should come out near 3.5. Use max(end_price() - 100, 0) as the payoff.")],
      "total += max(end_price() - 100, 0)"),
    mc("You run it twice and get 3.49, then 3.56. Why are the answers different?", ["There is a bug", "Each run uses different random paths, so the average wobbles a little", "The option's value changes every second"], 1,
      "A simulation gives an estimate, not an exact answer. The true value here is about 3.52."),
    mc("How do you make a Monte Carlo estimate more accurate?", ["Run more paths", "Run fewer paths", "Use a bigger strike"], 0,
      "More paths means less wobble. To cut the error in half you need about four times as many paths, which is why quants care about fast code."),
  ]),

  lesson("delta-and-hedging", "Delta and hedging", "How option traders stay neutral while the stock moves.", [
    read("Delta, again", [
      "In the binomial model, delta was the number of shares that cancels out the option's risk. It has a second meaning that traders use all day.",
      "**Delta** is how much an option's price changes when the stock moves by $1. A call with a delta of 0.5 gains about 50 cents when the stock rises $1." ]),
    num("A call has a delta of 0.6. The stock rises by $2. About how much does the call's price rise, in dollars?", 1.2, "0.6 × $2 = $1.20.", { prefix: "$" }),
    tryPy("Watch delta change", [
      "This values a 20-day call with a strike of 100 exactly, for several starting stock prices. It estimates delta by nudging the stock up and down by $1.",
      "Far below the strike the call barely reacts. Far above, it moves almost dollar for dollar with the stock." ],
      ["Run it and read down the delta column."], `
from math import comb

def call_value(stock, strike=100, days=20, step=2):
    total = 0
    for ups in range(days + 1):
        end = stock + step * (2 * ups - days)
        total += comb(days, ups) / 2**days * max(end - strike, 0)
    return total

print("stock  value  delta")
for stock in [80, 90, 100, 110, 120]:
    delta = (call_value(stock + 1) - call_value(stock - 1)) / 2
    print(stock, "  ", round(call_value(stock), 2), "  ", round(delta, 2))`),
    read("Delta hedging", [
      "A market maker who sells calls does not want to bet on the stock. So it buys delta shares for each share the option covers. If the stock rises, the shares gain what the calls lose.",
      "One option contract usually covers 100 shares. As the stock moves, delta changes, so the hedge has to be adjusted again and again." ]),
    py("Size the hedge", ["You have sold 10 call contracts, each covering 100 shares, with a delta of 0.4."],
      ["Set `hedge` to the number of shares you must buy to be delta neutral."], `
contracts = 10
shares_per_contract = 100
delta = 0.4

# Set hedge here

print(hedge)`, `
contracts = 10
shares_per_contract = 100
delta = 0.4

hedge = contracts * shares_per_contract * delta

print(hedge)`,
      [src(String.raw`hedge\s*=.*delta`, "Work it out from the variables, including delta."), out(String.raw`^400(\.0)?\s*$`, "You need 400 shares: 10 contracts × 100 shares × 0.4.")],
      "hedge = contracts * shares_per_contract * delta"),
    mc("After you hedge, the stock rises and the delta of your calls goes from 0.4 to 0.6. What do you do?", ["Nothing, you already hedged", "Buy more shares, because the hedge is now too small", "Sell all your shares"], 1,
      "You now need 600 shares, not 400. Keeping a hedge in line as delta moves is called dynamic hedging, and it is daily work on an options desk."),
  ]),

  quiz([
    num("A call has a strike of $75. The stock ends at $83. What is the payoff, in dollars?", 8, "$83 − $75 = $8.", { prefix: "$" }),
    num("A put has a strike of $40. The stock ends at $46. What is the payoff, in dollars?", 0, "The stock is above the strike, so the right to sell at $40 is worthless.", { prefix: "$" }),
    num("A stock is at $52. A call with a strike of $50 costs $5. By put-call parity, with interest ignored, what does the put cost, in dollars?", 3,
      "Call − put = stock − strike = $2, so the put costs $5 − $2 = $3.", { prefix: "$" }),
    mc("In the binomial model, why does the option's price not depend on the probability of the stock rising?", ["Because the probability is always 0.5", "Because the hedged portfolio is worth the same whichever way the stock moves", "Because options ignore the stock"], 1,
      "Once the risk is hedged away, opinions about direction no longer matter."),
    mc("What does a delta of 0.3 mean for a call?", ["It has a 3% chance of paying", "Its price moves about 30 cents for each $1 move in the stock", "It costs 30% of the stock price"], 1,
      "Delta is the option's sensitivity to the stock, and the number of shares that hedges it."),
  ]),
];
