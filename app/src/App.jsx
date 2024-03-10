import { Router } from './Router.jsx'
import './App.css'
import { Header } from './components/Header.jsx'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './config/queryClient.js'
import { Toaster } from './components/Toaster.jsx'
const App = () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <Header />
        <Router />
      </QueryClientProvider>
    </>
  )
}
export default App
