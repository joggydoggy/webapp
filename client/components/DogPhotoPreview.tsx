import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Image, Upload, Sparkles } from "lucide-react";

interface MeasurementPoint {
  id: string;
  x: number;
  y: number;
  label: string;
  color: string;
}

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
  const [measurementPoints, setMeasurementPoints] = useState<MeasurementPoint[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Load the dog photo from localStorage
    const savedPhoto = localStorage.getItem('dogPhoto');
    if (savedPhoto) {
      setDogPhoto(savedPhoto);
    }
    
    // Load measurement points from localStorage
    const savedPoints = localStorage.getItem('dogMeasurementPoints');
    if (savedPoints) {
      try {
        setMeasurementPoints(JSON.parse(savedPoints));
      } catch (e) {
        console.warn('Failed to parse measurement points');
      }
    }
  }, []);

  // Automatic shape detection when image loads
  useEffect(() => {
    if (dogPhoto && imageRef.current) {
      setTimeout(() => {
        detectDogShape();
      }, 100);
    }
  }, [dogPhoto]);

  // Automatic dog shape detection
  const detectDogShape = async () => {
    if (!imageRef.current || !canvasRef.current) return;
    
    setIsAnalyzing(true);
    
    try {
      // If we have measurement points, use them; otherwise create estimated points
      if (measurementPoints.length === 0) {
        const imageRect = imageRef.current.getBoundingClientRect();
        const autoPoints = generateAutoMeasurementPoints(imageRect.width, imageRect.height);
        setMeasurementPoints(autoPoints);
        localStorage.setItem('dogMeasurementPoints', JSON.stringify(autoPoints));
      }
    } catch (error) {
      console.warn('Shape detection failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Generate automatic measurement points if none exist
  const generateAutoMeasurementPoints = (width: number, height: number): MeasurementPoint[] => {
    return [
      { id: 'neck-top', x: width * 0.25, y: height * 0.25, label: 'Neck Base', color: '#8B5CF6' },
      { id: 'neck-collar', x: width * 0.28, y: height * 0.35, label: 'Collar Area', color: '#A855F7' },
      { id: 'shoulder', x: width * 0.32, y: height * 0.45, label: 'Shoulder', color: '#22C55E' },
      { id: 'back-start', x: width * 0.32, y: height * 0.25, label: 'Back Start', color: '#10B981' },
      { id: 'back-end', x: width * 0.75, y: height * 0.28, label: 'Back End', color: '#06B6D4' },
      { id: 'chest-top', x: width * 0.35, y: height * 0.45, label: 'Chest Top', color: '#F59E0B' },
      { id: 'chest-bottom', x: width * 0.42, y: height * 0.65, label: 'Chest Bottom', color: '#F97316' },
      { id: 'ground-ref', x: width * 0.35, y: height * 0.85, label: 'Ground Reference', color: '#6B7280' }
    ];
  };

  // Generate clothing path based on measurement points
  const generateClothingPath = () => {
    if (measurementPoints.length === 0) return '';

    const neckTop = measurementPoints.find(p => p.id === 'neck-top');
    const neckCollar = measurementPoints.find(p => p.id === 'neck-collar');
    const shoulder = measurementPoints.find(p => p.id === 'shoulder');
    const backStart = measurementPoints.find(p => p.id === 'back-start');
    const backEnd = measurementPoints.find(p => p.id === 'back-end');
    const chestTop = measurementPoints.find(p => p.id === 'chest-top');
    const chestBottom = measurementPoints.find(p => p.id === 'chest-bottom');

    if (!neckTop || !neckCollar || !shoulder || !backStart || !backEnd || !chestTop || !chestBottom) {
      return '';
    }

    // Create clothing outline based on style
    let path = '';
    
    if (design.style === 'classic') {
      // Classic style - full coverage with rounded edges
      path = `M ${neckTop.x},${neckTop.y}
               Q ${neckCollar.x},${neckCollar.y} ${shoulder.x},${shoulder.y}
               L ${chestTop.x},${chestTop.y}
               Q ${chestBottom.x},${chestBottom.y} ${backEnd.x * 0.8},${chestBottom.y}
               Q ${backEnd.x},${backEnd.y} ${backStart.x},${backStart.y}
               Q ${neckTop.x},${neckTop.y} ${neckTop.x},${neckTop.y} Z`;
    } else if (design.style === 'modern') {
      // Modern style - sleek lines with geometric shapes
      path = `M ${neckTop.x},${neckTop.y}
               L ${neckCollar.x + 10},${neckCollar.y}
               L ${shoulder.x + 5},${shoulder.y}
               L ${chestTop.x},${chestTop.y + 5}
               L ${chestBottom.x + 20},${chestBottom.y - 10}
               L ${backEnd.x - 20},${backEnd.y + 5}
               L ${backStart.x + 10},${backStart.y}
               L ${neckTop.x + 5},${neckTop.y - 5} Z`;
    } else {
      // Sporty style - athletic cut with ventilation areas
      path = `M ${neckTop.x},${neckTop.y}
               Q ${neckCollar.x},${neckCollar.y - 5} ${shoulder.x},${shoulder.y - 10}
               L ${chestTop.x - 5},${chestTop.y}
               L ${chestBottom.x + 15},${chestBottom.y - 15}
               L ${backEnd.x - 25},${backEnd.y}
               Q ${backStart.x},${backStart.y + 5} ${neckTop.x},${neckTop.y} Z`;
    }

    return path;
  };

  // Generate fabric pattern
  const getFabricPattern = () => {
    const patternId = `fabric-pattern-${design.fabric}`;
    
    switch (design.fabric) {
      case 'fleece':
        return (
          <pattern id={patternId} patternUnits="userSpaceOnUse" width="10" height="10">
            <rect width="10" height="10" fill={design.primaryColor} />
            <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.3)" />
            <circle cx="8" cy="8" r="1" fill="rgba(255,255,255,0.3)" />
          </pattern>
        );
      case 'waterproof':
        return (
          <pattern id={patternId} patternUnits="userSpaceOnUse" width="8" height="8">
            <rect width="8" height="8" fill={design.primaryColor} />
            <path d="M0,4 Q4,0 8,4 Q4,8 0,4" fill="rgba(255,255,255,0.2)" />
          </pattern>
        );
      case 'bamboo':
        return (
          <pattern id={patternId} patternUnits="userSpaceOnUse" width="6" height="20">
            <rect width="6" height="20" fill={design.primaryColor} />
            <line x1="1" y1="0" x2="1" y2="20" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
            <line x1="4" y1="0" x2="4" y2="20" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
          </pattern>
        );
      case 'wool':
        return (
          <pattern id={patternId} patternUnits="userSpaceOnUse" width="12" height="12">
            <rect width="12" height="12" fill={design.primaryColor} />
            <circle cx="3" cy="3" r="2" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
            <circle cx="9" cy="9" r="2" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
          </pattern>
        );
      default:
        return (
          <pattern id={patternId} patternUnits="userSpaceOnUse" width="4" height="4">
            <rect width="4" height="4" fill={design.primaryColor} />
          </pattern>
        );
    }
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
      {/* Analysis Indicator */}
      {isAnalyzing && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-10 rounded-lg">
          <div className="bg-white/90 px-4 py-2 rounded-lg flex items-center space-x-2">
            <Sparkles className="w-4 h-4 animate-spin text-dogzilla-purple" />
            <span className="text-sm font-medium">Analyzing dog shape...</span>
          </div>
        </div>
      )}

      {/* Dog Photo */}
      <img
        ref={imageRef}
        src={dogPhoto}
        alt={`${dog.name} - ${dog.breed}`}
        className="w-full h-auto max-h-80 object-contain"
        onLoad={() => detectDogShape()}
      />
      
      {/* Hidden canvas for image processing */}
      <canvas
        ref={canvasRef}
        className="hidden"
      />
      
      {/* Smart Clothing Overlay using SVG */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox={`0 0 ${imageRef.current?.clientWidth || 400} ${imageRef.current?.clientHeight || 300}`}
        preserveAspectRatio="none"
      >
        <defs>
          {getFabricPattern()}
          
          {/* Gradient definitions */}
          <linearGradient id="clothingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={design.primaryColor} stopOpacity="0.9" />
            <stop offset="50%" stopColor={design.secondaryColor} stopOpacity="0.8" />
            <stop offset="100%" stopColor={design.primaryColor} stopOpacity="0.9" />
          </linearGradient>
          
          {/* Shadow filter */}
          <filter id="clothingShadow">
            <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3"/>
          </filter>
        </defs>
        
        {/* Main clothing shape */}
        {measurementPoints.length > 0 && (
          <path
            d={generateClothingPath()}
            fill={`url(#fabric-pattern-${design.fabric})`}
            stroke={design.secondaryColor}
            strokeWidth="2"
            filter="url(#clothingShadow)"
            opacity="0.85"
          />
        )}
        
        {/* Style-specific accents */}
        {design.style === 'sporty' && measurementPoints.length > 0 && (
          <>
            {/* Sporty stripes */}
            <line 
              x1={measurementPoints.find(p => p.id === 'chest-top')?.x || 0}
              y1={measurementPoints.find(p => p.id === 'chest-top')?.y || 0}
              x2={(measurementPoints.find(p => p.id === 'back-end')?.x || 0) * 0.7}
              y2={measurementPoints.find(p => p.id === 'chest-top')?.y || 0}
              stroke="white"
              strokeWidth="3"
              opacity="0.6"
            />
            <line 
              x1={measurementPoints.find(p => p.id === 'chest-bottom')?.x || 0}
              y1={(measurementPoints.find(p => p.id === 'chest-bottom')?.y || 0) - 20}
              x2={(measurementPoints.find(p => p.id === 'back-end')?.x || 0) * 0.8}
              y2={(measurementPoints.find(p => p.id === 'chest-bottom')?.y || 0) - 20}
              stroke="white"
              strokeWidth="3"
              opacity="0.6"
            />
          </>
        )}
        
        {design.style === 'modern' && measurementPoints.length > 0 && (
          <>
            {/* Modern geometric accent */}
            <circle
              cx={(measurementPoints.find(p => p.id === 'chest-top')?.x || 0) + 20}
              cy={(measurementPoints.find(p => p.id === 'chest-top')?.y || 0) + 10}
              r="8"
              fill="white"
              opacity="0.7"
            />
          </>
        )}
        
        {/* Measurement visualization (subtle) */}
        {measurementPoints.map(point => (
          <circle
            key={point.id}
            cx={point.x}
            cy={point.y}
            r="2"
            fill={point.color}
            opacity="0.4"
          />
        ))}
      </svg>

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
      
      {/* Smart Detection Badge */}
      <div className="absolute top-2 left-2">
        <Badge 
          variant="outline" 
          className="text-xs bg-dogzilla-purple/10 border-dogzilla-purple/30 text-dogzilla-purple"
        >
          <Sparkles className="w-3 h-3 mr-1" />
          Auto-Fitted
        </Badge>
      </div>
    </div>
  );
}
