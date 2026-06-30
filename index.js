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

If a student shares an error, explain what the error means, then point to the specific line in their code that caused it.`;

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

    const initialUserPrompt = `Here are the student's files:
<files>
${filesContent}
</files>
Here is the assignment guide:
<guide>
${guideContent}
</guide>

The student says: ${initialInput}`;

    messages.push({
      "role": "user",
      "content": initialUserPrompt
    });

    try {
      const result = await codioIDE.coachBot.ask({
        systemPrompt: systemPrompt,
        messages: messages
      }, {preventMenu: true});
      messages.push({"role": "assistant", "content": result.result});
    } catch (e) {
      codioIDE.coachBot.write("Hmm, something went wrong on my end. Try asking that again!");
      messages.pop();
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
        const result = await codioIDE.coachBot.ask({
          systemPrompt: systemPrompt,
          messages: messages
        }, {preventMenu: true});
        messages.push({"role": "assistant", "content": result.result});
      } catch (e) {
        codioIDE.coachBot.write("Hmm, something went wrong on my end. Try asking that again!");
        messages.pop();
        continue;
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
