import type { Lesson } from "./types";
import { lesson, mc, num, out, py, quiz, read, src, tryPy } from "./helpers";

export const algorithms: Lesson[] = [
  lesson("counting-steps", "Counting steps", "How to say how fast a program is, without a stopwatch.", [
    read("Speed that scales", [
      "A program that is fast on 100 prices can be hopeless on 100 million. What matters is how the work **grows** as the data grows.",
      "Programmers describe this by counting steps. If doubling the data doubles the work, the program is **linear**. If doubling the data quadruples the work, it is **quadratic**, and it will not survive real market data." ]),
    tryPy("Linear against quadratic", ["Two ways of processing n items. The first looks at each item once. The second compares every item with every other."],
      ["Run it and watch how the two step counts grow as n gets ten times larger."], `
for n in [10, 100, 1000]:
    once = 0
    for i in range(n):
        once += 1

    pairs = 0
    for i in range(n):
        for j in range(n):
            pairs += 1

    print("n =", n, "| one loop:", once, "| loop inside a loop:", pairs)`),
    num("A program compares every item with every other item. On 1,000 items it takes 1 second. Roughly how many seconds will it take on 10,000 items?", 100, "Ten times the data means 10 × 10 = 100 times the work for a quadratic program."),
    mc("Programmers write a linear program's cost as O(n) and a quadratic one's as O(n²). This is called big O notation. Which would you want for processing every trade in a day?", ["O(n²)", "O(n)", "It makes no difference"], 1,
      "With millions of trades, n² is trillions of steps. Choosing an approach with a better growth rate matters far more than tuning a slow one."),
    mc("Two programs give the same answer. One takes 1 second on today's data, the other 2 seconds. Which is better for the future?", ["Always the 1 second one", "The one whose time grows more slowly as the data grows", "Neither"], 1,
      "A program that is twice as slow today but linear will beat a quadratic one as soon as the data gets large. Growth rate wins in the end."),
  ]),

  lesson("linear-search", "Linear search", "Look at everything, one item at a time.", [
    read("The obvious way", [
      "To find an item in a list, the simplest method is to check each position in turn until you find it. This is **linear search**.",
      "It always works, and it needs no preparation. Its cost is that, in the worst case, you check every single item." ]),
    py("Write a linear search", ["`enumerate(items)` gives each position and its item together."],
      ["Make `find` return the position of `target` in `items`, or -1 if it is not there."], `
def find(items, target):
    for position, item in enumerate(items):
        # Return the position when the item matches
        pass
    return -1

tickers = ["KO", "AAPL", "XOM", "NVDA", "JPM"]
print(find(tickers, "NVDA"))
print(find(tickers, "TSLA"))`, `
def find(items, target):
    for position, item in enumerate(items):
        if item == target:
            return position
    return -1

tickers = ["KO", "AAPL", "XOM", "NVDA", "JPM"]
print(find(tickers, "NVDA"))
print(find(tickers, "TSLA"))`,
      [out(String.raw`^3\s*$`, "NVDA is at position 3."), out(String.raw`^-1\s*$`, "TSLA is not in the list, so the answer should be -1.")], "if item == target:\n    return position"),
    num("A list has 1,000,000 items. In the worst case, how many items does linear search check?", 1000000, "Every one of them: when the target is last, or missing."),
    mc("When is linear search a perfectly good choice?", ["Never", "When the list is small or you only search it once", "Only for numbers"], 1,
      "For a handful of items the simple method is fine, and often fastest. The trouble starts when you search a huge list again and again."),
  ]),

  lesson("binary-search", "Binary search", "Find anything in a sorted list in a handful of steps.", [
    read("Halve it every time", [
      "If a list is **sorted**, you can do far better. Look at the middle item. If your target is smaller, it must be in the left half. If larger, the right half. Throw away the other half and repeat.",
      "Each step halves what is left. A million items take about 20 steps. This is **binary search**, and it is how you look things up in anything sorted, from a dictionary to a table of prices by time." ]),
    py("Write a binary search", ["`low` and `high` mark the part of the list still in play. `//` is division that rounds down."],
      ["Inside the loop: if the middle item is the target, return `mid`. If it is too small, move `low` to `mid + 1`. Otherwise move `high` to `mid - 1`."], `
def binary_search(items, target):
    low = 0
    high = len(items) - 1
    while low <= high:
        mid = (low + high) // 2
        # Compare items[mid] with target
        break
    return -1

prices = [3, 8, 12, 15, 21, 27, 33, 40, 46, 52]
print(binary_search(prices, 33))
print(binary_search(prices, 4))`, `
def binary_search(items, target):
    low = 0
    high = len(items) - 1
    while low <= high:
        mid = (low + high) // 2
        if items[mid] == target:
            return mid
        elif items[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1

prices = [3, 8, 12, 15, 21, 27, 33, 40, 46, 52]
print(binary_search(prices, 33))
print(binary_search(prices, 4))`,
      [out(String.raw`^6\s*$`, "33 is at position 6."), out(String.raw`^-1\s*$`, "4 is not in the list, so the answer should be -1.")],
      "if items[mid] == target:\n    return mid\nelif items[mid] < target:\n    low = mid + 1\nelse:\n    high = mid - 1"),
    num("About how many steps does binary search need for 1,000,000 sorted items? (Hint: 2 multiplied by itself 20 times is just over a million.)", 20, "Each step halves the list, and 2²⁰ is about a million, so 20 steps is enough."),
    mc("Linear search on a million items: up to 1,000,000 steps. Binary search: 20. What did binary search need that linear search did not?", ["A faster computer", "The list to be sorted first", "More memory"], 1,
      "The speed comes from structure. Much of computer science is about organizing data so that questions become cheap to answer."),
  ]),

  lesson("sorting", "Sorting", "Putting things in order, the slow way and the right way.", [
    read("Bubble sort", [
      "Sorting is so useful that it is built into every language. It is worth writing a simple one once to see what the work looks like.",
      "**Bubble sort** walks through the list comparing each pair of neighbors and swapping them if they are in the wrong order. Repeat the walk until nothing needs swapping. Large values bubble to the end." ]),
    py("Write a bubble sort", ["Python can swap two items in one line: `a, b = b, a`."],
      ["Inside the inner loop, if `items[j]` is greater than `items[j + 1]`, swap them."], `
def bubble_sort(items):
    n = len(items)
    for i in range(n):
        for j in range(n - 1 - i):
            # Swap neighbors that are out of order
            pass
    return items

print(bubble_sort([27, 3, 46, 8, 15, 12]))`, `
def bubble_sort(items):
    n = len(items)
    for i in range(n):
        for j in range(n - 1 - i):
            if items[j] > items[j + 1]:
                items[j], items[j + 1] = items[j + 1], items[j]
    return items

print(bubble_sort([27, 3, 46, 8, 15, 12]))`,
      [out(String.raw`^\[3, 8, 12, 15, 27, 46\]\s*$`, "The sorted list should be [3, 8, 12, 15, 27, 46].")], "if items[j] > items[j + 1]:\n    items[j], items[j + 1] = items[j + 1], items[j]"),
    mc("Bubble sort has a loop inside a loop. How does its work grow with the size of the list?", ["Linearly", "Quadratically", "It does not grow"], 1,
      "It is an O(n²) method. Sorting a million items this way would take around a trillion comparisons."),
    py("The built-in way", ["Python's `sorted( )` uses a much better method whose work grows only slightly faster than linearly. It can also sort by a rule you supply with `key`."],
      ["Print the trades sorted by size, largest first. Use `sorted(trades, key=..., reverse=True)` with a key that picks out the size."], `
trades = [("AAPL", 300), ("KO", 1200), ("NVDA", 50), ("JPM", 800)]

`, `
trades = [("AAPL", 300), ("KO", 1200), ("NVDA", 50), ("JPM", 800)]

print(sorted(trades, key=lambda t: t[1], reverse=True))`,
      [src(String.raw`sorted\(`, "Use sorted( )."), out(String.raw`^\[\('KO', 1200\), \('JPM', 800\), \('AAPL', 300\), \('NVDA', 50\)\]\s*$`, "The largest trade, KO, should come first, and NVDA last.")], "print(sorted(trades, key=lambda t: t[1], reverse=True))"),
    mc("In real work, should you write your own sort?", ["Yes, always", "No. Use the built-in one, and understand what it costs", "Sorting is never needed"], 1,
      "Library sorts are fast and thoroughly tested. Knowing how algorithms work is for choosing well and for interviews, where you may be asked to write one."),
  ]),

  lesson("hashing", "Dictionaries and hashing", "Look something up in one step, however much data there is.", [
    read("Even better than binary search", [
      "A Python dictionary finds a value by its key almost instantly, whether it holds ten items or ten million. The trick behind it is called **hashing**.",
      "The dictionary runs each key through a function that turns it into a position in a table, then goes straight there. No searching at all. Programmers call this constant time, or O(1)." ]),
    py("Count with a dictionary", ["Counting how often each thing appears is one of the most common tasks in data work."],
      ["Inside the loop, add 1 to the count for each ticker."], `
orders = ["AAPL", "KO", "AAPL", "NVDA", "KO", "AAPL", "JPM", "AAPL"]
counts = {}

for ticker in orders:
    # Add 1 to this ticker's count
    pass

print(counts["AAPL"], counts["KO"], counts["NVDA"])`, `
orders = ["AAPL", "KO", "AAPL", "NVDA", "KO", "AAPL", "JPM", "AAPL"]
counts = {}

for ticker in orders:
    counts[ticker] = counts.get(ticker, 0) + 1

print(counts["AAPL"], counts["KO"], counts["NVDA"])`,
      [out(String.raw`^4 2 1\s*$`, "The output should be: 4 2 1")], "counts[ticker] = counts.get(ticker, 0) + 1"),
    py("Have we seen it before?", ["A **set** is like a dictionary with only keys. Asking whether something is `in` a set is also a single step."],
      ["Inside the loop, if the id is already in `seen`, append it to `repeats`. Otherwise add it to `seen`."], `
ids = [101, 205, 318, 101, 422, 205, 599]
seen = set()
repeats = []

for i in ids:
    # Record repeats, and remember new ids
    pass

print(repeats)`, `
ids = [101, 205, 318, 101, 422, 205, 599]
seen = set()
repeats = []

for i in ids:
    if i in seen:
        repeats.append(i)
    else:
        seen.add(i)

print(repeats)`,
      [out(String.raw`^\[101, 205\]\s*$`, "The repeated ids are [101, 205].")], "if i in seen:\n    repeats.append(i)\nelse:\n    seen.add(i)"),
    mc("You need to check a million order ids for duplicates. Using a list and searching it for each id is quadratic. What does using a set make it?", ["Still quadratic", "Linear: one quick check per id", "Impossible"], 1,
      "Swapping one data structure for another turned a trillion steps into a million. Picking the right structure is the most useful habit in programming."),
  ]),

  lesson("recursion", "Recursion", "A function that solves a problem by calling itself.", [
    read("Smaller versions of the same problem", [
      "Some problems are naturally defined in terms of themselves. The factorial of 5, written 5!, is 5 × 4 × 3 × 2 × 1. That is also 5 × (the factorial of 4).",
      "A **recursive** function calls itself on a smaller input. It needs two parts: a **base case** that answers directly, and a step that reduces the problem toward it." ],
      "factorial(1) = 1                         the base case\nfactorial(n) = n × factorial(n − 1)       the step"),
    py("Factorial", ["Without the base case the function would call itself forever."],
      ["If `n` is 1 or less, return 1. Otherwise return `n` times `factorial(n - 1)`."], `
def factorial(n):
    # Base case, then the recursive step
    pass

print(factorial(5))
print(factorial(10))`, `
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))
print(factorial(10))`,
      [out(String.raw`^120\s*$`, "5! should be 120."), out(String.raw`^3628800\s*$`, "10! should be 3628800.")], "if n <= 1:\n    return 1\nreturn n * factorial(n - 1)"),
    mc("What happens to a recursive function with no base case?", ["It returns 0", "It keeps calling itself until the computer stops it with an error", "It runs once"], 1,
      "Every call waits for the next, and nothing ever answers. Python gives up after about a thousand nested calls."),
    py("Fibonacci", ["In the Fibonacci sequence each number is the sum of the two before it: 0, 1, 1, 2, 3, 5, 8, 13. So fib(n) = fib(n − 1) + fib(n − 2)."],
      ["If `n` is less than 2, return `n`. Otherwise return the sum of the two previous Fibonacci numbers."], `
def fib(n):
    # Base case, then the recursive step
    pass

print(fib(10))
print(fib(20))`, `
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(10))
print(fib(20))`,
      [out(String.raw`^55\s*$`, "fib(10) should be 55."), out(String.raw`^6765\s*$`, "fib(20) should be 6765.")], "if n < 2:\n    return n\nreturn fib(n - 1) + fib(n - 2)"),
    mc("To get fib(20), this function works out fib(18) twice, fib(17) three times, and so on. What does that do to its speed?", ["Nothing", "It makes the work explode as n grows", "It makes it faster"], 1,
      "The number of calls roughly doubles with each step up in n. fib(50) written this way would take hours. The next lesson fixes it in two lines."),
  ]),

  lesson("dynamic-programming", "Dynamic programming", "Never solve the same small problem twice.", [
    read("Remember your answers", [
      "The slow Fibonacci function wastes its time recomputing answers it has already found. The cure is simple: store each answer the first time, and look it up after that.",
      "Solving a big problem by storing the answers to its smaller pieces is called **dynamic programming**. It turns many impossibly slow methods into fast ones, and it is a favorite interview topic." ]),
    py("Fibonacci, remembered", ["`cache` is a dictionary of answers already worked out."],
      ["Before the recursive step, return `cache[n]` if `n` is already in the cache.", "After computing an answer, store it in the cache.", "Once it passes, change 30 to 90 and press Run. It finishes instantly."], `
cache = {}

def fib(n):
    if n < 2:
        return n
    # Return the stored answer if there is one
    answer = fib(n - 1) + fib(n - 2)
    # Store the answer before returning it
    return answer

print(fib(30))`, `
cache = {}

def fib(n):
    if n < 2:
        return n
    if n in cache:
        return cache[n]
    answer = fib(n - 1) + fib(n - 2)
    cache[n] = answer
    return answer

print(fib(30))`,
      [src(String.raw`n\s+in\s+cache`, "Check the cache first: if n in cache: return cache[n]"), src(String.raw`cache\[n\]\s*=`, "Store each answer with cache[n] = answer."), out(String.raw`^832040\s*$`, "fib(30) should be 832040.")],
      "if n in cache:\n    return cache[n]\n...\ncache[n] = answer"),
    mc("Without the cache, fib(90) would need more calls than there are grains of sand on Earth. With it, how many different values does it compute?", ["About 90", "About 8,100", "Billions"], 0,
      "Each value from 2 to 90 is worked out exactly once. The same idea prices options on trees with thousands of steps."),
    py("Ways to climb", ["A classic interview question. You climb a staircase of n steps, taking 1 or 2 steps at a time. How many different ways are there? The last move was either 1 step or 2, so ways(n) = ways(n − 1) + ways(n − 2)."],
      ["Fill in the loop so that `ways[i]` is the sum of the two entries before it."], `
def climb(n):
    ways = [1, 1]          # one way to climb 0 steps, one way to climb 1
    for i in range(2, n + 1):
        # Append ways[i - 1] + ways[i - 2]
        pass
    return ways[n]

print(climb(4))
print(climb(30))`, `
def climb(n):
    ways = [1, 1]          # one way to climb 0 steps, one way to climb 1
    for i in range(2, n + 1):
        ways.append(ways[i - 1] + ways[i - 2])
    return ways[n]

print(climb(4))
print(climb(30))`,
      [out(String.raw`^5\s*$`, "There are 5 ways to climb 4 steps."), out(String.raw`^1346269\s*$`, "There are 1346269 ways to climb 30 steps.")], "ways.append(ways[i - 1] + ways[i - 2])"),
    mc("What is the sign that a problem suits dynamic programming?", ["It involves money", "Its answer is built from the answers to smaller versions of itself, and those smaller versions repeat", "It needs sorting"], 1,
      "Overlapping smaller problems are the giveaway. Spotting them is a skill interviewers look for."),
  ]),

  lesson("a-tiny-order-book", "A tiny order book", "The data structure at the heart of an exchange.", [
    read("Always know the best price", [
      "An exchange must always know the highest bid and the lowest ask, while orders arrive and leave thousands of times a second. Searching a list each time would be far too slow.",
      "The right tool is a **heap**: a structure that hands you its smallest item instantly and stays organized as items are added and removed. Python's is in the `heapq` module." ]),
    py("The lowest ask", ["`heapq.heappush(heap, item)` adds an item. `heap[0]` is always the smallest."],
      ["Push every ask onto the heap, then print the smallest."], `
import heapq

asks = [10.06, 10.04, 10.09, 10.05]
heap = []

for a in asks:
    # Push a onto the heap
    pass

print(heap[0])`, `
import heapq

asks = [10.06, 10.04, 10.09, 10.05]
heap = []

for a in asks:
    heapq.heappush(heap, a)

print(heap[0])`,
      [src(String.raw`heappush`, "Use heapq.heappush(heap, a)."), out(String.raw`^10\.04\s*$`, "The lowest ask is 10.04.")], "heapq.heappush(heap, a)"),
    py("The highest bid", ["A heap gives the smallest item, and for bids you want the largest. The standard trick is to store each bid as a negative number."],
      ["Push the negative of every bid, then print the highest bid by flipping the sign of `heap[0]`."], `
import heapq

bids = [10.01, 10.03, 9.98, 10.02]
heap = []

for b in bids:
    # Push the negative of b
    pass

# Print the highest bid`, `
import heapq

bids = [10.01, 10.03, 9.98, 10.02]
heap = []

for b in bids:
    heapq.heappush(heap, -b)

print(-heap[0])`,
      [out(String.raw`^10\.03\s*$`, "The highest bid is 10.03.")], "heapq.heappush(heap, -b)\n...\nprint(-heap[0])"),
    tryPy("Match a market order", ["A buyer wants 250 shares. `heapq.heappop` removes and returns the cheapest ask each time."],
      ["Run it and follow how the order eats through the book."], `
import heapq

asks = [(10.04, 100), (10.05, 100), (10.06, 300)]     # (price, shares)
heapq.heapify(asks)

want = 250
cost = 0

while want > 0 and asks:
    price, size = heapq.heappop(asks)
    take = min(size, want)
    cost += take * price
    want -= take
    print("took", take, "at", price)
    if size > take:
        heapq.heappush(asks, (price, size - take))

print("total cost:", round(cost, 2))
print("best ask now:", asks[0])`),
    mc("Why does an exchange use structures like heaps instead of sorting the whole book after every order?", ["Sorting is not allowed", "A heap updates in a few steps, while re-sorting everything each time would be far too slow", "Heaps use no memory"], 1,
      "Adding to or removing from a heap takes work proportional to the logarithm of its size. Matching engines are some of the most carefully optimized programs in the world, and they are written by quant developers."),
  ]),

  quiz([
    mc("A program's work grows as n². The data becomes 3 times larger. How much more work is there?", ["3 times", "6 times", "9 times"], 2, "3² = 9."),
    mc("What must be true of a list before binary search can be used?", ["It must be short", "It must be sorted", "It must hold only numbers"], 1, "Binary search relies on order to throw away half the list each step."),
    mc("What is the typical cost of looking up a key in a dictionary?", ["It grows with the size of the dictionary", "About the same however large the dictionary is", "It doubles with each item"], 1, "Hashing goes straight to the right place."),
    mc("What two parts does every recursive function need?", ["A loop and a list", "A base case and a step toward it", "Two inputs"], 1, "Without a base case the recursion never ends."),
    mc("What does dynamic programming store?", ["The program's source code", "Answers to smaller problems, so they are not computed again", "Random numbers"], 1, "Reusing stored answers is what makes it fast."),
  ]),
];
