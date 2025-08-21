import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Save,
  FolderOpen,
  Copy,
  Trash2,
  Star,
  StarOff,
  Calendar,
  Palette,
  ShoppingCart,
} from "lucide-react";

interface DesignPrototype {
  id: string;
  name: string;
  petId: string;
  petName: string;
  dateCreated: string;
  dateModified: string;
  isFavorite: boolean;
  design: {
    style: "classic" | "modern" | "sporty";
    fabric: string;
    primaryColor: string;
    secondaryColor: string;
    size: "XS" | "S" | "M" | "L" | "XL";
    customFit: {
      collar: number;
      chest: number;
      length: number;
    };
  };
  estimatedPrice: number;
  thumbnail?: string;
}

interface PrototypeManagerProps {
  currentDesign: any;
  selectedPetId: string;
  selectedPetName: string;
  onLoadPrototype: (prototype: DesignPrototype) => void;
  onSavePrototype: (name: string) => void;
}

export default function PrototypeManager({
  currentDesign,
  selectedPetId,
  selectedPetName,
  onLoadPrototype,
  onSavePrototype,
}: PrototypeManagerProps) {
  const [prototypes, setPrototypes] = useState<DesignPrototype[]>([
    {
      id: "1",
      name: "Summer Casual",
      petId: "1",
      petName: "Buddy",
      dateCreated: "2024-01-15",
      dateModified: "2024-01-15",
      isFavorite: true,
      design: {
        style: "modern",
        fabric: "cotton-blend",
        primaryColor: "#3B82F6",
        secondaryColor: "#F59E0B",
        size: "M",
        customFit: { collar: 45, chest: 75, length: 55 },
      },
      estimatedPrice: 49.99,
    },
    {
      id: "2",
      name: "Winter Warmth",
      petId: "1",
      petName: "Buddy",
      dateCreated: "2024-01-10",
      dateModified: "2024-01-12",
      isFavorite: false,
      design: {
        style: "classic",
        fabric: "fleece",
        primaryColor: "#DC2626",
        secondaryColor: "#FFFFFF",
        size: "M",
        customFit: { collar: 45, chest: 75, length: 55 },
      },
      estimatedPrice: 54.99,
    },
  ]);

  const [isShowingPrototypes, setIsShowingPrototypes] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [prototypeName, setPrototypeName] = useState("");
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>(
    [],
  );

  const currentPetPrototypes = prototypes.filter(
    (p) => p.petId === selectedPetId,
  );

  const saveCurrentPrototype = () => {
    if (!prototypeName.trim()) return;

    const newPrototype: DesignPrototype = {
      id: Date.now().toString(),
      name: prototypeName.trim(),
      petId: selectedPetId,
      petName: selectedPetName,
      dateCreated: new Date().toISOString().split("T")[0],
      dateModified: new Date().toISOString().split("T")[0],
      isFavorite: false,
      design: currentDesign,
      estimatedPrice: calculatePrice(currentDesign),
    };

    setPrototypes((prev) => [...prev, newPrototype]);
    setPrototypeName("");
    setIsSaving(false);
    onSavePrototype(prototypeName.trim());
  };

  const calculatePrice = (design: any) => {
    let basePrice = 39.99;

    // Fabric pricing
    const fabricPricing: Record<string, number> = {
      "cotton-blend": 0,
      fleece: 5,
      waterproof: 10,
      bamboo: 8,
      wool: 15,
    };

    basePrice += fabricPricing[design.fabric] || 0;

    // Style complexity pricing
    const stylePricing: Record<string, number> = {
      classic: 0,
      modern: 5,
      sporty: 8,
    };

    basePrice += stylePricing[design.style] || 0;

    return Math.round(basePrice * 100) / 100;
  };

  const toggleFavorite = (id: string) => {
    setPrototypes((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p)),
    );
  };

  const deletePrototype = (id: string) => {
    setPrototypes((prev) => prev.filter((p) => p.id !== id));
  };

  const duplicatePrototype = (prototype: DesignPrototype) => {
    const newPrototype: DesignPrototype = {
      ...prototype,
      id: Date.now().toString(),
      name: `${prototype.name} (Copy)`,
      dateCreated: new Date().toISOString().split("T")[0],
      dateModified: new Date().toISOString().split("T")[0],
      isFavorite: false,
    };

    setPrototypes((prev) => [...prev, newPrototype]);
  };

  const toggleCompareSelection = (id: string) => {
    setSelectedForComparison((prev) => {
      if (prev.includes(id)) {
        return prev.filter((p) => p !== id);
      } else if (prev.length < 3) {
        // Limit to 3 comparisons
        return [...prev, id];
      }
      return prev;
    });
  };

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Dialog open={isSaving} onOpenChange={setIsSaving}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="bg-dogzilla-purple hover:bg-dogzilla-purple/90"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Prototype
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Design Prototype</DialogTitle>
              <DialogDescription>
                Save your current design for {selectedPetName} to compare and
                order later
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="prototype-name">Prototype Name</Label>
                <input
                  id="prototype-name"
                  type="text"
                  value={prototypeName}
                  onChange={(e) => setPrototypeName(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  placeholder="e.g., Summer Casual, Winter Coat, Play Time"
                />
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Current Design Summary</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    Style:{" "}
                    <span className="font-medium capitalize">
                      {currentDesign.style}
                    </span>
                  </div>
                  <div>
                    Fabric:{" "}
                    <span className="font-medium">
                      {currentDesign.fabric.replace("-", " ")}
                    </span>
                  </div>
                  <div>
                    Size:{" "}
                    <span className="font-medium">{currentDesign.size}</span>
                  </div>
                  <div>
                    Est. Price:{" "}
                    <span className="font-medium">
                      ${calculatePrice(currentDesign)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setIsSaving(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={saveCurrentPrototype}
                  disabled={!prototypeName.trim()}
                  className="bg-dogzilla-purple hover:bg-dogzilla-purple/90"
                >
                  Save Prototype
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog
          open={isShowingPrototypes}
          onOpenChange={setIsShowingPrototypes}
        >
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <FolderOpen className="w-4 h-4 mr-2" />
              Load Prototypes ({currentPetPrototypes.length})
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Saved Prototypes for {selectedPetName}</DialogTitle>
              <DialogDescription>
                Load a saved design prototype or compare multiple options
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Compare Mode Toggle */}
              <div className="flex items-center justify-between">
                <Button
                  variant={compareMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setCompareMode(!compareMode);
                    setSelectedForComparison([]);
                  }}
                >
                  Compare Mode{" "}
                  {compareMode && `(${selectedForComparison.length}/3)`}
                </Button>

                {compareMode && selectedForComparison.length >= 2 && (
                  <Badge variant="secondary">
                    Ready to compare {selectedForComparison.length} prototypes
                  </Badge>
                )}
              </div>

              {/* Prototypes Grid */}
              {currentPetPrototypes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Palette className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No saved prototypes for {selectedPetName} yet.</p>
                  <p className="text-sm">
                    Save your first design to get started!
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentPetPrototypes.map((prototype) => (
                    <Card
                      key={prototype.id}
                      className={`group cursor-pointer transition-all ${
                        compareMode
                          ? selectedForComparison.includes(prototype.id)
                            ? "ring-2 ring-dogzilla-purple"
                            : "hover:ring-2 hover:ring-dogzilla-purple/50"
                          : "hover:shadow-lg"
                      }`}
                      onClick={() =>
                        compareMode
                          ? toggleCompareSelection(prototype.id)
                          : onLoadPrototype(prototype)
                      }
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">
                              {prototype.name}
                            </CardTitle>
                            <CardDescription className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(
                                prototype.dateCreated,
                              ).toLocaleDateString()}
                            </CardDescription>
                          </div>

                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(prototype.id);
                              }}
                              className="h-8 w-8 p-0"
                            >
                              {prototype.isFavorite ? (
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              ) : (
                                <StarOff className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-3">
                        {/* Design Preview */}
                        <div
                          className="h-16 rounded-lg flex items-center justify-center relative overflow-hidden"
                          style={{
                            backgroundColor:
                              prototype.design.primaryColor + "20",
                          }}
                        >
                          <div
                            className="w-12 h-12 rounded border-2"
                            style={{
                              backgroundColor: prototype.design.primaryColor,
                              borderColor: prototype.design.secondaryColor,
                            }}
                          />
                          <Badge
                            variant="secondary"
                            className="absolute top-1 right-1 text-xs"
                          >
                            {prototype.design.style}
                          </Badge>
                        </div>

                        {/* Design Details */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">
                              Fabric:
                            </span>
                            <br />
                            <span className="font-medium capitalize">
                              {prototype.design.fabric.replace("-", " ")}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Size:</span>
                            <br />
                            <span className="font-medium">
                              {prototype.design.size}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t">
                          <span className="text-lg font-bold text-dogzilla-purple">
                            ${prototype.estimatedPrice}
                          </span>

                          {!compareMode && (
                            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  duplicatePrototype(prototype);
                                }}
                                className="h-8 w-8 p-0"
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deletePrototype(prototype.id);
                                }}
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Compare Actions */}
              {compareMode && selectedForComparison.length >= 2 && (
                <div className="flex justify-center pt-4 border-t">
                  <Button
                    onClick={() => {
                      // Handle comparison view
                      console.log("Compare prototypes:", selectedForComparison);
                      setCompareMode(false);
                      setSelectedForComparison([]);
                      setIsShowingPrototypes(false);
                    }}
                    className="bg-dogzilla-orange hover:bg-dogzilla-orange/90"
                  >
                    Compare Selected Prototypes
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {currentPetPrototypes.length > 0 && (
          <Badge variant="outline" className="text-xs">
            {currentPetPrototypes.filter((p) => p.isFavorite).length} favorites
          </Badge>
        )}
      </div>

      {/* Quick Favorites */}
      {currentPetPrototypes.filter((p) => p.isFavorite).length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <Star className="w-4 h-4 mr-2 text-yellow-500" />
              Quick Load Favorites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              {currentPetPrototypes
                .filter((p) => p.isFavorite)
                .slice(0, 3)
                .map((prototype) => (
                  <Button
                    key={prototype.id}
                    variant="outline"
                    size="sm"
                    onClick={() => onLoadPrototype(prototype)}
                    className="text-xs"
                  >
                    {prototype.name}
                  </Button>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
