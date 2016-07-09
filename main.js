/**
 * Project 2: Feedr
 * ====
 *
 * See the README.md for instructions
 */
'use strict'

;(function () {
  var container = document.querySelector('#container')
  var state = {}

  var menuEl = document.querySelector('#menu')
  var entriesEl = document.querySelector('#entries')
  var header = document.querySelector('header')
  var redditTopic = 'cats'

// Fetch subreddit urls
  function fetchSubreddit (url) {
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
            obj.score = item.data.score
            obj.author = item.data.author
            obj.postId = index
            return obj
          })
          console.log('state object')
          console.log(state)
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

  function findObject (id, resolve) {
    state.items.forEach((obj) => {
      var key = Object.keys(obj).filter((key) => {
        if (obj[key] === id) {
          resolve(obj)
        }
      })[0]
    })
  }

  delegate('body', 'click', 'ul.dropdown li a', function (event) {
    var thisUrl = (val) => {
      // Find relveant feed URL
      state.feedData.forEach((item) => {
        if (item.feedTitle === event.delegateTarget.dataset.category) {
          val = item.feedUrl
        }
      })
      return val
    }
    fetchSubreddit(thisUrl())
  })

  delegate('body', 'click', '.article-content a', function (event) {
    state.feedData.forEach((obj) => {
      Object.keys(obj).filter(function(key) {
        if (obj[key] === id) {

        }
    })
    renderPopup(data, container)
  })

// TODO: Grab subreddit categories
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
      // console.log('state.feedData')
      // console.log(state.feedData)
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
            <li><a href="#">News Source: <span>Source Name</span></a>
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

    function renderItem(item) {
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
            <article class="article" data-id=${item.postId}>
              <section class="featured-image">
                <img src="${item.imageUrl}" />
              </section>
              <section class="article-content">
                <a href="#">
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
        <h1>${data.postTitle}</h1>
        <p>
        ${data.postBody}
        </p>
        <a href="#" class="pop-up-action" target="_blank">Read more from source</a>
      </div>
    </div>
    `
  }
  fetchSubreddit('https://www.reddit.com/r/cscareerquestions.json')
  // renderLoading(state, container)
})()
