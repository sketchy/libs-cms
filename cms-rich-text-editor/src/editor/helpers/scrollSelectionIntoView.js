/**
 * Scroll the caret into view without touching the window / iframe.
 *
 * Slate's default uses Element.scrollIntoView(), which walks every
 * scrollable ancestor. In a Retool custom component that includes the
 * iframe and the parent canvas — a layout shift that remounts us.
 */

function isElement(node) {
  return Boolean(node) && node.nodeType === 1
}

function overflowY(element) {
  if (typeof getComputedStyle !== 'function' || !element) {
    return 'visible'
  }
  return getComputedStyle(element).overflowY || 'visible'
}

function isScrollContainer(element) {
  const overflow = overflowY(element)
  return overflow === 'auto' || overflow === 'scroll'
}

function findScrollContainer(startNode) {
  let current = isElement(startNode) ? startNode : startNode && startNode.parentElement

  while (current) {
    if (isScrollContainer(current)) {
      const parent = current.parentElement
      // Never treat the iframe document as the editor scroller
      const isDocumentRoot =
        typeof document !== 'undefined' &&
        (current === document.body || current === document.documentElement)
      if (!parent || isDocumentRoot) {
        return null
      }
      return current
    }
    current = current.parentElement
  }

  return null
}

function scrollSelectionIntoEditor(_editor, domRange) {
  if (!domRange || typeof domRange.getBoundingClientRect !== 'function') {
    return
  }

  const container = findScrollContainer(domRange.startContainer)
  if (!container) {
    return
  }

  const rangeRect = domRange.getBoundingClientRect()
  const parentRect = container.getBoundingClientRect()

  if (rangeRect.bottom > parentRect.bottom) {
    container.scrollTop += rangeRect.bottom - parentRect.bottom
  } else if (rangeRect.top < parentRect.top) {
    container.scrollTop -= parentRect.top - rangeRect.top
  }
}

module.exports = {
  scrollSelectionIntoEditor,
}
