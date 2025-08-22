import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Image, Upload } from "lucide-react";

interface DogData {
  name: string;
  breed: string;
  measurements: {
    collar: number;
    chest: number;
    length: number;
    weight: number;
    height: number;
    neckLength: number;
  };
}

interface DesignConfig {
  style: 'classic' | 'modern' | 'sporty';
  fabric: string;
  primaryColor: string;
  secondaryColor: string;
  size: 'XS' | 'S' | 'M' | 'L' | 'XL';
  customFit: {
    collar: number;
    chest: number;
    length: number;
  };
}

interface DogPhotoPreviewProps {
  dog: DogData;
  design: DesignConfig;
}

export default function DogPhotoPreview({ dog, design }: DogPhotoPreviewProps) {
  const [dogPhoto, setDogPhoto] = useState<string | null>(null);

  useEffect(() => {
    // Load the dog photo from localStorage
    const savedPhoto = localStorage.getItem('dogPhoto');
    if (savedPhoto) {
      setDogPhoto(savedPhoto);
    }
  }, []);

  // Generate clothing overlay based on design
  const generateClothingOverlay = () => {
    // Calculate approximate clothing positions based on dog measurements
    // These would be more sophisticated in a real app with AI/ML
    const overlayStyle = {
      position: 'absolute' as const,
      top: '20%',
      left: '20%',
      width: '60%',
      height: '40%',
      borderRadius: design.style === 'modern' ? '20px' : design.style === 'sporty' ? '10px' : '5px',
      backgroundColor: design.primaryColor,
      opacity: 0.7,
      border: `3px solid ${design.secondaryColor}`,
      background: `linear-gradient(135deg, ${design.primaryColor} 0%, ${design.secondaryColor} 100%)`,
    };

    // Add pattern based on fabric
    let pattern = '';
    switch (design.fabric) {
      case 'fleece':
        pattern = 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)';
        break;
      case 'waterproof':
        pattern = 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 2px, transparent 2px)';
        break;
      case 'bamboo':
        pattern = 'repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,255,255,0.1) 1px, rgba(255,255,255,0.1) 2px)';
        break;
      case 'wool':
        pattern = 'repeating-conic-gradient(from 0deg, rgba(255,255,255,0.1) 0deg, transparent 30deg)';
        break;
    }

    if (pattern) {
      overlayStyle.background = `${pattern}, linear-gradient(135deg, ${design.primaryColor} 0%, ${design.secondaryColor} 100%)`;
    }

    return overlayStyle;
  };

  if (!dogPhoto) {
    return (
      <div className="bg-muted/50 rounded-lg p-8 text-center">
        <Image className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="font-medium mb-2">No Photo Available</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Upload a photo in the Measurements section to see your dog wearing the custom design.
        </p>
        <Badge variant="outline" className="text-xs">
          <Upload className="w-3 h-3 mr-1" />
          Add Photo in Measurements
        </Badge>
      </div>
    );
  }

  return (
    <div className="relative bg-white rounded-lg overflow-hidden border">
      {/* Dog Photo */}
      <img
        src={dogPhoto}
        alt={`${dog.name} - ${dog.breed}`}
        className="w-full h-auto max-h-80 object-contain"
      />
      
      {/* Clothing Overlay */}
      <div
        style={generateClothingOverlay()}
        className="pointer-events-none"
      >
        {/* Style-specific details */}
        {design.style === 'modern' && (
          <div className="absolute inset-2 border-2 border-white/30 rounded-xl"></div>
        )}
        {design.style === 'sporty' && (
          <>
            <div className="absolute top-2 left-2 right-2 h-1 bg-white/40 rounded-full"></div>
            <div className="absolute bottom-2 left-2 right-2 h-1 bg-white/40 rounded-full"></div>
          </>
        )}
        {design.style === 'classic' && (
          <div className="absolute inset-3 border border-white/20 rounded"></div>
        )}
      </div>

      {/* Design Info Overlay */}
      <div className="absolute bottom-2 left-2 right-2">
        <div className="bg-black/70 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
          <div className="flex justify-between items-center">
            <span>{dog.name} - {design.style.charAt(0).toUpperCase() + design.style.slice(1)}</span>
            <span className="font-medium">{design.size}</span>
          </div>
        </div>
      </div>

      {/* Fabric Info */}
      <div className="absolute top-2 right-2">
        <Badge 
          variant="secondary" 
          className="text-xs bg-black/70 text-white border-white/20"
        >
          {design.fabric.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ')}
        </Badge>
      </div>
    </div>
  );
}
