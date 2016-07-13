/**
 * Project 2: Feedr
 * ====
 *
 * See the README.md for instructions
 */
'use strict'

;(function () {

  const container = document.querySelector('#container')
  const popupContainer = document.querySelector('#popup-container')
  const header = document.querySelector('header')
  const imgPlaceholder = './images/r_placeholder.png'
  const defaultSubreddit = 'https://www.reddit.com/r/cats.json'

  var state = {}

  let redditTopic = 'cats'

// NOTE:Fetch subreddit urls
  function fetchSubreddit (url) {
    renderLoading(state, container)
    if (url) {
      fetch(url)
        .then((response) => {
          return response.json()
        })
        .then((json) => {
          state.postData = json.data.children.map((item, index) => {
            let obj = {}
            let data = item.data
            obj.postTitle = data.title
            obj.postBody = data.selftext
            obj.postSrcUrl = data.url
            obj.score = data.score
            obj.author = data.author
            obj.postId = index
            // TODO: Write a function for the below that looks for a jpg / jpeg extension in a string. The edge cases for the below could go on forever otherwise, so just look for what's needed.
            obj.imageThumbUrl = ((item.data.thumbnail === '') || (item.data.thumbnail === 'default') || (item.data.thumbnail === 'self')) ? imgPlaceholder : item.data.thumbnail
            item.data.preview ? obj.imageUrl = item.data.preview.images[0].source.url : obj.imageUrl = imgPlaceholder
            return obj
          })
          renderList(state.postData, container)
        })
        .catch((err) => {
          console.warn('there\'s been a problem', err)
        })
    }
  }

  // Grab subreddit categories
  var subredditsByTopicUrl = 'https://www.reddit.com/api/subreddits_by_topic.json?query=' + redditTopic
  fetch(subredditsByTopicUrl)
  .then(function (response) {
    return response.json()
  })
  .then(function (json) {
    state.feedData = []
    state.feedData = json.map((item) => {
      var obj = {}
      obj.feedTitle = item.name
      obj.feedUrl = 'https://www.reddit.com/r/' + item.name + '.json'
      return obj
    })
    renderHeader(state, header)
  })
  .catch(function (err) {
    console.log('something went wrong:' + err)
  })

  delegate('body', 'click', 'ul.dropdown li a', function (event) {
    var thisFeedUrl = (val) => {
      // Find relveant feed URL
      state.feedData.forEach((item) => {
        if (item.feedTitle === event.delegateTarget.dataset.category) {
          val = item.feedUrl
          state.feedData.selectedFeed = item.feedTitle
        }
      })
      return val
    }
    fetchSubreddit(thisFeedUrl())
    // TODO: update selectedFeed with current category. Then, re-render menu.
    let menuHtml = renderMenu()
  })

  delegate('body', 'click', '.article-content a', function (event) {
    event.preventDefault()
    // TODO: Try using history API to do this stuff?
    var thisId = parseInt(event.delegateTarget.dataset.id, 10)
    state.postData.forEach((obj) => {
      if (thisId === obj.postId) {
        renderPopup(obj, popupContainer)
      }
    })

    delegate('body', 'click', '.close-pop-up', function (event) {
      event.preventDefault()
      let popup = document.querySelector('#pop-up')
      if (popup) {
        document.querySelector('#pop-up').remove()
      }
    })
  })

  // TODO: Search stuff
  delegate('body', 'keyup', '#search-input', function (event) {
    let val = event.delegateTarget.value
    console.log(val)
  })

  function renderMenu (data) {
    let selectedFeed = (!data.hasOwnProperty('selectedFeed')) ? 'All' : data.feedData.selectedFeed
    console.log("selectedFeed", selectedFeed)
    return `
      <ul>
        <li><a href="#">News Source: <span>${selectedFeed}</span></a>
          <ul class="dropdown">
            ${data.feedData.map((item) => {
              return `<li>${renderItem(item.feedTitle)}</li>`
            }).join('')}
          </ul>
        </li>
      </ul>
      `
  }

  function renderHeader (data, into) {
    // console.log(state)
    let menu = renderMenu(data)
    into.innerHTML = `
    <section class="wrapper">
      <a href="#"><h1>Feedr</h1></a>
        <nav>
        <section id="search">
        <input type="text" id="search-input" name="name" value="">
        <div id="search-icon"><img src="images/search.png" alt="" /></div>
        </section>
        ${menu}
        </nav>
      <div class="clearfix"></div>
    </section>
    `
  }

  function renderItem (item) {
    return `
        <a href="#" data-category="${item}">${item}</a>
      `
  }

  function renderLoading (data, into) {
    into.innerHTML = `<div id="pop-up" class="loader"></div>`
  }

  function filterState () {
  // TODO: Create a new state object, containing only the results that match the search input
  // This should run on each keyup event
  }

  // *** BEGIN VIEW ***
  function renderList (data, into) {
    console.log(data)
    into.innerHTML = `
    <section id="main" class="wrapper">
        ${data.map((item) => {
          return `
            <article class="article">
              <section class="featured-image">
                <img src="${item.imageThumbUrl}" />
              </section>
              <section class="article-content">
                <a href="#" data-id=${item.postId}>
                  <h3>${item.postTitle}</h3>
                  <h6>${item.author}</h6>
                </a>
              </section>
              <section class="impressions">
                ${item.score}
              </section>
              <div class="clearfix"></div>
            </article>
            `
        }).join('')}
      </section>
      `
  }
  function renderPopup (data, into) {
    into.innerHTML = `
    <div id="pop-up">
      <a href="#" class="close-pop-up">X</a>
      <div class="wrapper">
      <img src="${data.imageUrl}" />
        <h1>${data.postTitle}</h1>
        <p>
        ${data.postBody}
        </p>
        <a href="${data.postSrcUrl}" class="pop-up-action" target="_blank">Read more from source</a>
      </div>
    </div>
    `
  }

  // init
  (() => {
    fetchSubreddit(defaultSubreddit)
  })()
})()
