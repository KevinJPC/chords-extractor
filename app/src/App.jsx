import { Router } from './Router.jsx'
import './App.css'
import { Header } from './components/Header.jsx'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './config/queryClient.js'

const App = () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Header />
        <Router />
      </QueryClientProvider>
    </>
  )
}
export default App
