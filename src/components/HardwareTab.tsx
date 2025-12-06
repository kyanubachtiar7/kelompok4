import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cpu, Thermometer, ToggleRight, Bell, Camera } from "lucide-react";

const hardwareComponents = [
  {
    name: "ESP32 Microcontroller",
    description: "Main brain of the system, providing Wi-Fi connectivity and processing power.",
    icon: <Cpu className="w-8 h-8 text-primary" />,
  },
  {
    name: "DHT11/DHT22 Sensor",
    description: "Measures ambient temperature and humidity in real-time.",
    icon: <Thermometer className="w-8 h-8 text-primary" />,
  },
  {
    name: "Relay Module",
    description: "Acts as an electrical switch to control the fan's power.",
    icon: <ToggleRight className="w-8 h-8 text-primary" />,
  },
  {
    name: "Piezo Buzzer",
    description: "Provides audible alerts and notifications.",
    icon: <Bell className="w-8 h-8 text-primary" />,
  },
  {
    name: "Camera Module",
    description: "Enables live video feed and AI-powered pose detection.",
    icon: <Camera className="w-8 h-8 text-primary" />,
  },
];

const cardClasses = "bg-card/80 backdrop-blur-sm border border-primary/20 transition-all hover:border-primary/40 hover:bg-card/90";

const HardwareTab = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {hardwareComponents.map((component) => (
        <Card key={component.name} className={cardClasses}>
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            {component.icon}
            <CardTitle>{component.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{component.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default HardwareTab;