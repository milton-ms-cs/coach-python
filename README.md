# Python Coach

A Codio Custom Assistant (Virtual Coach) for middle school students who are learning Python for the first time.

## What it does

- Reads the student's open files and the guide page they're on before every answer, so it always sees their latest code.
- Explains error messages in plain language and points to the exact line.
- Shows a corrected line for a small bug, like a stray quote or a missing colon. For design questions it teaches the idea and asks the student to try.
- Teaches the way the assignment guide does (for example, f-strings for combining text and variables).
- Knows students work in Codio: it tells them to click **▶ Run** or type `python3 main.py` in the terminal.
- Never writes complete programs. Answers are short and written at a middle school reading level.

It's the simplest coach in this set: one `index.js` plus `metadata.json`, with no build step and no dependencies. That makes it a good starting template for a new coach.

## Using it in Codio

1. In Codio, go to **Organization > Extensions**, click **Add extension**, and paste this repository's URL. You need to be an organization owner.
2. Choose the coach in the [Virtual Coach settings](https://docs.codio.com/instructors/setupcourses/assignment-settings/virtual-coach.html) for a course or assignment.
3. After a new release, click **Check for Updates** on the Extensions page. Students can type `version` in the coach to see which version is running.

Every change to `index.js` or `metadata.json` needs a new GitHub release, with a tag that matches the `VERSION` constant in `index.js`.

## Session log

Each coach session adds a short summary to a hidden `.coach-log.json` file in the student's workspace: when it started and ended, the coach version, how many questions were asked, and the questions themselves (up to 50, each cut to 300 characters). Codio's own coach-log export leaves the student's question blank for message-based coaches like this one, so this file is the only record of what students asked. It's never sent to the model, and logging can't break the coach.

## Development

```bash
node --check index.js
```
