/**
 * Project 2: Feedr
 * ====
 *
 * See the README.md for instructions
 */
'use strict'

;(function () {
  var container = document.querySelector('#container')
  var state = {
    items: [
      {title: 'this', link: 'http://localhost:3000', imageUrl: 'http://fillmurray.com/100/100'},
      {title: 'that', link: 'http://localhost:3000', imageUrl: 'http://fillmurray.com/100/100'},
      {title: 'other', link: 'http://localhost:3000', imageUrl: 'http://fillmurray.com/100/100'}
    ]
  }

  var menuEl = document.querySelector('#menu')
  var entriesEl = document.querySelector('#entries')

  function fetchSubreddit (url) {
    if (url) {
      fetch('https://www.reddit.com/r/' + url + '.json')
        .then((response) => {
          return response.json()
        })
        .then((json) => {
          console.log(json)
          var links = ''
          for (var i = 0; i < json.data.children.length; i++) {
            links += '<li><a href="' + json.data.children[i].data.url + '">' +
              json.data.children[i].data.url + '</a></li>'
          }
          entriesEl.innerHTML = '<ul>' + links + '</ul>'
        })
    }
  }

  var subredditsByTopicUrl = 'https://www.reddit.com/api/subreddits_by_topic.json?query=javascript'
  fetch(subredditsByTopicUrl)
    .then(function (response) {
      return response.json()
    })
    .then(function (json) {
      var select = document.createElement('select')
      var links = ''
      for (var k = 0; k < json.length; k++) {
        links += '<option value="' + json[k].name + '">' + json[k].name +
          '</option>'
      }
      select.innerHTML = links
      select.addEventListener('change', function (e) {
        fetchSubreddit(e.target.value)
      })
      menuEl.appendChild(select)
    }).catch(function (err) {
      console.log('something went wrong:' + err)
    })

  // renderLoading(state, container)

  // function renderLoading (data, into) {
  //   `<div id="pop-up" class="loader">${thing}</div>`
  // }

  function renderList (state, into) {
    into.innerHTML = `
    <section id="main" class="wrapper">
        ${state.items.map((item) => {
      return `
            <article class="article">
              <section class="featured-image">
                <img src="${item.imageUrl}" />
              </section>
              <section class="article-content">
                <a href="${item.link}"> <h3>${item.title}</h3> </a>
              </section>
              <div class="clearfix"></div>
            </article>
            `
    }).join('')}
      </section>
      `
  }
  renderList(state, container)
})()
