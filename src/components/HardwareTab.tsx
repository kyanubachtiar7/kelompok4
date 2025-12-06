import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cpu, Thermometer, ToggleRight, Bell, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

const hardwareComponents = [
  {
    name: "ESP8266 Microcontroller",
    description: "Main brain of the system, providing Wi-Fi connectivity and processing power.",
    icon: <Cpu className="w-8 h-8 text-primary" />,
  },
  {
    name: "DHT22 Sensor",
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

const cardClasses = "bg-card/80 backdrop-blur-sm border border-primary/20 transition-all duration-300 ease-in-out hover:border-primary/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10";

const HardwareTab = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {hardwareComponents.map((component, index) => (
        <Card 
          key={component.name} 
          className={cn(cardClasses, "opacity-0 animate-fade-in")}
          style={{ animationDelay: `${index * 100}ms` }}
        >
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