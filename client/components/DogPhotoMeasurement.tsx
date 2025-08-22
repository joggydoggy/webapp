import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  Upload, 
  Camera, 
  Ruler, 
  RotateCcw, 
  Save, 
  Info,
  Target,
  Move
} from "lucide-react";

interface MeasurementPoint {
  id: string;
  x: number;
  y: number;
  label: string;
  color: string;
}

interface MeasurementLine {
  id: string;
  startPoint: string;
  endPoint: string;
  label: string;
  color: string;
  value?: number;
}

interface DogPhotoMeasurementProps {
  onMeasurementsChange: (measurements: {
    collar: number;
    chest: number;
    length: number;
    height: number;
    neckLength: number;
    weight: number;
  }) => void;
  onSaveMeasurements?: () => void;
}

export default function DogPhotoMeasurement({ onMeasurementsChange, onSaveMeasurements }: DogPhotoMeasurementProps) {
  const [image, setImage] = useState<string | null>(null);
  const [imageScale, setImageScale] = useState(1);
  const [measurementPoints, setMeasurementPoints] = useState<MeasurementPoint[]>([]);
  const [measurementLines, setMeasurementLines] = useState<MeasurementLine[]>([]);
  const [activePoint, setActivePoint] = useState<string | null>(null);
  const [referenceMeasurement, setReferenceMeasurement] = useState<number>(10); // cm
  const [referencePixels, setReferencePixels] = useState<number>(100); // pixels
  const [measurementsReady, setMeasurementsReady] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Essential measurement points for dog clothing
  const essentialPoints = [
    { id: 'neck-top', label: 'Neck Base', color: '#8B5CF6' },
    { id: 'neck-collar', label: 'Collar Area', color: '#A855F7' },
    { id: 'shoulder', label: 'Shoulder', color: '#22C55E' },
    { id: 'back-start', label: 'Back Start', color: '#10B981' },
    { id: 'back-end', label: 'Back End', color: '#06B6D4' },
    { id: 'chest-top', label: 'Chest Top', color: '#F59E0B' },
    { id: 'chest-bottom', label: 'Chest Bottom', color: '#F97316' },
    { id: 'ground-ref', label: 'Ground Reference', color: '#6B7280' }
  ];

  // Measurement lines configuration - only essential measurements
  const measurementConfig = [
    { id: 'collar', startPoint: 'neck-top', endPoint: 'neck-collar', label: 'Collar', color: '#8B5CF6' },
    { id: 'length', startPoint: 'back-start', endPoint: 'back-end', label: 'Back Length', color: '#A855F7' },
    { id: 'height', startPoint: 'shoulder', endPoint: 'ground-ref', label: 'Height', color: '#22C55E' },
    { id: 'chest', startPoint: 'chest-top', endPoint: 'chest-bottom', label: 'Chest Depth', color: '#F59E0B' }
  ];

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImage(result);
        // Save photo to localStorage for use in Design Studio
        localStorage.setItem('dogPhoto', result);
        // Auto-place some initial points for demonstration
        setTimeout(() => {
          autoDetectPoints();
        }, 100);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  // Utility function to keep points within image bounds
  const constrainToBounds = (x: number, y: number, imageWidth: number, imageHeight: number) => {
    return {
      x: Math.max(10, Math.min(x, imageWidth - 10)),
      y: Math.max(10, Math.min(y, imageHeight - 10))
    };
  };

  const autoDetectPoints = () => {
    if (!imageRef.current) return;

    const imageRect = imageRef.current.getBoundingClientRect();
    const imageWidth = imageRect.width;
    const imageHeight = imageRect.height;

    // Improved auto-detection based on typical dog anatomy in side view
    // Assumes dog is facing left in the photo
    const basePoints = [
      // Neck area (front of dog)
      { id: 'neck-top', rawX: imageWidth * 0.25, rawY: imageHeight * 0.25, label: 'Neck Base', color: '#8B5CF6' },
      { id: 'neck-collar', rawX: imageWidth * 0.28, rawY: imageHeight * 0.35, label: 'Collar Area', color: '#A855F7' },

      // Body structure
      { id: 'shoulder', rawX: imageWidth * 0.32, rawY: imageHeight * 0.45, label: 'Shoulder', color: '#22C55E' },
      { id: 'back-start', rawX: imageWidth * 0.32, rawY: imageHeight * 0.25, label: 'Back Start', color: '#10B981' },
      { id: 'back-end', rawX: imageWidth * 0.75, rawY: imageHeight * 0.28, label: 'Back End', color: '#06B6D4' },

      // Chest measurements
      { id: 'chest-top', rawX: imageWidth * 0.35, rawY: imageHeight * 0.45, label: 'Chest Top', color: '#F59E0B' },
      { id: 'chest-bottom', rawX: imageWidth * 0.42, rawY: imageHeight * 0.65, label: 'Chest Bottom', color: '#F97316' },

      // Ground reference for height
      { id: 'ground-ref', rawX: imageWidth * 0.35, rawY: imageHeight * 0.85, label: 'Ground Reference', color: '#6B7280' }
    ];

    // Apply bounds checking to all points
    const autoPoints: MeasurementPoint[] = basePoints.map(point => {
      const constrained = constrainToBounds(point.rawX, point.rawY, imageWidth, imageHeight);
      return {
        id: point.id,
        x: constrained.x,
        y: constrained.y,
        label: point.label,
        color: point.color
      };
    });

    setMeasurementPoints(autoPoints);
    calculateMeasurements(autoPoints);
    setMeasurementsReady(true);
    // Save points for use in Design Studio preview
    localStorage.setItem('dogMeasurementPoints', JSON.stringify(autoPoints));
  };

  const handlePointDrag = (pointId: string, newX: number, newY: number) => {
    if (!imageRef.current) return;

    const imageRect = imageRef.current.getBoundingClientRect();
    const constrained = constrainToBounds(newX, newY, imageRect.width, imageRect.height);

    const updatedPoints = measurementPoints.map(point =>
      point.id === pointId
        ? { ...point, x: constrained.x, y: constrained.y }
        : point
    );

    setMeasurementPoints(updatedPoints);
    calculateMeasurements(updatedPoints);
    setMeasurementsReady(updatedPoints.length === essentialPoints.length);
    // Save updated points for use in Design Studio preview
    localStorage.setItem('dogMeasurementPoints', JSON.stringify(updatedPoints));
  };

  const calculateMeasurements = (points: MeasurementPoint[]) => {
    const pixelsPerCm = referencePixels / referenceMeasurement;
    
    const measurements = {
      collar: 0,
      chest: 0,
      length: 0,
      height: 0,
      neckLength: 0,
      weight: 20 // Default weight, would need additional input
    };

    measurementConfig.forEach(config => {
      const startPoint = points.find(p => p.id === config.startPoint);
      const endPoint = points.find(p => p.id === config.endPoint);
      
      if (startPoint && endPoint) {
        const pixelDistance = Math.sqrt(
          Math.pow(endPoint.x - startPoint.x, 2) + 
          Math.pow(endPoint.y - startPoint.y, 2)
        );
        const cmDistance = pixelDistance / pixelsPerCm;
        
        switch(config.id) {
          case 'collar':
            measurements.collar = Math.round(cmDistance * 3.14); // Approximate circumference
            break;
          case 'length':
            measurements.length = Math.round(cmDistance);
            break;
          case 'height':
            measurements.height = Math.round(cmDistance);
            break;
          case 'chest':
            measurements.chest = Math.round(cmDistance * 3.5); // Approximate chest circumference
            measurements.neckLength = Math.round(cmDistance * 0.6); // Estimate neck length from chest depth
            break;
        }
      }
    });

    onMeasurementsChange(measurements);
  };

  const resetPoints = () => {
    setMeasurementPoints([]);
    setMeasurementLines([]);
    setMeasurementsReady(false);
  };

  const handleSaveMeasurements = () => {
    if (onSaveMeasurements) {
      onSaveMeasurements();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Camera className="w-5 h-5 mr-2 text-dogzilla-purple" />
          Photo-Based Measurements
        </CardTitle>
        <CardDescription>
          Upload a side view photo of your dog and place measurement markers for accurate sizing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!image ? (
          <div className="space-y-4">
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-dogzilla-purple transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium">Upload Dog Photo</p>
              <p className="text-sm text-muted-foreground">Click to select a side view photo of your dog</p>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <h4 className="font-medium flex items-center mb-2">
                <Info className="w-4 h-4 mr-2" />
                Photo Tips
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Take a clear side view photo of your dog standing</li>
                <li>• Ensure the dog is fully visible in the frame</li>
                <li>• Good lighting helps with automatic point detection</li>
                <li>• Include a reference object (like a ruler) for scale</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Controls */}
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={autoDetectPoints}>
                <Target className="w-4 h-4 mr-2" />
                Auto-Detect Points
              </Button>
              <Button variant="outline" size="sm" onClick={resetPoints}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Points
              </Button>
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                New Photo
              </Button>
            </div>

            {/* Reference Scale */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <Label htmlFor="ref-measurement">Reference Size (cm)</Label>
                <input
                  id="ref-measurement"
                  type="number"
                  value={referenceMeasurement}
                  onChange={(e) => setReferenceMeasurement(Number(e.target.value))}
                  className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="ref-pixels">Reference Pixels</Label>
                <input
                  id="ref-pixels"
                  type="number"
                  value={referencePixels}
                  onChange={(e) => setReferencePixels(Number(e.target.value))}
                  className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                />
              </div>
            </div>

            {/* Image with Measurement Points */}
            <div className="relative inline-block">
              <img
                ref={imageRef}
                src={image}
                alt="Dog for measurement"
                className="max-w-full h-auto rounded-lg border"
                style={{ maxHeight: '500px' }}
              />
              
              {/* Measurement Points */}
              {measurementPoints.map(point => (
                <div
                  key={point.id}
                  className="absolute w-4 h-4 rounded-full border-2 border-white cursor-move shadow-lg transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-transform"
                  style={{ 
                    left: point.x, 
                    top: point.y, 
                    backgroundColor: point.color 
                  }}
                  onMouseDown={(e) => {
                    setActivePoint(point.id);
                    const handleMouseMove = (e: MouseEvent) => {
                      if (imageRef.current) {
                        const rect = imageRef.current.getBoundingClientRect();
                        const newX = e.clientX - rect.left;
                        const newY = e.clientY - rect.top;
                        handlePointDrag(point.id, newX, newY);
                      }
                    };
                    const handleMouseUp = () => {
                      setActivePoint(null);
                      document.removeEventListener('mousemove', handleMouseMove);
                      document.removeEventListener('mouseup', handleMouseUp);
                    };
                    document.addEventListener('mousemove', handleMouseMove);
                    document.addEventListener('mouseup', handleMouseUp);
                  }}
                  title={point.label}
                />
              ))}
              
              {/* Measurement Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {measurementConfig.map(config => {
                  const startPoint = measurementPoints.find(p => p.id === config.startPoint);
                  const endPoint = measurementPoints.find(p => p.id === config.endPoint);
                  
                  if (startPoint && endPoint) {
                    const pixelDistance = Math.sqrt(
                      Math.pow(endPoint.x - startPoint.x, 2) + 
                      Math.pow(endPoint.y - startPoint.y, 2)
                    );
                    const cmDistance = Math.round(pixelDistance / (referencePixels / referenceMeasurement));
                    
                    return (
                      <g key={config.id}>
                        <line
                          x1={startPoint.x}
                          y1={startPoint.y}
                          x2={endPoint.x}
                          y2={endPoint.y}
                          stroke={config.color}
                          strokeWidth="2"
                          strokeDasharray="5,5"
                        />
                        <text
                          x={(startPoint.x + endPoint.x) / 2}
                          y={(startPoint.y + endPoint.y) / 2 - 10}
                          fill={config.color}
                          fontSize="12"
                          fontWeight="bold"
                          textAnchor="middle"
                          className="drop-shadow-sm"
                        >
                          {config.label}: {cmDistance}cm
                        </text>
                      </g>
                    );
                  }
                  return null;
                })}
              </svg>
            </div>

            {/* Essential Points Legend */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {essentialPoints.map(point => (
                <div key={point.id} className="flex items-center space-x-2 text-sm">
                  <div
                    className="w-3 h-3 rounded-full border border-white"
                    style={{ backgroundColor: point.color }}
                  />
                  <span className="text-xs">{point.label}</span>
                </div>
              ))}
            </div>

            {/* Measurement Instructions */}
            <div className="p-3 bg-dogzilla-purple/10 rounded-lg">
              <h4 className="font-medium text-sm mb-2 flex items-center">
                <Target className="w-4 h-4 mr-2" />
                Adjustment Tips
              </h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Drag points to fine-tune positioning</li>
                <li>• Ensure collar points capture the neck circumference</li>
                <li>• Back length should span from shoulders to tail base</li>
                <li>• Chest depth helps calculate full chest circumference</li>
              </ul>
            </div>

            {/* Save Button */}
            {measurementsReady && (
              <div className="flex justify-center pt-4">
                <Button
                  onClick={handleSaveMeasurements}
                  className="bg-dogzilla-purple hover:bg-dogzilla-purple/90 px-8"
                  size="lg"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Measurements
                </Button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
