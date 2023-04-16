import crypto from 'node:crypto'
import { Database } from '../database/index.js'
import { buildRoutePath } from '../utils/build-route-path.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (request, response) => {
      const {search} = request?.query;
      let searchObject = null
      
      if(search){
        searchObject = Object.assign({}, {
          title: search,
          description: search
        })
      }

      const users = database.select('tasks', searchObject)

      return response.end(JSON.stringify(users))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (request, response) => {
      const {title, description} = request.body

      const task = {
        id: crypto.randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date()
      }

      database.insert('tasks', task)

      return response.writeHead(201).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (request, response) => {
      const { id } = request.params
      const dataBody = request.body

      const data = Object.assign({}, {...dataBody, updated_at: new Date()})

      database.update('tasks', id, data)

      return response.writeHead(204).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (request, response) => {
      const { id } = request.params
      database.delete('tasks', id)
      return response.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (request, response) => {
      const { id } = request.params
      const data = Object.assign({}, {completed_at: new Date(), updated_at: new Date()})
      database.update('tasks', id, data)
      return response.writeHead(204).end()
    }
  }
]