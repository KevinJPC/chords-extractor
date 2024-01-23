import Plyr from 'plyr'
import 'plyr/dist/plyr.css'
import './AudioAnalysis.css'

import { useCallback, useEffect, useLayoutEffect } from 'react'

export const YoutubePlayer = ({ youtubeId, hideVideo = false, onTimeUpdate, ...props }) => {
  //

  useLayoutEffect(() => {
    const player = new Plyr('#player', {
      controls: ['progress', 'play', 'play-large', 'volume', 'current-time'],
      invertTime: false,
      volume: 0.75,
      hideControls: false,
      // ratio: '4:3',
      resetOnEnd: true,
      storage: { enabled: false }
    })

    const timeUpdateListener = (event) => {
      const time = event.detail.plyr.currentTime
      onTimeUpdate(time)
    }

    // const timeUpdateListener = () => {
    //   setInterval(() => {
    //     const currentTime = player.currentTime
    //     onTimeUpdate(currentTime)
    //   }, 1)
    // }
    // timeUpdateListener()

    player.on('timeupdate', timeUpdateListener)
    return () => {
      player.off('timeupdate', timeUpdateListener)
    }
  }, [])

  const toggleHideVideo = useCallback(({ hideVideo }) => {
    const height = hideVideo ? '53px' : '1000px'
    const wrapper = hideVideo ? '1' : '0'
    const control = hideVideo ? 'none' : 'block'
    document.documentElement.style.setProperty('--video-wrapper-height', height)
    document.documentElement.style.setProperty('--video-wrapper-opacity', wrapper)
    document.documentElement.style.setProperty('--video-control-display', control)
  }, [])

  useEffect(() => {
    toggleHideVideo({ hideVideo })
  }, [hideVideo])

  return (
    <div id='player' data-plyr-provider='youtube' data-plyr-embed-id={youtubeId} />
  )
}
