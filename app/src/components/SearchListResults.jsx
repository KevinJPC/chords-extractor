import { AudioCard } from './AudioCard'
import './SearchListResults.css'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export const SearchListResults = ({ results, ...props }) => {
  return (
    <>
      <ul className='search-list-results'>
        {results.map(({ _id, youtubeId, title, thumbnails, edits, chordsPerBeats }) => {
          const isAnalyzed = _id !== undefined
          return (
            <li key={youtubeId} className='search-list-results__item'>
              <AudioCard>
                <AudioCard.Thumbnail>
                  <AudioCard.ThumbnailImg src={thumbnails[0].url} />
                </AudioCard.Thumbnail>
                <AudioCard.Content>
                  <AudioCard.Title>{title}</AudioCard.Title>
                  <AudioCard.Body>
                    {!isAnalyzed && <AudioCard.Button>Analyze now</AudioCard.Button>}
                    {isAnalyzed && (
                      <AudioCard.DetailsList>
                        <AudioCard.DetailsItem>{edits} edits</AudioCard.DetailsItem>
                        <AudioCard.DetailsItem>{33} visits</AudioCard.DetailsItem>
                      </AudioCard.DetailsList>
                    )}
                    <AudioCard.Status isAnalyzed={isAnalyzed} />
                  </AudioCard.Body>
                </AudioCard.Content>
              </AudioCard>
            </li>
          )
        }
        )}
      </ul>
    </>
  )
}

export const SearchListResultsSkeleton = ({ count = 10 }) => {
  return (
    <>
      <SkeletonTheme baseColor='#222' highlightColor='#444'>
        <ul className='search-list-results'>
          {new Array(count).fill().map((_, index) => {
            return (
              <li key={index} className='search-list-results__item'>
                <AudioCard>
                  <AudioCard.Thumbnail>
                    <Skeleton height='100%' width='100%' />
                  </AudioCard.Thumbnail>
                  <AudioCard.Content>
                    <AudioCard.Title><Skeleton /></AudioCard.Title>
                    <AudioCard.Body>
                      <Skeleton width='150px' />
                    </AudioCard.Body>
                  </AudioCard.Content>
                </AudioCard>
              </li>
            )
          }
          )}
        </ul>
      </SkeletonTheme>
    </>
  )
}
