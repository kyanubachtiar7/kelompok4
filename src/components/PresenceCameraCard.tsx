import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMQTT } from '../context/MQTTContext';
import { Video } from 'lucide-react';

const PresenceCameraCard = () => {
  const { cameraPresence, cameraPersonCount } = useMQTT();
  const cardClasses = "bg-card/80 backdrop-blur-sm border border-primary/20";

  const isPresent = cameraPresence === 1;
  const statusText = isPresent 
    ? `ADA ORANG (count = ${cameraPersonCount ?? '?'})` 
    : 'TIDAK ADA ORANG';
  const indicatorColor = isPresent ? 'bg-green-500' : 'bg-red-500';

  return (
    <Card className={cardClasses}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Deteksi Kamera</CardTitle>
        <Video className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-1">
          <div className={`h-3 w-3 rounded-full animate-pulse ${indicatorColor}`}></div>
          <div className="text-xl font-bold">{statusText}</div>
        </div>
        <p className="text-xs text-muted-foreground">
          Real-time dari stream kamera
        </p>
      </CardContent>
    </Card>
  );
};

export default PresenceCameraCard;