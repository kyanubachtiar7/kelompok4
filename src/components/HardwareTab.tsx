import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cpu, Thermometer, ToggleRight, Bell, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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

const cardClasses = "bg-card/80 backdrop-blur-sm border border-primary/20 transition-all duration-300 ease-in-out hover:border-primary/40 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10 h-full";

const HardwareTab = () => {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full"
    >
      <CarouselContent>
        {hardwareComponents.map((component, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 p-4">
            <Card 
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
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="ml-12" />
      <CarouselNext className="mr-12" />
    </Carousel>
  );
};

export default HardwareTab;