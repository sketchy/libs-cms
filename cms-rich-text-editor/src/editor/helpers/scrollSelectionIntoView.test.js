/**
 * Slate's default scrollSelectionIntoView calls element.scrollIntoView(),
 * which scrolls every ancestor — including the Retool iframe and the
 * parent canvas. That layout shift remounts the custom component.
 *
 * This helper must only adjust the editor's own overflow container.
 */
const assert = require('assert')
const { scrollSelectionIntoEditor } = require('./scrollSelectionIntoView')

function makeRect(top, bottom) {
  return { top, bottom, left: 0, right: 100, height: bottom - top, width: 100 }
}

function createNode({ overflowY = 'visible', rect, parent = null } = {}) {
  const node = {
    nodeType: 1,
    parentElement: parent,
    scrollTop: 0,
    style: {},
    getBoundingClientRect: () => rect,
    _overflowY: overflowY,
  }
  return node
}

const originalGetComputedStyle = global.getComputedStyle
global.getComputedStyle = (el) => ({ overflowY: el._overflowY || 'visible' })

try {
  const editor = { children: [] }

  // iframe/body (must never be scrolled)
  const body = createNode({ overflowY: 'auto', rect: makeRect(0, 200) })
  body.parentElement = { nodeType: 1, parentElement: null, _overflowY: 'visible' }

  // actual editor overflow container
  const editable = createNode({ overflowY: 'auto', rect: makeRect(40, 180), parent: body })
  editable.scrollTop = 0

  const leaf = createNode({ overflowY: 'visible', rect: makeRect(170, 190), parent: editable })

  const domRange = {
    startContainer: leaf,
    getBoundingClientRect: () => makeRect(170, 190),
  }

  scrollSelectionIntoEditor(editor, domRange)

  assert.ok(editable.scrollTop > 0, 'scrolls the editor container down to reveal the caret')
  assert.strictEqual(body.scrollTop, 0, 'must not scroll the iframe/body')

  // already in view — no extra scroll
  editable.scrollTop = 0
  const inViewRange = {
    startContainer: leaf,
    getBoundingClientRect: () => makeRect(50, 70),
  }
  scrollSelectionIntoEditor(editor, inViewRange)
  assert.strictEqual(editable.scrollTop, 0, 'does not scroll when the caret is already visible')

  // missing range is a no-op
  scrollSelectionIntoEditor(editor, null)
  scrollSelectionIntoEditor(editor, undefined)

  console.log('scrollSelectionIntoView.test.js: all assertions passed')
} finally {
  global.getComputedStyle = originalGetComputedStyle
}
