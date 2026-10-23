import type { PythonLesson } from "./types";
import { collectionsLesson } from "./collections.ts";
const pythonReference = (chapter: string) => ({
  title: `Python tutorial: ${chapter}`,
  url: `https://docs.python.org/3.12/tutorial/${chapter}.html`,
  version: "Python 3.12 (Pyodide 0.27.7)",
  license: "PSF License; original teaching prose, no tutorial text reproduced.",
  retrieved: "2026-10-23",
});
export const pythonLessons: PythonLesson[] = [
  {
    id: "variables",
    title: "Names, values and a first useful program",
    level: "Beginner",
    minutes: 65,
    prerequisites: [],
    packages: [],
    objectives: [
      "Distinguish a name from the object it refers to.",
      "Trace assignment, arithmetic, string conversion and formatted output.",
      "Diagnose NameError and TypeError using a traceback.",
    ],
    sections: [
      {
        title: "Start with a question, then represent the information",
        paragraphs: [
          "Suppose a service team receives 120 requests and spends 5 minutes on each. How much handling time must it plan? A Python program can represent the quantities, calculate an answer and report the units. The arithmetic is small; the important engineering habit is making the assumptions visible. Here the workload excludes breaks and overhead. A number without a unit is easy to misuse, so choose names such as minutes_per_request rather than a vague name such as value.",
          "Python executes statements in order. An assignment evaluates the expression on the right and then binds the name on the left to its result. In requests = 120, requests is a name and 120 is an integer object. The equals sign is assignment, not an assertion that two expressions are mathematically equal. Reassigning a name changes its binding. It does not travel backward and change an earlier calculation. Read each line as a step in time, not as a spreadsheet formula that recalculates itself.",
          "The editor in this lesson runs CPython 3.12 compiled to WebAssembly through Pyodide. Press Run code to execute a fresh program. Its temporary Python files disappear after each run. The editor and your notes are saved in this browser, independently of those temporary files. This differs from a desktop REPL, which usually retains variables between commands. To repeat a desktop session reliably, put statements in a .py file and run python filename.py from a terminal. Do not type the REPL prompt >>> into a script.",
        ],
      },
      {
        title: "Types explain which operations make sense",
        paragraphs: [
          'An int represents a whole number with arbitrary precision subject to available memory. A float represents an approximation to a real number using binary floating point. A str represents Unicode text. A bool is True or False. Python names have no fixed declared type: the object determines the operations available. requests + 2 adds numbers, while "12" + "2" concatenates text to "122". Python will not guess that "12" + 2 should be arithmetic; this raises TypeError. Convert intentionally with int() or str(). Invalid numeric text such as int("twelve") raises ValueError.',
          "The / operator returns a floating-point result, even for integer operands. The // operator performs floor division: -7 // 3 is -3, because floor means toward negative infinity. The % operator returns the matching remainder, and ** exponentiates. Multiplication and division bind more tightly than addition; parentheses make business meaning explicit. Keep numeric values as numbers while calculating. Format them as strings only when reporting. Rounding a displayed value is different from changing the internal value.",
          "Quotation marks delimit a string; they are not part of its value. Use matching single or double quotes, and escape a quote or choose the other delimiter when needed. An f-string begins with f and evaluates expressions inside braces. The format specifier :.2f requests two digits after the decimal point. It is useful for a report, but it does not make binary floats exact financial arithmetic; use decimal.Decimal for contracts that require decimal rounding rules.",
        ],
      },
      {
        title: "Input is a boundary, not a type guarantee",
        paragraphs: [
          'On a desktop, input("Requests: ") reads a line and returns a string. A program must validate and convert that string before arithmetic. The browser worker deliberately does not open blocking prompts: use the raw_requests variable in the second example to model a line of input. This makes the example deterministic and easy to test. Later lessons will separate parsing, validation, calculation and presentation into functions.',
          "Before running an example, predict its output on paper. Then run it, change one input and explain the difference. If Python reports a failure, read the final exception name first, then find the learner.py line number. Fix the first causal mistake rather than adding conversions everywhere. A NameError usually indicates a misspelled name or a statement executed before assignment. Case matters: Requests and requests are different names.",
        ],
      },
    ],
    syntax: [
      {
        token: "name = expression",
        meaning: "Evaluate expression once, then bind name to the result.",
      },
      {
        token: 'f"{hours:.2f}"',
        meaning: "Evaluate hours and render two fractional digits.",
      },
      {
        token: "int(text)",
        meaning: "Parse whole-number text; invalid text raises ValueError.",
      },
    ],
    examples: [
      {
        title: "From demand to workload",
        code: 'requests = 120\nminutes_per_request = 5\nhours = requests * minutes_per_request / 60\nprint(f"Workload: {hours:.2f} hours")',
        output: "Workload: 10.00 hours\n",
        walkthrough: [
          "Line 1 binds requests to an integer, not to text.",
          "Line 2 names the unit so the conversion is inspectable.",
          "Line 3 multiplies before dividing, converting minutes to hours.",
          "Line 4 formats the result for a human without changing hours.",
        ],
      },
      {
        title: "Convert input and observe rebinding",
        code: 'raw_requests = "12"\nrequests = int(raw_requests)\nnext_day = requests + 3\nrequests = 0\nprint(next_day)\nprint(-7 // 3, -7 % 3)',
        output: "15\n-3 2\n",
        walkthrough: [
          "Line 1 models the string returned by desktop input().",
          'Line 2 parses it deliberately; changing it to "twelve" triggers ValueError.',
          "Line 3 stores a separate result; line 4 does not recompute next_day.",
          "Line 6 demonstrates floor division and its matching remainder.",
        ],
      },
    ],
    debugging: [
      {
        symptom: "NameError: name requests is not defined",
        explanation:
          "Check spelling, capitalization and statement order. Python only knows bindings that have already executed.",
      },
      {
        symptom: "TypeError when adding text and a number",
        explanation:
          "Inspect the intended operation. Parse text with int for arithmetic, or format numbers into an output string.",
      },
      {
        symptom: "An answer is off by a factor of 60",
        explanation:
          "Trace units line by line. Do not confuse minutes with hours or round an intermediate result prematurely.",
      },
    ],
    exercises: [
      {
        id: "variables-workload",
        title: "Report a shift workload",
        prompt:
          "Set contacts to 84 and minutes_per_contact to 5. Calculate hours and print exactly: Workload: 7.00 hours. The check evaluates both the numeric result and stdout.",
        starter:
          "contacts = 84\nminutes_per_contact = 5\nhours = 0\nprint(hours)",
        solution:
          'contacts = 84\nminutes_per_contact = 5\nhours = contacts * minutes_per_contact / 60\nprint(f"Workload: {hours:.2f} hours")',
        tests:
          'assert hours == 7, "Convert minutes to hours."\nassert __observed_stdout == "Workload: 7.00 hours\\n", "Use the required report format."',
        hints: [
          "Multiply contacts by minutes per contact before dividing by 60.",
          "Format hours inside an f-string using :.2f.",
        ],
      },
      {
        id: "variables-input",
        title: "Parse a quantity, then calculate",
        prompt:
          'raw contains "18". Convert it to an integer quantity and compute total as quantity times 4. Print total as a number.',
        starter:
          'raw = "18"\nquantity = raw\ntotal = quantity * 4\nprint(total)',
        solution:
          'raw = "18"\nquantity = int(raw)\ntotal = quantity * 4\nprint(total)',
        tests:
          'assert isinstance(quantity, int), "Quantity must be an integer."\nassert total == 72, "Compute a numeric total."\nassert __observed_stdout == "72\\n"',
        hints: [
          "Multiplying a string repeats it; it does not parse it.",
          "int(raw) converts numeric text into an integer.",
        ],
      },
    ],
    recall: [
      {
        id: "variables-recall",
        prompt: "After x = 4; y = x + 1; x = 9, what is y?",
        options: [
          "5, because y stored the evaluated result",
          "10, because y remains a formula linked to x",
          "An error, because reassignment is forbidden",
        ],
        correct: 0,
        explanation:
          "Assignment evaluates the right-hand expression at that moment. y is bound to 5; rebinding x does not recompute it.",
      },
    ],
    references: [pythonReference("introduction")],
  },
  {
    id: "loops",
    title: "Iteration, decisions and reliable totals",
    level: "Beginner",
    minutes: 75,
    prerequisites: ["variables"],
    packages: [],
    objectives: [
      "Trace a for loop and an accumulator.",
      "Handle empty inputs and explicit inclusion rules.",
      "Explain range boundaries, continue and break.",
    ],
    sections: [
      {
        title: "A loop makes repeated work explicit",
        paragraphs: [
          "A report rarely has only one record. Suppose daily handling times are [30, 0, -4, 50]. We want the sum of nonnegative observations, while preserving zeros as genuine observations. A for loop asks an iterable for one item at a time. It binds the loop target, executes the indented suite and repeats until the iterable is exhausted. It does not require a numeric index. Starting with the values directly is simpler and avoids off-by-one errors.",
          "An accumulator is state carried between iterations. Initialize total = 0 before the loop, then add accepted values inside it. If you initialize inside the loop, every iteration erases the work of the previous one. To trace a loop, make a table with the current item and the accumulator before and after the body. For [30, 0, -4, 50], the total should be 30, 30, 30, 80. A negative value is excluded because of the stated policy, not because all negative values are universally invalid.",
          "Indentation is syntax. A colon ends the loop header or condition; an indented suite follows. Four spaces per level is the conventional style. Mixing tabs and spaces can produce a TabError or confusing structure. In the editor, press Tab to indent; Escape followed by Tab leaves the editor. Run the program after changing only one indentation level and observe how the meaning changes.",
        ],
      },
      {
        title: "Conditions define the population",
        paragraphs: [
          "An if statement executes its suite only when its expression is truthy. For numeric observations, write the intended boundary explicitly: value >= 0 includes zero, while value > 0 excludes it. Do not use if value to mean valid: zero is falsey but may be valid. Empty strings, empty containers and None are also falsey, so truthiness is a convenience rather than a validation strategy. Use comparisons and types when the contract needs precision.",
          'continue skips the rest of the current iteration. break exits the nearest loop entirely. Neither is a substitute for a clear population definition. To stop reading at a sentinel, such as "STOP", use break before processing that value. To ignore blank records and keep scanning, use continue. A loop else suite runs only if no break occurs; defer it until the basic control flow is clear.',
          "range(start, stop, step) produces integers up to but excluding stop. range(1, 4) yields 1, 2, 3; range(4) begins at zero. A negative step can count downward, but its sign must move toward the boundary. range(3, 0, -1) yields 3, 2, 1. An empty range is legitimate. Use enumerate(values, start=1) when a human-readable row number is needed alongside each value.",
        ],
      },
      {
        title: "Empty input is part of the design",
        paragraphs: [
          "Summing an empty population naturally produces zero. Averaging requires an explicit policy because dividing by the number of accepted records may divide by zero. Track count separately from total; then return None or report no observations when count is zero. Returning zero for an undefined average invents evidence. The workload report in this lesson keeps validation separate from aggregation so rejected records can be counted or investigated.",
          "Comprehensions are concise transformations of iterables: [x * 2 for x in values if x >= 0] reads as transform each accepted value. They are useful when building a new collection. A normal loop is clearer when multiple counters, logging or early exits are involved. Avoid comprehensions used only for side effects. Predict the empty-input result before optimizing or shortening a working loop.",
        ],
      },
    ],
    syntax: [
      {
        token: "for value in values:",
        meaning: "Bind each item in turn and execute the indented body.",
      },
      { token: "if value >= 0:", meaning: "Include zero under this policy." },
      { token: "range(1, 4)", meaning: "Yield 1, 2, 3; stop is exclusive." },
    ],
    examples: [
      {
        title: "Accept observations explicitly",
        code: "values = [30, 0, -4, 50]\ntotal = 0\ncount = 0\nfor value in values:\n    if value >= 0:\n        total += value\n        count += 1\nprint(total, count)",
        output: "80 3\n",
        walkthrough: [
          "Lines 2–3 initialize independent accumulators before iteration.",
          "Line 4 visits each original value exactly once.",
          "Line 5 includes zero and excludes -4.",
          "Lines 6–7 update only accepted values; output preserves numerator and count.",
        ],
      },
      {
        title: "Number a filtered report",
        code: 'teams = ["North", "", "South"]\nfor row, team in enumerate(teams, start=1):\n    if not team:\n        continue\n    print(f"{row}: {team}")\nprint(list(range(3, 0, -1)))',
        output: "1: North\n3: South\n[3, 2, 1]\n",
        walkthrough: [
          "enumerate retains original row positions rather than inventing consecutive accepted-row numbers.",
          "The empty string is deliberately skipped.",
          "continue advances to the next original row.",
          "The negative-step range excludes zero.",
        ],
      },
    ],
    debugging: [
      {
        symptom: "Only the final item appears in the total",
        explanation:
          "Check whether total = 0 is inside the loop. Initialization belongs before the repeated suite.",
      },
      {
        symptom: "Zero observations disappear",
        explanation:
          "if value tests truthiness. Use an explicit comparison such as value >= 0 when zero is valid.",
      },
      {
        symptom: "IndexError at the last iteration",
        explanation:
          "Iterate over values directly, or check that an index range excludes len(values).",
      },
    ],
    exercises: [
      {
        id: "loops-sum",
        title: "Implement an inclusion rule",
        prompt:
          "Define positive_total(values) that sums strictly positive numbers. It must return 0 for an empty list and exclude zero and negatives. Do not modify the input.",
        starter:
          "def positive_total(values):\n    total = 0\n    # Add accepted values here.\n    return total",
        solution:
          "def positive_total(values):\n    total = 0\n    for value in values:\n        if value > 0:\n            total += value\n    return total",
        tests:
          "assert positive_total([3, -2, 0, 7]) == 10\nassert positive_total([]) == 0\nassert positive_total([-2, -1]) == 0\nitems = [2, 4]\nassert positive_total(items) == 6 and items == [2, 4]",
        hints: [
          "Initialize total before iterating.",
          "Add only values greater than zero. Return after the loop.",
        ],
      },
      {
        id: "loops-labels",
        title: "Create inclusive day labels",
        prompt:
          'Define days(n) returning ["Day 1", ..., "Day n"]. days(0) must return an empty list.',
        starter: "def days(n):\n    return []",
        solution:
          'def days(n):\n    return [f"Day {i}" for i in range(1, n + 1)]',
        tests:
          'assert days(3) == ["Day 1", "Day 2", "Day 3"]\nassert days(0) == []\nassert days(1) == ["Day 1"]',
        hints: [
          "range excludes its stop value.",
          "A comprehension can produce a string for each integer from 1 through n.",
        ],
      },
    ],
    recall: [
      {
        id: "loops-recall",
        prompt:
          "A valid count can be zero. Which condition includes it while rejecting negatives?",
        options: ["if count:", "if count >= 0:", "if count > 0:"],
        correct: 1,
        explanation:
          "An explicit >= 0 includes zero. Truthiness and > 0 both exclude it.",
      },
    ],
    references: [pythonReference("controlflow")],
  },
  {
    id: "functions",
    title: "Functions, contracts and scope",
    level: "Beginner",
    minutes: 80,
    prerequisites: ["variables", "loops"],
    packages: [],
    objectives: [
      "Separate parameters, arguments and return values.",
      "Write a reusable function with a testable contract.",
      "Avoid mutable default arguments and accidental shared state.",
    ],
    sections: [
      {
        title: "Give a calculation a boundary",
        paragraphs: [
          "A function packages a named operation with inputs and an output. A good first contract is small: workload_hours(contacts, seconds_per_contact) returns handling effort in hours. It does not prompt the user, print a report or update a database. Those are separate concerns. Keeping the core calculation independent makes it reusable in a browser exercise, command-line report or automated test. A function is useful because its meaning can be checked independently, not just because it reduces repeated lines.",
          "def creates a function object and binds its name; it does not execute the body. Parameters are local names in the definition. Arguments are the expressions supplied by a caller. In workload_hours(120, 300), 120 is bound to contacts and 300 to seconds_per_contact when the call begins. Each call has its own local namespace. A return statement evaluates an expression, ends that call and gives the value back to the caller. Execution that reaches the end without return produces None.",
          "print is a presentation side effect. return is a data-flow mechanism. A function that only prints 10 cannot be multiplied by two by its caller: its returned value is None. Return numeric data from a calculation and format it at the edge. In a test, compare the returned value rather than the spelling of the implementation. Two different algorithms can satisfy the same behavioral contract.",
        ],
      },
      {
        title: "Scope and argument binding",
        paragraphs: [
          "Names assigned in a function are local unless explicitly declared global or nonlocal. Reading a global constant is possible, but hidden dependencies make a function harder to test. Pass changing business inputs as parameters. If you assign to a name anywhere in a function, Python treats it as local throughout that function; reading it before assignment raises UnboundLocalError. Do not fix that error by adding global automatically. Ask whether the value should be an argument or a returned result.",
          "Positional arguments match parameters by position; keyword arguments match by name. A default provides a value when the caller omits that argument. Defaults are evaluated once when def executes, not for every call. A list default therefore persists across calls. To create a fresh list when needed, default to None and construct a new list inside. If you intentionally accept a list, document whether the function mutates it. Copying with list(items) makes ownership explicit for a simple flat collection.",
          "A docstring is the first string expression in the function body. Describe units, allowed inputs, returned meaning and exceptional cases. Type hints such as contacts: int communicate intent to tools and readers, but CPython does not enforce them at runtime. Tests and validation still matter. Avoid claiming a function is safe merely because it has annotations.",
        ],
      },
      {
        title: "Design examples that challenge the contract",
        paragraphs: [
          "Test a normal input, a zero boundary and a second ordinary case that changes the result. A constant return can pass one happy-path example, so it is weak evidence. For floating-point arithmetic, use math.isclose with a tolerance appropriate to the domain rather than assuming every decimal calculation is exact. Domain restrictions belong in the contract: if negative contacts are invalid, decide whether to raise ValueError rather than silently returning a negative workload.",
          "Refactoring a long script into functions should preserve observable behavior. First capture expected values, extract a small pure calculation, then rerun those checks. Resist making every line a function: a boundary is useful when it names a meaningful idea, isolates a policy or enables an independent test. Later, exception handling will keep invalid inputs separate from successful results.",
        ],
      },
    ],
    syntax: [
      {
        token: "def name(parameter):",
        meaning: "Create a callable; its indented body runs on a call.",
      },
      {
        token: "return expression",
        meaning: "End this call and deliver a value to its caller.",
      },
      {
        token: "items=None",
        meaning:
          "Use a sentinel default and allocate mutable objects inside the call.",
      },
    ],
    examples: [
      {
        title: "Calculate first, format later",
        code: 'def workload_hours(contacts, seconds_per_contact):\n    """Return handling effort in hours, excluding overhead."""\n    return contacts * seconds_per_contact / 3600\n\nhours = workload_hours(120, seconds_per_contact=300)\nprint(f"{hours:.1f} hours")\nprint(workload_hours(0, 300))',
        output: "10.0 hours\n0.0\n",
        walkthrough: [
          "Line 1 defines the contract boundary; nothing is calculated yet.",
          "Line 2 documents the meaning and excluded overhead.",
          "Line 3 returns data rather than printing.",
          "Line 5 supplies one positional and one keyword argument; line 6 presents it.",
        ],
      },
      {
        title: "Avoid shared defaults",
        code: 'def add_tag(tag, tags=None):\n    result = [] if tags is None else list(tags)\n    result.append(tag)\n    return result\n\nprint(add_tag("daily"))\nprint(add_tag("weekly"))\noriginal = ["sales"]\nprint(add_tag("reviewed", original))\nprint(original)',
        output: "['daily']\n['weekly']\n['sales', 'reviewed']\n['sales']\n",
        walkthrough: [
          "The None default carries no mutable collection across calls.",
          "Line 2 creates or copies a list to establish ownership.",
          "append mutates only the new result.",
          "The final print proves that the caller's original list remains intact.",
        ],
      },
    ],
    debugging: [
      {
        symptom: "TypeError involving NoneType after a function call",
        explanation:
          "Check for a missing return. Printing a value does not return it.",
      },
      {
        symptom: "A second call contains data from the first",
        explanation:
          "Inspect mutable defaults and module-level state. Allocate new lists per call when independent results are required.",
      },
      {
        symptom: "UnboundLocalError",
        explanation:
          "A local name is being read before its assignment. Pass the value into the function or reorganize the state flow.",
      },
    ],
    exercises: [
      {
        id: "functions-hours",
        title: "Return a reusable calculation",
        prompt:
          "Define workload_hours(contacts, seconds_per_contact) returning hours. Test zero demand and fractional hours without printing inside the function.",
        starter: "def workload_hours(contacts, seconds_per_contact):\n    pass",
        solution:
          "def workload_hours(contacts, seconds_per_contact):\n    return contacts * seconds_per_contact / 3600",
        tests:
          "import math\nassert workload_hours(120, 300) == 10\nassert workload_hours(0, 300) == 0\nassert math.isclose(workload_hours(3, 90), 0.075)",
        hints: [
          "A calculation needs return, not print.",
          "There are 3,600 seconds in an hour.",
        ],
      },
      {
        id: "functions-default",
        title: "Prevent cross-call contamination",
        prompt:
          "Define add_label(label, labels=None). Return a new list with label appended, leaving any supplied list unchanged.",
        starter:
          "def add_label(label, labels=[]):\n    labels.append(label)\n    return labels",
        solution:
          "def add_label(label, labels=None):\n    result = [] if labels is None else list(labels)\n    result.append(label)\n    return result",
        tests:
          'assert add_label("a") == ["a"]\nassert add_label("b") == ["b"]\nsource = ["x"]\nassert add_label("y", source) == ["x", "y"]\nassert source == ["x"]',
        hints: [
          "Default to None rather than a list.",
          "Copy the supplied list before appending.",
        ],
      },
    ],
    recall: [
      {
        id: "functions-recall",
        prompt:
          "A calculation prints 7 but contains no return statement. What does its caller receive?",
        options: ["7", 'The string "7"', "None"],
        correct: 2,
        explanation:
          "Printing writes output. A call with no executed return expression produces None.",
      },
    ],
    references: [pythonReference("controlflow")],
  },
  collectionsLesson,
  {
    id: "exceptions",
    title: "Exceptions, validation and useful failures",
    level: "Intermediate",
    minutes: 75,
    prerequisites: ["functions"],
    packages: [],
    objectives: [
      "Separate invalid data from unexpected programming defects.",
      "Raise specific errors and handle only the intended failure.",
      "Use finally and context managers to release resources.",
    ],
    sections: [
      {
        title: "A failure should carry meaning",
        paragraphs: [
          'When an operation cannot fulfill its contract, an exception interrupts normal control flow. int("many") raises ValueError because the string has the right broad type but no valid integer representation. Trying to call a missing name raises NameError, which usually indicates a programming defect. Treating both as ordinary bad input hides mistakes. A robust reporting pipeline distinguishes expected validation failures from errors that should stop the run and be investigated.',
          "A traceback lists the chain of calls that led to the exception. Start with the last exception name and message, then locate the relevant learner.py line. The earliest listed call may simply be a caller; the last frame usually points closest to the failure. Read the surrounding state and contract before editing. Catching every error removes the traceback that would have helped diagnose a broken assumption.",
          'Use raise ValueError("contacts must be nonnegative") when a parsed value violates your domain. An exception message should say what rule failed without exposing secrets or confidential data. Successful data and failed data should not share a misleading sentinel. Returning 0 for an invalid count makes it indistinguishable from a genuine zero count and can corrupt every downstream metric.',
        ],
      },
      {
        title: "Keep the protected operation small",
        paragraphs: [
          "A try suite contains an operation that may fail. An except ValueError suite handles that specific exception. Keep the try block narrow so it is obvious which failure you expect. If parsing and report generation are in one large try, a ValueError from a programming mistake in the report might be mislabeled as bad source data. Parse first, validate next and calculate afterward. This also gives tests precise boundaries.",
          "An else suite after except runs only if the try suite finishes without raising. A finally suite runs when control leaves the try statement, whether the operation succeeds, fails or returns. It is useful for releasing resources, but returning from finally can suppress exceptions or override earlier results. Avoid that pattern. For files, prefer with open(...) as handle so a context manager closes the resource automatically.",
          "When translating a lower-level error, preserve causality with raise NewError(...) from original. A caller can read both the domain-level message and its cause. Use this sparingly; sometimes letting the original ValueError propagate is already the clearest contract. Never catch BaseException to handle data validation, because it includes control-flow exceptions such as KeyboardInterrupt and SystemExit.",
        ],
      },
      {
        title: "Validation is a sequence of decisions",
        paragraphs: [
          "Consider a count supplied as text. First decide whether leading and trailing whitespace are acceptable. int accepts them, so strip is not required just for parsing. Next decide whether negative values are allowed. Finally decide whether a business upper bound is necessary. Do not invent one silently. A parser returning a count can raise ValueError for malformed or negative text while accepting zero.",
          "Tests for exception paths need to fail when no exception occurs. A try/except that merely ignores an error is not an assertion. In standard-library tests, use unittest.TestCase.assertRaises or an explicit helper that raises AssertionError if the expected exception is absent. pytest offers pytest.raises on a desktop; it is not preinstalled in this browser runtime. The exercises use plain assertions and explicit checks to keep their dependency boundary visible.",
        ],
      },
    ],
    syntax: [
      {
        token: "try: ... except ValueError:",
        meaning:
          "Handle a specific expected failure from the protected operation.",
      },
      {
        token: "raise ValueError(message)",
        meaning: "Stop normal execution when a domain contract is violated.",
      },
      {
        token: "finally:",
        meaning:
          "Run cleanup on exit; do not use a return here to hide failures.",
      },
    ],
    examples: [
      {
        title: "Reject an invalid count explicitly",
        code: 'def parse_count(text):\n    count = int(text)\n    if count < 0:\n        raise ValueError("count must be nonnegative")\n    return count\n\nfor raw in ["12", "0", "-3", "many"]:\n    try:\n        print(parse_count(raw))\n    except ValueError:\n        print("invalid count")',
        output: "12\n0\ninvalid count\ninvalid count\n",
        walkthrough: [
          "Line 2 allows Python to report malformed integer text.",
          "Lines 3–4 add the separate business rule.",
          "The caller catches only expected ValueError failures.",
          "Zero is printed as a real observation rather than treated as failure.",
        ],
      },
      {
        title: "Cleanup runs even when parsing fails",
        code: 'events = []\ntry:\n    int("invalid")\nexcept ValueError:\n    events.append("rejected")\nfinally:\n    events.append("cleanup")\nprint(events)',
        output: "['rejected', 'cleanup']\n",
        walkthrough: [
          "int raises before a normal result is produced.",
          "The matching handler records rejection.",
          "finally runs afterward and records cleanup.",
          "No return in finally suppresses the failure or changes the contract.",
        ],
      },
    ],
    debugging: [
      {
        symptom: "All failures appear as zero rows",
        explanation:
          "Look for broad except blocks returning zero. Preserve the distinction between missing evidence and an observed zero.",
      },
      {
        symptom: "A bug disappears after adding except Exception",
        explanation:
          "The exception may be hidden, not fixed. Narrow the protected operation and catch only expected validation errors.",
      },
      {
        symptom: "The error message lacks the source location",
        explanation:
          "Read stderr in the lab. Do not replace the traceback with a vague success message.",
      },
    ],
    exercises: [
      {
        id: "exceptions-count",
        title: "Build a strict count parser",
        prompt:
          "Define parse_count(text) returning a nonnegative integer. Malformed or negative values must raise ValueError. Zero and surrounding whitespace are valid.",
        starter: "def parse_count(text):\n    return 0",
        solution:
          'def parse_count(text):\n    count = int(text)\n    if count < 0:\n        raise ValueError("count must be nonnegative")\n    return count',
        tests:
          'assert parse_count(" 12 ") == 12\nassert parse_count("0") == 0\nfor invalid in ["many", "-1", ""]:\n    try:\n        parse_count(invalid)\n    except ValueError:\n        pass\n    else:\n        raise AssertionError("Invalid counts must raise ValueError")',
        hints: [
          "int handles malformed text and whitespace.",
          "Raise ValueError separately if the parsed number is negative.",
        ],
      },
      {
        id: "exceptions-safe",
        title: "Handle one expected failure",
        prompt:
          "Define ratio(numerator, denominator). Return None for a zero denominator and ordinary division otherwise. Unexpected type errors must still propagate.",
        starter:
          "def ratio(numerator, denominator):\n    try:\n        return numerator / denominator\n    except Exception:\n        return None",
        solution:
          "def ratio(numerator, denominator):\n    try:\n        return numerator / denominator\n    except ZeroDivisionError:\n        return None",
        tests:
          'assert ratio(3, 2) == 1.5\nassert ratio(0, 2) == 0\nassert ratio(3, 0) is None\ntry:\n    ratio("bad", 2)\nexcept TypeError:\n    pass\nelse:\n    raise AssertionError("Do not swallow TypeError")',
        hints: [
          "Catch ZeroDivisionError rather than Exception.",
          "The invalid string should still raise TypeError.",
        ],
      },
    ],
    recall: [
      {
        id: "exceptions-recall",
        prompt:
          "A bad string reaches arithmetic because of a programming bug. Should a count parser swallow every exception?",
        options: [
          "Yes, return zero so the report always finishes",
          "No, catch expected parse failures and let unrelated defects surface",
          "Yes, any traceback means the user made a mistake",
        ],
        correct: 1,
        explanation:
          "Broad handling masks defects and invents successful data. Narrow exception boundaries preserve evidence.",
      },
    ],
    references: [pythonReference("errors")],
  },
  {
    id: "objects",
    title: "Objects, invariants and dataclasses",
    level: "Intermediate",
    minutes: 85,
    prerequisites: ["functions", "exceptions"],
    packages: [],
    objectives: [
      "Distinguish instance state from shared class state.",
      "Enforce an invariant through a small public interface.",
      "Use a dataclass for a record without confusing it with validation.",
    ],
    sections: [
      {
        title: "Bundle data with rules that protect it",
        paragraphs: [
          "An object combines state and behavior. A Workload object can store contact counts and calculate hours using a consistent unit policy. A class defines the interface; each instance has its own state. Creating two instances should not accidentally share a list of observations. Classes are useful when operations belong to a persistent entity with meaningful invariants. A plain function is often better for a stateless calculation.",
          "A method is a function accessed through an instance. Python passes the instance as the first argument, conventionally named self. In self.contacts = contacts, the left side stores an attribute on that instance, while the right side reads the local parameter. __init__ initializes a newly created instance; it must not return an ordinary value. Calling Workload(120) constructs and initializes an object. Calling workload.hours(300) then invokes behavior using its state.",
          "An invariant is a rule that should remain true whenever callers observe the object. For a validated count, nonnegative contacts may be an invariant. Check it at construction and in any method that changes it. Python underscores communicate intended internal use but do not enforce private memory access. Do not claim a local class provides a security boundary. A disciplined interface helps correctness; hostile callers can still deliberately bypass conventions.",
        ],
      },
      {
        title: "Instance state is not class state",
        paragraphs: [
          "An assignment in a class body creates a class attribute. A mutable list there is shared by instances unless an instance attribute shadows it. To give each report its own rows, set self.rows = [] inside __init__. This resembles the mutable-default problem from functions: the issue is the lifetime and ownership of an object, not a special prohibition on lists. Test two instances to expose accidental shared state.",
          "Dataclasses generate repetitive record methods such as __init__, __repr__ and __eq__ from annotated fields. They are convenient for structured values such as an interval label and count. Annotations do not validate values automatically. Put domain checks in __post_init__ if the record must enforce them. For a mutable field, use field(default_factory=list), not a shared default. frozen=True prevents normal attribute rebinding but does not recursively freeze objects stored inside fields.",
          "Prefer composition before building an inheritance hierarchy. A report can contain interval records and use a calculation function. It does not need to inherit from every record type. Inheritance is useful when substitutability and shared contracts are clear. Overriding a method in a subclass should preserve the promises callers rely on, including acceptable inputs and failure behavior.",
        ],
      },
      {
        title: "Test the public behavior",
        paragraphs: [
          "A class test should demonstrate ordinary use, an invalid construction and independence between instances. Avoid tests that depend on every internal attribute if callers only need a documented method. For a count object, check that the calculated hours change with its inputs and that invalid counts are rejected. For a list-owning object, append to one instance and verify the other remains empty.",
          "A professional codebase does not use classes merely to appear advanced. Ask which state lives longer than one calculation and which rule the interface protects. A dataclass record plus pure functions can be clearer than a large mutable manager. In the eventual reporting capstone, immutable source records, explicit validation and a small aggregation layer will keep responsibilities inspectable.",
        ],
      },
    ],
    syntax: [
      {
        token: "class Name:",
        meaning: "Define a new class and its namespace.",
      },
      {
        token: "self.attribute",
        meaning: "Access state on this particular instance.",
      },
      {
        token: "@dataclass",
        meaning:
          "Generate record methods; validation still needs explicit code.",
      },
    ],
    examples: [
      {
        title: "Protect the count invariant",
        code: 'class Workload:\n    def __init__(self, contacts):\n        if contacts < 0:\n            raise ValueError("contacts must be nonnegative")\n        self.contacts = contacts\n\n    def hours(self, seconds_per_contact):\n        return self.contacts * seconds_per_contact / 3600\n\nreport = Workload(120)\nprint(report.hours(300))\nprint(Workload(0).hours(300))',
        output: "10.0\n0.0\n",
        walkthrough: [
          "__init__ validates before storing the count.",
          "self.contacts belongs to one instance.",
          "hours reads instance state and a method argument.",
          "Separate instances can represent zero and nonzero demand.",
        ],
      },
      {
        title: "A record with an independent list",
        code: 'from dataclasses import dataclass, field\n\n@dataclass\nclass Report:\n    name: str\n    rows: list = field(default_factory=list)\n\na = Report("North")\nb = Report("South")\na.rows.append(12)\nprint(a.rows)\nprint(b.rows)',
        output: "[12]\n[]\n",
        walkthrough: [
          "The decorator generates a constructor for name and rows.",
          "default_factory calls list separately for each instance.",
          "Appending to a.rows changes only the first report.",
          "The empty b.rows is evidence of independent ownership.",
        ],
      },
    ],
    debugging: [
      {
        symptom: "TypeError: missing required positional argument self",
        explanation:
          "Call an instance method on an instance, and include self in its definition.",
      },
      {
        symptom: "Two reports unexpectedly share rows",
        explanation:
          "Move mutable per-instance state into __init__, or use dataclass field(default_factory=list).",
      },
      {
        symptom: "Invalid values enter a typed dataclass",
        explanation:
          "Type annotations do not enforce runtime contracts. Add explicit validation where needed.",
      },
    ],
    exercises: [
      {
        id: "objects-counter",
        title: "Model a nonnegative counter",
        prompt:
          "Implement Counter(start=0), add(amount), and value. Reject negative start or increments with ValueError. Independent instances must retain independent counts.",
        starter:
          "class Counter:\n    def __init__(self, start=0):\n        self.value = start\n\n    def add(self, amount):\n        pass",
        solution:
          'class Counter:\n    def __init__(self, start=0):\n        if start < 0:\n            raise ValueError("negative start")\n        self.value = start\n\n    def add(self, amount):\n        if amount < 0:\n            raise ValueError("negative increment")\n        self.value += amount',
        tests:
          'a, b = Counter(2), Counter()\na.add(3)\nassert a.value == 5 and b.value == 0\nfor action in [lambda: Counter(-1), lambda: a.add(-1)]:\n    try:\n        action()\n    except ValueError:\n        pass\n    else:\n        raise AssertionError("Reject negative values")\nassert a.value == 5',
        hints: [
          "Validate before mutating state.",
          "Use self.value rather than a class-level shared value.",
        ],
      },
      {
        id: "objects-record",
        title: "Create independent report records",
        prompt:
          "Define a dataclass Report with name and rows. rows must default to a new empty list for each instance.",
        starter:
          "from dataclasses import dataclass, field\n\n# Define Report here.",
        solution:
          "from dataclasses import dataclass, field\n\n@dataclass\nclass Report:\n    name: str\n    rows: list = field(default_factory=list)",
        tests:
          'from dataclasses import is_dataclass\nassert is_dataclass(Report)\na, b = Report("A"), Report("B")\na.rows.append(4)\nassert a.rows == [4] and b.rows == []\nassert Report("C", [2]).rows == [2]',
        hints: [
          "Annotate name and rows beneath @dataclass.",
          "Use field(default_factory=list) to allocate independent lists.",
        ],
      },
    ],
    recall: [
      {
        id: "objects-recall",
        prompt:
          "What does a dataclass annotation such as contacts: int guarantee at runtime?",
        options: [
          "It rejects every non-integer automatically",
          "It communicates the intended type but does not validate it",
          "It makes the object immutable",
        ],
        correct: 1,
        explanation:
          "Annotations support readers and tools. Explicit validation enforces runtime value contracts.",
      },
    ],
    references: [
      pythonReference("classes"),
      {
        title: "dataclasses — data classes",
        url: "https://docs.python.org/3.12/library/dataclasses.html",
        version: "Python 3.12",
        license: "PSF License",
        retrieved: "2026-10-23",
      },
    ],
  },
  {
    id: "pandas",
    title: "Pandas: clean records and aggregate honestly",
    level: "Advanced",
    minutes: 95,
    prerequisites: ["loops", "functions", "exceptions", "objects"],
    packages: ["pandas"],
    objectives: [
      "Load a CSV into a DataFrame and inspect missing or invalid values.",
      "Aggregate numerator and denominator rather than averaging percentages.",
      "Validate join cardinality and preserve source evidence.",
    ],
    sections: [
      {
        title: "A table has a schema and a population",
        paragraphs: [
          "A pandas DataFrame is a labeled two-dimensional table whose columns may have different dtypes. A Series is a labeled one-dimensional object, often one column from a frame. Column labels and indexes are part of the data model: operations may align by label rather than by physical position. This is powerful, but it means a spreadsheet intuition about row position is not enough. Inspect columns, dtypes and row counts before transforming a new source.",
          'read_csv parses text according to explicit or inferred rules. Real sources contain blanks, malformed numbers and inconsistent labels. A missing numeric value may become NaN; a nullable dtype may use pd.NA. Neither should automatically be interpreted as a genuine zero. pd.to_numeric(errors="coerce") converts unparseable entries to missing values, which is useful only if you subsequently audit what was rejected. Dropping rows without counting them silently changes the reporting population.',
          "The first example uses StringIO so its entire dataset is visible and reproducible. On a desktop, pass a pathlib.Path to read_csv instead. In this browser, files live in the temporary worker filesystem and disappear between runs. The pinned runtime includes pandas 2.2.3 and NumPy 2.0.2, loaded locally with no package download during execution. The first load and offline snapshot are larger than a text-only lesson; a slow device may take several seconds to initialize.",
        ],
      },
      {
        title: "Clean with a declared policy",
        paragraphs: [
          "A cleaning rule must be explainable. Here contacts must parse as numeric and be nonnegative. Construct a boolean mask from those requirements, retain accepted rows with .loc[mask].copy(), and count rejected rows separately. Copying makes the ownership of the cleaned table explicit. If labels require normalization, use string methods deliberately and retain the raw column when auditability matters. Do not change a category merely because it looks unfamiliar.",
          'Use vectorized Series operations for column arithmetic. frame["workload_seconds"] = frame["contacts"] * frame["aht_seconds"] multiplies aligned values without a Python-level row loop. Vectorization often improves clarity and speed, but it does not validate units or missingness. A fast calculation with a wrong denominator is still wrong. Inspect the effect of each transformation on the row population and numeric totals.',
          "A groupby divides records by key, applies an aggregation and combines results. Default missing-key behavior can exclude rows with missing group labels, so choose dropna=False when those rows must remain visible. A group total should preserve additive components such as contacts and workload seconds. Calculate ratios after summing their components. Averaging row averages implicitly gives every row equal weight, regardless of its population.",
        ],
      },
      {
        title: "Joins and metrics need contracts",
        paragraphs: [
          "Suppose queue A has 90 timely answers from 100 offered contacts, and queue B has 10 from 20. The combined service level is 100 / 120, about 83.33%, not the average of 90% and 50%. Store both numerator and denominator. For a zero denominator, report missing or undefined according to the metric contract rather than forcing a zero percentage. Tests should include unequal populations so an incorrect unweighted method fails.",
          'A merge can multiply rows when a key appears multiple times on both sides. If each queue should map to exactly one region, merge with validate="many_to_one" and investigate a MergeError rather than accepting inflated totals. Use indicator=True to audit unmatched keys. Check the expected row count and key uniqueness before and after the join. A syntactically successful merge is not evidence that its business relationship is correct.',
          "For reproducibility, pin package versions, keep a data dictionary, record rejection counts and export deterministic results. Sort group labels before comparison when order is not part of the contract. A local browser exercise is a learning record, not an approved production reporting system. The professional capstone still requires files, schema validation, tests and an exportable report; this module establishes the aggregation decisions that pipeline must make.",
        ],
      },
    ],
    syntax: [
      {
        token: "frame.loc[mask].copy()",
        meaning:
          "Select accepted rows and make independent ownership explicit.",
      },
      {
        token: "groupby(key, dropna=False)",
        meaning: "Aggregate by label while retaining missing-key groups.",
      },
      {
        token: 'merge(..., validate="many_to_one")',
        meaning: "Assert that the right-side join key is unique.",
      },
    ],
    examples: [
      {
        title: "Keep a rejection count",
        code: 'import pandas as pd\nfrom io import StringIO\n\nsource = "team,contacts\\nNorth,12\\nSouth,bad\\nNorth,8\\nSouth,-2\\n"\nframe = pd.read_csv(StringIO(source))\nvalues = pd.to_numeric(frame["contacts"], errors="coerce")\nvalid = values.notna() & (values >= 0)\nclean = frame.loc[valid].copy()\nclean["contacts"] = values.loc[valid]\nprint("rejected:", int((~valid).sum()))\nprint(clean.groupby("team")["contacts"].sum().to_dict())',
        output: "rejected: 2\n{'North': 20.0}\n",
        walkthrough: [
          "StringIO supplies the complete synthetic CSV rather than a hidden file.",
          "to_numeric marks malformed text as missing; the mask also rejects negatives.",
          "The cleaned frame keeps accepted records and reports two rejected rows.",
          "The group total is computed from validated numeric values.",
        ],
      },
      {
        title: "Rebuild a ratio from additive components",
        code: 'import pandas as pd\n\nframe = pd.DataFrame({"timely": [90, 10], "offered": [100, 20]})\nservice_level = frame["timely"].sum() / frame["offered"].sum()\nprint(f"{service_level:.2%}")\nlookup = pd.DataFrame({"queue": ["A", "B"], "region": ["East", "West"]})\nrows = pd.DataFrame({"queue": ["A", "A", "B"]})\njoined = rows.merge(lookup, on="queue", validate="many_to_one")\nprint(joined["region"].tolist())',
        output: "83.33%\n['East', 'East', 'West']\n",
        walkthrough: [
          "Unequal denominators make a simple percentage average invalid.",
          "Sum both components before division.",
          "The lookup contains one region per queue.",
          "validate rejects a duplicate lookup key instead of silently multiplying records.",
        ],
      },
    ],
    debugging: [
      {
        symptom: "An aggregate is unexpectedly inflated after merge",
        explanation:
          "Inspect duplicate keys and enforce the intended join cardinality with validate.",
      },
      {
        symptom: "Missing data became zero without explanation",
        explanation:
          "Remove blanket fillna(0). Distinguish unknown values from observed zero and document the policy.",
      },
      {
        symptom: "Combined percentages disagree with component totals",
        explanation:
          "Rebuild the ratio from summed numerators and denominators; do not average percentages across unequal populations.",
      },
    ],
    exercises: [
      {
        id: "pandas-total",
        title: "Aggregate validated observations",
        prompt:
          "Define team_totals(frame). Ignore rows with missing or negative contacts and return a dict of summed contacts per team. Leave the input DataFrame unchanged. Empty input returns {}.",
        starter:
          "import pandas as pd\n\ndef team_totals(frame):\n    return {}",
        solution:
          'import pandas as pd\n\ndef team_totals(frame):\n    valid = frame["contacts"].notna() & (frame["contacts"] >= 0)\n    return frame.loc[valid].groupby("team")["contacts"].sum().to_dict()',
        tests:
          'import pandas as pd\nf = pd.DataFrame({"team": ["A", "B", "A", "B"], "contacts": [2, -1, 3, None]})\nbefore = f.copy(deep=True)\nassert team_totals(f) == {"A": 5}\nassert f.equals(before), "Do not mutate the source"\nassert team_totals(f.iloc[:0]) == {}\nassert team_totals(pd.DataFrame({"team":["B"],"contacts":[0]})) == {"B":0}',
        hints: [
          "Build a mask using notna() and >= 0.",
          "Group accepted rows by team and sum contacts, then call to_dict().",
        ],
      },
      {
        id: "pandas-ratio",
        title: "Calculate a weighted service level",
        prompt:
          "Define service_level(frame), with timely and offered columns. Return the combined ratio, or None when total offered is zero. Do not round the returned value.",
        starter:
          'def service_level(frame):\n    return (frame["timely"] / frame["offered"]).mean()',
        solution:
          'def service_level(frame):\n    offered = frame["offered"].sum()\n    if offered == 0:\n        return None\n    return frame["timely"].sum() / offered',
        tests:
          'import pandas as pd\nimport math\nf = pd.DataFrame({"timely":[90,10],"offered":[100,20]})\nassert math.isclose(service_level(f), 100/120)\nassert service_level(pd.DataFrame({"timely":[0],"offered":[0]})) is None\nassert service_level(pd.DataFrame({"timely":[0],"offered":[4]})) == 0',
        hints: [
          "The denominator is the sum of offered, not the number of rows.",
          "Handle a zero denominator before division.",
        ],
      },
    ],
    recall: [
      {
        id: "pandas-recall",
        prompt:
          "Two rows have timely/offered values 90/100 and 10/20. Which combined metric respects the population?",
        options: [
          "70%, the mean of the two percentages",
          "83.33%, calculated as (90 + 10) / (100 + 20)",
          "100%, because 100 contacts were timely",
        ],
        correct: 1,
        explanation:
          "Additive numerators and denominators preserve weighting. Equal weighting of rows would change the metric.",
      },
    ],
    references: [
      {
        title: "pandas: calculate summary statistics",
        url: "https://pandas.pydata.org/docs/getting_started/intro_tutorials/06_calculate_statistics.html",
        version: "pandas 2.2.3",
        license: "BSD-3-Clause; original examples and teaching prose.",
        retrieved: "2026-10-23",
      },
    ],
  },
];
