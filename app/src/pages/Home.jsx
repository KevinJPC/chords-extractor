import { SearchInput } from '../components/SearchInput'
import './Home.css'

export const Home = () => {
  return (
    <section className='landing container container--small'>
      <h1 className='landing__title'>
        C<span className='landing__accent'>#</span>ords extrator
      </h1>

      <p className='landing__description'>
        Chords extractor allows you to extract chords from any
        YouTube video and watch them while it’s playing, you can
        also either make your own version or watch other user edits.
      </p>

      <SearchInput className='lading__search' />

    </section>
  )
}
