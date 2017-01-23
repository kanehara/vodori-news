import axios from 'axios'

export function fetchLinks(activePage) {
    const devIoEndpoint = "http://localhost:3000/room/333392";
    const allThePeopleEndpoint = "http://localhost:3000/room/1839723";
    const vodoriNewsEndpoint = "http://localhost:3000/room/3502399";

    let endpoint;
    switch (activePage) {
        case('dev-io'):
            endpoint = devIoEndpoint
            break
        case('all-the-people'):
            endpoint = allThePeopleEndpoint
            break
        case('vodori-news'):
            endpoint = vodoriNewsEndpoint
            break
    }

    return new Promise((resolve, reject) => {
        axios
            .get(endpoint)
            .then(({data}) => {
                if (data) data.__lastUpdated = Date.now()
                resolve(data)
            })
            .catch((err) => {
                console.log(err)
                reject(err)
            })
    })
}
