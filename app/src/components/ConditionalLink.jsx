import { Link } from 'wouter'

export const ConditionalLink = ({ children, isNavigable = false, ...props }) => {
  return (
    <>
      {(isNavigable)
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
