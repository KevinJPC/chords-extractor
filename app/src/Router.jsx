import { Route } from 'wouter'
import { Home } from './pages/Home'
import { AudioAnalysis } from './pages/AudioAnalysis'

export const Router = () => {
  return (
    <>
      <Route path='/'><Home /></Route>
      <Route path='/chords/:id' component={AudioAnalysis} />
    </>
  )
}
