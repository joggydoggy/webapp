import { useState } from "react";
import { Link } from "react-router-dom";
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
import DogPhotoMeasurement from "@/components/DogPhotoMeasurement";
import {
  Heart,
  Plus,
  Edit,
  Trash2,
  Camera,
  Ruler,
  Calendar,
  ArrowRight,
} from "lucide-react";

interface PetProfile {
  id: string;
  name: string;
  breed: string;
  dateAdded: string;
  photo?: string;
  measurements: {
    collar: number;
    chest: number;
    length: number;
    weight: number;
    height: number;
    neckLength: number;
  };
}

export default function Profiles() {
  const [profiles, setProfiles] = useState<PetProfile[]>([
    {
      id: "1",
      name: "Buddy",
      breed: "Golden Retriever",
      dateAdded: "2024-01-15",
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
      dateAdded: "2024-01-10",
      measurements: {
        collar: 35,
        chest: 55,
        length: 40,
        weight: 12,
        height: 35,
        neckLength: 15,
      },
    },
  ]);

  const [isAddingProfile, setIsAddingProfile] = useState(false);
  const [editingProfile, setEditingProfile] = useState<PetProfile | null>(null);
  const [newProfile, setNewProfile] = useState<
    Omit<PetProfile, "id" | "dateAdded">
  >({
    name: "",
    breed: "",
    measurements: {
      collar: 40,
      chest: 60,
      length: 50,
      weight: 20,
      height: 45,
      neckLength: 15,
    },
  });

  const addProfile = () => {
    const profile: PetProfile = {
      ...newProfile,
      id: Date.now().toString(),
      dateAdded: new Date().toISOString().split("T")[0],
    };
    setProfiles((prev) => [...prev, profile]);
    setNewProfile({
      name: "",
      breed: "",
      measurements: {
        collar: 40,
        chest: 60,
        length: 50,
        weight: 20,
        height: 45,
        neckLength: 15,
      },
    });
    setIsAddingProfile(false);
  };

  const updateProfile = (updatedProfile: PetProfile) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === updatedProfile.id ? updatedProfile : p)),
    );
    setEditingProfile(null);
  };

  const deleteProfile = (id: string) => {
    setProfiles((prev) => prev.filter((p) => p.id !== id));
  };

  const handleMeasurementsChange = (
    measurements: typeof newProfile.measurements,
  ) => {
    if (editingProfile) {
      setEditingProfile((prev) => (prev ? { ...prev, measurements } : null));
    } else {
      setNewProfile((prev) => ({ ...prev, measurements }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-dogzilla-purple/5 to-dogzilla-yellow/10">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Pet Profiles
            </h1>
            <p className="text-muted-foreground">
              Manage your furry friends and their measurements
            </p>
          </div>

          <Dialog open={isAddingProfile} onOpenChange={setIsAddingProfile}>
            <DialogTrigger asChild>
              <Button className="bg-dogzilla-purple hover:bg-dogzilla-purple/90 mt-4 md:mt-0">
                <Plus className="w-4 h-4 mr-2" />
                Add New Pet
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Pet Profile</DialogTitle>
                <DialogDescription>
                  Create a profile for your dog with measurements for future
                  clothing orders
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="new-name">Pet Name</Label>
                    <input
                      id="new-name"
                      type="text"
                      value={newProfile.name}
                      onChange={(e) =>
                        setNewProfile((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                      placeholder="Enter your pet's name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-breed">Breed</Label>
                    <input
                      id="new-breed"
                      type="text"
                      value={newProfile.breed}
                      onChange={(e) =>
                        setNewProfile((prev) => ({
                          ...prev,
                          breed: e.target.value,
                        }))
                      }
                      className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                      placeholder="e.g., Golden Retriever, Mixed Breed"
                    />
                  </div>
                </div>

                {/* Photo Measurement */}
                <DogPhotoMeasurement
                  onMeasurementsChange={handleMeasurementsChange}
                />

                {/* Manual Measurements Fallback */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Ruler className="w-5 h-5 mr-2" />
                      Manual Measurements
                    </CardTitle>
                    <CardDescription>
                      Adjust measurements manually if needed
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Collar (cm)</Label>
                        <input
                          type="number"
                          value={newProfile.measurements.collar}
                          onChange={(e) =>
                            setNewProfile((prev) => ({
                              ...prev,
                              measurements: {
                                ...prev.measurements,
                                collar: Number(e.target.value),
                              },
                            }))
                          }
                          className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                        />
                      </div>
                      <div>
                        <Label>Chest (cm)</Label>
                        <input
                          type="number"
                          value={newProfile.measurements.chest}
                          onChange={(e) =>
                            setNewProfile((prev) => ({
                              ...prev,
                              measurements: {
                                ...prev.measurements,
                                chest: Number(e.target.value),
                              },
                            }))
                          }
                          className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                        />
                      </div>
                      <div>
                        <Label>Length (cm)</Label>
                        <input
                          type="number"
                          value={newProfile.measurements.length}
                          onChange={(e) =>
                            setNewProfile((prev) => ({
                              ...prev,
                              measurements: {
                                ...prev.measurements,
                                length: Number(e.target.value),
                              },
                            }))
                          }
                          className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                        />
                      </div>
                      <div>
                        <Label>Height (cm)</Label>
                        <input
                          type="number"
                          value={newProfile.measurements.height}
                          onChange={(e) =>
                            setNewProfile((prev) => ({
                              ...prev,
                              measurements: {
                                ...prev.measurements,
                                height: Number(e.target.value),
                              },
                            }))
                          }
                          className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                        />
                      </div>
                      <div>
                        <Label>Neck Length (cm)</Label>
                        <input
                          type="number"
                          value={newProfile.measurements.neckLength}
                          onChange={(e) =>
                            setNewProfile((prev) => ({
                              ...prev,
                              measurements: {
                                ...prev.measurements,
                                neckLength: Number(e.target.value),
                              },
                            }))
                          }
                          className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                        />
                      </div>
                      <div>
                        <Label>Weight (kg)</Label>
                        <input
                          type="number"
                          value={newProfile.measurements.weight}
                          onChange={(e) =>
                            setNewProfile((prev) => ({
                              ...prev,
                              measurements: {
                                ...prev.measurements,
                                weight: Number(e.target.value),
                              },
                            }))
                          }
                          className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddingProfile(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={addProfile}
                    disabled={!newProfile.name.trim()}
                    className="bg-dogzilla-purple hover:bg-dogzilla-purple/90"
                  >
                    Save Pet Profile
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Profiles Grid */}
        {profiles.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No pets added yet</h3>
              <p className="text-muted-foreground mb-6">
                Add your first pet profile to get started with custom clothing
                designs
              </p>
              <Button
                onClick={() => setIsAddingProfile(true)}
                className="bg-dogzilla-purple hover:bg-dogzilla-purple/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Pet
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile) => (
              <Card
                key={profile.id}
                className="group hover:shadow-lg transition-all duration-300"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-dogzilla-purple/10 rounded-full flex items-center justify-center">
                        <Heart className="w-6 h-6 text-dogzilla-purple" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {profile.name}
                        </CardTitle>
                        <CardDescription>{profile.breed}</CardDescription>
                      </div>
                    </div>

                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingProfile(profile)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteProfile(profile.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2" />
                    Added {new Date(profile.dateAdded).toLocaleDateString()}
                  </div>

                  {/* Quick Measurements Display */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Collar:</span>
                      <span className="font-medium">
                        {profile.measurements.collar}cm
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Chest:</span>
                      <span className="font-medium">
                        {profile.measurements.chest}cm
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Length:</span>
                      <span className="font-medium">
                        {profile.measurements.length}cm
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Weight:</span>
                      <span className="font-medium">
                        {profile.measurements.weight}kg
                      </span>
                    </div>
                  </div>

                  <Button
                    asChild
                    className="w-full bg-dogzilla-orange hover:bg-dogzilla-orange/90"
                  >
                    <Link to={`/customize?pet=${profile.id}`}>
                      Design Clothing
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Edit Profile Dialog */}
      {editingProfile && (
        <Dialog open={true} onOpenChange={() => setEditingProfile(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit {editingProfile.name}</DialogTitle>
              <DialogDescription>
                Update your pet's information and measurements
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Pet Name</Label>
                  <input
                    type="text"
                    value={editingProfile.name}
                    onChange={(e) =>
                      setEditingProfile((prev) =>
                        prev ? { ...prev, name: e.target.value } : null,
                      )
                    }
                    className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  />
                </div>
                <div>
                  <Label>Breed</Label>
                  <input
                    type="text"
                    value={editingProfile.breed}
                    onChange={(e) =>
                      setEditingProfile((prev) =>
                        prev ? { ...prev, breed: e.target.value } : null,
                      )
                    }
                    className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <Label>Collar (cm)</Label>
                  <input
                    type="number"
                    value={editingProfile.measurements.collar}
                    onChange={(e) =>
                      setEditingProfile((prev) =>
                        prev
                          ? {
                              ...prev,
                              measurements: {
                                ...prev.measurements,
                                collar: Number(e.target.value),
                              },
                            }
                          : null,
                      )
                    }
                    className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  />
                </div>
                <div>
                  <Label>Chest (cm)</Label>
                  <input
                    type="number"
                    value={editingProfile.measurements.chest}
                    onChange={(e) =>
                      setEditingProfile((prev) =>
                        prev
                          ? {
                              ...prev,
                              measurements: {
                                ...prev.measurements,
                                chest: Number(e.target.value),
                              },
                            }
                          : null,
                      )
                    }
                    className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  />
                </div>
                <div>
                  <Label>Length (cm)</Label>
                  <input
                    type="number"
                    value={editingProfile.measurements.length}
                    onChange={(e) =>
                      setEditingProfile((prev) =>
                        prev
                          ? {
                              ...prev,
                              measurements: {
                                ...prev.measurements,
                                length: Number(e.target.value),
                              },
                            }
                          : null,
                      )
                    }
                    className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  />
                </div>
                <div>
                  <Label>Height (cm)</Label>
                  <input
                    type="number"
                    value={editingProfile.measurements.height}
                    onChange={(e) =>
                      setEditingProfile((prev) =>
                        prev
                          ? {
                              ...prev,
                              measurements: {
                                ...prev.measurements,
                                height: Number(e.target.value),
                              },
                            }
                          : null,
                      )
                    }
                    className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  />
                </div>
                <div>
                  <Label>Neck Length (cm)</Label>
                  <input
                    type="number"
                    value={editingProfile.measurements.neckLength}
                    onChange={(e) =>
                      setEditingProfile((prev) =>
                        prev
                          ? {
                              ...prev,
                              measurements: {
                                ...prev.measurements,
                                neckLength: Number(e.target.value),
                              },
                            }
                          : null,
                      )
                    }
                    className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  />
                </div>
                <div>
                  <Label>Weight (kg)</Label>
                  <input
                    type="number"
                    value={editingProfile.measurements.weight}
                    onChange={(e) =>
                      setEditingProfile((prev) =>
                        prev
                          ? {
                              ...prev,
                              measurements: {
                                ...prev.measurements,
                                weight: Number(e.target.value),
                              },
                            }
                          : null,
                      )
                    }
                    className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setEditingProfile(null)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => updateProfile(editingProfile)}
                  className="bg-dogzilla-purple hover:bg-dogzilla-purple/90"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
