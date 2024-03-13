import { useEffect, useState } from 'react'
import './FakeProgressBar.css'

export const FakeProgressBar = ({ hasFinished = false }) => {
  const [fakeProgress, setFakeProgress] = useState(0)

  useEffect(() => {
    if (fakeProgress !== 100 && hasFinished) return setFakeProgress(100)

    const currentProgress = fakeProgress
    if (currentProgress >= 90) return

    const timeoutId = setTimeout(function increaseProgress () {
      const stepValueRandom = Math.floor(Math.random() * 10) + 1
      setFakeProgress(currentProgress + stepValueRandom)
    }, 2000)
    return () => clearTimeout(timeoutId)
  }, [fakeProgress, hasFinished])

  return (

    <div className='progress-bar'>
      <div className='progress-bar__value-background' style={{ '--progress-value': `${fakeProgress}%` }}>
        <div className='progress-bar__value'>{fakeProgress}%</div>
      </div>
    </div>
  )
}
