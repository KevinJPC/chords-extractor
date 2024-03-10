import { Link } from 'wouter'

export const ConditionalLink = ({ children, navigable = false, disable = false, ...props }) => {
  return (
    <>
      {(navigable && !disable)
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
