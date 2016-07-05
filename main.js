/**
 * Project 2: Feedr
 * ====
 *
 * See the README.md for instructions
 */
(function () {
  var container = document.querySelector('#container')
  var state = {}

  renderLoading(state, container)

  fetch('https://crossorigin.me/https://maps.googleapis.com/maps/api/place/textsearch/xml?query=restaurants+in+Sydney&key=AIzaSyCT4WbbETNv8QhLddKci_onB8xcZC1hF1A')
  .then((response) => {
    return response.json()
  })
  .then((response) => {
    console.log(response)
  })
  .catch((err) => {
    console.log('error!', err)
  })

  function renderLoading (data, into) {
    // TODO: Add the template
    // `<div id="pop-up" class="loader">${thing}</div>`
  }

  function renderList (state, into) {

  }
})()

