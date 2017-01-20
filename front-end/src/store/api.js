export function fetchLinks(activeType) {
    return new Promise((resolve, reject) => {
        // TODO: Make API call to HAPI server
        // TODO: Use activeType to get different links list

        const russia = {
            "timestamp": "2017-01-20T01:53:54.706749+00:00",
            "url": "https://www.washingtonpost.com/news/worldviews/wp/2017/01/19/facebook-temporarily-blocked-rt-and-moscow-isnt-happy/?utm_term=.40173b487f91",
            "description": "test",
            "title": "Russia stinks",
            "imageUrl": "http://vignette2.wikia.nocookie.net/rickandmorty/images/1/1e/Rick_and_morty_icon.png/revision/latest?cb=20150805041642",
            "from": {
                "mention_name": "da BEN",
                "name": "Ben"
            }
        }

        const val = [];

        for (let i = 0; i < 25; ++i) {
            let link = Object.assign({}, russia);
            link.title += i;
            val.push(link);
        }

        if (val) val.__lastUpdated = Date.now()
        resolve(val)
    })
}
