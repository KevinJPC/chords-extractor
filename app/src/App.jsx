import { Router } from './Router.jsx'
import './App.css'
import { Header } from './components/Header.jsx'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './config/queryClient.js'
import { Toaster } from 'react-hot-toast'

const App = () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Toaster position='bottom-center' />
        <Header />
        <Router />
      </QueryClientProvider>
    </>
  )
}
export default App
