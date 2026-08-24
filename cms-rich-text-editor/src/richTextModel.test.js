/**
 * Regression: Retool remounts the custom-component iframe when the
 * caret crosses the initial viewport (scrollIntoView / auto-height).
 * After remount, the last modelUpdate() fields are still on `model`,
 * but the editor was re-initialized from `initialValue` only — wiping
 * in-progress edits when initialValue is empty.
 */
const assert = require('assert')
const {
  parseRichTextValue,
  getInitialValueKey,
  resolveEditorDocument,
  shouldSeedOutputs,
} = require('./richTextModel')

const emptyDoc = {
  nodeType: 'document',
  data: {},
  content: [
    {
      nodeType: 'paragraph',
      data: {},
      content: [{ nodeType: 'text', value: '', marks: [], data: {} }],
    },
  ],
}

const userDoc = {
  nodeType: 'document',
  data: {},
  content: [
    {
      nodeType: 'paragraph',
      data: {},
      content: [{ nodeType: 'text', value: '+65 peanut robot', marks: [], data: {} }],
    },
  ],
}

const otherDoc = {
  nodeType: 'document',
  data: {},
  content: [
    {
      nodeType: 'paragraph',
      data: {},
      content: [{ nodeType: 'text', value: 'a different card', marks: [], data: {} }],
    },
  ],
}

// --- legacy behavior copied from RichText.js (the bug) ---
function legacyResolve(model) {
  let richTextValue
  if (typeof model.initialValue === 'string' && model.initialValue.length) {
    try {
      richTextValue = JSON.parse(`${model.initialValue}`)
    } catch (e) {
      richTextValue = undefined
    }
  }
  return richTextValue
}

function legacyShouldSeed() {
  // useEffect([initialValue]) always runs on mount
  return true
}

const remountAfterTyping = {
  initialValue: undefined,
  value: userDoc,
  hasChanged: true,
  appliedInitialKey: '',
}

assert.strictEqual(
  legacyResolve(remountAfterTyping),
  undefined,
  'sanity: legacy path ignores persisted model.value'
)
assert.strictEqual(legacyShouldSeed(), true, 'sanity: legacy path re-seeds (wipes) on remount')

// --- desired behavior ---
assert.deepStrictEqual(
  resolveEditorDocument(remountAfterTyping),
  userDoc,
  'remount after typing must restore persisted model.value'
)
assert.strictEqual(
  shouldSeedOutputs(remountAfterTyping),
  false,
  'remount after typing must not re-seed outputs from empty initialValue'
)

assert.deepStrictEqual(
  resolveEditorDocument({ initialValue: undefined }),
  undefined,
  'first mount with no initialValue uses fallback (undefined)'
)
assert.strictEqual(
  shouldSeedOutputs({ initialValue: undefined }),
  true,
  'first mount should seed outputs'
)

assert.deepStrictEqual(
  resolveEditorDocument({ initialValue: JSON.stringify(userDoc) }),
  userDoc,
  'parses stringified initialValue'
)
assert.deepStrictEqual(
  parseRichTextValue(userDoc),
  userDoc,
  'accepts object initialValue (Retool sometimes passes JSON, not a string)'
)

const switchedRecord = {
  initialValue: JSON.stringify(otherDoc),
  value: userDoc,
  hasChanged: true,
  appliedInitialKey: getInitialValueKey(undefined),
}
assert.deepStrictEqual(
  resolveEditorDocument(switchedRecord),
  otherDoc,
  'a new initialValue from the parent wins over a previous edit'
)
assert.strictEqual(
  shouldSeedOutputs(switchedRecord),
  true,
  'a new initialValue should re-seed outputs'
)

assert.deepStrictEqual(
  resolveEditorDocument({ initialValue: '', value: emptyDoc, appliedInitialKey: '' }),
  emptyDoc,
  'empty initialValue key still restores a persisted empty/default document'
)

assert.deepStrictEqual(
  resolveEditorDocument({
    initialValue: undefined,
    value: userDoc,
    hasChanged: true,
  }),
  userDoc,
  'upgrade remount without appliedInitialKey still restores persisted edits'
)

console.log('richTextModel.test.js: all assertions passed')
