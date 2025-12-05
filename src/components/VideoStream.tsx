import React from 'react';
import { Card } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Terminal } from 'lucide-react';

const VideoStream = () => {
  const streamUrl = 'http://127.0.0.1:5000/';
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setError('Gagal memuat stream video. Pastikan server di http://127.0.0.1:5000/ berjalan dan dapat diakses.');
  };

  // Set timeout untuk error jika stream tidak kunjung termuat
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        handleError();
      }
    }, 10000); // 10 detik timeout

    return () => clearTimeout(timer);
  }, [isLoading]);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background">
          <Skeleton className="h-full w-full" />
          <p className="absolute text-foreground">Memuat stream video...</p>
        </div>
      )}
      {error && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}
      <iframe
        src={streamUrl}
        title="Pose Stream"
        className={`h-full w-full border-0 ${isLoading || error ? 'hidden' : 'block'}`}
        allow="camera; microphone"
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};

export default VideoStream;