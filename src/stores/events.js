import { defineStore } from 'pinia'

export const useEventsStore = defineStore('events', {
  state: () => ({
    events: [],
  }),

  actions: {
    addEvents(events) {
      console.log(events)
      const existingEvents = this.events

      const newEvents = events.filter((event) => {
        return !existingEvents.some((e) => e.id === event.id)
      })

      this.events = [...existingEvents, ...newEvents]
    },
    addSingleEvent(event) {
      if (!this.events.some((e) => e.id === event.id)) {
        this.events = [...this.events, event]
      }
    },
    getEvent(id) {
      return this.events.find((e) => e.id === id)
    },
    removeEvent(event) {
      const filtered = this.events.filter((e) => e.id !== event.id)
      this.events = filtered
    },
    removeEventById(id) {
      const filtered = this.events.filter((e) => e.id !== id)
      this.events = filtered
    },
    updateEvent(event) {
      const updated = this.events.map((e) => {
        if (e.id === event.id) {
          return event
        }
        return e
      })

      this.events = updated
    },
  },
})
