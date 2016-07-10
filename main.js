/**
 * Project 2: Feedr
 * ====
 *
 * See the README.md for instructions
 */
'use strict'

;(function () {
  var container = document.querySelector('#container')
  var popupContainer = document.querySelector('#popup-container')
  var state = {}
  var header = document.querySelector('header')
  var redditTopic = 'cats'
  var imgPlaceholder = './images/article_placeholder_1.jpg'
  var defaultSubreddit = 'https://www.reddit.com/r/cats.json'

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
            obj.postTitle = item.data.title
            obj.postBody = item.data.selftext
            obj.postSrcUrl = item.data.url
            obj.score = item.data.score
            obj.author = item.data.author
            obj.postId = index
            // TODO: Write a function for the below that looks for a URL in a string. The edge cases for the below could go on forever otherwise, so just look for what's needed.
            obj.imageThumbUrl = obj.imageThumbUrl = ((item.data.thumbnail === '') || (item.data.thumbnail === 'default') || (item.data.thumbnail === 'self')) ? imgPlaceholder : item.data.thumbnail
            item.data.preview ? obj.imageUrl = item.data.preview.images[0].source.url : obj.imageUrl = imgPlaceholder
            return obj
          })
          // console.log('state object')
          // console.log(state)
          renderList(state.postData, container)
          // console.log('from fetchSubreddit: ')
          // console.log(state.postData)
        })
        .catch((err) => {
          console.log('there\'s been a problem', err)
        })
    }
  }

  // function  getStuff(eventName) {
  //   return stuff === eventName
  // }

  // function findObject (id, resolve) {
  //   state.items.forEach((obj) => {
  //     var key = Object.keys(obj).filter((key) => {
  //       if (obj[key] === id) {
  //         resolve(obj)
  //       }
  //     })[0]
  //   })
  // }

  delegate('body', 'click', 'ul.dropdown li a', function (event) {
    var thisFeedUrl = (val) => {
      // Find relveant feed URL
      state.feedData.forEach((item) => {
        if (item.feedTitle === event.delegateTarget.dataset.category) {
          val = item.feedUrl
          state.feedData.currentFeed = item.feedTitle
        }
      })
      return val
    }
    fetchSubreddit(thisFeedUrl())
    renderHeader(state, header)
  })

  delegate('body', 'click', '.article-content a', function (event) {
    event.preventDefault()
    // TODO: Try using history API to do this stuff ?
    // i.e. history.pushState('foo', 'bar', '#zip')
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
  function renderHeader (state, into) {
    into.innerHTML = `
      <section class="wrapper">
        <a href="#"><h1>Feedr</h1></a>
        <nav>
          <section id="search">
            <input type="text" name="name" value="">
            <div id="search-icon"><img src="images/search.png" alt="" /></div>
          </section>
          <ul>
            <li><a href="#">News Source: <span>${state.feedData.currentFeed}</span></a>
            <ul class="dropdown">
              ${state.feedData.map((item) => {
                return `<li>${renderItem(item.feedTitle)}</li>`
              }).join('')}
            </ul>
            </ul>
            </li>
          </ul>
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

  function renderList (data, into) {
    // console.log('from renderList ')
    // console.log(data)
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
    renderHeader(state, header)
  })()
})()
