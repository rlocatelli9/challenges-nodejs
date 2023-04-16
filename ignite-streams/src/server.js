import http from 'node:http'
import {handleJsonData} from './middlewares/index.js'
import { routes } from './routes/index.js'
import { extractQueryParams } from './utils/extract-query-params.js'

const server = http.createServer(async (request, response) => {
  const {method, url} = request

  await handleJsonData(request, response)

  const route = routes.find(route => {
    return route.method === method && route.path.test(url)
  })

  if(route){
    const routeParams = request.url.match(route.path)

    request.query = extractQueryParams(routeParams?.groups?.query)

    request.params = Object.assign({}, routeParams?.groups)

    return route.handler(request, response)
  } else {
    return response.writeHead(404).end()
  }
})

server.listen(3333)