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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import DogPreview from "@/components/DogPreview";
import PrototypeManager from "@/components/PrototypeManager";
import {
  Palette,
  Shirt,
  Save,
  Download,
  RotateCcw,
  Heart,
  Sparkles,
  Star,
  Eye,
  Ruler,
  PaintBucket,
  Camera,
  Edit3,
  Users,
  ChevronDown,
} from "lucide-react";

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
}

export default function DesignStudio() {
  // Available pet profiles (in real app, this would come from API/database)
  const [availablePets] = useState([
    {
      id: "1",
      name: "Buddy",
      breed: "Golden Retriever",
      measurements: {
        collar: 45,
        chest: 75,
        length: 55,
        weight: 30,
        height: 60,
        neckLength: 20,
      },
    },
    {
      id: "2",
      name: "Luna",
      breed: "French Bulldog",
      measurements: {
        collar: 35,
        chest: 55,
        length: 40,
        weight: 12,
        height: 35,
        neckLength: 15,
      },
    },
    {
      id: "3",
      name: "Max",
      breed: "German Shepherd",
      measurements: {
        collar: 50,
        chest: 80,
        length: 65,
        weight: 35,
        height: 65,
        neckLength: 22,
      },
    },
  ]);

  const [selectedPetId, setSelectedPetId] = useState<string>("1");
  const selectedPet =
    availablePets.find((p) => p.id === selectedPetId) || availablePets[0];

  // User's dog data - starts with selected pet or manual entry
  const [dogData, setDogData] = useState<DogData>({
    name: selectedPet.name,
    breed: selectedPet.breed,
    measurements: selectedPet.measurements,
  });

  const [design, setDesign] = useState<DesignConfig>({
    style: "modern",
    fabric: "cotton-blend",
    primaryColor: "#8B5CF6", // dogzilla-purple
    secondaryColor: "#F59E0B", // dogzilla-yellow
    size: "M",
    customFit: {
      collar: selectedPet.measurements.collar,
      chest: selectedPet.measurements.chest,
      length: selectedPet.measurements.length,
    },
  });

  // Handle pet selection change
  const handlePetSelection = (petId: string) => {
    const pet = availablePets.find((p) => p.id === petId);
    if (pet) {
      setSelectedPetId(petId);
      setDogData({
        name: pet.name,
        breed: pet.breed,
        measurements: pet.measurements,
      });
      setDesign((prev) => ({
        ...prev,
        customFit: {
          collar: pet.measurements.collar,
          chest: pet.measurements.chest,
          length: pet.measurements.length,
        },
      }));
    }
  };

  // Handle loading a saved prototype
  const handleLoadPrototype = (prototype: any) => {
    setDesign(prototype.design);
    // Update dog data if needed
    const pet = availablePets.find((p) => p.id === prototype.petId);
    if (pet) {
      setDogData({
        name: pet.name,
        breed: pet.breed,
        measurements: pet.measurements,
      });
    }
  };

  // Handle saving a prototype
  const handleSavePrototype = (name: string) => {
    console.log(`Saved prototype "${name}" for ${dogData.name}`);
    // In real app, this would save to API/database
  };

  // Update custom fit when dog measurements change
  const updateDogMeasurement = (
    key: keyof DogData["measurements"],
    value: number,
  ) => {
    setDogData((prev) => ({
      ...prev,
      measurements: {
        ...prev.measurements,
        [key]: value,
      },
    }));

    // Update design custom fit for relevant measurements
    if (key === "collar" || key === "chest" || key === "length") {
      setDesign((prev) => ({
        ...prev,
        customFit: {
          ...prev.customFit,
          [key]: value,
        },
      }));
    }
  };

  const updateDogInfo = (key: "name" | "breed", value: string) => {
    setDogData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const styles = [
    {
      id: "classic",
      name: "Classic",
      description: "Timeless elegance with premium materials",
      icon: Star,
      preview: "Traditional cut with refined details",
    },
    {
      id: "modern",
      name: "Modern",
      description: "Contemporary designs with innovative fabrics",
      icon: Sparkles,
      preview: "Sleek lines with bold accents",
    },
    {
      id: "sporty",
      name: "Sporty",
      description: "Active wear for comfort and performance",
      icon: Shirt,
      preview: "Athletic fit with breathable materials",
    },
  ];

  const fabrics = [
    {
      id: "cotton-blend",
      name: "Cotton Blend",
      description: "Soft, breathable, machine washable",
      price: "+$0",
    },
    {
      id: "fleece",
      name: "Fleece",
      description: "Warm, cozy, perfect for winter",
      price: "+$5",
    },
    {
      id: "waterproof",
      name: "Waterproof",
      description: "Weather resistant, easy to clean",
      price: "+$10",
    },
    {
      id: "bamboo",
      name: "Bamboo",
      description: "Eco-friendly, hypoallergenic",
      price: "+$8",
    },
    {
      id: "wool",
      name: "Merino Wool",
      description: "Premium warmth, naturally odor resistant",
      price: "+$15",
    },
  ];

  const colors = [
    { name: "Purple", value: "#8B5CF6" },
    { name: "Orange", value: "#F97316" },
    { name: "Yellow", value: "#F59E0B" },
    { name: "Blue", value: "#3B82F6" },
    { name: "Green", value: "#10B981" },
    { name: "Pink", value: "#EC4899" },
    { name: "Red", value: "#EF4444" },
    { name: "Gray", value: "#6B7280" },
    { name: "Black", value: "#1F2937" },
    { name: "White", value: "#F9FAFB" },
  ];

  const updateDesign = (updates: Partial<DesignConfig>) => {
    setDesign((prev) => ({ ...prev, ...updates }));
  };

  const saveDesign = () => {
    // In real app, save to backend
    console.log("Saving design:", design);
    alert("Design saved successfully!");
  };

  const exportDesign = () => {
    // In real app, export design file
    console.log("Exporting design:", design);
    alert("Design exported!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-dogzilla-purple/5 to-dogzilla-yellow/10">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Design Studio
            </h1>
            <p className="text-muted-foreground">
              Create custom clothing for your furry friend
            </p>
          </div>

          <div className="flex gap-3 mt-4 md:mt-0">
            <Button variant="outline" onClick={() => window.location.reload()}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button variant="outline" onClick={saveDesign}>
              <Save className="w-4 h-4 mr-2" />
              Save Design
            </Button>
            <Button
              onClick={exportDesign}
              className="bg-dogzilla-purple hover:bg-dogzilla-purple/90"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Pet Selection & Prototype Management */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Pet Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-dogzilla-purple" />
                Select Pet Profile
              </CardTitle>
              <CardDescription>
                Choose a saved pet profile or use manual measurements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedPetId} onValueChange={handlePetSelection}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availablePets.map((pet) => (
                    <SelectItem key={pet.id} value={pet.id}>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-dogzilla-purple/10 rounded-full flex items-center justify-center">
                          <Heart className="w-4 h-4 text-dogzilla-purple" />
                        </div>
                        <div>
                          <div className="font-medium">{pet.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {pet.breed}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <h4 className="font-medium text-sm mb-2">
                  Current Pet: {dogData.name}
                </h4>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Collar:</span>
                    <div className="font-medium">
                      {dogData.measurements.collar}cm
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Chest:</span>
                    <div className="font-medium">
                      {dogData.measurements.chest}cm
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Length:</span>
                    <div className="font-medium">
                      {dogData.measurements.length}cm
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prototype Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="w-5 h-5 mr-2 text-dogzilla-orange" />
                Design Prototypes
              </CardTitle>
              <CardDescription>
                Save and manage multiple design variations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PrototypeManager
                currentDesign={design}
                selectedPetId={selectedPetId}
                selectedPetName={dogData.name}
                onLoadPrototype={handleLoadPrototype}
                onSavePrototype={handleSavePrototype}
              />
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Design Controls */}
          <div className="lg:col-span-2 space-y-6">
            {/* Dog Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-dogzilla-purple" />
                  Your Dog's Information
                </CardTitle>
                <CardDescription>
                  Enter your dog's details and measurements for a custom fit
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dog-name" className="text-sm font-medium">
                      Dog's Name
                    </Label>
                    <input
                      id="dog-name"
                      type="text"
                      value={dogData.name}
                      onChange={(e) => updateDogInfo("name", e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                      placeholder="Enter your dog's name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dog-breed" className="text-sm font-medium">
                      Breed
                    </Label>
                    <input
                      id="dog-breed"
                      type="text"
                      value={dogData.breed}
                      onChange={(e) => updateDogInfo("breed", e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                      placeholder="e.g., Golden Retriever, Mixed Breed"
                    />
                  </div>
                </div>

                {/* Measurements */}
                <div>
                  <h4 className="font-medium mb-4 flex items-center">
                    <Ruler className="w-4 h-4 mr-2" />
                    Measurements (in centimeters)
                  </h4>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="collar" className="text-sm font-medium">
                        Collar Circumference
                      </Label>
                      <input
                        id="collar"
                        type="number"
                        min="15"
                        max="80"
                        value={dogData.measurements.collar}
                        onChange={(e) =>
                          updateDogMeasurement("collar", Number(e.target.value))
                        }
                        className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Around the neck
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="chest" className="text-sm font-medium">
                        Chest Circumference
                      </Label>
                      <input
                        id="chest"
                        type="number"
                        min="25"
                        max="120"
                        value={dogData.measurements.chest}
                        onChange={(e) =>
                          updateDogMeasurement("chest", Number(e.target.value))
                        }
                        className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Around the widest part
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="length" className="text-sm font-medium">
                        Back Length
                      </Label>
                      <input
                        id="length"
                        type="number"
                        min="15"
                        max="100"
                        value={dogData.measurements.length}
                        onChange={(e) =>
                          updateDogMeasurement("length", Number(e.target.value))
                        }
                        className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Base of neck to tail
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="height" className="text-sm font-medium">
                        Height at Shoulder
                      </Label>
                      <input
                        id="height"
                        type="number"
                        min="15"
                        max="100"
                        value={dogData.measurements.height}
                        onChange={(e) =>
                          updateDogMeasurement("height", Number(e.target.value))
                        }
                        className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Ground to shoulder
                      </p>
                    </div>

                    <div>
                      <Label
                        htmlFor="neck-length"
                        className="text-sm font-medium"
                      >
                        Neck Length
                      </Label>
                      <input
                        id="neck-length"
                        type="number"
                        min="8"
                        max="40"
                        value={dogData.measurements.neckLength}
                        onChange={(e) =>
                          updateDogMeasurement(
                            "neckLength",
                            Number(e.target.value),
                          )
                        }
                        className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Head to shoulder
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="weight" className="text-sm font-medium">
                        Weight (kg)
                      </Label>
                      <input
                        id="weight"
                        type="number"
                        min="1"
                        max="80"
                        value={dogData.measurements.weight}
                        onChange={(e) =>
                          updateDogMeasurement("weight", Number(e.target.value))
                        }
                        className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Current weight
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-dogzilla-yellow/10 border border-dogzilla-yellow/20 rounded-lg">
                  <h5 className="font-medium text-sm mb-2">
                    📏 Measurement Tips
                  </h5>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Use a soft measuring tape for accurate results</li>
                    <li>• Measure when your dog is standing calmly</li>
                    <li>• Add 2-5cm for comfort depending on desired fit</li>
                    <li>
                      • For chest, measure at the widest part behind front legs
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Photo-Based Measurements */}
            <DogPhotoMeasurement
              onMeasurementsChange={(measurements) => {
                setDogData((prev) => ({
                  ...prev,
                  measurements: {
                    ...prev.measurements,
                    ...measurements,
                  },
                }));
                // Update design custom fit
                setDesign((prev) => ({
                  ...prev,
                  customFit: {
                    collar: measurements.collar,
                    chest: measurements.chest,
                    length: measurements.length,
                  },
                }));
              }}
            />

            {/* Style Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-dogzilla-orange" />
                  Choose Style
                </CardTitle>
                <CardDescription>
                  Select the perfect style for your dog's personality
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={design.style}
                  onValueChange={(value) =>
                    updateDesign({ style: value as any })
                  }
                >
                  <div className="grid md:grid-cols-3 gap-4">
                    {styles.map((style) => (
                      <div key={style.id} className="relative">
                        <RadioGroupItem
                          value={style.id}
                          id={style.id}
                          className="sr-only"
                        />
                        <Label
                          htmlFor={style.id}
                          className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            design.style === style.id
                              ? "border-dogzilla-purple bg-dogzilla-purple/5"
                              : "border-border hover:border-dogzilla-purple/50"
                          }`}
                        >
                          <div className="flex items-center justify-center mb-3">
                            <style.icon
                              className={`w-8 h-8 ${
                                design.style === style.id
                                  ? "text-dogzilla-purple"
                                  : "text-muted-foreground"
                              }`}
                            />
                          </div>
                          <h3 className="font-medium text-center mb-1">
                            {style.name}
                          </h3>
                          <p className="text-sm text-muted-foreground text-center mb-2">
                            {style.description}
                          </p>
                          <p className="text-xs text-center text-muted-foreground">
                            {style.preview}
                          </p>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Customization Tabs */}
            <Card>
              <CardHeader>
                <CardTitle>Customize Your Design</CardTitle>
                <CardDescription>
                  Fine-tune every detail to perfection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="fabric" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="fabric">Fabric</TabsTrigger>
                    <TabsTrigger value="colors">Colors</TabsTrigger>
                    <TabsTrigger value="fit">Fit</TabsTrigger>
                  </TabsList>

                  <TabsContent value="fabric" className="space-y-4">
                    <RadioGroup
                      value={design.fabric}
                      onValueChange={(value) => updateDesign({ fabric: value })}
                    >
                      {fabrics.map((fabric) => (
                        <div
                          key={fabric.id}
                          className="flex items-center space-x-3 p-3 rounded-lg border"
                        >
                          <RadioGroupItem value={fabric.id} id={fabric.id} />
                          <Label
                            htmlFor={fabric.id}
                            className="flex-1 cursor-pointer"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium">{fabric.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {fabric.description}
                                </div>
                              </div>
                              <Badge variant="secondary">{fabric.price}</Badge>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </TabsContent>

                  <TabsContent value="colors" className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium mb-3 block">
                        Primary Color
                      </Label>
                      <div className="grid grid-cols-5 gap-3">
                        {colors.map((color) => (
                          <button
                            key={`primary-${color.value}`}
                            onClick={() =>
                              updateDesign({ primaryColor: color.value })
                            }
                            className={`w-12 h-12 rounded-lg border-2 transition-all ${
                              design.primaryColor === color.value
                                ? "border-ring scale-110"
                                : "border-border hover:scale-105"
                            }`}
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <Label className="text-sm font-medium mb-3 block">
                        Accent Color
                      </Label>
                      <div className="grid grid-cols-5 gap-3">
                        {colors.map((color) => (
                          <button
                            key={`secondary-${color.value}`}
                            onClick={() =>
                              updateDesign({ secondaryColor: color.value })
                            }
                            className={`w-12 h-12 rounded-lg border-2 transition-all ${
                              design.secondaryColor === color.value
                                ? "border-ring scale-110"
                                : "border-border hover:scale-105"
                            }`}
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="fit" className="space-y-6">
                    <div>
                      <Label className="text-sm font-medium mb-3 block">
                        Size
                      </Label>
                      <Select
                        value={design.size}
                        onValueChange={(value) =>
                          updateDesign({ size: value as any })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="XS">Extra Small (XS)</SelectItem>
                          <SelectItem value="S">Small (S)</SelectItem>
                          <SelectItem value="M">Medium (M)</SelectItem>
                          <SelectItem value="L">Large (L)</SelectItem>
                          <SelectItem value="XL">Extra Large (XL)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium flex items-center">
                        <Ruler className="w-4 h-4 mr-2" />
                        Custom Fit Adjustments
                      </h4>

                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm">
                            Collar: {design.customFit.collar}cm
                          </Label>
                          <Slider
                            value={[design.customFit.collar]}
                            onValueChange={([value]) =>
                              updateDesign({
                                customFit: {
                                  ...design.customFit,
                                  collar: value,
                                },
                              })
                            }
                            min={25}
                            max={70}
                            step={1}
                            className="mt-2"
                          />
                        </div>

                        <div>
                          <Label className="text-sm">
                            Chest: {design.customFit.chest}cm
                          </Label>
                          <Slider
                            value={[design.customFit.chest]}
                            onValueChange={([value]) =>
                              updateDesign({
                                customFit: {
                                  ...design.customFit,
                                  chest: value,
                                },
                              })
                            }
                            min={35}
                            max={100}
                            step={1}
                            className="mt-2"
                          />
                        </div>

                        <div>
                          <Label className="text-sm">
                            Length: {design.customFit.length}cm
                          </Label>
                          <Slider
                            value={[design.customFit.length]}
                            onValueChange={([value]) =>
                              updateDesign({
                                customFit: {
                                  ...design.customFit,
                                  length: value,
                                },
                              })
                            }
                            min={25}
                            max={80}
                            step={1}
                            className="mt-2"
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Design Preview */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="w-5 h-5 mr-2 text-dogzilla-yellow" />
                  Live Preview
                </CardTitle>
                <CardDescription>See your design come to life</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Live Dog Preview */}
                <div className="mb-6">
                  <DogPreview dog={dogData} design={design} />
                </div>

                {/* Design Summary */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Dog:</span>
                    <span className="font-medium">{dogData.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Style:
                    </span>
                    <span className="font-medium capitalize">
                      {design.style}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Fabric:
                    </span>
                    <span className="font-medium">
                      {fabrics.find((f) => f.id === design.fabric)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Size:</span>
                    <span className="font-medium">{design.size}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Colors:
                    </span>
                    <div className="flex space-x-2">
                      <div
                        className="w-6 h-6 rounded border-2 border-border"
                        style={{ backgroundColor: design.primaryColor }}
                      />
                      <div
                        className="w-6 h-6 rounded border-2 border-border"
                        style={{ backgroundColor: design.secondaryColor }}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mt-6">
                  <div className="text-center">
                    <span className="text-2xl font-bold text-dogzilla-purple">
                      $
                      {(() => {
                        let basePrice = 39.99;
                        const fabricPricing: Record<string, number> = {
                          "cotton-blend": 0,
                          fleece: 5,
                          waterproof: 10,
                          bamboo: 8,
                          wool: 15,
                        };
                        const stylePricing: Record<string, number> = {
                          classic: 0,
                          modern: 5,
                          sporty: 8,
                        };
                        basePrice += fabricPricing[design.fabric] || 0;
                        basePrice += stylePricing[design.style] || 0;
                        return Math.round(basePrice * 100) / 100;
                      })()}
                    </span>
                    <div className="text-xs text-muted-foreground">
                      Estimated price
                    </div>
                  </div>

                  <Button className="w-full bg-dogzilla-orange hover:bg-dogzilla-orange/90">
                    <PaintBucket className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>

                  <Button variant="outline" className="w-full">
                    <Save className="w-4 h-4 mr-2" />
                    Save as Prototype
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
