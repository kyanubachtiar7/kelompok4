import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const VIDEO_STREAM_URL = "http://127.0.0.1:5000";

const VideoStream = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pose Stream</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-video rounded-md overflow-hidden">
          <iframe
            src={VIDEO_STREAM_URL}
            title="Pose Stream"
            className="w-full h-full border-0"
            allowFullScreen
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoStream;