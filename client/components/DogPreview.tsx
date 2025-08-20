import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, ZoomIn, ZoomOut, RotateCw } from "lucide-react";

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

interface DogPreviewProps {
  dog: DogData;
  design: DesignConfig;
}

// Breed-specific characteristics for side view (used as base multipliers)
const breedCharacteristics: Record<string, {
  bodyLength: number; // body length multiplier
  bodyHeight: number; // body height multiplier
  neckLength: number; // relative neck length
  legLength: number; // relative leg length
  headLength: number; // head length (snout to back of head)
  headHeight: number; // head height
  backCurve: number; // back curvature (0-1)
  chestDepth: number; // chest depth multiplier
  bellyTuck: number; // belly tuck-up (0-1)
}> = {
  'Golden Retriever': {
    bodyLength: 1.0,
    bodyHeight: 1.0,
    neckLength: 1.0,
    legLength: 1.0,
    headLength: 1.0,
    headHeight: 1.0,
    backCurve: 0.1,
    chestDepth: 1.0,
    bellyTuck: 0.2
  },
  'French Bulldog': {
    bodyLength: 0.8,
    bodyHeight: 0.9,
    neckLength: 0.6,
    legLength: 0.7,
    headLength: 1.1,
    headHeight: 1.3,
    backCurve: 0.05,
    chestDepth: 1.2,
    bellyTuck: 0.1
  },
  'Labrador': {
    bodyLength: 1.0,
    bodyHeight: 1.0,
    neckLength: 0.9,
    legLength: 1.0,
    headLength: 0.9,
    headHeight: 0.9,
    backCurve: 0.1,
    chestDepth: 1.0,
    bellyTuck: 0.15
  },
  'German Shepherd': {
    bodyLength: 1.1,
    bodyHeight: 1.1,
    neckLength: 1.1,
    legLength: 1.1,
    headLength: 1.0,
    headHeight: 0.95,
    backCurve: 0.2,
    chestDepth: 0.9,
    bellyTuck: 0.3
  },
  'Chihuahua': {
    bodyLength: 0.7,
    bodyHeight: 0.6,
    neckLength: 0.7,
    legLength: 0.6,
    headLength: 1.2,
    headHeight: 1.4,
    backCurve: 0.05,
    chestDepth: 0.8,
    bellyTuck: 0.25
  },
  'Bulldog': {
    bodyLength: 0.8,
    bodyHeight: 0.8,
    neckLength: 0.5,
    legLength: 0.6,
    headLength: 1.1,
    headHeight: 1.2,
    backCurve: 0.05,
    chestDepth: 1.3,
    bellyTuck: 0.05
  }
};

