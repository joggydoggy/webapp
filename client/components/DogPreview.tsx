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

// Breed-specific characteristics for different dog shapes
const breedCharacteristics: Record<string, {
  bodyRatio: number; // length to height ratio
  neckLength: number; // relative neck length
  legLength: number; // relative leg length
  headSize: number; // relative head size
  bodyShape: 'slim' | 'stocky' | 'athletic';
}> = {
  'Golden Retriever': {
    bodyRatio: 1.3,
    neckLength: 1.0,
    legLength: 1.0,
    headSize: 1.0,
    bodyShape: 'athletic'
  },
  'French Bulldog': {
    bodyRatio: 1.1,
    neckLength: 0.7,
    legLength: 0.8,
    headSize: 1.3,
    bodyShape: 'stocky'
  },
  'Labrador': {
    bodyRatio: 1.2,
    neckLength: 0.9,
    legLength: 1.0,
    headSize: 1.0,
    bodyShape: 'athletic'
  },
  'German Shepherd': {
    bodyRatio: 1.4,
    neckLength: 1.1,
    legLength: 1.1,
    headSize: 1.0,
    bodyShape: 'athletic'
  },
  'Chihuahua': {
    bodyRatio: 1.0,
    neckLength: 0.8,
    legLength: 0.7,
    headSize: 1.4,
    bodyShape: 'slim'
  },
  'Bulldog': {
    bodyRatio: 1.0,
    neckLength: 0.6,
    legLength: 0.7,
    headSize: 1.2,
    bodyShape: 'stocky'
  }
};

export default function DogPreview({ dog, design }: DogPreviewProps) {
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);

  const characteristics = breedCharacteristics[dog.breed] || breedCharacteristics['Golden Retriever'];
  
  // Calculate sizes based on measurements and breed characteristics
  const baseSize = Math.min(dog.measurements.chest, dog.measurements.length) * 2;
  const dogWidth = dog.measurements.chest * 2.2;
  const dogHeight = (dog.measurements.length / characteristics.bodyRatio) * 2;
  const headSize = (dogWidth * 0.4) * characteristics.headSize;
  const neckLength = (dogHeight * 0.15) * characteristics.neckLength;
  const legLength = (dogHeight * 0.4) * characteristics.legLength;

  // Calculate clothing dimensions based on custom fit
  const collarWidth = design.customFit.collar * 2;
  const chestWidth = design.customFit.chest * 2.2;
  const clothingLength = design.customFit.length * 2;

  // Style-specific clothing shapes
  const getClothingPath = () => {
    const startX = (400 - chestWidth) / 2;
    const startY = 120 + neckLength;
    
    switch (design.style) {
      case 'classic':
        return `
          M ${startX} ${startY}
          L ${startX + chestWidth} ${startY}
          L ${startX + chestWidth * 0.9} ${startY + clothingLength * 0.8}
          L ${startX + chestWidth * 0.1} ${startY + clothingLength * 0.8}
          Z
        `;
      case 'sporty':
        return `
          M ${startX + chestWidth * 0.1} ${startY}
          L ${startX + chestWidth * 0.9} ${startY}
          L ${startX + chestWidth * 0.95} ${startY + clothingLength * 0.6}
          L ${startX + chestWidth * 0.85} ${startY + clothingLength * 0.9}
          L ${startX + chestWidth * 0.15} ${startY + clothingLength * 0.9}
          L ${startX + chestWidth * 0.05} ${startY + clothingLength * 0.6}
          Z
        `;
      case 'modern':
      default:
        return `
          M ${startX} ${startY}
          L ${startX + chestWidth} ${startY}
          L ${startX + chestWidth * 0.95} ${startY + clothingLength * 0.4}
          L ${startX + chestWidth * 0.9} ${startY + clothingLength * 0.85}
          L ${startX + chestWidth * 0.1} ${startY + clothingLength * 0.85}
          L ${startX + chestWidth * 0.05} ${startY + clothingLength * 0.4}
          Z
        `;
    }
  };

  const getDogBodyPath = () => {
    const centerX = 200;
    const startY = 120 + neckLength;
    
    // Body shape varies by breed characteristics
    const bodyStartX = (400 - dogWidth) / 2;
    const bodyEndX = bodyStartX + dogWidth;
    
    if (characteristics.bodyShape === 'stocky') {
      return `
        M ${bodyStartX + dogWidth * 0.1} ${startY}
        L ${bodyEndX - dogWidth * 0.1} ${startY}
        Q ${bodyEndX} ${startY + dogHeight * 0.2} ${bodyEndX - dogWidth * 0.05} ${startY + dogHeight * 0.6}
        L ${bodyEndX - dogWidth * 0.15} ${startY + dogHeight * 0.9}
        L ${bodyStartX + dogWidth * 0.15} ${startY + dogHeight * 0.9}
        Q ${bodyStartX} ${startY + dogHeight * 0.2} ${bodyStartX + dogWidth * 0.1} ${startY}
        Z
      `;
    } else if (characteristics.bodyShape === 'slim') {
      return `
        M ${bodyStartX + dogWidth * 0.2} ${startY}
        L ${bodyEndX - dogWidth * 0.2} ${startY}
        Q ${bodyEndX - dogWidth * 0.1} ${startY + dogHeight * 0.3} ${bodyEndX - dogWidth * 0.15} ${startY + dogHeight * 0.7}
        L ${bodyEndX - dogWidth * 0.25} ${startY + dogHeight * 0.95}
        L ${bodyStartX + dogWidth * 0.25} ${startY + dogHeight * 0.95}
        Q ${bodyStartX + dogWidth * 0.1} ${startY + dogHeight * 0.3} ${bodyStartX + dogWidth * 0.2} ${startY}
        Z
      `;
    } else { // athletic
      return `
        M ${bodyStartX + dogWidth * 0.15} ${startY}
        L ${bodyEndX - dogWidth * 0.15} ${startY}
        Q ${bodyEndX} ${startY + dogHeight * 0.25} ${bodyEndX - dogWidth * 0.1} ${startY + dogHeight * 0.65}
        L ${bodyEndX - dogWidth * 0.2} ${startY + dogHeight * 0.9}
        L ${bodyStartX + dogWidth * 0.2} ${startY + dogHeight * 0.9}
        Q ${bodyStartX} ${startY + dogHeight * 0.25} ${bodyStartX + dogWidth * 0.15} ${startY}
        Z
      `;
    }
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
