import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, ZoomIn, ZoomOut, RotateCw } from "lucide-react";

interface Dog {
  id: string;
  name: string;
  breed: string;
  measurements: {
    collar: number;
    chest: number;
    length: number;
    weight: number;
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
  dog: Dog;
  design: DesignConfig;
}

// Breed-specific characteristics for side view
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

  const characteristics = breedCharacteristics[dog.breed] || breedCharacteristics['Golden Retriever'];

  // Calculate sizes based on measurements and breed characteristics for side view
  const baseScale = 3; // Base scaling factor
  const bodyLength = dog.measurements.length * baseScale * characteristics.bodyLength;
  const bodyHeight = dog.measurements.chest * 0.6 * baseScale * characteristics.bodyHeight;
  const headLength = (bodyLength * 0.25) * characteristics.headLength;
  const headHeight = (bodyHeight * 0.4) * characteristics.headHeight;
  const neckLength = (bodyLength * 0.15) * characteristics.neckLength;
  const legLength = (bodyHeight * 0.6) * characteristics.legLength;
  const chestDepth = bodyHeight * characteristics.chestDepth;

  // Calculate clothing dimensions based on custom fit for side view
  const clothingLength = design.customFit.length * baseScale * 0.9; // Slightly shorter than body
  const clothingHeight = design.customFit.chest * 0.4 * baseScale; // Height of clothing on body

  // Style-specific clothing shapes for side view (fitted to dog body)
  const getClothingPath = () => {
    // Base positioning - clothing starts after neck and covers body
    const clothingStartX = 120 + neckLength * 0.8; // Start after neck
    const clothingEndX = clothingStartX + clothingLength;
    const backY = 180; // Top of back
    const bellyY = backY + clothingHeight; // Bottom of clothing

    // Create curved path that follows dog's body contours
    const backCurveControl = backY + (bodyHeight * characteristics.backCurve * 20);
    const bellyTuckY = bellyY - (clothingHeight * characteristics.bellyTuck);

    switch (design.style) {
      case 'classic':
        // Traditional straight cut with slight body following
        return `
          M ${clothingStartX} ${backY + 5}
          L ${clothingEndX - 20} ${backY + 2}
          Q ${clothingEndX - 10} ${backY + 15} ${clothingEndX - 15} ${bellyTuckY}
          L ${clothingStartX + 25} ${bellyY - 10}
          Q ${clothingStartX + 10} ${bellyY - 5} ${clothingStartX + 5} ${backY + 20}
          Z
        `;
      case 'sporty':
        // Athletic fit that closely follows body contours
        return `
          M ${clothingStartX} ${backY + 8}
          Q ${clothingStartX + clothingLength * 0.3} ${backCurveControl - 5} ${clothingEndX - 15} ${backY + 5}
          Q ${clothingEndX - 5} ${backY + 12} ${clothingEndX - 12} ${bellyTuckY - 5}
          L ${clothingEndX - 18} ${bellyTuckY + 5}
          Q ${clothingStartX + clothingLength * 0.7} ${bellyY - 8} ${clothingStartX + 20} ${bellyY - 12}
          Q ${clothingStartX + 8} ${bellyY - 8} ${clothingStartX + 2} ${backY + 25}
          Z
        `;
      case 'modern':
      default:
        // Contemporary fit with geometric lines but body-conscious
        return `
          M ${clothingStartX + 2} ${backY + 6}
          L ${clothingEndX - 18} ${backY + 3}
          Q ${clothingEndX - 8} ${backY + 18} ${clothingEndX - 14} ${bellyTuckY}
          L ${clothingEndX - 20} ${bellyTuckY + 8}
          Q ${clothingStartX + clothingLength * 0.6} ${bellyY - 6} ${clothingStartX + 22} ${bellyY - 8}
          Q ${clothingStartX + 6} ${bellyY - 3} ${clothingStartX} ${backY + 22}
          Z
        `;
    }
  };

