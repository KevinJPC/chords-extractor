import React, { useCallback, useLayoutEffect, useRef } from 'react'

export const InfinityScroll = ({ isLoading, onIntersect, children }) => {
  const observableRef = useRef(null)

  useLayoutEffect(() => {
    const observer = new window.IntersectionObserver((entries) => {
      const entry = entries[0]
      if (entry.isIntersecting && !isLoading) {
        onIntersect()
        console.log(entry)
      }
    }, {
      rootMargin: '1px'
    })
    const observable = observableRef.current
    if (observable) observer.observe(observable)
    return () => {
      observer.disconnect()
    }
  }, [isLoading])

  return (
    <div ref={observableRef}>
      {children}
    </div>
  )
}
