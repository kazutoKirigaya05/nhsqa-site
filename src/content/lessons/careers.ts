import type { Lesson } from "./types";
import { lesson, mc, quiz, read } from "./helpers";

export const careers: Lesson[] = [
  lesson("kinds-of-firms", "Kinds of firms", "Who actually hires quants.", [
    read("Five places quants work", [
      "**Proprietary trading firms** trade the firm's own money, often as market makers. They are known for hard interviews, small teams and heavy use of technology.",
      "**Hedge funds** invest money for outside clients such as pension funds, using strategies that range from fully automated to driven by human judgment.",
      "**Investment banks** make markets for clients and build the models used to price complicated products.",
      "**Asset managers** run large, long-term portfolios, including index funds.",
      "**Exchanges and financial technology companies** build the systems everyone else trades on." ]),
    mc("A firm trades only its own money, quoting bids and asks on thousands of stocks all day. What kind of firm is it?", ["An asset manager", "A proprietary trading firm", "A pension fund"], 1,
      "Trading its own capital, and earning from the spread, marks it as a proprietary market maker."),
    mc("A firm manages retirement savings for millions of people, mostly in low-cost funds that track an index. What kind of firm is it?", ["A hedge fund", "An asset manager", "A proprietary trading firm"], 1,
      "Large pools of long-term money, run cheaply, are the business of asset managers. They employ quants too, for portfolio construction and risk."),
    mc("What do all these employers have in common in what they look for?", ["A finance degree", "Strong math, programming and clear thinking under pressure", "Family connections"], 1,
      "Many quants studied math, physics, computer science or engineering, and learned the finance on the job. The skills matter far more than the subject on the diploma."),
  ]),

  lesson("the-roles-up-close", "The roles, up close", "What the three main jobs are like day to day.", [
    read("A researcher's day", [
      "A **quant researcher** spends most of the day with data and code. They form an idea about how prices behave, gather the data, test it, and then try hard to prove themselves wrong.",
      "Most ideas fail. A researcher who finds one or two strategies a year that survive honest testing is doing well. The job rewards patience, skepticism and careful statistics." ]),
    read("A trader's day", [
      "A **quant trader** watches live markets and manages risk as it happens. At an automated firm that means monitoring strategies, adjusting their settings, and deciding what to do when something unusual occurs.",
      "The day is tied to market hours and can be intense. The job rewards quick mental math, calm decisions and honesty about mistakes." ]),
    read("A developer's day", [
      "A **quant developer** builds and maintains the systems: the code that receives market data, runs strategies, sends orders and tracks positions. A bug can cost a great deal of money in seconds.",
      "The job rewards careful engineering, testing and a deep interest in making software fast and reliable." ]),
    mc("You love finding patterns in data and do not mind that most of your ideas turn out wrong. Which role fits best?", ["Researcher", "Trader", "Developer"], 0,
      "Research is mostly careful failure, with rare and valuable successes."),
    mc("You like building things that work perfectly and enjoy making code run faster. Which role fits best?", ["Researcher", "Trader", "Developer"], 2,
      "Developers own the machinery. At many firms they are paid and respected on a level with researchers and traders."),
    mc("Besides these three, firms also employ risk managers. What is their job?", ["To find new strategies", "To check that the firm's total positions cannot cause a loss it could not survive", "To recruit staff"], 1,
      "Risk managers look at the whole firm and have the authority to make traders reduce positions. It is a quantitative job in its own right."),
  ]),

  lesson("what-to-study", "What to study", "What you can do now, in high school.", [
    read("In school", [
      "Take the most demanding **math** your school offers and aim to understand it deeply instead of only passing. Probability and statistics matter most, then calculus.",
      "Learn to **program** properly. One language learned well, usually Python, beats four learned badly. If your school offers computer science, take it.",
      "Do not neglect writing and speaking. Quants have to explain their ideas clearly to other people every day." ]),
    read("Outside school", [
      "**Competitions** build exactly the skills firms test: math contests and olympiads, programming contests, and trading or investing challenges.",
      "**Puzzles and games** of skill train decision-making under uncertainty: chess, poker played for no money, and probability brain teasers.",
      "**Reading** about markets, statistics and how to think clearly gives you the vocabulary. Finish the tracks on this site and you will have a real head start." ]),
    mc("Which combination is closest to what quant firms hire from at university?", ["Subjects heavy in math and programming, such as mathematics, statistics, computer science, physics or engineering", "Any subject, as long as grades are good", "Only finance"], 0,
      "Firms hire for mathematical and computational ability, and teach the finance themselves."),
    mc("You have one free hour a day. Which is the better use of it for a future quant?", ["Memorizing stock tickers", "Working through probability problems and writing small programs", "Watching market news"], 1,
      "Depth in math and coding compounds for years. Market trivia is forgotten in a week."),
    mc("A classmate says you need to be a genius to become a quant. What is closer to the truth?", ["They are right", "It takes strong skills built over years of steady practice, which is something you can choose to do", "It takes luck only"], 1,
      "The field is competitive and nobody can promise you a job in it. But the skills are learnable, and they are valuable in many careers besides this one."),
  ]),

  lesson("projects-that-show-skill", "Projects that show skill", "Proof beats claims.", [
    read("Show your work", [
      "Anyone can say they are interested in quantitative finance. A finished project shows it. Good projects are small, honest and yours.",
      "**A backtest with a conclusion.** Take one idea, test it properly, and write up what you found, including that it did not work.",
      "**A simulation.** Model a game or a market in code and explain what it taught you.",
      "**A tool.** A program that fetches data, computes statistics or draws charts that you actually use." ]),
    mc("Which project write-up would impress a quant interviewer most?", ["My strategy made 400% in a backtest", "I tested a momentum rule on ten years of data. It looked good until I added trading costs, and here is why", "I have many ideas for strategies"], 1,
      "The second shows honesty, skepticism and an understanding of costs. A claim of 400% mostly signals that the author has not yet learned about overfitting."),
    read("Use what is here", [
      "Your record on the **Trading floor** can be a project. Keep a journal of each decision and its reasoning, then analyze your own results: your hit rate, your average win and loss, your biggest mistakes.",
      "Put your code somewhere public, such as GitHub, with a short explanation a stranger could follow. Clear writing about your own work is rare and valued." ]),
    mc("What should every project write-up include?", ["Only the successes", "What you tried, what happened, what went wrong and what you would do next", "As much jargon as possible"], 1,
      "Being straightforward about limits and mistakes is the mark of someone who can be trusted with real money."),
    mc("You copy a project from the internet and present it as your own. What is the likely result in an interview?", ["Nobody will notice", "You will be asked detailed questions about it and will not be able to answer", "You will be hired faster"], 1,
      "Interviewers probe whatever is on your resume in depth. Besides being dishonest, it does not work."),
  ]),

  lesson("how-hiring-works", "How hiring works", "The stages between applying and getting an offer.", [
    read("The usual path", [
      "Most quants are hired through **internships** during university, which often lead to a full-time offer. The process is long and has several stages.",
      "First comes a **resume screen**. Then an **online assessment**: timed mental math, probability questions or a coding test. Then **interviews**, first by phone or video and finally a full day of several in a row.",
      "The interviews cover probability and brain teasers, mental math, coding, market-making games, and questions about how you think and work with others." ]),
    mc("In a probability interview you get stuck. What is the best thing to do?", ["Stay silent until you have the answer", "Think out loud, try a simpler version of the problem, and say what you would check", "Guess confidently"], 1,
      "Interviewers are judging how you reason and how you respond to hints. A clear path through a simpler case often earns more than a lucky final answer."),
    mc("You realize halfway through an answer that you made a mistake earlier. What should you do?", ["Hide it and keep going", "Say so, correct it, and carry on", "Start arguing"], 1,
      "Traders who hide errors are dangerous. Catching and admitting your own mistake is a point in your favor."),
    mc("Firms receive far more applications than they have places. What follows from that?", ["Everyone qualified gets in", "Rejection is normal even for strong candidates, so it is wise to apply widely and keep other options open", "There is no point applying"], 1,
      "Many people who end up with good careers in the field were turned down several times first. The same skills also lead to data science, software engineering and research."),
    mc("What is the best preparation for these interviews, starting now?", ["Buying a suit", "Years of regular practice at probability, mental math and programming", "Memorizing answers to famous puzzles"], 1,
      "Memorized answers fall apart when the interviewer changes the question slightly. Real fluency does not."),
  ]),

  lesson("ethics-and-rules", "Ethics and rules", "The lines that must never be crossed.", [
    read("Markets run on trust", [
      "People only trade in a market they believe is fair. So there are strict laws, and breaking them ends careers and can lead to prison. Three matter most.",
      "**Insider trading**: trading on important information that is not public, such as an employee buying shares before their company announces a takeover.",
      "**Market manipulation**: deliberately creating a false picture of price or demand. One form, called **spoofing**, is placing large orders you intend to cancel, to trick others into moving the price.",
      "**Misusing client money or information**: a firm must put its clients' interests ahead of its own." ]),
    mc("Your aunt works at a company and tells you privately that it will announce huge profits tomorrow. You buy the shares today. What is that?", ["Smart research", "Insider trading, which is illegal", "Arbitrage"], 1,
      "It is trading on important, non-public information. Both the person who tips and the person who trades can be prosecuted."),
    mc("A trader places a huge buy order they never intend to fill, waits for the price to rise, sells at the higher price, then cancels the buy order. What is that?", ["Market making", "Spoofing, a form of illegal manipulation", "Hedging"], 1,
      "The order existed only to deceive. Firms and regulators run software that searches for exactly this pattern."),
    mc("You study a company's public reports for weeks and conclude its shares are too cheap. You buy. Is that allowed?", ["No, it is insider trading", "Yes. Reaching your own conclusion from public information is what markets are for", "Only with a license"], 1,
      "Analysis of public information is the legitimate way to gain an edge. The line is drawn at information the public does not have, and at deception."),
    mc("A colleague suggests a profitable trade that you suspect breaks a rule. What should you do?", ["Do it quietly", "Do not do it, and raise it with your firm's compliance team", "Do it once to see"], 1,
      "Every firm has a compliance team whose job is to answer these questions. Asking first is always right, and no profit is worth your reputation or your freedom."),
    read("Why this lesson is here", [
      "Quants are trusted with large amounts of other people's money and with powerful tools. Skill without integrity is a danger to everyone, including the person who has it.",
      "The reputation you build for honesty starts now, with how you handle your own work, your mistakes and your results." ]),
  ]),

  quiz([
    mc("Which kind of firm trades only its own money, often as a market maker?", ["A proprietary trading firm", "An asset manager", "A pension fund"], 0, "Proprietary means the capital belongs to the firm."),
    mc("Which role spends the day testing ideas about how prices behave?", ["Developer", "Researcher", "Risk manager"], 1, "Researchers form and test ideas, and most of them fail."),
    mc("Which subjects matter most to prepare for quant work?", ["Math and programming", "History and geography", "Accounting only"], 0, "Firms hire for mathematical and computational skill."),
    mc("Buying shares because a friend at the company told you secret good news is:", ["Good research", "Insider trading", "Diversification"], 1, "It is illegal to trade on important information the public does not have."),
    mc("What is spoofing?", ["Placing orders you intend to cancel in order to mislead other traders", "Trading very quickly", "Buying an index fund"], 0, "It is a form of market manipulation and is illegal."),
  ]),
];
