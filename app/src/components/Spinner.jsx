import './Spinner.css'
export const Spinner = ({ size = 24, color = '#fff', thickness = 2 }) => {
  return (
    <span
      style={{
        '--color': `${color}`,
        '--size': `${size}px`,
        '--thickness': `${thickness}px`
      }}
      className='loader'
    />
  )
}
