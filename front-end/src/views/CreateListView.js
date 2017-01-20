import ItemList from '../components/ItemList.vue'

// This is a factory function for dynamically creating root-level list views,
// since they share most of the logic except for the type of items to display.
// They are essentially higher order components wrapping ItemList.vue.
export function createListView (type) {
  return {
    name: `${type}-stories-view`,
    // this will be called during SSR to pre-fetch data into the store!
    preFetch (store) {
        store.dispatch('CHANGE_PAGE', store.state.route.params.page)
        return store.dispatch('FETCH_LINKS', { type })
    },
    render (h) {
      return h(ItemList, { props: { type }})
    }
  }
}
