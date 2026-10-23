import type { PythonLesson } from "./types";

export const collectionsLesson: PythonLesson = {
  id: "collections",
  title: "Collections, identity and reliable record summaries",
  level: "Beginner",
  minutes: 75,
  prerequisites: ["variables", "loops", "functions"],
  packages: [],
  objectives: [
    "Choose lists, tuples, sets and dictionaries for different data contracts.",
    "Trace mutation, aliases and shallow copies without changing source records.",
    "Build ordered deduplication and validated dictionary aggregation functions.",
  ],
  sections: [
    {
      title: "Choose the structure from the question",
      paragraphs: [
        "Imagine receiving a small list of service records. One question asks which teams appeared first, another asks how many contacts each team handled, and another asks which unique teams were present. These questions describe different relationships. A list keeps items in sequence and permits duplicates. A dictionary associates a key with a value, so a team name can lead to its accumulated count. A set records membership without duplicate elements. A tuple represents a fixed sequence of positions, such as a team and a count returned together. Choose a structure because it expresses the relationship clearly, not because its brackets look familiar.",
        "Sequence indexing starts at zero. values[0] selects the first item and values[-1] selects the last. Indexing an empty list raises IndexError, so decide what empty input means before selecting an item. A slice such as values[1:3] includes the start and excludes the stop; it creates a new outer list rather than editing the original. Readability matters more than compressing every operation into one expression. For a beginner report, an explicit loop with named intermediate values is often easier to audit than a deeply nested comprehension.",
        "Use a tuple when the positions form a small record whose structure should remain fixed. team, contacts = pair unpacks exactly two items; the number of names must match the number of values. A single-item tuple needs a comma, as in (team,). Parentheses alone do not create it. Tuple immutability prevents replacing an element, but a mutable list stored inside a tuple can still change. A fixed outer container does not automatically make every object reachable through it immutable. Name this distinction when explaining a data contract to someone else.",
      ],
    },
    {
      title: "Mutation changes an object; assignment changes a binding",
      paragraphs: [
        "Suppose planned = [3, 5] and actual = planned. Both names refer to one list. Calling actual.append(7) therefore changes what planned sees too. By contrast, actual = [9] rebinds actual to another list and leaves planned alone. This is the same assignment model from the first chapter, now applied to mutable objects. Before adding a copy, ask whether the program intends shared state. Sharing is useful when it is deliberate, but accidental sharing can silently alter a baseline used later in the report.",
        "planned.copy() or planned[:] creates a shallow copy: a new outer list containing references to the same elements. With numbers this often gives the independence you need, because numbers are immutable. With nested lists or dictionaries, editing a nested object can still affect the original. The first example makes that effect visible rather than hiding it. Build new result records when the function promises to preserve its input. For a deeply nested snapshot, copy.deepcopy is an option, but it has a cost and should follow a clear ownership decision rather than become an automatic habit.",
        "Methods that mutate a list, such as append and sort, return None. Writing result = names.sort() sorts names and binds result to None; it does not produce a separate sorted list. Use sorted(names) when you need a new result. Avoid removing items from a list while looping over that same list, because shifting positions can cause an item to be skipped. Accumulate accepted items in a new list instead. The non-mutation assertions in this chapter check that your output did not come at the cost of damaging the input.",
      ],
    },
    {
      title: "Make keys, ordering and validation explicit",
      paragraphs: [
        "A dictionary lookup totals[team] requires that key to exist. totals.get(team, 0) supplies a default without inserting the missing key. Combining that default with assignment gives an accumulation pattern: totals[team] = totals.get(team, 0) + contacts. Dictionary iteration follows insertion order. A set has no sequence-position contract, so converting a set directly to a list does not promise first-seen ordering. For stable deduplication, use a list for the result and a set for membership. Add a name to both only when you encounter it for the first time.",
        "Dictionary keys and set members must be hashable. Strings and integers are suitable; lists and dictionaries are not. An empty set is set(), because {} creates an empty dictionary. Membership tests also depend on the structure: name in totals checks dictionary keys, whereas name in totals.values() checks its stored values. Choose that operation intentionally. If the report must print a reproducible sequence, sort the keys explicitly rather than treating the appearance of one set display as a permanent promise.",
        "Validation belongs before aggregation. The second task accepts nonnegative integers and deliberately rejects booleans, even though isinstance(True, int) is true in Python. It also rejects missing or blank team names. These are exercise-specific rules, not universal business rules: another application might accept decimal quantities or route invalid records into an error list. State the accepted domain in the function contract, handle empty input as a normal case, and test unseen team names. A function that works only for the sample names has memorized an example rather than solved the problem.",
      ],
    },
  ],
  syntax: [
    {
      token: "items[start:stop]",
      meaning: "Create a slice; start is included and stop is excluded.",
    },
    {
      token: "mapping.get(key, default)",
      meaning: "Read a value or return a fallback without inserting the key.",
    },
    {
      token: "set()",
      meaning:
        "Create an empty set for unique, hashable members; {} is a dictionary.",
    },
    {
      token: "name, count = pair",
      meaning: "Unpack a two-item sequence into two names.",
    },
  ],
  examples: [
    {
      title: "A shallow copy still shares nested objects",
      code: 'planned = [[3], [5]]\nactual = planned.copy()\nactual[0].append(7)\nactual.append([9])\nprint(planned)\nprint(actual)\npair = ("North", 8)\nteam, contacts = pair\nprint(team, contacts)',
      output: "[[3, 7], [5]]\n[[3, 7], [5], [9]]\nNorth 8\n",
      walkthrough: [
        "The copy creates another outer list, while both lists still reference the same two inner lists.",
        "Appending 7 to the first inner list is visible through both outer lists.",
        "Appending a new outer element changes actual alone, so planned still contains two elements.",
        "Unpacking the tuple binds a name to each of its two positions; it does not modify the tuple.",
      ],
    },
    {
      title: "Accumulate totals and print a stable report",
      code: 'records = [("North", 3), ("South", 2), ("North", 4)]\ntotals = {}\nfor team, contacts in records:\n    totals[team] = totals.get(team, 0) + contacts\nprint(sorted(totals.items()))\nexpected = {"North", "West"}\nprint(sorted(expected - set(totals)))',
      output: "[('North', 7), ('South', 2)]\n['West']\n",
      walkthrough: [
        "Each tuple supplies one team key and one numeric contribution.",
        "The first contribution uses the zero fallback; the next contribution for that key adds to its existing total.",
        "sorted creates a reproducible display without depending on a set's iteration order.",
        "Set difference identifies expected keys absent from the observed dictionary, here West.",
      ],
    },
  ],
  debugging: [
    {
      symptom: "A baseline changes when a copy is edited",
      explanation:
        "Trace which object changed. A shallow outer copy still shares nested mutable elements with the original.",
    },
    {
      symptom: "The sorted result is None",
      explanation:
        "list.sort mutates the original and returns None. Use sorted when the contract requires a new sorted list.",
    },
    {
      symptom: "A missing team raises KeyError",
      explanation:
        "Use a deliberate missing-key policy: validate required record keys, and use get with zero when initializing an aggregate.",
    },
  ],
  exercises: [
    {
      id: "collections-unique",
      title: "Keep the first appearance of each name",
      prompt:
        "Define unique_names(names). For a list of strings, strip surrounding whitespace, ignore empty results and return unique names in first-seen order. Matching is case-sensitive. Return a new list and leave the input unchanged. Empty input returns [].",
      starter: "def unique_names(names):\n    return names",
      solution:
        "def unique_names(names):\n    result = []\n    seen = set()\n    for raw in names:\n        name = raw.strip()\n        if name and name not in seen:\n            seen.add(name)\n            result.append(name)\n    return result",
      tests:
        'from copy import deepcopy\nsource = [" North ", "", "South", "North", "north", "  ", "South"]\nbefore = deepcopy(source)\nresult = unique_names(source)\nassert result == ["North", "South", "north"], "Preserve first-seen order after trimming; matching is case-sensitive."\nassert source == before, "Do not mutate the input."\nassert result is not source, "Return a new list."\nassert unique_names([]) == []\nassert unique_names(["Beta", "Alpha", "Beta", "Gamma"]) == ["Beta", "Alpha", "Gamma"]\nassert unique_names([" x ", "x", " "]) == ["x"]',
      hints: [
        "Use a list for order and a set for membership; an unordered set alone cannot express first appearance.",
        "Normalize each string with strip before checking whether it is empty or already seen.",
      ],
    },
    {
      id: "collections-totals",
      title: "Summarize valid team records without mutation",
      prompt:
        "Define team_totals(records) for a list of dictionaries. A valid row has a nonblank string team and a nonnegative integer contacts value; booleans are invalid counts. Strip the team name, sum valid rows by team and ignore invalid rows or missing fields. Keep zero-contact teams. Return a new dictionary; leave all input records unchanged. Empty input returns {}.",
      starter: "def team_totals(records):\n    return {}",
      solution:
        'def team_totals(records):\n    totals = {}\n    for record in records:\n        team = record.get("team")\n        contacts = record.get("contacts")\n        if not isinstance(team, str) or not team.strip():\n            continue\n        if not isinstance(contacts, int) or isinstance(contacts, bool) or contacts < 0:\n            continue\n        team = team.strip()\n        totals[team] = totals.get(team, 0) + contacts\n    return totals',
      tests:
        'from copy import deepcopy\nrows = [{"team":" North ","contacts":3},{"team":"North","contacts":4},{"team":"South","contacts":0},{"team":"North","contacts":-1},{"team":"Flag","contacts":True},{"team":"","contacts":8},{"team":None,"contacts":2},{"contacts":9},{"team":"Missing"},{"team":"Text","contacts":"5"},{"team":"Decimal","contacts":2.5}]\nbefore = deepcopy(rows)\nassert team_totals(rows) == {"North":7,"South":0}, "Validate records before aggregating and retain zero-count teams."\nassert rows == before, "Preserve every source record."\nassert team_totals([]) == {}\nassert team_totals([{"team":"Unseen","contacts":2},{"team":"Unseen","contacts":5}]) == {"Unseen":7}\nassert team_totals(list(reversed(rows))) == {"North":7,"South":0}',
      hints: [
        "Read optional fields with get, then validate the team string and numeric domain before adding a row.",
        "Reject bool explicitly, because it is a subclass of int. Initialize an unseen team with totals.get(team, 0).",
      ],
    },
  ],
  recall: [
    {
      id: "collections-recall",
      prompt:
        "After a = [[1]]; b = a.copy(); b[0].append(2), what does a contain?",
      options: [
        "[[1]], because every level was copied",
        "[[1, 2]], because the inner list is shared",
        "An error, because lists cannot contain lists",
      ],
      correct: 1,
      explanation:
        "The outer lists are different objects, but a shallow copy retains references to the same inner list. Mutating that inner list is visible from both.",
    },
  ],
  references: [
    {
      title: "Python tutorial: data structures",
      url: "https://docs.python.org/3.12/tutorial/datastructures.html",
      version: "Python 3.12 (Pyodide 0.27.7)",
      license: "PSF License; original teaching prose, examples and exercises.",
      retrieved: "2026-10-23",
    },
  ],
};
