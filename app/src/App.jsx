import { Router } from './Router.jsx'
import './App.css'
import { Background } from './components/Background.jsx'

const App = () => {
  return (
    <>
      <Background />
      <div className='container'>
        <Router />
      </div>
    </>
  )
}
export default App
