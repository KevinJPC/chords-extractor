import { useLocation as useWouterLocation, useRoute as useWouterRoute } from 'wouter'

const getQueryString = () => window.location.search

const getQueryParams = () => {
  const queryString = getQueryString()
  const urlSearchParams = new URLSearchParams(queryString)
  const queryParams = Object.fromEntries(urlSearchParams.entries())
  return queryParams
}

export const useLocation = () => {
  const [location, navigate] = useWouterLocation()
  const search = getQueryString()
  return [location, navigate, search]
}

export const useRoute = (pattern) => {
  let [match, params] = useWouterRoute(pattern)
  if (match) {
    const queryParams = getQueryParams()
    params = {
      ...queryParams,
      ...params
    }
  }
  return [match, params]
}
