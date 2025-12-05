const VIDEO_STREAM_URL = "http://127.0.0.1:5000";

const VideoStream = () => {
  return (
    <div className="aspect-video rounded-md overflow-hidden">
      <iframe
        src={VIDEO_STREAM_URL}
        title="Pose Stream"
        className="w-full h-full border-0"
        allowFullScreen
      />
    </div>
  );
};

export default VideoStream;