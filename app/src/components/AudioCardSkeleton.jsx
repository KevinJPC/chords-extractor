import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { AudioCard } from './AudioCard'
import { CustomSkeleton } from './Skeleton'

export const AudioCardSkeleton = () =>
  <SkeletonTheme baseColor='#222' highlightColor='#444'>
    <AudioCard style={{ pointerEvents: 'none' }}>
      <AudioCard.Thumbnail>
        <Skeleton height='100%' width='100%' />
      </AudioCard.Thumbnail>
      <AudioCard.Content>
        <AudioCard.Title>
          <CustomSkeleton width='100%' height='100%' />
        </AudioCard.Title>
        <AudioCard.Body>
          <CustomSkeleton height='8px' width='100%' style={{ maxWidth: '250px' }} />
        </AudioCard.Body>
      </AudioCard.Content>
    </AudioCard>
  </SkeletonTheme>
