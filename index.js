(async function(codioIDE, window) {

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

  async function onButtonPress() {
    let messages = [];

    // Get initial context
    const context = await codioIDE.coachBot.getContext();

    let initialInput;
    try {
      initialInput = await codioIDE.coachBot.input("What can I help you with?");
    } catch (e) {
      codioIDE.coachBot.showMenu();
      return;
    }

    // Build structured first message with student's files and guide
    const filesContent = (context.files && context.files.length > 0)
      ? context.files.map(f => `File: ${f.path}\n${f.content}`).join('\n\n')
      : "No files available.";

    const guideContent = (context.guidesPage && context.guidesPage.content)
      ? context.guidesPage.content
      : "No guide available.";

    const assignmentName = (context.assignmentData && context.assignmentData.name)
      ? context.assignmentData.name
      : null;

    const initialUserPrompt = `Here are the student's files:
<files>
${filesContent}
</files>
Here is the assignment guide:
<guide>
${guideContent}
</guide>
${assignmentName ? `\nAssignment: ${assignmentName}\n` : ''}
The student says: ${initialInput}`;

    messages.push({
      "role": "user",
      "content": initialUserPrompt
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

      const trimmedInput = input.trim().toLowerCase();
      if (exitPhrases.includes(trimmedInput)) {
        break;
      }

      messages.push({
        "role": "user",
        "content": input
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
        continue;
      } finally {
        codioIDE.coachBot.hideThinkingAnimation();
      }

      // Keep first message (with files + guide) + last 8 messages (4 exchanges)
      while (messages.length > 9) {
        messages.splice(1, 2); // drop the oldest assistant+user pair, keep messages[0] (context) intact
      }
    }

    codioIDE.coachBot.write("You're welcome! Let me know if you have more questions.");
    codioIDE.coachBot.showMenu();
  }
})(window.codioIDE, window);
