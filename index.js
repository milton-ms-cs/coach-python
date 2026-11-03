(async function(codioIDE, window) {

  const VERSION = "5.9.0";

  const systemPrompt = `You are the Python Coach, a friendly and helpful coding coach for middle school students (grades 7 and 8) learning Python.

When helping students:
- Keep responses short: 2-3 sentences for simple questions, a short paragraph for bigger concepts.
- Use plain, visual language: "This line tells Python to..." not "This invokes..."
- Be encouraging by naming one specific thing they did right ("Your input line saves the answer correctly."). Only say they're close when one small fix is left. Don't start every reply the same way.
- Always look at the student's actual code (provided in <files> tags) before answering.
- Reference the assignment guide (in <guide> tags) to understand what the student is working on.
- When fixing a problem, prefer the tools the guide uses. Don't bring in lists, \`in\`, loops, sys.exit() or new string methods unless the guide shows them or the student already uses them. Explaining a concept they ask about is fine; solving their task with a tool the guide hasn't taught is not.

What you CAN do:
- Explain what an error message means in plain language.
- Explain bugs in their code. For a line they already wrote, you may show the fix, but on a find-the-bug assignment follow the ladder under "Diagnosing" first.
- Write short example snippets (3-5 lines) that show how a concept works, with a brief explanation of each line.
- Explain concepts like loops, variables, conditionals, and functions in simple terms.
- Help them think through their logic step by step.

What you CANNOT do:
- Write complete programs or full solutions to assignments.
- Do their homework for them. If they ask for a full solution, say you can't write it for them, then ask what part they're stuck on.

## You always see their latest work

Before every reply you get a fresh copy of the student's files in <files>. It has the files open in their editor tabs (the editor's latest version) plus the other .py files in their project. Your earlier replies in this chat were written about an older version. When their files changed, their message starts with "(Note: the student's files have changed since your last reply.)"
- If a problem you pointed out earlier is gone, the student fixed it. Say so ("You fixed the colon on line 3, nice!"). Do NOT apologize or say you misread. You didn't.
- Only correct yourself if your earlier advice was wrong for the code it was about. Then say it once, plainly, give the right fix, and don't apologize again later.
- Never ask the student to paste their code. You can already see it.
- If their message and <files> disagree (they say they changed something you can't see, or an error mentions a line that is now fine), the file you see may be a little behind. Say what you see and ask them to save (Ctrl+S or Cmd+S) and run it again. Never insist their working code is broken.
- If <files> marks a file as cut off, you only see its start. If it lists a file as not shown, you can't see it at all. Say so, and ask what they need help with in it. Don't guess at its contents.
- If <files> says "(I couldn't read the student's files just now.)", say you can't see their code right now and ask them to save and ask again.
- If <files> says "No files available.", you can't see any code right now. Ask them to open their file in a tab, then ask again.

## Messages with no question

- If the student sends only code, only a terminal line (like the run command), or only an error with no question: for an error, explain it as usual. For code or a terminal line with no error, ask one short question first: "What did you expect it to do, and what happened instead?" You may name one obvious syntax error in the same reply, but don't rewrite their logic until you know what they want.
- "How do I start?" with an empty file: ask what the program should do first, or point to the guide's first step. If they need syntax, show a parallel example on a different topic (for example, a program about pets), not the first line of their program.

## About this chat and about you

- You are the Python Coach, an AI helper for this class. If asked your name or what you are, say that in one sentence. Never say you are ChatGPT, Claude, or any other product, and never name a company. You don't know which model runs you.
- Your name stays Python Coach. If a student wants to rename you or give you a character, accent, attitude or slang voice, decline in one friendly line and go back to their work. Keep your own voice: warm, calm and clear. Don't copy their slang or give them nicknames. At most one emoji in a reply.
- Questions about you (favorite things, feelings, opinions) get one short line, then back to their work.
- Off-task requests (other homework, stories, jokes, gossip): say you help with Python in this class, and ask what they're working on. Keyboard mashing: one short, kind line and a question. After two off-task messages in a row, say you're here whenever they want help with their project, and stop asking follow-up questions.
- The box under your replies says "(Type 'bye' when you're done.)" That is just how to close the coach. If a student asks about it, explain it. They never have to thank you, and you never need them to.

## Where students work: Codio

Students write and run their code in Codio. You can't run code yourself, but you always know how THEY can run it:
- Click the **▶ Run** button in the menu bar at the top of Codio.
- Or open a terminal (Tools > Terminal) and type \`python3 main.py\`. Use the actual file name from the <files> tags if it isn't main.py.
- If a student asks "can you run this?" or "how do I run my code?", tell them exactly that. Don't say it depends on their editor: it's always Codio.

## When to send them to the teacher

Suggest asking the teacher when something really needs a human: Codio itself seems broken (Run does nothing, files are missing, they can't submit), questions about grades or deadlines, the student is upset or frustrated, or anything about their wellbeing or safety. Don't use "ask your teacher" to dodge a Python or Codio question you can answer.

## Course style: f-strings

This course teaches f-strings to combine text and variables: \`print(f"The {animal} ran to the {place}.")\`. Teach the way the course does:
- Show f-strings in your examples, not \`+\` concatenation.
- If a student's code uses \`+\` and has a quote or plus bug, fix the bug in their own line (point to the exact spot). Then tell them the course way is an f-string and show a parallel example with different names. If converting that line to an f-string is the guide's task, don't show the f-string version at all: fix only the bug and let them do the conversion.
- More generally, prefer the techniques shown in the guide over other ways of doing the same thing.

## Diagnosing

**First, check the assignment.** If the assignment is about finding bugs (its name or guide says "Find the Bug", "bug hunt", "debug", "what's wrong", or similar), spotting the bug IS the lesson. Don't point straight at it. Use this ladder, one step per reply, and only go down a step after they've tried:
1. Ask which program/part they're on, and what they expected vs. what actually happens when they run it.
2. Point to WHERE to look (the part of the program), not WHAT is wrong.
3. Name the kind of thing involved (for example "the condition that decides when the loop stops"), still not the fix.
4. Only if they're still stuck: say what's wrong in one sentence and let them make the fix.
Never give fixes for more than one bug in a reply. If they say you're not helping, say sorry in a few words and give the next step of the ladder, not the answer.
On other assignments, the direct diagnosing rules below still apply.

**Bugs in a line they already wrote: be direct.** Error messages and tracebacks (SyntaxError, NameError, IndentationError, TypeError, etc.), typos in keywords, function names or variable names, a missing colon after if/while/for/def, mismatched parentheses or quotes, = instead of ==, a wrong index: explain what the error says in plain English, say what is wrong, and point to the exact line. You may show the corrected version of a line THEY already wrote. This is for fixing their line, never for writing a line they haven't tried yet.
- A check like \`if answer == "yes" or "y":\` is always true, because "y" on its own counts as true. If you see it anywhere in their file, mention it briefly even if they asked about something else. Explain it; don't rewrite the line for them.
- Indentation: use the same number of spaces the student's file already uses and keep it consistent. If the same indentation error comes back twice, show the whole small block with exact spacing and tell them to delete and retype it so no hidden tabs remain. A third time, suggest asking the teacher.
- If a student misreads your hint, explain it a new way. Don't repeat the same hint.

## Short programs: one line can be the whole answer

Many tasks in this class are only a few lines, so one "small" line can be the entire step. Before you show any code, compare it with the task in the <guide>: if your snippet plus their code would finish the step, don't show it. Show the idea with different names and values instead, and let them write their own line.

**The skills the lessons teach: they write them.** These are NOT small fixes:
  a condition that joins checks with and / or; which if/elif comes first; adding int() so input() text becomes a number; a loop's counter, total or True/False flag; matching or filtering items in a loop.
For these, ask for their plan in words first, then show a parallel example with different names and values, or a template with blanks. Never write it with their own variable names and values filled in, and don't open with a numbered recipe: that recipe IS the answer.
- "How do I write a loop that does X?", "Can you write this function for me?", "My program doesn't work": these are design questions. Teach the concept, walk through what it should do in plain English one step at a time, and break "doesn't work" into the smallest first step ("Let's start with just printing the input. What does your code do right now?").

**When they keep asking ("show me", "next", "just tell me", "I don't get it")**, each answer gives LESS of the solution, not more:
1. First ask: explain the idea and show a parallel example with different names.
2. Second ask: give a template with blanks for the parts that belong to their program, or point to the exact line in THEIR file where the change goes and say in words what it must do.
3. Still stuck: ask which part they don't understand, or suggest they talk it through with their teacher. That's not a dodge here.
Never hand over the remaining lines of the step, even if they ask several times. Help with one part at a time, and don't give the next part until they've written the current one.

**Guide questions are theirs.** When the guide asks them to predict what the code will do, trace it, explain why something works, or write a reflection, plan or comment, don't give the answer. Ask what they think, then react to it. For a reflection, give a sentence starter ("My code chose ___ because ___.") and a question that helps them fill it in. For a trace, ask what each step gives, one at a time. Never answer first and then ask them to "say it in their own words."

**Code blocks get pasted.** Students often copy whatever is in a code block straight into their file. Put only code meant for their file in a code block, and say plainly when an example uses different data ("Here's the same idea with a list of pets:").

Example. A student's check lets every answer through and they ask how to fix it.
Good: "Each side of \`and\` needs its own full comparison. Here's the shape with different names: \`if flavor == "mint" and size == "large":\`. Now build yours with your own variables."
Bad: writing their exact condition with their variable names and values.`;

  const exitPhrases = ["thanks", "thank you", "bye", "goodbye", "done", "exit", "quit", "stop", "no thanks", "i'm good", "im good", "that's all", "thats all"];

  // Exit only when the whole message is a goodbye ("thanks!", "ok bye", "no thanks 🙂",
  // "i’m good thanks"). Every word must be goodbye vocabulary, so "thanks, still broken",
  // "i'm done with loops" or "stop button doesn't work" keep the chat open. "stop"/"exit"/
  // "quit"/"done" alone still exit through the exact exitPhrases list.
  const goodbyeWords = ["thanks", "thank", "you", "thx", "ty", "bye", "goodbye", "cya", "no", "ok", "okay",
    "cool", "great", "alright", "all", "that's", "thats", "i'm", "im", "good", "done", "for", "now",
    "see", "ya", "later", "so", "much", "then", "very", "lot", "a"];
  const goodbyeCores = ["thanks", "thank", "thx", "ty", "bye", "goodbye", "cya"];
  const goodbyePhrases = ["i'm good", "im good", "i'm done", "im done", "that's all", "thats all", "see ya", "see you"];
  function isExitMessage(text) {
    if (typeof text !== "string") return false;
    if (text.indexOf("?") !== -1) return false;
    const norm = text.toLowerCase().replace(/[‘’]/g, "'").replace(/[^a-z' ]+/g, " ").replace(/\s+/g, " ").trim();
    if (!norm) return false;
    if (exitPhrases.includes(norm)) return true;
    const words = norm.split(" ");
    if (words.length > 6) return false;
    if (!words.every(function(w) { return goodbyeWords.indexOf(w) !== -1; })) return false;
    const padded = " " + norm + " ";
    return words.some(function(w) { return goodbyeCores.indexOf(w) !== -1; }) ||
      goodbyePhrases.some(function(p) { return padded.indexOf(" " + p + " ") !== -1; });
  }

  codioIDE.coachBot.register("pythonCoachHelp", "Python Coach", onButtonPress);

  // ---- Project .py files read through codioIDE.files -------------------------
  // getContext().files lists only files OPEN in editor tabs, so supplement it with
  // every project .py file (same pattern as the micro:bit coach's collector).
  // Returns {entries, skipped}: entries are {path, block} ready to join; skipped names
  // are files that couldn't be read or didn't fit the budget. All reads are time-bounded.
  const FILE_CAP = 15000;
  const TOTAL_BUDGET = 40000;

  function fileBlock(path, content, limit) {
    limit = limit || FILE_CAP;
    if (content.length === 0) return `File: ${path}\n(empty file)`;
    if (content.length > limit) {
      return `File: ${path}\n${content.slice(0, limit)}\n(cut off after ${limit} characters)`;
    }
    return `File: ${path}\n${content}`;
  }

  async function collectPythonFiles(skipPaths) {
    const result = { entries: [], skipped: [] };
    const F = codioIDE.files;
    if (!F || typeof F.getStructure !== "function" || typeof F.getContent !== "function") return result;

    let files = [];
    try {
      files = findPythonFiles(await withTimeout(F.getStructure(), 8000, "structure"), "");
    } catch (err) {
      return result;
    }
    files.sort();

    let used = 0;
    for (const filePath of files) {
      if (skipPaths && skipPaths.has(normalizePath(filePath))) continue;
      if (used >= TOTAL_BUDGET) { result.skipped.push(filePath); continue; }

      try {
        const content = await withTimeout(F.getContent(filePath), 8000, "read " + filePath);
        if (typeof content !== "string") { result.skipped.push(filePath); continue; }
        // a file cut by the remaining budget (not just the per-file cap) is still partly visible
        const block = fileBlock(filePath, content, Math.min(FILE_CAP, TOTAL_BUDGET - used));
        result.entries.push({ path: filePath, block: block });
        used += block.length;
      } catch (err) {
        result.skipped.push(filePath);
      }
    }

    return result;
  }

  function normalizePath(p) {
    return String(p).replace(/^\.\//, "").replace(/^\//, "");
  }

  // getStructure() returns a name->value MAP: a file's value is a leaf (Codio
  // uses 1), a directory's value is a nested map, not an array of nodes.
  function findPythonFiles(node, path) {
    let out = [];
    if (!node || typeof node !== "object") return out;

    for (const name in node) {
      if (!Object.prototype.hasOwnProperty.call(node, name)) continue;
      if (name.startsWith(".")) continue;
      const full = path ? `${path}/${name}` : name;
      const value = node[name];

      if (value && typeof value === "object") {
        out = out.concat(findPythonFiles(value, full));
      } else if (name.toLowerCase().endsWith(".py")) {
        out.push(full);
      }
    }
    return out;
  }

  // The exact text last placed between <files> tags (not the guide, not the question).
  let lastFilesBlock = "";
  let lastContextDegraded = false; // true when getContext() failed and this block has no open-tab files

  // Build the context-bearing first message from a fresh getContext() read plus
  // the project .py files. Re-run before every ask() so the coach sees the
  // student's latest edits, not their code as of the button press.
  // On a refresh the newest question is the last message, so the first question
  // is only mentioned as history.
  async function buildContextMessage(initialInput, isRefresh) {
    let context = {};
    lastContextDegraded = false;
    try {
      context = (await withTimeout(codioIDE.coachBot.getContext(), 8000, "getContext")) || {};
    } catch (e) {
      // On a refresh, keep the previous context (the caller catches this). On the first
      // turn, answer with no open-tab files or guide rather than not at all.
      if (isRefresh) throw e;
      context = {};
      lastContextDegraded = true;
    }

    // Open-tab files first. A tab whose content isn't a string is unreadable: try the
    // same path through codioIDE.files, otherwise list it as not shown.
    const entries = [];
    const skipped = [];
    const openPaths = new Set();
    for (const f of (context.files || [])) {
      if (!f || typeof f.path !== "string") continue;
      openPaths.add(normalizePath(f.path));
      let content = f.content;
      if (typeof content !== "string") {
        content = null;
        try {
          const F = codioIDE.files;
          if (F && typeof F.getContent === "function") {
            const got = await withTimeout(F.getContent(f.path), 8000, "read " + f.path);
            if (typeof got === "string") content = got;
          }
        } catch (e) {}
      }
      if (content === null) skipped.push(normalizePath(f.path));
      else entries.push({ path: normalizePath(f.path), block: fileBlock(normalizePath(f.path), content) });
    }

    try {
      const extra = await collectPythonFiles(openPaths);
      extra.entries.forEach(function(en) { entries.push(en); });
      extra.skipped.forEach(function(n) { skipped.push(n); });
    } catch (e) {}

    // Sorted by path so tab order or getStructure key order can't change the block.
    entries.sort(function(x, y) { return x.path < y.path ? -1 : (x.path > y.path ? 1 : 0); });
    let filesContent = entries.map(function(en) { return en.block; }).join('\n\n');
    if (!filesContent) filesContent = "No files available.";
    if (skipped.length > 0) {
      filesContent += `\n\nNot shown (too long to include, or couldn't be read): ${skipped.join(", ")}`;
    }
    lastFilesBlock = filesContent;

    const guideContent = (context.guidesPage && context.guidesPage.content)
      ? context.guidesPage.content
      : "No guide available.";

    const assignmentName = (context.assignmentData && context.assignmentData.name)
      ? context.assignmentData.name
      : null;

    const ending = isRefresh
      ? `(The student's first question in this chat was: ${initialInput}. Their newest message is the last one below.)`
      : `The student says: ${initialInput}`;

    return `Here are the student's files (current as of their latest question):
<files>
${filesContent}
</files>
Here is the assignment guide:
<guide>
${guideContent}
</guide>
${assignmentName ? `\nAssignment: ${assignmentName}\n` : ''}
${ending}`;
  }

  // ============================================================
  // Session log — a hidden, shared workspace file (.coach-log.json) that every
  // coach appends to (one entry per session, tagged with `coach`), summarizing
  // how students use the coaches. Dot-prefixed so it never enters the LLM
  // context. Deliberately records the student's questions: Codio's own course
  // coach-log export logs only the userPrompt field, which is empty for
  // messages-based coaches like these — this file is where the questions live.
  // Sessions are never dropped (always appended). Logging is wrapped so it can
  // never break the coach.
  // ============================================================

  const SESSION_LOG_PATH = ".coach-log.json";
  const COACH_ID = "python";
  const MAX_LOGGED_QUESTIONS = 50;

  // Returns the parsed history, [] when the file doesn't exist or is empty, or null when the
  // file exists but couldn't be read/parsed. null disables saving for this session so a
  // transient read failure can never overwrite (wipe) everyone's history.
  async function loadSessionHistory() {
    const F = codioIDE.files;
    if (!F || typeof F.getContent !== "function") return null;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const text = await withTimeout(F.getContent(SESSION_LOG_PATH), 8000, "read log");
        if (typeof text !== "string" || !text.trim()) return [];
        const parsed = JSON.parse(text);
        return Array.isArray(parsed) ? parsed : null;
      } catch (e) {
        await delay(300);
      }
    }
    // Both reads failed: only start fresh if the file really isn't there.
    try {
      if (typeof F.getStructure === "function") {
        const tree = await withTimeout(F.getStructure(), 8000, "structure");
        if (tree && typeof tree === "object" && Object.keys(tree).length > 0 && !(SESSION_LOG_PATH in tree)) return [];
      }
    } catch (e) {}
    return null;
  }

  // Bound any files-API call so a hung deleteFiles/add/getContent can't stall the coach.
  const delay = (ms) => new Promise((r) => setTimeout(r, ms));

  function withTimeout(promise, ms, label) {
    let t;
    const timeout = new Promise((_, rej) => { t = setTimeout(() => rej(new Error("timeout: " + label)), ms); });
    return Promise.race([promise, timeout]).finally(() => clearTimeout(t));
  }

  // Confirm a write really landed — Codio's deleteFiles()+add() overwrite can land
  // a 0-byte file while add() throws nothing (observed live Aug 2026: the shared
  // .coach-log.json was wiped to 0 bytes). Verify by length (tolerant of trailing-
  // newline normalization), not exact match.
  async function readbackOk(F, path, content) {
    if (typeof F.getContent !== "function") return true;
    try {
      const got = await withTimeout(F.getContent(path), 8000, "read " + path);
      return typeof got === "string" && got.length > 0 && got.length >= content.length - 4;
    } catch (e) {
      return false;
    }
  }

  // Write and VERIFY. add() can't overwrite, so an existing file needs
  // deleteFiles()+add — but that add can land empty if the delete hasn't settled,
  // so pause, re-add, read back, and retry. Never reports success on an empty write.
  async function addVerified(F, path, content) {
    try {
      await withTimeout(F.add(path, content), 8000, "add " + path);
      if (await readbackOk(F, path, content)) return true;
    } catch (e) {}
    if (typeof F.deleteFiles !== "function") return false;
    for (let attempt = 0; attempt < 5; attempt++) {
      try { await withTimeout(F.deleteFiles([path]), 8000, "del " + path); } catch (e) {}
      await delay(150 + attempt * 150);
      try { await withTimeout(F.add(path, content), 8000, "add " + path); } catch (e) {}
      if (await readbackOk(F, path, content)) return true;
      await delay(150);
    }
    return false;
  }

  async function saveSessionHistory(history) {
    const F = codioIDE.files;
    if (!F || typeof F.add !== "function") return;
    const text = JSON.stringify(history, null, 2);
    await addVerified(F, SESSION_LOG_PATH, text);
  }

  // Never block the conversation on a log write — shared pattern, see the coaches
  // CLAUDE.md "Session Logging". saveSessionHistory() is a full read-modify-rewrite
  // (deleteFiles + add) of the shared log; awaiting it in the turn loop means a
  // stalled write freezes the coach with no input box. queueSave() serializes
  // writes on a promise chain (overlapping fire-and-forget saves can't corrupt the
  // file) and is called WITHOUT await each turn; only the end-of-session flush is awaited.
  let saveChain = Promise.resolve();
  function queueSave(history) {
    saveChain = saveChain.then(function() { return saveSessionHistory(history); }).catch(function() {});
    return saveChain;
  }

  // ============================================================
  // Strict mode: a nudge toward trying first for students who lean on the coach.
  // Turned on from this workspace's own .coach-log.json history, never from a
  // list of students. It changes only the advice in STRICT_PROMPT; the coach still
  // helps on every question and never mentions a mode, limit or count. Thresholds
  // are here so the monthly review can tune them.
  // ============================================================
  const STRICT_WORKSPACE_QUESTIONS = 20; // questions logged in this workspace by this coach...
  const STRICT_WORKSPACE_DAYS = 14;      // ...in sessions that started within this many days
  const STRICT_SESSION_QUESTIONS = 10;   // questions in the current session
  const STRICT_RECENT_WINDOW = 8;        // look at the last N questions...
  const STRICT_RECENT_NEXT_STEP = 5;     // ...and turn on if this many are "next step" asks
  const STRICT_RELEASE_ATTEMPTS = 2;     // own attempts in a row that turn it off for the session

  const NEXT_STEP_PATTERNS = [
    /^(ok(ay)? )?(so )?(what'?s |what is )?(the )?next( step| part| one)?( please| pls)?$/,
    /^(ok(ay)? )?(and )?then what$/,
    /^(what goes |the )?next (line|bit)$/,
    /^what goes next$/,
    /^(keep going|continue|go on|more)( please| pls)?$/,
    /^(and|ok) (then|now)$/,
    /^(idk|i don'?t know|i dunno)( what to do| what to write)?$/,
    /\bshow me\b/,
    /\bwhat (do|should|can) i (write|type|put|add|do|drag|click|use)\b/,
    /\b(what|which) blocks? (do|should|can) i (use|add|drag|put|need)\b/,
    /^which blocks?$/,
    /\bwhat'?s the (code|answer)\b/,
    /\bwhat now\b/,
    /\bnow what\b/,
    /\bis (this|it|that|my code|mine) (right|correct|good|ok|okay)$/,
    /\bjust tell me\b/,
    /\b(give|write|tell) me the (code|answer|line|blocks?)\b/,
    /\b(can|could) you (just )?(write|code|do|make|finish) (it|this|that|the [a-z ]+|my [a-z ]+) for me\b/,
    /\bdo it for me\b/,
    /^(can (you|u) )?(just )?fix (it|this|that|my [a-z]+)( for me)?( please| pls)?$/,
    /^can (you|u) (just )?do it$/
  ];

  function normalizeAsk(text) {
    return String(text || "").toLowerCase().replace(/[‘’]/g, "'").replace(/[^a-z0-9' ?\n]+/g, " ").replace(/[ \t]+/g, " ").trim();
  }

  const CODE_WORDS = ["if", "elif", "else", "for", "in", "while", "def", "return", "and", "or", "not", "is", "import", "from", "as", "true", "false", "none", "pass", "break", "with", "class", "let", "const", "var", "function"];

  // A paste of code with no question, no error and no sentence of their own in it.
  // A non-code line with 3+ plain words (outside quotes and comments) counts as their own
  // words ("my plan: ask for a number", "it prints twice"), so it isn't a bare paste.
  function isBarePaste(text) {
    const s = String(text || "");
    if (s.length < 12 || s.indexOf("?") !== -1) return false;
    if (!/[=(){}\[\]:<>;]/.test(s)) return false; // no code characters: it's prose, not a paste
    if (/error|traceback|exception|\b(why|how|what|where|help|doesn'?t|isn'?t|won'?t|can'?t|stuck|wrong|broken|not|nothing|still|instead|but|working|tried|plan)\b/i.test(s)) return false;
    return !s.split("\n").some(function(line) {
      const bare = line.replace(/(["'])(?:(?!\1).)*\1/g, " ").replace(/(#|\/\/).*$/, " ");
      if (/[=(){}\[\]:<>;+*\/-]/.test(bare)) return false; // a code line
      const plain = bare.split(/\s+/).filter(function(w) { return /^[a-z]+[.,!]?$/i.test(w) && CODE_WORDS.indexOf(w.toLowerCase()) === -1; });
      return plain.length >= 3;
    });
  }

  function isNextStepPhrase(text) {
    const norm = normalizeAsk(text).replace(/\?/g, "").trim();
    if (!norm || norm.split(/\s+/).length > 10) return false;
    if (/error|traceback|\b(run|running|tried|try|plan)\b/.test(norm)) return false; // normal help
    return NEXT_STEP_PATTERNS.some(function(p) { return p.test(norm); });
  }

  function isNextStepAsk(text) {
    return isBarePaste(text) || isNextStepPhrase(text);
  }

  // The student is working on their own: they changed their files, or wrote a real
  // message (a plan, an explanation, a specific question) instead of a "next" ask.
  function isOwnAttempt(text, filesChanged) {
    if (isNextStepPhrase(text)) return false;
    if (filesChanged) return true; // they edited their work (a paste after an edit counts)
    if (isBarePaste(text)) return false;
    return normalizeAsk(text).split(/\s+/).filter(Boolean).length >= 6;
  }

  // Returns the threshold that fired ("workspace", "session" or "next-steps"), or null.
  function strictTrigger(history, session) {
    let workspaceCount = 0;
    let recent = [];
    for (let i = 0; i < history.length; i++) {
      const s = history[i];
      if (!s || typeof s !== "object" || s.coach !== COACH_ID) continue; // this coach's sessions only
      const qs = Array.isArray(s.questions) ? s.questions : [];
      const startedMs = Date.parse(s.started);
      if (s !== session && !(startedMs > Date.now() - STRICT_WORKSPACE_DAYS * 86400000)) continue; // old or undated
      workspaceCount += (typeof s.exchanges === "number" && s.exchanges >= qs.length) ? s.exchanges : qs.length;
      recent = recent.concat(qs.filter(function(q) { return typeof q === "string"; }));
    }
    if (workspaceCount >= STRICT_WORKSPACE_QUESTIONS) return "workspace";
    if ((session.exchanges || 0) >= STRICT_SESSION_QUESTIONS) return "session";
    const last = recent.slice(-STRICT_RECENT_WINDOW);
    if (last.filter(isNextStepAsk).length >= STRICT_RECENT_NEXT_STEP) return "next-steps";
    return null;
  }

  // Call once per question, after recordTurn() (so `history` includes this session and
  // this question). Updates the session's log fields; the next queued save carries them.
  function updateStrict(state, history, session, latestText, filesChanged) {
    if (state.released) return state; // off for the rest of this session
    if (state.on) {
      state.attemptStreak = isOwnAttempt(latestText, filesChanged) ? state.attemptStreak + 1 : 0;
      if (state.attemptStreak >= STRICT_RELEASE_ATTEMPTS) {
        state.on = false;
        state.released = true;
        session.strictReleased = true;
      }
      return state;
    }
    const reason = strictTrigger(history, session);
    if (reason) {
      state.on = true;
      state.reason = reason;
      state.attemptStreak = 0;
      session.strict = true;
      session.strictReason = reason;
    }
    return state;
  }

  const STRICT_PROMPT = `

## Right now: help this student try first

This student has been leaning on you for the next step. Stay warm and keep helping with every question, but nudge them to try first.
- Same as always: explain what an error message means and which line it points to, explain an idea, give a short example with different names or data, point out a typo or missing punctuation, and help them find a block, menu or button, and tell them how to run their work.
- For "what do I write", "next" or "show me" questions, first ask one short question back ("What do you think the next step is?" or "What did you try?") and wait for their answer. If they answer with a real attempt, even a wrong one, help as usual from there.
- Don't write the lesson's main step in their own work (their condition, their loop, their counter, their blocks). Show the pattern with different names and let them adapt it. If they ask twice for that step, give a parallel example, not their finished line. Fixing a typo or missing punctuation in a line they already wrote is still fine.
- After about three "next step" asks in a row, suggest they run what they have and see what happens, or ask them to explain their plan in one sentence.
- If they've been stuck on the same thing for three or more turns, kindly suggest their teacher, for example: "This one might be easier to sort out with your teacher. If you're in class, ask them now. If you're working at home, send them a message about where you're stuck." That's a suggestion, never a refusal. Keep helping too.
- Never mention a mode, a limit or how many questions they've asked, and never refuse. You're a coach who wants them to try first.`;

  // Short, stable fingerprint of the files block the model sees (FNV-1a, 8 hex chars).
  // Logged per turn so a later review can tell "student fixed it" from "coach saw stale files".
  function fingerprint(text) {
    const s = String(text || "");
    let h = 0x811c9dc5;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
    return { len: s.length, hash: ("0000000" + h.toString(16)).slice(-8) };
  }


  async function onButtonPress() {
    codioIDE.coachBot.write(
      `Python Coach v${VERSION} - Ask me your Python questions!`,
      codioIDE.coachBot.MESSAGE_ROLES.ASSISTANT
    );

    let messages = [];

    let initialInput;
    while (true) {
      try {
        initialInput = await codioIDE.coachBot.input("What can I help you with?");
      } catch (e) {
        codioIDE.coachBot.showMenu();
        return;
      }

      if ((initialInput || "").trim().toLowerCase() === "version") {
        codioIDE.coachBot.write(`Current version: ${VERSION}`, codioIDE.coachBot.MESSAGE_ROLES.ASSISTANT);
        continue;
      }

      if (typeof initialInput !== "string" || !initialInput.trim()) continue;

      break;
    }

    // A goodbye as the very first message: no ask(), no log session.
    if (isExitMessage(initialInput)) {
      codioIDE.coachBot.write("Okay, bye! Come back any time you want help.");
      codioIDE.coachBot.showMenu();
      return;
    }

    let sessionHistory = await loadSessionHistory();
    const logEnabled = sessionHistory !== null;
    if (!logEnabled) sessionHistory = [];
    const session = {
      coach: COACH_ID,
      started: new Date().toISOString(),
      updated: null,
      ended: null,
      coachVersion: VERSION,
      exchanges: 0,
      questions: [],
      contextFingerprints: [],
      failedReplies: 0,
      strict: false,
      strictReason: null,
      strictReleased: false
    };
    sessionHistory.push(session);

    async function recordTurn(question) {
      session.exchanges += 1;
      if (session.questions.length < MAX_LOGGED_QUESTIONS) {
        session.questions.push(String(question).slice(0, 300));
      }
      session.updated = new Date().toISOString();
      if (logEnabled) queueSave(sessionHistory); // fire-and-forget: never block the input loop on a log write
    }

    // Files-changed baseline: hash of the files block behind the last reply the student
    // actually got. Kept out of the capped contextFingerprints array on purpose.
    const strictState = { on: false, reason: null, released: false, attemptStreak: 0 };
    let lastAnsweredHash = null;
    let currentHash = null;
    function noteFingerprint() {
      if (lastContextDegraded) { noteFingerprintFailed(); return false; } // never use a degraded block as the baseline
      const fp = fingerprint(lastFilesBlock);
      currentHash = fp.hash;
      const changed = lastAnsweredHash !== null && fp.hash !== lastAnsweredHash;
      if (session.contextFingerprints.length < MAX_LOGGED_QUESTIONS) {
        session.contextFingerprints.push({ len: fp.len, hash: fp.hash, changed: changed });
      }
      return changed;
    }
    function noteFingerprintFailed() {
      currentHash = null;
      if (session.contextFingerprints.length < MAX_LOGGED_QUESTIONS) {
        session.contextFingerprints.push({ len: null, hash: null, changed: false, refreshFailed: true });
      }
    }
    // Context with no files, used when building the real one throws.
    function fallbackContext(question) {
      return `Here are the student's files:\n<files>\n(I couldn't read the student's files just now.)\n</files>\nThe student says: ${question}`;
    }

    await recordTurn(initialInput);

    let firstContent;
    try {
      firstContent = await buildContextMessage(initialInput, false);
      noteFingerprint();
    } catch (e) {
      firstContent = fallbackContext(initialInput);
      noteFingerprintFailed();
    }
    updateStrict(strictState, sessionHistory, session, initialInput, false);
    messages.push({
      "role": "user",
      "content": firstContent
    });

    try {
      codioIDE.coachBot.showThinkingAnimation();
      const result = await codioIDE.coachBot.ask({
        systemPrompt: strictState.on ? systemPrompt + STRICT_PROMPT : systemPrompt,
        messages: messages
      }, {preventMenu: true});
      const reply = (result && typeof result.result === "string") ? result.result : "";
      if (!reply.trim()) {
        // Never keep an empty assistant turn: an empty message in the history can make every
        // later ask() fail too (seen live: one session got 10 empty replies in a row).
        session.failedReplies = (session.failedReplies || 0) + 1;
        codioIDE.coachBot.write("Hmm, I didn't get an answer that time. Please ask again!");
        messages.pop();          // drop the user turn that got no answer
      } else {
        messages.push({ role: "assistant", content: reply });
        if (currentHash !== null) lastAnsweredHash = currentHash;
      }
    } catch (e) {
      session.failedReplies = (session.failedReplies || 0) + 1;
      codioIDE.coachBot.write("Hmm, something went wrong on my end. Try asking that again!");
      messages.pop();
    } finally {
      codioIDE.coachBot.hideThinkingAnimation();
    }

    while (true) {
      let input;
      try {
        input = await codioIDE.coachBot.input("What else can I help you with? (Type 'bye' when you're done.)");
      } catch (e) {
        break;
      }

      if ((input || "").trim().toLowerCase() === "version") {
        codioIDE.coachBot.write(`Current version: ${VERSION}`, codioIDE.coachBot.MESSAGE_ROLES.ASSISTANT);
        continue;
      }

      if (typeof input !== "string" || !input.trim()) continue;

      if (isExitMessage(input)) {
        break;
      }

      await recordTurn(input);

      if (messages.length === 0) {
        // The first reply failed, so there is no context message yet: start over with
        // this question as the initial one (keeps the student's new question).
        initialInput = input;
        let content;
        try {
          content = await buildContextMessage(input, false);
          noteFingerprint();
        } catch (e) {
          content = fallbackContext(input);
          noteFingerprintFailed();
        }
        updateStrict(strictState, sessionHistory, session, input, false);
        messages.push({ "role": "user", "content": content });
      } else {
        // Refresh the context block so the coach sees the student's latest edits
        let changed = false;
        try {
          const fresh = await buildContextMessage(initialInput, true);
          changed = noteFingerprint();
          messages[0] = { "role": "user", "content": fresh };
        } catch (e) {
          // Keep the previous context if the refresh fails
          changed = false;
          noteFingerprintFailed();
        }

        updateStrict(strictState, sessionHistory, session, input, changed);
        messages.push({
          "role": "user",
          "content": changed
            ? "(Note: the student's files have changed since your last reply.)\n\n" + input
            : input
        });
      }

      try {
        codioIDE.coachBot.showThinkingAnimation();
        const result = await codioIDE.coachBot.ask({
          systemPrompt: strictState.on ? systemPrompt + STRICT_PROMPT : systemPrompt,
          messages: messages
        }, {preventMenu: true});
        const reply = (result && typeof result.result === "string") ? result.result : "";
        if (!reply.trim()) {
          session.failedReplies = (session.failedReplies || 0) + 1;
          codioIDE.coachBot.write("Hmm, I didn't get an answer that time. Please ask again!");
          messages.pop();
          continue;
        } else {
          messages.push({ role: "assistant", content: reply });
          if (currentHash !== null) lastAnsweredHash = currentHash;
        }
      } catch (e) {
        session.failedReplies = (session.failedReplies || 0) + 1;
        codioIDE.coachBot.write("Hmm, something went wrong on my end. Try asking that again!");
        messages.pop();
        continue;
      } finally {
        codioIDE.coachBot.hideThinkingAnimation();
      }

      // Keep first message (with files + guide) + last 8 messages (4 exchanges)
      while (messages.length > 9) {
        messages.splice(1, 2); // drop the oldest assistant+user pair, keep messages[0] (context) intact
      }
    }

    session.ended = new Date().toISOString();
    if (logEnabled) await queueSave(sessionHistory); // flush queued writes (safe to await — no input follows)

    codioIDE.coachBot.write("Okay, bye! Come back any time you want help.");
    codioIDE.coachBot.showMenu();
  }
})(window.codioIDE, window);
