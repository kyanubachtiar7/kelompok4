import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const VIDEO_STREAM_URL = "http://127.0.0.1:5000";

const VideoStream = () => {
  const [streamError, setStreamError] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gesture Stream</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-900 aspect-video flex items-center justify-center rounded-md overflow-hidden">
          {streamError ? (
            <p className="text-white text-center">
              Stream video tidak tersedia.<br />
              Pastikan server di http://127.0.0.1:5000 berjalan.
            </p>
          ) : (
            <img 
              src={VIDEO_STREAM_URL} 
              alt="Video Stream" 
              className="w-full h-full object-contain"
              onError={() => setStreamError(true)}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoStream;