export function scrollRangeIntoContainer(container, domRange) {
  if (!container || !domRange || typeof domRange.getBoundingClientRect !== 'function') {
    return
  }

  const rangeRect = domRange.getBoundingClientRect()
  if (!rangeRect || (rangeRect.width === 0 && rangeRect.height === 0 && rangeRect.top === 0)) {
    return
  }

  const box = container.getBoundingClientRect()
  const padding = 12
  if (rangeRect.bottom > box.bottom - padding) {
    container.scrollTop += rangeRect.bottom - (box.bottom - padding)
  } else if (rangeRect.top < box.top + padding) {
    container.scrollTop -= (box.top + padding) - rangeRect.top
  }
}

function pinDocumentScroll() {
  if (window.scrollX || window.scrollY) {
    window.scrollTo(0, 0)
  }
  if (document.documentElement.scrollTop || document.documentElement.scrollLeft) {
    document.documentElement.scrollTop = 0
    document.documentElement.scrollLeft = 0
  }
  if (document.body.scrollTop || document.body.scrollLeft) {
    document.body.scrollTop = 0
    document.body.scrollLeft = 0
  }
}

export function installIframeContainment() {
  pinDocumentScroll()
  window.addEventListener('scroll', pinDocumentScroll, true)
  document.addEventListener('scroll', (event) => {
    if (event.target === document || event.target === document.documentElement || event.target === document.body) {
      pinDocumentScroll()
    }
  }, true)
}
