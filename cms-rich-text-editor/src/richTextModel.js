/**
 * Retool model helpers for the rich text custom component.
 *
 * Retool remounts the sandbox iframe when the document/caret crosses the
 * initial viewport. After remount, `model` still has the last
 * modelUpdate() fields — we must restore from those instead of
 * re-seeding from an empty `initialValue`.
 */

function parseRichTextValue(initialValue) {
  if (initialValue == null || initialValue === '') {
    return undefined
  }

  if (typeof initialValue === 'string') {
    try {
      return JSON.parse(initialValue)
    } catch (e) {
      console.error('Could not parse string as JSON for rich text', e)
      return undefined
    }
  }

  if (typeof initialValue === 'object') {
    return initialValue
  }

  return undefined
}

function getInitialValueKey(initialValue) {
  if (initialValue == null || initialValue === '') {
    return ''
  }

  if (typeof initialValue === 'string') {
    return initialValue
  }

  try {
    return JSON.stringify(initialValue)
  } catch (e) {
    return ''
  }
}

function resolveEditorDocument({ initialValue, value, appliedInitialKey, hasChanged } = {}) {
  const initialKey = getInitialValueKey(initialValue)
  const parsedInitial = parseRichTextValue(initialValue)

  if (appliedInitialKey === initialKey && value) {
    return value
  }

  // First load of this build after a remount: key is missing, but Retool
  // still has the last published document from modelUpdate().
  if (appliedInitialKey === undefined && hasChanged && value) {
    return value
  }

  return parsedInitial
}

function shouldSeedOutputs({ initialValue, appliedInitialKey } = {}) {
  return getInitialValueKey(initialValue) !== appliedInitialKey
}

module.exports = {
  parseRichTextValue,
  getInitialValueKey,
  resolveEditorDocument,
  shouldSeedOutputs,
}
