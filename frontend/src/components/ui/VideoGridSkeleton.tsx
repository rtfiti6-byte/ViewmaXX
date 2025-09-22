// Stub for VideoGridSkeleton
import React from 'react';

const VideoGridSkeleton: React.FC = () => {
  return (
    <div className="video-grid-skeleton">
      {/* Skeleton loading UI */}
      <div style={{height: 200, background: '#eee', borderRadius: 8}} />
    </div>
  );
};

export default VideoGridSkeleton;
