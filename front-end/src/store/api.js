// this is aliased in webpack config based on server/client build
import api from 'create-api'

// warm the front page cache every 15 min
// make sure to do this only once across all requests
if (api.onServer && !api.warmCacheStarted) {
  api.warmCacheStarted = true
  warmCache()
}

function warmCache () {
  fetchItems((api.cachedIds.top || []).slice(0, 30))
  setTimeout(warmCache, 1000 * 60 * 15)
}

function fetch (child) {
  const cache = api.cachedItems
  if (cache && cache.has(child)) {
    return Promise.resolve(cache.get(child))
  } else {
    return new Promise((resolve, reject) => {
      // api.child(child).once('value', snapshot => {
      //   const val = snapshot.val()
      //   // mark the timestamp when this item is cached
      //   if (val) val.__lastUpdated = Date.now()
      //   cache && cache.set(child, val)
      //   resolve(val)
      // }, reject)

        const val = [{
            "timestamp": "2017-01-20T01:53:54.706749+00:00",
            "url": "https://www.washingtonpost.com/news/worldviews/wp/2017/01/19/facebook-temporarily-blocked-rt-and-moscow-isnt-happy/?utm_term=.40173b487f91",
            "description": "test",
            "title": "Russia stinks",
            "image": "none",
            "from": {
                "mention_name": "da BEN",
                "name": "Ben"
            }
        }]
        if (val) val.__lastUpdated = Date.now()
        cache && cache.set(child, val)
        resolve(val)
    })
  }
}

export function fetchIdsByType (type) {
  return api.cachedIds && api.cachedIds[type]
    ? Promise.resolve(api.cachedIds[type])
    : fetch(`${type}stories`)
}

export function fetchItem (id) {
  return fetch(`item/${id}`)
}

export function fetchItems (ids) {
  return Promise.all(ids.map(id => fetchItem(id)))
}

export function fetchUser (id) {
  return fetch(`user/${id}`)
}

export function watchList (type, cb) {
  let first = true
  const ref = api.child(`${type}stories`)
  const handler = snapshot => {
    if (first) {
      first = false
    } else {
      cb(snapshot.val())
    }
  }
  ref.on('value', handler)
  return () => {
    ref.off('value', handler)
  }
}
