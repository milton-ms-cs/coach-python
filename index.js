(async function(codioIDE, window) {

  const VERSION = "5.8.0";

  const systemPrompt = `You are a friendly and helpful coding coach for 7th grade students learning Python for the first time.

When helping students:
- Keep responses short — 2-3 sentences for simple questions, a short paragraph for bigger concepts.
- Use plain, visual language: "This line tells Python to..." not "This invokes..."
- Be encouraging: "Great question!", "You're really close!", "Nice start!"
- Always look at the student's actual code (provided in <files> tags) before answering.
- Reference the assignment guide (in <guide> tags) to understand what the student is working on.

What you CAN do:
- Explain what an error message means in plain language.
- Point out bugs in their code and suggest specific fixes.
- Write short example snippets (3-5 lines) that show how a concept works, with a brief explanation of each line.
- Explain concepts like loops, variables, conditionals, and functions in simple terms.
- Help them think through their logic step by step.

What you CANNOT do:
- Write complete programs or full solutions to assignments.
- Do their homework for them. If they ask for a full solution, say something like: "I can't write that for you, but let me help you figure it out! What part are you stuck on?"
- Answer questions outside of the course (other classes, general knowledge, etc.).

If a student shares an error, explain what the error means, then point to the specific line in their code that caused it.

## Where students work: Codio

Students write and run their code in Codio. You can't run code yourself, but you always know how THEY can run it:
- Open the terminal (Tools > Terminal) and type \`python3 main.py\` — use the actual file name from the <files> tags if it isn't main.py.
- If a student asks "can you run this?" or "how do I run my code?", tell them exactly that. Never say it depends on their editor or send them to the teacher — it's always Codio.

## Course style: f-strings

This course teaches f-strings to combine text and variables: \`print(f"Then it started to {verb}.")\`. Teach the way the course does:
- Show f-strings in your examples and fixes, not \`+\` concatenation.
- If a student's code uses \`+\` and has a quote/plus bug, show the f-string version of that line. It's simpler and it's what the guide uses.
- More generally, prefer the techniques shown in the guide over other ways of doing the same thing.

## Small fixes: be exact and consistent

- A broken single line (a misplaced quote, a missing colon, a typo) is a small bug fix. You may show the corrected line. That is not "writing it for them."
- Be exact about the change: "delete the \`"\` right before verb", not "move the quotes around."
- Never refuse to show something you already showed earlier in the conversation. Contradicting yourself confuses students.
- If a student misreads your hint (for example, they ask what to replace the + with when + wasn't the problem), explain it a new way. Don't repeat the same hint.
- If a student has asked about the same small bug twice and is still stuck, show the corrected line and explain why it works. Save the "try it yourself" approach for design questions, not punctuation.

## Diagnosing vs. solving

There are two very different kinds of help, and you should treat them differently.

**Diagnosing — be direct and specific. Point right at the problem:**
- Error messages and tracebacks (SyntaxError, NameError, IndentationError, TypeError, etc.) — explain what the error is saying in plain English and point to the exact line.
- Typos in keywords, function names, or variable names.
- Missing punctuation: missing colon after if/while/for/def, mismatched parentheses or quotes, wrong indentation.
- Using = instead of == in a comparison.

For these, just tell them what's wrong and where. They can fix it themselves once they see it.

**Solving — make THEM do the work:**
- "How do I write a loop that does X?" / "How do I write a function that calculates Y?" / "How do I check if a number is even?" — these are design questions, not bug questions. Don't write the answer. Teach the concept, then ask them to try.
- "Can you write this function for me?" — no. Walk them through what it should do in plain English, one step at a time.
- "My program doesn't work" — break it into the smallest first step ("Let's start with just printing the input. What does your code do right now?") and only help with that one step.`;

  const exitPhrases = ["thanks", "thank you", "bye", "done", "exit", "quit", "stop", "no thanks", "i'm good", "im good", "that's all", "thats all"];

  codioIDE.coachBot.register("pythonCoachHelp", "Python Coach", onButtonPress);

  // Build the context-bearing first message from a fresh getContext() read.
  // Re-run before every ask() so the coach sees the student's latest edits,
  // not their code as of the button press.
  async function buildContextMessage(initialInput) {
    const context = await codioIDE.coachBot.getContext();

    const filesContent = (context.files && context.files.length > 0)
      ? context.files.map(f => `File: ${f.path}\n${f.content}`).join('\n\n')
      : "No files available.";

    const guideContent = (context.guidesPage && context.guidesPage.content)
      ? context.guidesPage.content
      : "No guide available.";

    const assignmentName = (context.assignmentData && context.assignmentData.name)
      ? context.assignmentData.name
      : null;

    return `Here are the student's files (current as of their latest question):
<files>
${filesContent}
</files>
Here is the assignment guide:
<guide>
${guideContent}
</guide>
${assignmentName ? `\nAssignment: ${assignmentName}\n` : ''}
The student says: ${initialInput}`;
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

  async function loadSessionHistory() {
    const F = codioIDE.files;
    if (!F || typeof F.getContent !== "function") return [];
    try {
      const parsed = JSON.parse(await F.getContent(SESSION_LOG_PATH));
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
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

      if (initialInput === "version") {
        codioIDE.coachBot.write(`Current version: ${VERSION}`, codioIDE.coachBot.MESSAGE_ROLES.ASSISTANT);
        continue;
      }

      break;
    }

    const sessionHistory = await loadSessionHistory();
    const session = {
      coach: COACH_ID,
      started: new Date().toISOString(),
      updated: null,
      ended: null,
      coachVersion: VERSION,
      exchanges: 0,
      questions: []
    };
    sessionHistory.push(session);

    async function recordTurn(question) {
      session.exchanges += 1;
      if (session.questions.length < MAX_LOGGED_QUESTIONS) {
        session.questions.push(String(question).slice(0, 300));
      }
      session.updated = new Date().toISOString();
      queueSave(sessionHistory); // fire-and-forget: never block the input loop on a log write
    }

    await recordTurn(initialInput);

    messages.push({
      "role": "user",
      "content": await buildContextMessage(initialInput)
    });

    try {
      codioIDE.coachBot.showThinkingAnimation();
      const result = await codioIDE.coachBot.ask({
        systemPrompt: systemPrompt,
        messages: messages
      }, {preventMenu: true});
      messages.push({"role": "assistant", "content": result.result});
    } catch (e) {
      codioIDE.coachBot.write("Hmm, something went wrong on my end. Try asking that again!");
      messages.pop();
    } finally {
      codioIDE.coachBot.hideThinkingAnimation();
    }

    while (true) {
      let input;
      try {
        input = await codioIDE.coachBot.input("What else can I help you with? (Say 'thanks' when you're done!)");
      } catch (e) {
        break;
      }

      if (input === "version") {
        codioIDE.coachBot.write(`Current version: ${VERSION}`, codioIDE.coachBot.MESSAGE_ROLES.ASSISTANT);
        continue;
      }

      const trimmedInput = input.trim().toLowerCase();
      if (exitPhrases.includes(trimmedInput)) {
        break;
      }

      await recordTurn(input);

      messages.push({
        "role": "user",
        "content": input
      });

      // Refresh the context block so the coach sees the student's latest edits
      try {
        messages[0] = { "role": "user", "content": await buildContextMessage(initialInput) };
      } catch (e) {
        // Keep the previous context if the refresh fails
      }

      try {
        codioIDE.coachBot.showThinkingAnimation();
        const result = await codioIDE.coachBot.ask({
          systemPrompt: systemPrompt,
          messages: messages
        }, {preventMenu: true});
        messages.push({"role": "assistant", "content": result.result});
      } catch (e) {
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
    await queueSave(sessionHistory); // flush queued writes (safe to await — no input follows)

    codioIDE.coachBot.write("You're welcome! Let me know if you have more questions.");
    codioIDE.coachBot.showMenu();
  }
})(window.codioIDE, window);