  const getDogBodyPath = () => {
    // Side view body coordinates
    const bodyStartX = 120 + neckLength;
    const bodyEndX = bodyStartX + bodyLength;
    const backY = 180; // Top of back
    const bellyY = backY + bodyHeight;
    const chestX = bodyStartX + bodyLength * 0.15; // Chest position
    const backCurveControl = backY + (bodyHeight * characteristics.backCurve * 20);
    const bellyTuckY = bellyY - (bodyHeight * characteristics.bellyTuck);

    // Create realistic side profile based on breed characteristics
    return `
      M ${bodyStartX} ${backY + 10}
      Q ${chestX} ${backCurveControl} ${bodyEndX - 20} ${backY + 5}
      Q ${bodyEndX - 5} ${backY + 15} ${bodyEndX - 10} ${backY + bodyHeight * 0.7}
      L ${bodyEndX - 15} ${bellyTuckY}
      Q ${bodyStartX + bodyLength * 0.7} ${bellyY - 5} ${chestX} ${bellyY - 10}
      Q ${bodyStartX + 10} ${bellyY - 5} ${bodyStartX - 5} ${backY + 35}
      Z
    `;
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
          {/* Ground shadow */}
          <ellipse
            cx="200"
            cy="380"
            rx={dogWidth * 0.6}
            ry="15"
            fill="rgba(0,0,0,0.1)"
          />
          
          {/* Dog legs */}
          <g>
            {/* Front legs */}
            <rect
              x={180 - dogWidth * 0.25}
              y={120 + neckLength + dogHeight * 0.7}
              width="12"
              height={legLength}
              rx="6"
              fill="#8B5A3C"
            />
            <rect
              x={200 - dogWidth * 0.25}
              y={120 + neckLength + dogHeight * 0.7}
              width="12"
              height={legLength}
              rx="6"
              fill="#8B5A3C"
            />
            
            {/* Back legs */}
            <rect
              x={180 + dogWidth * 0.15}
              y={120 + neckLength + dogHeight * 0.7}
              width="12"
              height={legLength}
              rx="6"
              fill="#8B5A3C"
            />
            <rect
              x={200 + dogWidth * 0.15}
              y={120 + neckLength + dogHeight * 0.7}
              width="12"
              height={legLength}
              rx="6"
              fill="#8B5A3C"
            />
          </g>

          {/* Dog body */}
          <path
            d={getDogBodyPath()}
            fill="#D4A574"
            stroke="#B8956A"
            strokeWidth="2"
          />

          {/* Dog head */}
          <ellipse
            cx="200"
            cy={100}
            rx={headSize * 0.8}
            ry={headSize * 0.6}
            fill="#D4A574"
            stroke="#B8956A"
            strokeWidth="2"
          />

          {/* Dog neck */}
          <rect
            x={200 - (collarWidth * 0.3)}
            y={100 + headSize * 0.4}
            width={collarWidth * 0.6}
            height={neckLength}
            fill="#D4A574"
            stroke="#B8956A"
            strokeWidth="1"
          />

          {/* Collar */}
          <rect
            x={200 - (collarWidth * 0.35)}
            y={105 + headSize * 0.4}
            width={collarWidth * 0.7}
            height="8"
            rx="4"
            fill={design.secondaryColor}
            stroke={design.primaryColor}
            strokeWidth="1"
          />

          {/* Dog ears */}
          <ellipse
            cx={200 - headSize * 0.4}
            cy={95}
            rx={headSize * 0.25}
            ry={headSize * 0.4}
            fill="#C49968"
            stroke="#B8956A"
            strokeWidth="1"
          />
          <ellipse
            cx={200 + headSize * 0.4}
            cy={95}
            rx={headSize * 0.25}
            ry={headSize * 0.4}
            fill="#C49968"
            stroke="#B8956A"
            strokeWidth="1"
          />

          {/* Dog eyes */}
          <circle cx={200 - headSize * 0.25} cy={95} r="3" fill="#2D3748" />
          <circle cx={200 + headSize * 0.25} cy={95} r="3" fill="#2D3748" />
          <circle cx={200 - headSize * 0.25} cy={94} r="1" fill="white" />
          <circle cx={200 + headSize * 0.25} cy={94} r="1" fill="white" />

          {/* Dog nose */}
          <ellipse cx="200" cy={100 + headSize * 0.2} rx="4" ry="3" fill="#2D3748" />

          {/* Clothing */}
          <path
            d={getClothingPath()}
            fill={design.primaryColor}
            stroke={design.secondaryColor}
            strokeWidth="2"
            opacity="0.9"
          />

          {/* Clothing details based on style */}
          {design.style === 'sporty' && (
            <g>
              {/* Sport stripes */}
              <line
                x1={(400 - chestWidth) / 2 + chestWidth * 0.2}
                y1={130 + neckLength}
                x2={(400 - chestWidth) / 2 + chestWidth * 0.8}
                y2={130 + neckLength}
                stroke={design.secondaryColor}
                strokeWidth="3"
              />
              <line
                x1={(400 - chestWidth) / 2 + chestWidth * 0.25}
                y1={150 + neckLength}
                x2={(400 - chestWidth) / 2 + chestWidth * 0.75}
                y2={150 + neckLength}
                stroke={design.secondaryColor}
                strokeWidth="2"
              />
            </g>
          )}

          {design.style === 'classic' && (
            <g>
              {/* Classic button details */}
              <circle
                cx="200"
                cy={140 + neckLength}
                r="3"
                fill={design.secondaryColor}
                stroke="white"
                strokeWidth="1"
              />
              <circle
                cx="200"
                cy={160 + neckLength}
                r="3"
                fill={design.secondaryColor}
                stroke="white"
                strokeWidth="1"
              />
            </g>
          )}

          {design.style === 'modern' && (
            <g>
              {/* Modern geometric pattern */}
              <polygon
                points={`${200 - 15},${135 + neckLength} ${200},${125 + neckLength} ${200 + 15},${135 + neckLength} ${200},${145 + neckLength}`}
                fill={design.secondaryColor}
                opacity="0.8"
              />
            </g>
          )}

          {/* Dog tail */}
          <path
            d={`M ${200 + dogWidth * 0.4} ${140 + neckLength + dogHeight * 0.3}
                Q ${200 + dogWidth * 0.6} ${120 + neckLength + dogHeight * 0.2}
                  ${200 + dogWidth * 0.5} ${100 + neckLength + dogHeight * 0.1}`}
            stroke="#D4A574"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
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
