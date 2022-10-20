This small Firestore web app runs a limit query followed by a limit-to-last query.
It was used to determine the "expected results" of this bug:
https://github.com/googleapis/java-firestore/issues/1068

## Usage

1. Edit `firebase_config.ts` to fill out your `apiKey` and `projectId`
   (optional if you only want to use the Firestore emulator).
2. Run `npm install`
3. Run `npm run build` to generate the compiled JavaScript.
4. Open `index.html` in a web browser, and click the "Run Test" button.
