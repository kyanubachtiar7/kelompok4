import React from 'react';

const VideoStream = () => {
  // A placeholder image URL. You can replace this with your specific image
  // that includes the AI skeleton overlay.
  const placeholderImageUrl = 'https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3';

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
      <img
        src={placeholderImageUrl}
        alt="Pose Stream Placeholder"
        className="h-full w-full object-cover brightness-75"
      />
      
      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
        <p className="text-white/80 text-lg font-medium backdrop-blur-sm p-2 rounded">
          Live Feed Placeholder
        </p>
      </div>

      {/* "LIVE | AI Tracking Active" badge */}
      <div className="absolute top-3 left-3 flex items-center space-x-2 rounded-md bg-red-600 px-2.5 py-1 text-xs font-bold text-white shadow-lg">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
        </span>
        <span>LIVE | AI Tracking Active</span>
      </div>
    </div>
  );
};

export default VideoStream;