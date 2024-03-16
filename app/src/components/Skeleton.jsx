import Skeleton from 'react-loading-skeleton'

export const CustomSkeleton = ({ ...props }) =>
  <div style={{ flex: 1 }}>
    <Skeleton {...props} />
  </div>
