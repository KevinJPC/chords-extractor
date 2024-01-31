export const useQueryParams = () => {
  const queryString = window.location.search
  const urlSearchParams = new URLSearchParams(queryString)
  const queryParams = Object.fromEntries(urlSearchParams.entries())

  const setQueries = () => {
    //
  }

  return [queryParams, setQueries]
}

// export const useLocation = () => {
//   const [location, navigate] = useWouterLocation()
//   const search = getQueryString()
//   return [location, navigate, search]
// }

// export const useRoute = (pattern) => {
//   let [match, params] = useWouterRoute(pattern)
//   if (match) {
//     const queryParams = getQueryParams()
//     params = {
//       ...queryParams,
//       ...params
//     }
//   }
//   return [match, params]
// }
