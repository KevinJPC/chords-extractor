import { Router } from './Router.jsx'
import './App.css'
import { Background } from './components/Background.jsx'
import { Header } from './components/Header.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

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
