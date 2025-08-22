import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Heart, User, ShoppingBag, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Home", href: "/", icon: null },
    { name: "Measurements", href: "/measurements", icon: Ruler },
    { name: "Design Studio", href: "/customize", icon: Palette },
    { name: "My Dogs", href: "/profiles", icon: Heart },
    { name: "Orders", href: "/orders", icon: ShoppingBag },
  ];

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 mr-8">
          <div className="w-8 h-8 bg-gradient-to-br from-dogzilla-purple to-dogzilla-orange rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">D</span>
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-dogzilla-purple to-dogzilla-orange bg-clip-text text-transparent">
            JOGGYDOGGY
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 flex-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-dogzilla-purple",
                isActive(item.href)
                  ? "text-dogzilla-purple"
                  : "text-muted-foreground",
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <Link to="/login" className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              Sign In
            </Link>
          </Button>
          <Button
            size="sm"
            className="bg-dogzilla-purple hover:bg-dogzilla-purple/90"
          >
            <Link to="/register">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden ml-auto">
            <Button variant="ghost" size="sm">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <div className="flex flex-col space-y-4 mt-8">
              <Link
                to="/"
                className="flex items-center space-x-2 pb-4 border-b"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-dogzilla-purple to-dogzilla-orange rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">D</span>
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-dogzilla-purple to-dogzilla-orange bg-clip-text text-transparent">
                  JOGGYDOGGY
                </span>
              </Link>

              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 text-lg font-medium py-2 px-3 rounded-lg transition-colors",
                    isActive(item.href)
                      ? "bg-dogzilla-purple/10 text-dogzilla-purple"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.icon && <item.icon className="h-5 w-5" />}
                  <span>{item.name}</span>
                </Link>
              ))}

              <div className="pt-4 border-t space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  size="lg"
                >
                  <Link to="/login" className="flex items-center">
                    <User className="h-5 w-5 mr-3" />
                    Sign In
                  </Link>
                </Button>
                <Button
                  className="w-full bg-dogzilla-purple hover:bg-dogzilla-purple/90"
                  size="lg"
                >
                  <Link to="/register">Get Started</Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
