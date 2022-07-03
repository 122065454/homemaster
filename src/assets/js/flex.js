(function flexible (window, document) {
  var maxWidth = 600
  var minWidth = 100
  var docEl = document.documentElement
  var bodyEl = document.body
  var dpr = window.devicePixelRatio || 1
  function setRemUnit () {
    var width = docEl.clientWidth
    if (width > maxWidth) {
      width = maxWidth
    } else if (width < minWidth) {
      width = minWidth
    }

    var rem = width / 10
    docEl.style.fontSize = rem + 'px'
    bodyEl.style.fontSize = '16px'
  }

  setRemUnit()

  // reset rem unit on page resize
  window.addEventListener('resize', setRemUnit)
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      setRemUnit()
    }
  })

  // detect 0.5px supports
  if (dpr >= 2) {
    var fakeBody = document.createElement('body')
    var testElement = document.createElement('div')
    testElement.style.border = '.5px solid transparent'
    fakeBody.appendChild(testElement)
    docEl.appendChild(fakeBody)
    if (testElement.offsetHeight === 1) {
      docEl.classList.add('hairlines')
    }
    docEl.removeChild(fakeBody)
  }
}(window, document))
