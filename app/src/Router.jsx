import { Route } from 'wouter'
import { Home } from './pages/Home'
import { AudioAnalysis } from './pages/AudioAnalysis'
import { Search } from './pages/Search'

export const Router = () => {
  return (
    <>
      <Route path='/' component={Home} />
      <Route path='/chords/:id' component={AudioAnalysis} />
      <Route path='/search' component={Search} />
    </>
  )
}
