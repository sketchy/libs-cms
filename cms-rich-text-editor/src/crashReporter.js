import React from 'react'

const OVERLAY_ID = 'rte-crash-overlay'

function errorMessage(error) {
  if (error == null) {
    return 'Unknown error'
  }
  if (typeof error === 'string') {
    return error
  }
  return error.message || String(error)
}

function errorStack(error) {
  if (error && typeof error === 'object' && error.stack) {
    return String(error.stack)
  }
  return ''
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function shouldIgnore(error, event) {
  const message = errorMessage(error || event?.message)
  return message.includes('ResizeObserver loop')
}

export function reportCrash(error, meta = {}) {
  if (shouldIgnore(error)) {
    return
  }

  const payload = {
    at: new Date().toISOString(),
    source: meta.source || 'unknown',
    message: errorMessage(error),
    stack: errorStack(error),
    componentStack: meta.componentStack || '',
    extra: meta.extra || undefined,
  }

  try {
    window.__RTE_LAST_CRASH__ = payload
  } catch {
    // sandboxed iframe
  }

  console.error('[RTE crash]', payload.source, payload.message, error)

  if (typeof document === 'undefined' || document.getElementById(OVERLAY_ID)) {
    return
  }

  const root = document.createElement('div')
  root.id = OVERLAY_ID
  root.setAttribute('data-testid', 'rte-crash-overlay')
  root.style.cssText = [
    'position:fixed',
    'inset:0',
    'z-index:2147483647',
    'background:#1f2937',
    'color:#f9fafb',
    'font:13px/1.4 ui-sans-serif,system-ui,sans-serif',
    'padding:16px',
    'overflow:auto',
  ].join(';')

  const details = [
    payload.message,
    payload.stack,
    payload.componentStack,
  ].filter(Boolean).join('\n\n')

  root.innerHTML = `
    <div style="max-width:720px">
      <div style="font-size:16px;font-weight:700;color:#fca5a5">Rich text editor crashed</div>
      <div style="margin:8px 0;color:#d1d5db">
        Source: <code>${escapeHtml(payload.source)}</code>
      </div>
      <pre style="white-space:pre-wrap;word-break:break-word;background:#111827;padding:12px;border-radius:8px;margin:0">${escapeHtml(details)}</pre>
      <div style="display:flex;gap:8px;margin-top:12px">
        <button type="button" data-rte-crash-reload style="padding:8px 12px;border:0;border-radius:6px;background:#2563eb;color:#fff;cursor:pointer">Reload editor</button>
        <button type="button" data-rte-crash-copy style="padding:8px 12px;border:0;border-radius:6px;background:#374151;color:#fff;cursor:pointer">Copy error</button>
      </div>
    </div>
  `

  root.querySelector('[data-rte-crash-reload]')?.addEventListener('click', () => {
    window.location.reload()
  })
  root.querySelector('[data-rte-crash-copy]')?.addEventListener('click', () => {
    const text = JSON.stringify(payload, null, 2)
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text)
    }
  })

  document.body.appendChild(root)
}

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    reportCrash(error, {
      source: 'error-boundary',
      componentStack: info?.componentStack,
    })
  }

  render() {
    if (this.state.error) {
      return null
    }
    return this.props.children
  }
}

export function installGlobalCrashReporter() {
  if (typeof window === 'undefined' || window.__RTE_CRASH_REPORTER__) {
    return
  }
  window.__RTE_CRASH_REPORTER__ = true

  window.addEventListener('error', (event) => {
    if (shouldIgnore(event.error, event)) {
      return
    }
    reportCrash(event.error || event.message, { source: 'window.onerror' })
  })

  window.addEventListener('unhandledrejection', (event) => {
    reportCrash(event.reason, { source: 'unhandledrejection' })
  })
}

export function createGuardedModelUpdate(modelUpdate) {
  let count = 0
  let resetTimer = null
  let tripped = false

  return (payload) => {
    if (tripped) {
      return
    }

    count += 1
    if (!resetTimer) {
      resetTimer = setTimeout(() => {
        count = 0
        resetTimer = null
      }, 100)
    }

    if (count > 20) {
      tripped = true
      reportCrash(new Error('Maximum update depth exceeded (modelUpdate loop)'), {
        source: 'modelUpdate-circuit-breaker',
        extra: { count },
      })
      return
    }

    modelUpdate(payload)
  }
}