export default function DogPreview({ dog, design }: DogPreviewProps) {
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);

  // Calculate geometric dimensions based purely on user measurements
  const baseScale = 2.5; // Base scaling factor for display

  // Core body dimensions from measurements
  const bodyLength = dog.measurements.length * baseScale;
  const bodyHeight = dog.measurements.height * baseScale * 0.8; // Adjusted for side view
  const neckLength = dog.measurements.neckLength * baseScale;
  const headLength = neckLength * 0.6; // Simple head proportional to neck
  const headHeight = bodyHeight * 0.3; // Simple head height
  const legLength = bodyHeight * 0.7; // Legs proportional to height
  const chestDepth = dog.measurements.chest * baseScale * 0.2; // Depth for 3D effect

  // Calculate clothing dimensions based on custom fit
  const clothingLength = design.customFit.length * baseScale * 0.85;
  const clothingHeight = design.customFit.chest * baseScale * 0.15;

  // Simple geometric clothing overlay
  const getClothingOutline = () => {
    const startX = 120;
    const backY = 180;
    const clothingStartX = startX + neckLength + 5; // Start slightly after neck
    const clothingEndX = clothingStartX + clothingLength;
    const clothingBackY = backY + 5; // Slightly below back line
    const clothingBellyY = clothingBackY + clothingHeight;

    // Simple rectangular clothing with style variations
    const baseClothing = [
      [clothingStartX, clothingBackY], // front top
      [clothingEndX, clothingBackY], // back top
      [clothingEndX, clothingBellyY], // back bottom
      [clothingStartX, clothingBellyY] // front bottom
    ];

    // Style-specific modifications
    if (design.style === 'sporty') {
      // Add angled cut for sporty look
      return [
        [clothingStartX + 10, clothingBackY],
        [clothingEndX - 5, clothingBackY],
        [clothingEndX - 10, clothingBellyY],
        [clothingStartX + 5, clothingBellyY]
      ];
    } else if (design.style === 'classic') {
      // Traditional rectangular cut
      return baseClothing;
    } else { // modern
      // Slightly tapered modern cut
      return [
        [clothingStartX + 5, clothingBackY],
        [clothingEndX, clothingBackY],
        [clothingEndX - 8, clothingBellyY],
        [clothingStartX, clothingBellyY]
      ];
    }
  };

  const getDogOutline = () => {
    // Define key points for low-poly dog outline
    const startX = 120;
    const backY = 180;

    // Head points (simple rectangle)
    const headPoints = [
      [startX, backY + 10], // head back top
      [startX - headLength, backY + 10], // head front top
      [startX - headLength, backY + 10 + headHeight], // head front bottom
      [startX, backY + 10 + headHeight] // head back bottom
    ];

    // Neck points (connecting head to body)
    const neckPoints = [
      [startX, backY + 10 + headHeight], // neck start (from head)
      [startX + neckLength, backY] // neck end (to body)
    ];

    // Body points (main rectangle with slight taper)
    const bodyPoints = [
      [startX + neckLength, backY], // body front top
      [startX + neckLength + bodyLength, backY], // body back top
      [startX + neckLength + bodyLength, backY + bodyHeight * 0.8], // body back bottom
      [startX + neckLength + bodyLength * 0.2, backY + bodyHeight] // body front bottom (chest)
    ];

    // Leg points (simple lines)
    const frontLeg = [
      [startX + neckLength + bodyLength * 0.25, backY + bodyHeight * 0.8],
      [startX + neckLength + bodyLength * 0.25, backY + bodyHeight * 0.8 + legLength]
    ];

    const backLeg = [
      [startX + neckLength + bodyLength * 0.75, backY + bodyHeight * 0.8],
      [startX + neckLength + bodyLength * 0.75, backY + bodyHeight * 0.8 + legLength]
    ];

    // Tail points (simple line)
    const tailPoints = [
      [startX + neckLength + bodyLength, backY + bodyHeight * 0.4],
      [startX + neckLength + bodyLength + 30, backY - 20]
    ];

    return { headPoints, neckPoints, bodyPoints, frontLeg, backLeg, tailPoints, startX, backY };
  };

  return (
    <div className="bg-gradient-to-br from-muted/30 to-background rounded-lg p-4 space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-xs">
            {dog.breed}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {design.style}
          </Badge>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
            className="h-8 w-8 p-0"
          >
            <ZoomOut className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setZoom(Math.min(2, zoom + 0.1))}
            className="h-8 w-8 p-0"
          >
            <ZoomIn className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setRotation((rotation + 45) % 360)}
            className="h-8 w-8 p-0"
          >
            <RotateCw className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setRotation(0);
              setZoom(1);
            }}
            className="h-8 w-8 p-0"
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Preview Canvas */}
      <div className="aspect-square bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-950/20 dark:to-blue-950/20 rounded-lg overflow-hidden relative">
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full"
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
            transition: 'transform 0.3s ease'
          }}
        >
          {/* Ground line */}
          <line
            x1="50"
            y1="380"
            x2="350"
            y2="380"
            stroke="rgba(0,0,0,0.2)"
            strokeWidth="1"
            strokeDasharray="5,5"
          />

          {(() => {
            const outline = getDogOutline();
            const clothingOutline = getClothingOutline();

            return (
              <g>
                {/* Dog outline - head */}
                <polygon
                  points={outline.headPoints.map(p => `${p[0]},${p[1]}`).join(' ')}
                  fill="none"
                  stroke="#6B7280"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />

                {/* Dog outline - neck */}
                <line
                  x1={outline.neckPoints[0][0]}
                  y1={outline.neckPoints[0][1]}
                  x2={outline.neckPoints[1][0]}
                  y2={outline.neckPoints[1][1]}
                  stroke="#6B7280"
                  strokeWidth="2"
                />

                {/* Dog outline - body */}
                <polygon
                  points={outline.bodyPoints.map(p => `${p[0]},${p[1]}`).join(' ')}
                  fill="none"
                  stroke="#6B7280"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />

                {/* Dog outline - front leg */}
                <line
                  x1={outline.frontLeg[0][0]}
                  y1={outline.frontLeg[0][1]}
                  x2={outline.frontLeg[1][0]}
                  y2={outline.frontLeg[1][1]}
                  stroke="#6B7280"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* Dog outline - back leg */}
                <line
                  x1={outline.backLeg[0][0]}
                  y1={outline.backLeg[0][1]}
                  x2={outline.backLeg[1][0]}
                  y2={outline.backLeg[1][1]}
                  stroke="#6B7280"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* Dog outline - tail */}
                <line
                  x1={outline.tailPoints[0][0]}
                  y1={outline.tailPoints[0][1]}
                  x2={outline.tailPoints[1][0]}
                  y2={outline.tailPoints[1][1]}
                  stroke="#6B7280"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* Clothing overlay */}
                <polygon
                  points={clothingOutline.map(p => `${p[0]},${p[1]}`).join(' ')}
                  fill={design.primaryColor}
                  fillOpacity="0.7"
                  stroke={design.secondaryColor}
                  strokeWidth="2"
                  strokeLinejoin="round"
                />

                {/* Style-specific details */}
                {design.style === 'sporty' && (
                  <g>
                    <line
                      x1={clothingOutline[0][0] + 15}
                      y1={clothingOutline[0][1] + 8}
                      x2={clothingOutline[1][0] - 15}
                      y2={clothingOutline[1][1] + 8}
                      stroke={design.secondaryColor}
                      strokeWidth="3"
                    />
                    <line
                      x1={clothingOutline[0][0] + 10}
                      y1={clothingOutline[0][1] + 18}
                      x2={clothingOutline[1][0] - 20}
                      y2={clothingOutline[1][1] + 18}
                      stroke={design.secondaryColor}
                      strokeWidth="2"
                    />
                  </g>
                )}

                {design.style === 'classic' && (
                  <g>
                    <circle
                      cx={clothingOutline[0][0] + 20}
                      cy={clothingOutline[0][1] + 15}
                      r="3"
                      fill={design.secondaryColor}
                    />
                    <circle
                      cx={clothingOutline[0][0] + 40}
                      cy={clothingOutline[0][1] + 15}
                      r="3"
                      fill={design.secondaryColor}
                    />
                  </g>
                )}

                {design.style === 'modern' && (
                  <polygon
                    points={`${clothingOutline[0][0] + 25},${clothingOutline[0][1] + 10} ${clothingOutline[0][0] + 40},${clothingOutline[0][1] + 5} ${clothingOutline[0][0] + 55},${clothingOutline[0][1] + 10} ${clothingOutline[0][0] + 40},${clothingOutline[0][1] + 15}`}
                    fill={design.secondaryColor}
                    fillOpacity="0.8"
                  />
                )}
              </g>
            );
          })()}
        </svg>

        {/* Measurement overlay */}
        <div className="absolute bottom-4 left-4 text-xs text-muted-foreground bg-background/80 p-2 rounded">
          <div>Chest: {design.customFit.chest}cm</div>
          <div>Length: {design.customFit.length}cm</div>
          <div>Collar: {design.customFit.collar}cm</div>
        </div>

        {/* Fabric indicator */}
        <div className="absolute top-4 right-4">
          <Badge 
            variant="secondary" 
            className="text-xs bg-background/80"
          >
            {design.fabric.replace('-', ' ')}
          </Badge>
        </div>
      </div>
    </div>
  );
}
