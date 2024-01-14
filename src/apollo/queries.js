import gql from 'graphql-tag'

export const ALL_LOCATIONS_QUERY = gql`
  query {
    locations {
      id
      name
      locationCode
    }
  }
`

export const ALL_USERS_QUERY = gql`
  query {
    users {
      id
      firstName
      lastName
      email
    }
  }
`

export const FIND_MANY_EVENTS_QUERY = gql`
  query FindManyEvents($input: FindManyArgsInput) {
    events(findManyArgsInput: $input) {
      data {
        id
        title
        description
        startDate
        endDate
        location {
          id
          name
        }
        createdBy {
          id
          firstName
          lastName
        }
        createdAt
        updatedAt
        participants {
          id
          firstName
          lastName
          email
        }
      }
      meta {
        page
        limit
        total
      }
    }
  }
`

export const CREATE_EVENT_MUTATION = gql`
  mutation CreateEvent($input: CreateEventInput!) {
    createEvent(createEventInput: $input) {
      id
      title
      description
      startDate
      endDate
      location {
        id
        name
      }
      createdBy {
        id
        firstName
        lastName
      }
      participants {
        id
        firstName
        lastName
        email
      }
      createdAt
      updatedAt
    }
  }
`

export const UPDATE_EVENT_MUTATION = gql`
  mutation UpdateEvent($input: UpdateEventInput!) {
    updateEvent(updateEventInput: $input) {
      id
      title
      description
      startDate
      endDate
      location {
        id
        name
      }
      createdBy {
        id
        firstName
        lastName
      }
      participants {
        id
        firstName
        lastName
        email
      }
      createdAt
      updatedAt
    }
  }
`

export const DELETE_EVENT_MUTATION = gql`
  mutation DeleteEvent($id: String!) {
    removeEvent(id: $id) {
      title
    }
  }
`
