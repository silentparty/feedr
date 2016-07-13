/**
 * Project 2: Feedr
 * ====
 *
 * See the README.md for instructions
 */
'use strict'

;(function () {
  // Set default subreddit
  let redditTopic = 'cats'

  const state = {}
  const container = document.querySelector('#container')
  const popupContainer = document.querySelector('#popup-container')
  const navContainer = document.querySelector('nav')
  const header = document.querySelector('header')
  const imgPlaceholder = './images/r_placeholder.png'
  const subredditsByTopic = 'https://www.reddit.com/api/subreddits_by_topic.json?query=' + redditTopic

  // Fetch subreddit posts
  function fetchSubredditPostData (url) {
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
            state.feedData.selectedFeed
            // TODO: Write a function for the below that looks for a jpg / jpeg extension in a string. The edge cases for the below could go on forever otherwise, so just look for what's needed.
            obj.imageThumbUrl = ((item.data.thumbnail === '') || (item.data.thumbnail === 'default') || (item.data.thumbnail === 'self')) ? imgPlaceholder : item.data.thumbnail
            item.data.preview ? obj.imageUrl = item.data.preview.images[0].source.url : obj.imageUrl = imgPlaceholder
            return obj
          })
          renderList(state.postData, container)
        })
        .catch((err) => {
          alert('OH NO SOMETHING BROKE')
          console.error("there's been a problem", err)
        })
    }
  }

  // Grab the initial list of categories. These are then combined with Reddit's base URL structure to form the feed URL.
  function fetchSubRedditCategories (url) {
    fetch(url)
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
        // On initial load, set the default subreddit to the first in the array
        state.feedData.selectedFeed = state.feedData[0].feedTitle
        renderHeader(state, header)
        fetchSubredditPostData(state.feedData[0].feedUrl)
      })
      .catch(function (err) {
        alert('Failed to fetch initial category list. The server might be down, please try again in a minute or two.')
        console.error('something went wrong:' + err)
      })
  }

  // Menu item click event
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
    fetchSubredditPostData(thisFeedUrl())
    renderHeader(state, header)
  })

  // Article list click event
  delegate('body', 'click', '.article-content a', function (event) {
    event.preventDefault()
    // TODO: Try using history API or hashes to do this stuff?
    var thisId = parseInt(event.delegateTarget.dataset.id, 10)
    state.postData.forEach((obj) => {
      if (thisId === obj.postId) {
        renderPopup(obj, popupContainer)
      }
    })

    // Close popup
    delegate('body', 'click', '.close-pop-up', function (event) {
      event.preventDefault()
      let popup = document.querySelector('#pop-up')
      if (popup) {
        document.querySelector('#pop-up').remove()
      }
    })
  })

  // TODO: Search stuff
  // delegate('body', 'keyup', '#search-input', function (event) {
  //   let val = event.delegateTarget.value
  //   filterState(val)
  // })

  // TODO: Create a new state object, containing only the results that match the search input
  // NOTE: This should run on each keyup event, with each keystroke build a regex query.
  // NOTE: Combined with keyup event, the below code will log a matching title string. Just needs Regex now.
  // function filterState (query) {
  //   let localState = state.postData
  //   let filteredState = {}
  //   state.postData.forEach((obj) => {
  //     if (query === obj.postTitle) {
  //       console.log(obj.postTitle)
  //     }
  //   })
  // }

  // *** BEGIN VIEW ***
  function renderMenu (data) {
    let selectedFeed = data.feedData.selectedFeed
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

  // Header template
  function renderHeader (data, into) {
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

  // List item template
  function renderItem (item) {
    return `
        <a href="#" data-category="${item}">${item}</a>
      `
  }

  // Loading template
  function renderLoading (data, into) {
    into.innerHTML = `<div id="pop-up" class="loader"></div>`
  }

  // Complete article list template
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

  // Popup (article detail) template
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

  // Initialise the page
  (() => {
    fetchSubRedditCategories(subredditsByTopic)
  })()
})()
