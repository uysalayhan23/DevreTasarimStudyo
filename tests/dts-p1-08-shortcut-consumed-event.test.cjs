'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const {ladderShortcut} = require('../dist/ladder-editor.js');

// A nested control may consume an event before it bubbles to the Ladder dialog.
// The dialog must not run a second Undo/Redo/Save or alter the PLC draft.
const cases = [
  [
    "Ctrl+Z consumed",
    {
      "key": "z",
      "ctrlKey": true,
      "defaultPrevented": true
    },
    false,
    false,
    null
  ],
  [
    "Ctrl+Y consumed",
    {
      "key": "y",
      "ctrlKey": true,
      "defaultPrevented": true
    },
    false,
    false,
    null
  ],
  [
    "Ctrl+S consumed",
    {
      "key": "s",
      "ctrlKey": true,
      "defaultPrevented": true
    },
    false,
    false,
    null
  ],
  [
    "Cmd+Shift+Z consumed",
    {
      "key": "Z",
      "metaKey": true,
      "shiftKey": true,
      "defaultPrevented": true
    },
    false,
    false,
    null
  ],
  [
    "Ctrl+Z normal",
    {
      "key": "z",
      "ctrlKey": true
    },
    false,
    false,
    "undo"
  ],
  [
    "Ctrl+Y normal",
    {
      "key": "y",
      "ctrlKey": true
    },
    false,
    false,
    "redo"
  ],
  [
    "Cmd+Shift+Z normal",
    {
      "key": "Z",
      "metaKey": true,
      "shiftKey": true
    },
    false,
    false,
    "redo"
  ],
  [
    "Ctrl+S normal",
    {
      "key": "s",
      "ctrlKey": true
    },
    false,
    false,
    "save"
  ],
  [
    "Ctrl+S input",
    {
      "key": "s",
      "ctrlKey": true
    },
    true,
    false,
    "pending-field"
  ],
  [
    "Ctrl+Z input",
    {
      "key": "z",
      "ctrlKey": true
    },
    true,
    false,
    null
  ],
  [
    "Ctrl+Z running",
    {
      "key": "z",
      "ctrlKey": true
    },
    false,
    true,
    "locked"
  ],
  [
    "Ctrl+Z composing",
    {
      "key": "z",
      "ctrlKey": true,
      "isComposing": true
    },
    false,
    false,
    null
  ],
  [
    "Ctrl+Alt+Z",
    {
      "key": "z",
      "ctrlKey": true,
      "altKey": true
    },
    false,
    false,
    null
  ],
  [
    "Plain Z",
    {
      "key": "z"
    },
    false,
    false,
    null
  ]
];
for (const [name, event, editing, running, expected] of cases) {
  test('P1-08 shortcut: '+name, () => {
    assert.equal(ladderShortcut(event, editing, running), expected);
  });
}
