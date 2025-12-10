import React, { useState } from "react";
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
import { DialogTrigger } from "@/components/ui/dialog";
import HardwareDetailDialog from "./HardwareDetailDialog";

const hardwareComponents = [
  {
    name: "Mikrokontroler ESP8266",
    description: "Otak utama sistem, menyediakan konektivitas Wi-Fi dan daya pemrosesan.",
    longDescription: "ESP8266 adalah mikrokontroler berbiaya rendah dengan kemampuan Wi-Fi terintegrasi. Ini adalah pilihan populer untuk proyek IoT karena ukurannya yang kecil, konsumsi daya rendah, dan kemampuan untuk terhubung ke internet. Dalam sistem ini, ESP8266 berfungsi sebagai pusat kendali, mengumpulkan data sensor, dan mengirimkannya ke server MQTT.",
    icon: <Cpu className="w-8 h-8 text-primary" />,
    imageUrl: "/esp8266.jpg",
  },
  {
    name: "Sensor DHT22",
    description: "Mengukur suhu dan kelembapan lingkungan secara real-time.",
    longDescription: "Sensor DHT22 adalah sensor digital yang mampu mengukur suhu dan kelembapan dengan akurasi tinggi. Sensor ini ideal untuk aplikasi pemantauan lingkungan karena stabilitas jangka panjangnya dan kemampuannya untuk beroperasi dalam rentang suhu dan kelembapan yang luas. Data dari DHT22 digunakan untuk memantau kondisi ruangan dan memicu tindakan otomatis pada kipas.",
    icon: <Thermometer className="w-8 h-8 text-primary" />,
    imageUrl: "/dht22.jpg",
  },
  {
    name: "Modul Relay",
    description: "Berfungsi sebagai sakelar listrik untuk mengontrol daya kipas.",
    longDescription: "Modul relay adalah sakelar elektronik yang memungkinkan mikrokontroler mengontrol perangkat berdaya tinggi seperti kipas. Ini bertindak sebagai antarmuka antara sirkuit berdaya rendah (mikrokontroler) dan sirkuit berdaya tinggi (kipas), memastikan keamanan dan efisiensi. Relay ini digunakan untuk menghidupkan atau mematikan kipas berdasarkan data suhu dan kelembapan.",
    icon: <ToggleRight className="w-8 h-8 text-primary" />,
    imageUrl: "/relay-module.jpg",
  },
  {
    name: "Buzzer",
    description: "Memberikan peringatan dan notifikasi yang dapat didengar.",
    longDescription: "Buzzer adalah perangkat audio yang menghasilkan suara bip atau nada. Dalam sistem ini, buzzer digunakan untuk memberikan peringatan yang dapat didengar, misalnya ketika terdeteksi adanya gerakan yang tidak biasa atau kondisi lingkungan yang melebihi ambang batas tertentu. Ini berfungsi sebagai indikator status atau alarm sederhana.",
    icon: <Bell className="w-8 h-8 text-primary" />,
    imageUrl: "/buzzer.jpg",
  },
  {
    name: "Modul Kamera",
    description: "Memungkinkan umpan video langsung dan deteksi pose bertenaga AI.",
    longDescription: "Modul kamera terintegrasi untuk menyediakan umpan video langsung dari lingkungan yang dipantau. Selain itu, kamera ini mendukung deteksi pose bertenaga AI, yang dapat digunakan untuk menganalisis keberadaan atau aktivitas orang di dalam ruangan. Fitur ini menambah lapisan intelijen pada sistem pemantauan.",
    icon: <Camera className="w-8 h-8 text-primary" />,
    imageUrl: "/camera-module.jpg",
  },
];

const cardClasses = "bg-card/80 backdrop-blur-sm border border-primary/20 transition-all duration-300 ease-in-out hover:border-primary/40 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10 h-full cursor-pointer";

const HardwareTab = () => {
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<typeof hardwareComponents[0] | null>(null);

  const handleCardClick = (component: typeof hardwareComponents[0]) => {
    setSelectedComponent(component);
    setIsDetailDialogOpen(true);
  };

  return (
    <>
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent>
          {hardwareComponents.map((component, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 p-4">
              <DialogTrigger asChild>
                <Card 
                  className={cn(cardClasses, "opacity-0 animate-fade-in")}
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => handleCardClick(component)}
                >
                  <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                    {component.icon}
                    <CardTitle>{component.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{component.description}</p>
                  </CardContent>
                </Card>
              </DialogTrigger>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="ml-12" />
        <CarouselNext className="mr-12" />
      </Carousel>

      <HardwareDetailDialog 
        isOpen={isDetailDialogOpen} 
        onOpenChange={setIsDetailDialogOpen} 
        component={selectedComponent} 
      />
    </>
  );
};

export default HardwareTab;