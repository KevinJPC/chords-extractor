import './SearchInput.css'

export const SearchInput = ({ handleSubmit, props }) => {
  return (
    <search className='search'>
      <form onSubmit={handleSubmit} className='search__form'>
        <input className='search__input' name='search' type='text' placeholder='Type something or paste a link' />
        <button className='search__button' type='submit'>Search</button>
      </form>
    </search>
  )
}
