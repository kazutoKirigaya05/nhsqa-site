import type { Lesson } from "./types";
import { lesson, mc, num, out, py, quiz, read, src, tryPy } from "./helpers";

const PRICE_FN = `def bond_price(face, coupon_rate, market_rate, years):
    price = 0
    for t in range(1, years + 1):
        price += face * coupon_rate / (1 + market_rate) ** t
    price += face / (1 + market_rate) ** years
    return price`;

export const bonds: Lesson[] = [
  lesson("time-value-of-money", "The time value of money", "Why a dollar today is worth more than a dollar next year.", [
    read("Money can grow", [
      "Would you rather have $100 today or $100 a year from now? Today, because you could put it in a bank and have more than $100 in a year.",
      "This is the **time value of money**, and all of finance is built on it. To compare money at different times, you have to move it to the same point in time using an interest rate.",
      "Moving money forward is called finding its **future value**." ],
      "future value  =  amount today × (1 + rate)ⁿ      for n years"),
    num("You put $1,000 in an account paying 5% a year. What is it worth after 3 years, in dollars? (Nearest cent.)", 1000 * 1.05 ** 3, "$1,000 × 1.05 × 1.05 × 1.05 = $1,157.63.", { tol: 0.011, prefix: "$" }),
    py("A future value function", ["`**` is Python's power operator."],
      ["Make `future_value` return the amount multiplied by (1 + rate) to the power of years."], `
def future_value(amount, rate, years):
    # Replace the next line
    pass

print(round(future_value(1000, 0.05, 3), 2))
print(round(future_value(500, 0.04, 10), 2))`, `
def future_value(amount, rate, years):
    return amount * (1 + rate) ** years

print(round(future_value(1000, 0.05, 3), 2))
print(round(future_value(500, 0.04, 10), 2))`,
      [out(String.raw`^1157\.63\s*$`, "The first answer should be 1157.63."), out(String.raw`^740\.12\s*$`, "The second answer should be 740.12.")], "return amount * (1 + rate) ** years"),
    mc("Interest rates rise from 2% to 6%. What happens to the value of having money today instead of later?", ["It matters less", "It matters more", "No change"], 1,
      "The higher the rate, the more a dollar today can grow, so the bigger the gap between money now and money later."),
  ]),

  lesson("present-value", "Present value", "What future money is worth today.", [
    read("Running the clock backwards", [
      "Future value moves money forward in time. **Present value** moves it back: what would you need today to end up with a given amount later?",
      "You divide instead of multiply. This is called **discounting**, and the rate used is the **discount rate**.",
      "Present value is the single most used calculation in finance. The price of a bond, a stock or a whole company is the present value of the money it is expected to pay." ],
      "present value  =  future amount ÷ (1 + rate)ⁿ"),
    num("Someone promises you $1,000 in exactly one year. The interest rate is 5%. What is that promise worth today, in dollars? (Nearest cent.)", 1000 / 1.05, "$1,000 ÷ 1.05 = $952.38. Put $952.38 in the bank at 5% and you would have $1,000 in a year.", { tol: 0.011, prefix: "$" }),
    py("A present value function", ["The mirror image of future value."],
      ["Make `present_value` return the amount divided by (1 + rate) to the power of years."], `
def present_value(amount, rate, years):
    # Replace the next line
    pass

print(round(present_value(1000, 0.05, 5), 2))`, `
def present_value(amount, rate, years):
    return amount / (1 + rate) ** years

print(round(present_value(1000, 0.05, 5), 2))`,
      [out(String.raw`^783\.53\s*$`, "$1,000 in 5 years at 5% is worth 783.53 today.")], "return amount / (1 + rate) ** years"),
    tryPy("The further away, the less it is worth", ["The present value of $1,000 received at different times, at a 5% rate."],
      ["Run it. Then change the rate to 0.10 and see how much faster the value melts."], `
rate = 0.05

for years in [0, 1, 5, 10, 20, 30, 50]:
    print(years, "years:", round(1000 / (1 + rate) ** years, 2))`),
    mc("Two companies will each pay you $1 million. Company A pays in 2 years, Company B in 20 years. Which promise is worth more today?", ["A", "B", "They are worth the same"], 0,
      "The same amount sooner is always worth more. Much of what makes one investment worth more than another is simply when the money arrives."),
  ]),

  lesson("what-is-a-bond", "What is a bond?", "A loan you can buy and sell.", [
    read("Lending, packaged", [
      "When a government or company wants to borrow, it sells **bonds**. A bond is a promise to pay interest on a schedule and to repay the loan at the end.",
      "Three numbers define it. The **face value** is the amount repaid at the end, often $1,000. The **coupon** is the yearly interest, as a percent of the face value. The **maturity** is when the loan ends.",
      "The bond market is bigger than the stock market, and it is where interest rates are set." ]),
    num("A bond has a face value of $1,000 and a 4% coupon. How much interest does it pay each year, in dollars?", 40, "4% of $1,000 is $40 a year.", { prefix: "$" }),
    py("List the payments", ["A 3-year bond with a $1,000 face value and a 5% coupon pays a coupon each year, plus the face value at the end."],
      ["Inside the loop, append the coupon for each year. For the final year, append the coupon plus the face value."], `
face = 1000
coupon_rate = 0.05
years = 3
payments = []

for year in range(1, years + 1):
    # Append this year's payment
    pass

print(payments)`, `
face = 1000
coupon_rate = 0.05
years = 3
payments = []

for year in range(1, years + 1):
    if year == years:
        payments.append(face * coupon_rate + face)
    else:
        payments.append(face * coupon_rate)

print(payments)`,
      [out(String.raw`^\[50\.0, 50\.0, 1050\.0\]\s*$`, "The payments should be [50.0, 50.0, 1050.0].")], "if year == years:\n    payments.append(face * coupon_rate + face)\nelse:\n    payments.append(face * coupon_rate)"),
    mc("What is the main risk in lending to a shaky company by buying its bond?", ["The company might do too well", "The company might fail to pay you back", "The coupon might rise"], 1,
      "This is credit risk, or default risk. Riskier borrowers must offer higher coupons to persuade anyone to lend, which is why rates differ so much between borrowers."),
    mc("If you own a company's bond and the company's profits triple, what extra do you get?", ["Triple the coupon", "Nothing extra: you get the promised payments and no more", "A share of the profit"], 1,
      "Bondholders are lenders, not owners. Their upside is capped at what was promised. Shareholders get the upside, and take more of the risk."),
  ]),

  lesson("pricing-a-bond", "Pricing a bond", "A bond is worth the present value of its payments.", [
    read("Add up the discounted payments", [
      "A bond is a list of future payments. Its price is what those payments are worth today: discount each one back to the present at the market interest rate, and add them up.",
      "The coupon is fixed when the bond is issued. The market rate changes every day. That is why a bond's price moves." ]),
    py("A bond pricing function", ["The loop handles the coupons. The face value comes back at the end and must be discounted too."],
      ["After the loop, add the present value of the face value to `price`."], `
def bond_price(face, coupon_rate, market_rate, years):
    price = 0
    for t in range(1, years + 1):
        price += face * coupon_rate / (1 + market_rate) ** t
    # Add the discounted face value here
    return price

print(round(bond_price(1000, 0.05, 0.05, 3), 2))
print(round(bond_price(1000, 0.05, 0.06, 3), 2))`, `
${PRICE_FN}

print(round(bond_price(1000, 0.05, 0.05, 3), 2))
print(round(bond_price(1000, 0.05, 0.06, 3), 2))`,
      [out(String.raw`^1000\.0\s*$`, "When the market rate equals the coupon, the price should be 1000.0."), out(String.raw`^973\.27\s*$`, "At a 6% market rate the price should be 973.27.")], "price += face / (1 + market_rate) ** years"),
    mc("In that example the market rate rose from 5% to 6%, and the bond's price fell from $1,000 to $973.27. Why?", ["The bond pays less now", "New bonds now pay 6%, so nobody will pay full price for one that pays only 5%", "The company is in trouble"], 1,
      "The bond's payments have not changed. What changed is what else you could buy. Its price drops until its return matches the new 6%."),
    tryPy("The seesaw", ["Price the same bond across a range of market rates."],
      ["Run it and read down the column: as rates go up, the price goes down."], `
${PRICE_FN}

for rate in [0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08]:
    print(str(round(rate * 100)) + "%", round(bond_price(1000, 0.05, rate, 3), 2))`),
    mc("You own bonds, and the central bank unexpectedly raises interest rates. What happens to the value of your bonds?", ["It rises", "It falls", "No effect"], 1,
      "Bond prices and interest rates move in opposite directions. This one relationship drives a huge share of all trading in the world."),
  ]),

  lesson("yield", "Yield", "The return a bond offers at today's price.", [
    read("The rate hidden in the price", [
      "In the market you do not see a bond's discount rate. You see its price. The **yield** is the rate that would make the present value of the bond's payments equal to that price.",
      "It answers the investor's real question: if I pay this price and hold the bond to the end, what return am I getting? When a bond's price falls, its yield rises." ]),
    num("A bond pays a $50 coupon each year and costs $950 today. A quick measure, called the current yield, is the coupon divided by the price. What is it, as a decimal? (Four decimal places.)", 50 / 950,
      "50 ÷ 950 = 0.0526, or 5.26%. That is higher than the 5% coupon, because you paid less than face value.", { tol: 0.0006 }),
    py("Solve for the true yield", [
      "The true yield also counts the gain from getting $1,000 back on a bond you bought for $950. There is no formula for it, so we search.",
      "Try every rate from 0.01% upwards and stop at the first one where the price drops to $950 or below." ],
      ["Inside the loop, when `bond_price(...)` at this rate is 950 or less, store the rate in `answer` and `break`."], `
${PRICE_FN}

answer = None

for step in range(1, 2000):
    rate = step / 10000
    # Stop at the first rate whose price is 950 or less
    pass

print(answer)`, `
${PRICE_FN}

answer = None

for step in range(1, 2000):
    rate = step / 10000
    if bond_price(1000, 0.05, rate, 3) <= 950:
        answer = rate
        break

print(answer)`,
      [src("break", "Use break to stop the loop once you find the rate."), out(String.raw`^0\.069\d?\s*$`, "The yield should be about 0.069, or 6.9%.")], "if bond_price(1000, 0.05, rate, 3) <= 950:\n    answer = rate\n    break"),
    mc("A bond's price jumps after good news about the company. What happens to its yield?", ["It rises", "It falls", "It stays the same"], 1,
      "A higher price for the same payments means a lower return for a new buyer. Price up, yield down. Traders often quote bonds by yield instead of price."),
    mc("Two 5-year bonds: a government bond yields 4% and a company bond yields 7%. What is the extra 3% paying for?", ["Nothing, it is free money", "The risk that the company fails to pay", "Higher trading fees"], 1,
      "The gap is called the credit spread. It is the market's price for default risk, and it widens sharply when investors get nervous."),
  ]),

  lesson("duration", "Interest rate risk", "Why long bonds swing more than short ones.", [
    read("Not all bonds react the same", [
      "When rates rise, every bond's price falls. But a bond that pays back in 30 years falls far more than one that pays back next year.",
      "The reason is discounting. A payment far in the future is divided by (1 + rate) many times over, so a small change in the rate is magnified." ]),
    py("Short against long", ["Compare two simple bonds that each make a single payment of $1,000: one in 2 years, one in 10 years. Rates rise from 4% to 5%."],
      ["Set `short_change` and `long_change` to the percentage change in each bond's price: new price divided by old price, minus 1."], `
def pv(amount, rate, years):
    return amount / (1 + rate) ** years

# Set short_change (2 years) and long_change (10 years)

print(round(short_change, 4), round(long_change, 4))`, `
def pv(amount, rate, years):
    return amount / (1 + rate) ** years

short_change = pv(1000, 0.05, 2) / pv(1000, 0.04, 2) - 1
long_change = pv(1000, 0.05, 10) / pv(1000, 0.04, 10) - 1

print(round(short_change, 4), round(long_change, 4))`,
      [out(String.raw`^-0\.019 -0\.0913\s*$`, "The output should be: -0.019 -0.0913")], "short_change = pv(1000, 0.05, 2) / pv(1000, 0.04, 2) - 1\nlong_change = pv(1000, 0.05, 10) / pv(1000, 0.04, 10) - 1"),
    read("Duration", [
      "The 2-year bond lost about 2% and the 10-year bond about 9%. A rough rule: for each 1 point rise in rates, a bond loses about as many percent as its **duration**, which for these simple bonds is close to the years until payment.",
      "Duration is the bond trader's main risk number, in the way delta is for an options trader." ]),
    num("A bond has a duration of 7. Rates rise by 1 percentage point. Roughly what percent of its value does it lose?", 7, "About 7%. Duration is the percent price change for a 1 point move in rates."),
    mc("You expect interest rates to fall sharply. Which bonds would gain the most?", ["Short-term bonds", "Long-term bonds", "They gain equally"], 1,
      "Long bonds have the highest duration, so they move most in both directions. Choosing duration is how bond investors express a view on rates."),
  ]),

  lesson("the-yield-curve", "The yield curve", "One chart that economists watch more than any other.", [
    read("Yields at every maturity", [
      "A government borrows for many different lengths of time: 3 months, 2 years, 10 years, 30 years. Plot the yield at each maturity and you get the **yield curve**.",
      "Usually it slopes upward. Lending for longer means more can go wrong, so lenders want a higher rate." ]),
    tryPy("Draw two curves", ["One normal curve and one upside-down, drawn as text."],
      ["Run it and compare the two shapes."], `
normal = {"3 months": 3.0, "2 years": 3.4, "5 years": 3.8, "10 years": 4.2, "30 years": 4.6}
inverted = {"3 months": 5.3, "2 years": 4.8, "5 years": 4.3, "10 years": 4.1, "30 years": 4.2}

for name, curve in [("NORMAL", normal), ("INVERTED", inverted)]:
    print(name)
    for maturity, y in curve.items():
        print(" ", maturity.ljust(9), "#" * round(y * 6), y)`),
    mc("When short-term yields are higher than long-term yields, the curve is called:", ["Steep", "Flat", "Inverted"], 2,
      "An inverted curve is unusual. It means investors expect rates to fall in the future, usually because they expect the economy to weaken."),
    mc("Why do investors pay so much attention to an inverted yield curve?", ["It has often appeared before recessions", "It makes bonds illegal to trade", "It only happens in leap years"], 0,
      "In the United States, inversions have come before most recessions of recent decades. It is not a perfect signal, and the delay has varied from months to a couple of years."),
    mc("A bank borrows short term from savers and lends long term to home buyers. Which curve shape is best for its profits?", ["Upward sloping", "Flat", "Inverted"], 0,
      "It pays the low short rate and earns the higher long rate. When the curve inverts, that business gets squeezed, which is one reason inversions matter to the real economy."),
  ]),

  lesson("central-banks", "Central banks and markets", "How one interest rate reaches every price.", [
    read("The rate behind all rates", [
      "Each major economy has a **central bank**. In the United States it is the Federal Reserve. Its main tool is a very short-term interest rate, which it raises to slow inflation and lowers to support a weak economy.",
      "That rate feeds into everything: mortgages, company borrowing, bond yields, and the discount rate used to value stocks." ]),
    py("Rates and the value of the future", ["A fast-growing company is expected to pay investors $100 in 10 years. What is that worth today at different interest rates?"],
      ["Print the present value of $100 in 10 years at a rate of 2%, then at 5%, each rounded to 2 decimal places."], `
def pv(amount, rate, years):
    return amount / (1 + rate) ** years

`, `
def pv(amount, rate, years):
    return amount / (1 + rate) ** years

print(round(pv(100, 0.02, 10), 2))
print(round(pv(100, 0.05, 10), 2))`,
      [out(String.raw`^82\.03\s*$`, "At 2% the value should be 82.03."), out(String.raw`^61\.39\s*$`, "At 5% the value should be 61.39.")], "print(round(pv(100, 0.02, 10), 2))\nprint(round(pv(100, 0.05, 10), 2))"),
    mc("Rates rose from 2% to 5%, and the value of that distant $100 fell by about a quarter. Which companies are hit hardest by rising rates?", ["Those whose profits are expected far in the future", "Those paying large profits today", "All equally"], 0,
      "Distant money is discounted the most. This is why fast-growing technology companies often fall hardest when interest rates rise."),
    mc("The central bank is expected to cut rates by 0.25 points, and it does exactly that. What usually happens to markets?", ["A huge rally", "Very little, because the cut was already in prices", "A crash"], 1,
      "Markets move on surprises. Traders spend a great deal of effort estimating what is already expected, so they can judge what would count as a surprise."),
    mc("Inflation is running well above target. What is a central bank most likely to do?", ["Lower rates", "Raise rates", "Print bonds"], 1,
      "Higher rates make borrowing dearer, which cools spending and slows price rises. The cost is usually slower growth, which is the trade-off central banks manage."),
  ]),

  quiz([
    num("What is $2,000 worth in 2 years at 10% interest, in dollars?", 2420, "$2,000 × 1.1 × 1.1 = $2,420.", { prefix: "$" }),
    num("What is the present value of $1,100 received in one year, at a 10% rate, in dollars?", 1000, "$1,100 ÷ 1.1 = $1,000.", { prefix: "$" }),
    mc("Interest rates fall. What happens to the prices of existing bonds?", ["They rise", "They fall", "Nothing"], 0, "Prices and rates move in opposite directions."),
    mc("Which bond is more sensitive to a change in interest rates?", ["A 1-year bond", "A 20-year bond", "They are the same"], 1, "Longer maturity means higher duration and bigger price moves."),
    mc("What does an inverted yield curve mean?", ["Long-term yields are above short-term yields", "Short-term yields are above long-term yields", "All yields are zero"], 1, "It often signals that investors expect a weaker economy."),
  ]),
];
