import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DogPhotoMeasurement from "@/components/DogPhotoMeasurement";
import { 
  Ruler, 
  Camera, 
  Edit3, 
  Heart,
  ArrowRight,
  CheckCircle,
  Info,
  Save,
  ArrowLeft
} from "lucide-react";

interface DogMeasurements {
  collar: number;
  chest: number;
  length: number;
  weight: number;
  height: number;
  neckLength: number;
}

interface DogData {
  name: string;
  breed: string;
  measurements: DogMeasurements;
}

export default function Measurements() {
  const navigate = useNavigate();
  
  const [dogData, setDogData] = useState<DogData>({
    name: "",
    breed: "",
    measurements: {
      collar: 40,
      chest: 60,
      length: 50,
      weight: 20,
      height: 45,
      neckLength: 15
    }
  });

  const [measurementMethod, setMeasurementMethod] = useState<"manual" | "photo">("photo");
  const [isComplete, setIsComplete] = useState(false);

  const updateDogInfo = (field: keyof Omit<DogData, 'measurements'>, value: string) => {
    setDogData(prev => ({ ...prev, [field]: value }));
  };

  const updateMeasurement = (key: keyof DogMeasurements, value: number) => {
    setDogData(prev => ({
      ...prev,
      measurements: {
        ...prev.measurements,
        [key]: value
      }
    }));
  };

  const handlePhotoMeasurementsChange = (measurements: DogMeasurements) => {
    setDogData(prev => ({ ...prev, measurements }));
  };

  const saveMeasurements = () => {
    // In real app, save to backend/localStorage
    console.log('Saving measurements:', dogData);
    localStorage.setItem('tempDogData', JSON.stringify(dogData));
    setIsComplete(true);
  };

  const continueToDesign = () => {
    navigate('/customize');
  };

  const isFormValid = dogData.name.trim() && dogData.breed.trim() && 
                    dogData.measurements.collar > 0 && 
                    dogData.measurements.chest > 0 && 
                    dogData.measurements.length > 0;

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-dogzilla-purple/5 to-dogzilla-yellow/10 flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Measurements Complete!</h2>
            <p className="text-muted-foreground mb-6">
              Great! {dogData.name}'s measurements are ready. Now let's design some amazing clothing!
            </p>
            <div className="space-y-3">
              <Button 
                className="w-full bg-dogzilla-purple hover:bg-dogzilla-purple/90"
                onClick={continueToDesign}
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Start Designing
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/profiles')}
              >
                Save to Profiles
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-dogzilla-purple/5 to-dogzilla-yellow/10">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" asChild className="mr-4">
            <Link to="/profiles">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Take Measurements</h1>
            <p className="text-muted-foreground">
              Get accurate measurements for your dog to ensure the perfect fit
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-dogzilla-purple text-white rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <span className="ml-2 text-sm font-medium">Measurements</span>
            </div>
            <div className="w-8 h-0.5 bg-muted"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
              <span className="ml-2 text-sm text-muted-foreground">Design</span>
            </div>
            <div className="w-8 h-0.5 bg-muted"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-sm font-medium">
                3
              </div>
              <span className="ml-2 text-sm text-muted-foreground">Order</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Dog Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="w-5 h-5 mr-2 text-dogzilla-purple" />
                Dog Information
              </CardTitle>
              <CardDescription>Tell us about your furry friend</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dog-name" className="text-sm font-medium">
                    Dog's Name *
                  </Label>
                  <input
                    id="dog-name"
                    type="text"
                    value={dogData.name}
                    onChange={(e) => updateDogInfo("name", e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                    placeholder="Enter your dog's name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="dog-breed" className="text-sm font-medium">
                    Breed *
                  </Label>
                  <input
                    id="dog-breed"
                    type="text"
                    value={dogData.breed}
                    onChange={(e) => updateDogInfo("breed", e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                    placeholder="e.g., Golden Retriever, Mixed Breed"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Measurement Method Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Choose Measurement Method</CardTitle>
              <CardDescription>
                Select how you'd like to measure your dog
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={measurementMethod} onValueChange={(value) => setMeasurementMethod(value as "manual" | "photo")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="photo" className="flex items-center">
                    <Camera className="w-4 h-4 mr-2" />
                    Photo Measurement
                  </TabsTrigger>
                  <TabsTrigger value="manual" className="flex items-center">
                    <Edit3 className="w-4 h-4 mr-2" />
                    Manual Input
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="photo" className="mt-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <h4 className="font-medium flex items-center mb-2">
                        <Info className="w-4 h-4 mr-2" />
                        Photo Measurement Tips
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Take a clear side view photo of your dog standing</li>
                        <li>• Ensure good lighting and the dog is fully visible</li>
                        <li>• Place a ruler or known object for scale reference</li>
                        <li>• Our tool will help you place measurement points</li>
                      </ul>
                    </div>
                    
                    <DogPhotoMeasurement onMeasurementsChange={handlePhotoMeasurementsChange} />
                  </div>
                </TabsContent>
                
                <TabsContent value="manual" className="mt-6">
                  <div className="space-y-6">
                    <div className="p-4 bg-dogzilla-yellow/10 border border-dogzilla-yellow/20 rounded-lg">
                      <h4 className="font-medium text-sm mb-2">📏 Measurement Guidelines</h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Use a soft measuring tape for accurate results</li>
                        <li>• Measure when your dog is standing calmly</li>
                        <li>• Add 2-5cm for comfort depending on desired fit</li>
                        <li>• For chest, measure at the widest part behind front legs</li>
                      </ul>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="collar" className="text-sm font-medium">
                          Collar Circumference (cm) *
                        </Label>
                        <input
                          id="collar"
                          type="number"
                          min="15"
                          max="80"
                          value={dogData.measurements.collar}
                          onChange={(e) => updateMeasurement("collar", Number(e.target.value))}
                          className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                          required
                        />
                        <p className="text-xs text-muted-foreground mt-1">Around the neck</p>
                      </div>
                      
                      <div>
                        <Label htmlFor="chest" className="text-sm font-medium">
                          Chest Circumference (cm) *
                        </Label>
                        <input
                          id="chest"
                          type="number"
                          min="25"
                          max="120"
                          value={dogData.measurements.chest}
                          onChange={(e) => updateMeasurement("chest", Number(e.target.value))}
                          className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                          required
                        />
                        <p className="text-xs text-muted-foreground mt-1">Around the widest part</p>
                      </div>
                      
                      <div>
                        <Label htmlFor="length" className="text-sm font-medium">
                          Back Length (cm) *
                        </Label>
                        <input
                          id="length"
                          type="number"
                          min="15"
                          max="100"
                          value={dogData.measurements.length}
                          onChange={(e) => updateMeasurement("length", Number(e.target.value))}
                          className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                          required
                        />
                        <p className="text-xs text-muted-foreground mt-1">Base of neck to tail</p>
                      </div>
                      
                      <div>
                        <Label htmlFor="height" className="text-sm font-medium">
                          Height at Shoulder (cm)
                        </Label>
                        <input
                          id="height"
                          type="number"
                          min="15"
                          max="100"
                          value={dogData.measurements.height}
                          onChange={(e) => updateMeasurement("height", Number(e.target.value))}
                          className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Ground to shoulder</p>
                      </div>
                      
                      <div>
                        <Label htmlFor="neck-length" className="text-sm font-medium">
                          Neck Length (cm)
                        </Label>
                        <input
                          id="neck-length"
                          type="number"
                          min="8"
                          max="40"
                          value={dogData.measurements.neckLength}
                          onChange={(e) => updateMeasurement("neckLength", Number(e.target.value))}
                          className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Head to shoulder</p>
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
                          onChange={(e) => updateMeasurement("weight", Number(e.target.value))}
                          className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Current weight</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Measurement Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Measurement Summary</CardTitle>
              <CardDescription>Review your dog's measurements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Dog Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-medium">{dogData.name || "Not provided"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Breed:</span>
                      <span className="font-medium">{dogData.breed || "Not provided"}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Measurements</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Collar:</span>
                      <span className="font-medium">{dogData.measurements.collar}cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Chest:</span>
                      <span className="font-medium">{dogData.measurements.chest}cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Length:</span>
                      <span className="font-medium">{dogData.measurements.length}cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Height:</span>
                      <span className="font-medium">{dogData.measurements.height}cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Neck:</span>
                      <span className="font-medium">{dogData.measurements.neckLength}cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Weight:</span>
                      <span className="font-medium">{dogData.measurements.weight}kg</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" asChild>
              <Link to="/profiles">
                Cancel
              </Link>
            </Button>
            
            <Button 
              onClick={saveMeasurements}
              disabled={!isFormValid}
              className="bg-dogzilla-purple hover:bg-dogzilla-purple/90"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Continue to Design
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
