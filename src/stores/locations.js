import { defineStore } from 'pinia'

export const useLocationsStore = defineStore('locations', {
  state: () => ({
    locations: [],
  }),

  actions: {
    addLocations(locations) {
      this.locations = locations
    },
    addSingleLocation(location) {
      console.log(this.locations, location)
      if (!this.locations.some((e) => e.id === location.id)) {
        this.locations = [...this.locations, location]
      }
    },
    getLocation(id) {
      return this.locations.find((e) => e.id === id)
    },
    removeLocation(location) {
      const filtered = this.locations.filter((e) => e.id !== location.id)
      this.locations = filtered
    },
    removeLocationById(id) {
      const filtered = this.locations.filter((e) => e.id !== id)
      this.locations = filtered
    },
    updateLocation(location) {
      const updated = this.locations.map((e) => {
        if (e.id === location.id) {
          return location
        }
        return e
      })

      this.locations = updated
    },
  },
})
