import toast, { Toaster as ReactToaster } from 'react-hot-toast'

export const Toaster = ({ children }) => (
  <ReactToaster
    position='bottom-center'
    toastOptions={{
      style: {
        maxWidth: '500px',
        width: '95%'
      },
      iconTheme: {
      },
      error: {
        style: {
          background: '#d71919',
          color: '#F9F5FF'
        },
        iconTheme: {
          primary: '#F9F5FF',
          secondary: '#d71919'
        }
      }
    }}
  />
)

export const customContent = (t, message) => {
  return (
    <>
      <div style={{ position: 'absolute', inset: '0', cursor: 'pointer' }} onClick={() => toast.dismiss(t.id)} />
      <span>{message}</span>
    </>
  )
}
