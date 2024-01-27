import './SearchInput.css'
import { SearchIcon } from './icons/SearchIcon'
import { useLocation } from 'wouter'

export const SearchInput = ({ props }) => {
  const [, navigate] = useLocation()

  const handleSubmit = (e) => {
    e.preventDefault()

    const search = e.target.search.value
    const searchParams = new URLSearchParams({
      q: search
    })

    navigate(`/search?${searchParams.toString()}`)
  }

  return (
    <search className='search' {...props}>
      <form onSubmit={handleSubmit} className='search__form'>
        <input className='search__input' name='search' type='text' placeholder='Type something or paste a link' />
        <button className='search__button' type='submit' onSubmit={handleSubmit}><SearchIcon /></button>
      </form>
    </search>
  )
}
