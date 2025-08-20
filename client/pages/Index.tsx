import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Palette, 
  Ruler, 
  Shirt, 
  Star, 
  Truck, 
  Shield, 
  Smartphone,
  ArrowRight,
  Sparkles
} from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-dogzilla-purple/5 to-dogzilla-yellow/10">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-dogzilla-purple/20 via-transparent to-dogzilla-orange/20" />
        <div className="container mx-auto px-4 pt-20 pb-32 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 bg-dogzilla-yellow/20 text-dogzilla-navy border-dogzilla-yellow/30">
              <Sparkles className="w-4 h-4 mr-2" />
              Custom Dog Fashion Made Easy
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-dogzilla-purple via-dogzilla-orange to-dogzilla-purple bg-clip-text text-transparent mb-6">
              DOGZILLA
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Create custom clothing for your furry friend with our innovative design platform. 
              From measurements to delivery, we make your dog look amazing.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-dogzilla-purple hover:bg-dogzilla-purple/90 text-white px-8 py-6 text-lg">
                <Link to="/customize" className="flex items-center">
                  Start Designing
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" className="border-dogzilla-orange text-dogzilla-orange hover:bg-dogzilla-orange hover:text-white px-8 py-6 text-lg">
                <Link to="/profiles" className="flex items-center">
                  Add Your Dog
                  <Heart className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Dogs Love Dogzilla
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Every detail designed with your dog's comfort and your style in mind
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-lg transition-all duration-300 border-dogzilla-purple/20">
              <CardHeader>
                <div className="w-12 h-12 bg-dogzilla-purple/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-dogzilla-purple/20 transition-colors">
                  <Ruler className="h-6 w-6 text-dogzilla-purple" />
                </div>
                <CardTitle>Perfect Measurements</CardTitle>
                <CardDescription>
                  Guided measurement process with videos and images to ensure the perfect fit for your dog's unique body shape.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-dogzilla-orange/20">
              <CardHeader>
                <div className="w-12 h-12 bg-dogzilla-orange/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-dogzilla-orange/20 transition-colors">
                  <Palette className="h-6 w-6 text-dogzilla-orange" />
                </div>
                <CardTitle>Live Design Preview</CardTitle>
                <CardDescription>
                  See exactly how your design will look with our 3D prototype viewer. Change colors, fabrics, and styles in real-time.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-dogzilla-yellow/20">
              <CardHeader>
                <div className="w-12 h-12 bg-dogzilla-yellow/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-dogzilla-yellow/20 transition-colors">
                  <Shirt className="h-6 w-6 text-dogzilla-navy" />
                </div>
                <CardTitle>Premium Materials</CardTitle>
                <CardDescription>
                  Choose from classic, modern, and sporty styles with premium fabrics that are comfortable and durable.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-dogzilla-purple/20">
              <CardHeader>
                <div className="w-12 h-12 bg-dogzilla-purple/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-dogzilla-purple/20 transition-colors">
                  <Truck className="h-6 w-6 text-dogzilla-purple" />
                </div>
                <CardTitle>Fast Delivery</CardTitle>
                <CardDescription>
                  Standard, express, and tracked delivery options. Get your custom clothing delivered right to your door.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-dogzilla-orange/20">
              <CardHeader>
                <div className="w-12 h-12 bg-dogzilla-orange/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-dogzilla-orange/20 transition-colors">
                  <Shield className="h-6 w-6 text-dogzilla-orange" />
                </div>
                <CardTitle>Secure Payments</CardTitle>
                <CardDescription>
                  Multiple payment options including credit cards, PayPal, Apple Pay, and Google Pay with bank-level security.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-dogzilla-yellow/20">
              <CardHeader>
                <div className="w-12 h-12 bg-dogzilla-yellow/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-dogzilla-yellow/20 transition-colors">
                  <Smartphone className="h-6 w-6 text-dogzilla-navy" />
                </div>
                <CardTitle>Mobile First</CardTitle>
                <CardDescription>
                  Fully responsive design that works perfectly on all devices. Design on the go, anywhere, anytime.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Styles Preview Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Choose Your Style
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From classic elegance to modern sporty looks, we have styles for every personality
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="group hover:scale-105 transition-all duration-300 overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-dogzilla-navy/10 to-dogzilla-purple/20 flex items-center justify-center">
                <Shirt className="h-16 w-16 text-dogzilla-purple" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Classic</h3>
                <p className="text-muted-foreground">
                  Timeless elegance with premium materials and traditional cuts
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:scale-105 transition-all duration-300 overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-dogzilla-orange/10 to-dogzilla-yellow/20 flex items-center justify-center">
                <Sparkles className="h-16 w-16 text-dogzilla-orange" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Modern</h3>
                <p className="text-muted-foreground">
                  Contemporary designs with innovative fabrics and bold patterns
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:scale-105 transition-all duration-300 overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-dogzilla-yellow/10 to-dogzilla-purple/20 flex items-center justify-center">
                <Star className="h-16 w-16 text-dogzilla-yellow" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Sporty</h3>
                <p className="text-muted-foreground">
                  Active wear designed for comfort and performance during play
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-dogzilla-purple/5 via-dogzilla-orange/5 to-dogzilla-yellow/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Make Your Dog a Style Icon?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of pet parents who trust Dogzilla for custom dog clothing
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-dogzilla-purple hover:bg-dogzilla-purple/90 text-white px-8 py-6 text-lg">
              <Link to="/customize" className="flex items-center">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
