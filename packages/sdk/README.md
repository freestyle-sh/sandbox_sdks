# Freestyle Sandboxes SDK

SDK for [Freestyle Sandboxes API](https://api.freestyle.sh)

## Installation

```bash
npm install freestyle-sandboxes
```

## Usage

```javascript
import { FreestyleSandboxes } from "freestyle-sandboxes";

const sandboxes = new FreestyleSandboxes({
  apiKey: "your-api-key",
});

sandboxes.executeScript(
  `export default () => {
  let set1 = [1, 2, 3, 4, 5];
  let set2 = [4, 5, 6, 7, 8];

  // find the sum of every value of each set multiplied by every value of the other set

  let sum = 0;
  for (let i = 0; i < set1.length; i++) {
    for (let j = 0; j < set2.length; j++) {
      sum += set1[i] * set2[j];
    }
  }

  return sum;
};`
);
```

## AI SDK

The freestyle-sandboxes/ai package provides utilities to add Freestyle Sandboxes to your AI.

### Usage

```javascript
import { executeTool } from "freestyle-sandboxes/ai";
import { generateText } from "ai";

const codeExecutor = executeTool({
  apiKey: "your-api-key",
});

const { text, steps } = await generateText({
  model: yourModel,
  tools: {
    codeExecutor,
  },
  maxSteps: 2, // allow up to 5 steps
  prompt:
    "What is the sum of every number between 1 and 12 multiplied by itself?",
});
```
