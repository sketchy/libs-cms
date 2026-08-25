import React from 'react'

export const bootId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

let nextInstanceId = 0

function isDebugEnabled() {
  try {
    if (typeof window !== 'undefined' && window.__RTE_DEBUG__ === true) {
      return true
    }
    if (typeof localStorage !== 'undefined' && localStorage.getItem('DEBUG_RTE') === '1') {
      return true
    }
  } catch {
    // sandboxed iframe / privacy mode
  }
  return false
}

export function log(event, payload) {
  if (!isDebugEnabled()) {
    return
  }
  console.log('[DEBUG-rte]', event, { bootId, ...payload })
}

function collectText(value) {
  if (value == null) {
    return ''
  }
  if (typeof value === 'string') {
    return value
  }
  if (Array.isArray(value)) {
    return value.map(collectText).join('')
  }
  if (typeof value === 'object') {
    if (typeof value.text === 'string') {
      return value.text
    }
    if (typeof value.value === 'string') {
      return value.value
    }
    if (value.children) {
      return collectText(value.children)
    }
    if (value.content) {
      return collectText(value.content)
    }
  }
  return ''
}

export function fingerprint(value) {
  if (value == null) {
    return { empty: true }
  }
  try {
    const json = JSON.stringify(value)
    const text = collectText(value)
    return {
      kind: Array.isArray(value) ? 'array' : typeof value,
      nodeType: value.nodeType,
      childCount: Array.isArray(value) ? value.length : value.content?.length ?? value.children?.length,
      jsonLength: json.length,
      textLength: text.length,
      textPreview: text.slice(0, 80),
    }
  } catch (error) {
    return { error: String(error) }
  }
}

let lastPublishedPlainText = ''
let verdictLoggedForPublished = false

export function recordPublished(value) {
  lastPublishedPlainText = collectText(value)
  verdictLoggedForPublished = false
}

function isEmptyOrDefault(value) {
  return collectText(value).trim().length === 0
}

/**
 * One line to copy from the Retool console when live published text is about
 * to be replaced by an empty/DEFAULTS document or a stale original.
 */
export function maybeLogVerdict(probe, appliedValue) {
  if (verdictLoggedForPublished) {
    return
  }
  const previous = lastPublishedPlainText
  if (!previous) {
    return
  }

  const appliedText = collectText(appliedValue)
  const replacingWithDefault = isEmptyOrDefault(appliedValue)
  const replacingWithOriginal = appliedText !== previous
  if (!replacingWithDefault && !replacingWithOriginal) {
    return
  }

  verdictLoggedForPublished = true
  log('VERDICT', {
    probe,
    replacingWith: replacingWithDefault ? 'default' : 'original',
    previousPublishedPlainText: previous.slice(0, 120),
    applied: fingerprint(appliedValue),
  })
}

export function useLifecycle(name, appliedValue) {
  const instanceIdRef = React.useRef(null)
  if (instanceIdRef.current === null) {
    nextInstanceId += 1
    instanceIdRef.current = nextInstanceId
  }
  const instanceId = instanceIdRef.current
  const appliedValueRef = React.useRef(appliedValue)
  appliedValueRef.current = appliedValue

  React.useEffect(() => {
    log('mount', { name, instanceId })
    if (appliedValueRef.current !== undefined) {
      maybeLogVerdict(`${name} mount`, appliedValueRef.current)
    }
    return () => {
      log('unmount', { name, instanceId })
    }
  }, [name, instanceId])
}
