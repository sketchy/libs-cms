import React from 'react'

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

export function reportCrash(error, meta = {}) {
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
      return (
        <div style={{ padding: 16, font: '13px/1.4 ui-sans-serif, system-ui, sans-serif' }}>
          Rich text editor crashed. Reload the page to try again.
        </div>
      )
    }
    return this.props.children
  }
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
