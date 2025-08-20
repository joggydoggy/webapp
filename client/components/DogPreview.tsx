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
  const baseScale = 2.2; // Base scaling factor for display

  // Core body dimensions from measurements
  const bodyLength = dog.measurements.length * baseScale;
  const bodyHeight = dog.measurements.height * baseScale * 0.75; // Adjusted for side view
  const bodyWidth = dog.measurements.chest * baseScale * 0.3; // Width based on chest circumference
  const neckLength = dog.measurements.neckLength * baseScale;
  const neckThickness = dog.measurements.collar * baseScale * 0.15; // Neck thickness from collar circumference
  const headLength = neckLength * 0.8; // Head proportional to neck
  const headHeight = neckThickness * 1.8; // Head height based on neck thickness
  const legLength = bodyHeight * 0.8; // Legs proportional to height

  // Calculate clothing dimensions based on custom fit
  const clothingLength = design.customFit.length * baseScale * 0.82;
  const clothingHeight = design.customFit.chest * baseScale * 0.18;

  // Clothing overlay that fits over dog shape nodes
  const getClothingOutline = (dogOutline: any) => {
    const { bodyStartX, backY, bodyPoints, neckPoints } = dogOutline;

    // Clothing should wrap around the dog's body shape
    const clothingStartX = bodyStartX + 8; // Start after neck connection
    const clothingEndX = clothingStartX + clothingLength;
    const clothingBackY = backY + 3; // Slightly above back line
    const clothingBellyY = clothingBackY + clothingHeight;

    // Follow the dog's body contour for proper fit
    const neckConnectionY = neckPoints[2][1]; // Lower neck connection point

    // Base clothing points that follow dog shape
    const baseClothing = [
      [clothingStartX, clothingBackY], // front top (on back)
      [clothingEndX, clothingBackY], // back top (on back)
      [clothingEndX, clothingBellyY], // back bottom
      [bodyStartX + bodyLength * 0.15, clothingBellyY + 5], // front bottom (following chest curve)
      [clothingStartX - 5, neckConnectionY + 8] // connect near neck
    ];

    // Style-specific modifications
    if (design.style === 'sporty') {
      // Athletic cut with angled lines
      return [
        [clothingStartX + 12, clothingBackY - 2],
        [clothingEndX - 8, clothingBackY],
        [clothingEndX - 12, clothingBellyY],
        [bodyStartX + bodyLength * 0.15, clothingBellyY + 3],
        [clothingStartX - 3, neckConnectionY + 10]
      ];
    } else if (design.style === 'classic') {
      // Traditional cut following body lines
      return baseClothing;
    } else { // modern
      // Contemporary cut with geometric precision
      return [
        [clothingStartX + 8, clothingBackY],
        [clothingEndX - 2, clothingBackY],
        [clothingEndX - 10, clothingBellyY],
        [bodyStartX + bodyLength * 0.18, clothingBellyY + 2],
        [clothingStartX - 2, neckConnectionY + 6]
      ];
    }
  };

  const getDogOutline = () => {
    // Define key points for realistic low-poly dog outline
    const startX = 120;
    const backY = 180;

    // Head points (more realistic dog head shape)
    const headPoints = [
      [startX - headLength * 0.9, backY + 5], // snout top
      [startX - headLength * 0.2, backY], // forehead top
      [startX, backY + 8], // head back top
      [startX, backY + 8 + headHeight], // head back bottom
      [startX - headLength * 0.3, backY + 8 + headHeight], // jaw back
      [startX - headLength * 0.9, backY + 8 + headHeight * 0.7] // snout bottom
    ];

    // Neck shape (proper trapezoid connecting head to body)
    const neckPoints = [
      [startX, backY + 8 + headHeight * 0.7], // neck start from head (upper)
      [startX, backY + 8 + headHeight], // neck start from head (lower)
      [startX + neckLength, backY + bodyHeight * 0.2], // neck end to body (lower)
      [startX + neckLength, backY] // neck end to body (upper)
    ];

    // Body points (using chest circumference for width)
    const bodyStartX = startX + neckLength;
    const chestWidth = bodyWidth;
    const bodyPoints = [
      [bodyStartX, backY], // body front top
      [bodyStartX + bodyLength, backY], // body back top
      [bodyStartX + bodyLength, backY + bodyHeight * 0.9], // body back bottom
      [bodyStartX + bodyLength * 0.15, backY + bodyHeight], // body front bottom (chest extends)
      [bodyStartX, backY + bodyHeight * 0.7] // body front side
    ];

    // Leg points (positioned relative to body)
    const frontLeg = [
      [bodyStartX + bodyLength * 0.2, backY + bodyHeight * 0.9],
      [bodyStartX + bodyLength * 0.2, backY + bodyHeight * 0.9 + legLength]
    ];

    const backLeg = [
      [bodyStartX + bodyLength * 0.8, backY + bodyHeight * 0.9],
      [bodyStartX + bodyLength * 0.8, backY + bodyHeight * 0.9 + legLength]
    ];

    // Tail points
    const tailPoints = [
      [bodyStartX + bodyLength, backY + bodyHeight * 0.4],
      [bodyStartX + bodyLength + 35, backY - 15]
    ];

    return {
      headPoints,
      neckPoints,
      bodyPoints,
      frontLeg,
      backLeg,
      tailPoints,
      startX,
      backY,
      bodyStartX,
      neckThickness
    };
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
