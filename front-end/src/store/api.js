export function fetchLinks(activeType) {
    return new Promise((resolve, reject) => {
        // TODO: Make API call to HAPI server
        // TODO: Use activeType to get different links list

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
        resolve(val)
    })
}
