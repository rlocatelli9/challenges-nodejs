export function extractQueryParams(query) {
  if(query) {
    return query.substr(1).split('&').reduce((initialQueryParams, param) => {
      const [key, value] = param.split('=')
      initialQueryParams[key] = value
      return initialQueryParams
    }, {})
  }
  return {}
}