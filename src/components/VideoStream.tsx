import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface VideoStreamProps {
  frameData: string | null;
}

const VideoStream = ({ frameData }: VideoStreamProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gesture Stream</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-900 aspect-video flex items-center justify-center rounded-md overflow-hidden">
          {frameData ? (
            <img src={`data:image/jpeg;base64,${frameData}`} alt="Video Stream" className="w-full h-full object-contain" />
          ) : (
            <p className="text-white">Menunggu stream video...</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoStream;