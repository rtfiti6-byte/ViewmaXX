// Stub for VideoGridSkeleton
import React from 'react';

interface VideoGridSkeletonProps {
  count?: number;
}

const VideoGridSkeleton: React.FC<VideoGridSkeletonProps> = ({ count = 8 }) => {
  return (
    <div className="video-grid-skeleton" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ height: 200, background: '#eee', borderRadius: 8 }} />
      ))}
    </div>
  );
};

export default VideoGridSkeleton;
export { VideoGridSkeleton };
