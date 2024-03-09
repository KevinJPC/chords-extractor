import { Link } from 'wouter'

export const ConditionalLink = ({ children, navigable = false, ...props }) => {
  return (
    <>
      {navigable
        ? (
          <Link {...props}>
            <a>
              {children}
            </a>
          </Link>
          )
        : children}
    </>
  )
}
