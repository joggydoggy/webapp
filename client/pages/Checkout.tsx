import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ArrowLeft,
  CreditCard,
  Truck,
  MapPin,
  Shield,
  CheckCircle,
  Clock,
  Package,
  Star
} from "lucide-react";

interface CheckoutItem {
  id: string;
  petName: string;
  designName: string;
  style: string;
  fabric: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  thumbnail: string;
}

interface DeliveryAddress {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

interface BillingAddress extends DeliveryAddress {
  sameAsDelivery: boolean;
}

export default function Checkout() {
  // Sample cart items
  const [cartItems] = useState<CheckoutItem[]>([
    {
      id: "1",
      petName: "Buddy",
      designName: "Summer Casual",
      style: "Modern",
      fabric: "Cotton Blend",
      size: "M",
      color: "Purple/Orange",
      quantity: 1,
      price: 44.99,
      thumbnail: ""
    },
    {
      id: "2", 
      petName: "Luna",
      designName: "Winter Warmth",
      style: "Classic",
      fabric: "Fleece",
      size: "S",
      color: "Red/White",
      quantity: 1,
      price: 54.99,
      thumbnail: ""
    }
  ]);

  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
    firstName: "",
    lastName: "",
    company: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
    phone: ""
  });

  const [billingAddress, setBillingAddress] = useState<BillingAddress>({
    ...deliveryAddress,
    sameAsDelivery: true
  });

  const [deliveryOption, setDeliveryOption] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: ""
  });

  const deliveryOptions = [
    { 
      id: "standard", 
      name: "Standard Delivery", 
      description: "5-7 business days", 
      price: 0,
      icon: Package 
    },
    { 
      id: "express", 
      name: "Express Delivery", 
      description: "2-3 business days", 
      price: 9.99,
      icon: Clock 
    },
    { 
      id: "overnight", 
      name: "Overnight Delivery", 
      description: "Next business day", 
      price: 24.99,
      icon: Truck 
    }
  ];

  const paymentMethods = [
    { id: "card", name: "Credit/Debit Card", icon: CreditCard },
    { id: "paypal", name: "PayPal", icon: "🟦" },
    { id: "apple", name: "Apple Pay", icon: "🍎" },
    { id: "google", name: "Google Pay", icon: "🟩" }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryPrice = deliveryOptions.find(opt => opt.id === deliveryOption)?.price || 0;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + deliveryPrice + tax;

  const updateDeliveryAddress = (field: keyof DeliveryAddress, value: string) => {
    setDeliveryAddress(prev => ({ ...prev, [field]: value }));
    if (billingAddress.sameAsDelivery) {
      setBillingAddress(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleBillingSameAsDelivery = (checked: boolean) => {
    setBillingAddress(prev => ({
      ...prev,
      sameAsDelivery: checked,
      ...(checked ? deliveryAddress : {})
    }));
  };

  const handlePlaceOrder = () => {
    // In real app, process payment and create order
    console.log("Processing order...", {
      items: cartItems,
      delivery: deliveryAddress,
      billing: billingAddress,
      payment: paymentMethod,
      total
    });
    
    // Redirect to order confirmation
    alert("Order placed successfully! You will receive a confirmation email shortly.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-dogzilla-purple/5 to-dogzilla-yellow/10">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" asChild className="mr-4">
            <Link to="/customize">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Design
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Checkout</h1>
            <p className="text-muted-foreground">Complete your order for custom dog clothing</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-dogzilla-purple" />
                  Delivery Address
                </CardTitle>
                <CardDescription>Where should we send your custom dog clothing?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <input
                      id="firstName"
                      type="text"
                      value={deliveryAddress.firstName}
                      onChange={(e) => updateDeliveryAddress("firstName", e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <input
                      id="lastName"
                      type="text"
                      value={deliveryAddress.lastName}
                      onChange={(e) => updateDeliveryAddress("lastName", e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="company">Company (Optional)</Label>
                  <input
                    id="company"
                    type="text"
                    value={deliveryAddress.company}
                    onChange={(e) => updateDeliveryAddress("company", e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  />
                </div>
                
                <div>
                  <Label htmlFor="address1">Address Line 1 *</Label>
                  <input
                    id="address1"
                    type="text"
                    value={deliveryAddress.address1}
                    onChange={(e) => updateDeliveryAddress("address1", e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="address2">Address Line 2 (Optional)</Label>
                  <input
                    id="address2"
                    type="text"
                    value={deliveryAddress.address2}
                    onChange={(e) => updateDeliveryAddress("address2", e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  />
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <input
                      id="city"
                      type="text"
                      value={deliveryAddress.city}
                      onChange={(e) => updateDeliveryAddress("city", e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <input
                      id="state"
                      type="text"
                      value={deliveryAddress.state}
                      onChange={(e) => updateDeliveryAddress("state", e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <input
                      id="zipCode"
                      type="text"
                      value={deliveryAddress.zipCode}
                      onChange={(e) => updateDeliveryAddress("zipCode", e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <input
                    id="phone"
                    type="tel"
                    value={deliveryAddress.phone}
                    onChange={(e) => updateDeliveryAddress("phone", e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Delivery Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="w-5 h-5 mr-2 text-dogzilla-orange" />
                  Delivery Options
                </CardTitle>
                <CardDescription>Choose your preferred delivery speed</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={deliveryOption} onValueChange={setDeliveryOption}>
                  {deliveryOptions.map(option => (
                    <div key={option.id} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value={option.id} id={option.id} />
                      <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <option.icon className="w-5 h-5 text-dogzilla-purple" />
                            <div>
                              <div className="font-medium">{option.name}</div>
                              <div className="text-sm text-muted-foreground">{option.description}</div>
                            </div>
                          </div>
                          <div className="font-medium">
                            {option.price === 0 ? "Free" : `$${option.price}`}
                          </div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Billing Address */}
            <Card>
              <CardHeader>
                <CardTitle>Billing Address</CardTitle>
                <CardDescription>Address for payment processing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sameAsDelivery"
                    checked={billingAddress.sameAsDelivery}
                    onCheckedChange={handleBillingSameAsDelivery}
                  />
                  <Label htmlFor="sameAsDelivery">Same as delivery address</Label>
                </div>
                
                {!billingAddress.sameAsDelivery && (
                  <div className="space-y-4">
                    {/* Billing address form - similar to delivery address */}
                    <p className="text-sm text-muted-foreground">
                      Please enter your billing address details
                    </p>
                    {/* Would add full billing address form here */}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-dogzilla-yellow" />
                  Payment Method
                </CardTitle>
                <CardDescription>Secure payment processing with bank-level encryption</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  {paymentMethods.map(method => (
                    <div key={method.id} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value={method.id} id={method.id} />
                      <Label htmlFor={method.id} className="flex items-center space-x-3 cursor-pointer">
                        {typeof method.icon === 'string' ? (
                          <span className="text-xl">{method.icon}</span>
                        ) : (
                          <method.icon className="w-5 h-5 text-dogzilla-purple" />
                        )}
                        <span>{method.name}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                
                {paymentMethod === 'card' && (
                  <div className="space-y-4 mt-4 p-4 border rounded-lg">
                    <div>
                      <Label htmlFor="cardNumber">Card Number *</Label>
                      <input
                        id="cardNumber"
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={cardDetails.number}
                        onChange={(e) => setCardDetails(prev => ({ ...prev, number: e.target.value }))}
                        className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiry Date *</Label>
                        <input
                          id="expiry"
                          type="text"
                          placeholder="MM/YY"
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails(prev => ({ ...prev, expiry: e.target.value }))}
                          className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV *</Label>
                        <input
                          id="cvv"
                          type="text"
                          placeholder="123"
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails(prev => ({ ...prev, cvv: e.target.value }))}
                          className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="cardName">Cardholder Name *</Label>
                      <input
                        id="cardName"
                        type="text"
                        value={cardDetails.name}
                        onChange={(e) => setCardDetails(prev => ({ ...prev, name: e.target.value }))}
                        className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                        required
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>{cartItems.length} item(s) in your cart</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                {cartItems.map(item => (
                  <div key={item.id} className="flex space-x-3 p-3 border rounded-lg">
                    <div className="w-16 h-16 bg-gradient-to-br from-dogzilla-purple/20 to-dogzilla-orange/20 rounded-lg flex items-center justify-center">
                      <Star className="w-6 h-6 text-dogzilla-purple" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{item.designName}</h4>
                      <p className="text-sm text-muted-foreground">For {item.petName}</p>
                      <p className="text-xs text-muted-foreground">{item.style} • {item.fabric} • Size {item.size}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm">Qty: {item.quantity}</span>
                        <span className="font-medium">${item.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                <Separator />
                
                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery:</span>
                    <span>{deliveryPrice === 0 ? "Free" : `$${deliveryPrice.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                
                <Button 
                  onClick={handlePlaceOrder}
                  className="w-full mt-6 bg-dogzilla-purple hover:bg-dogzilla-purple/90"
                  size="lg"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Place Order
                </Button>
                
                <div className="text-center text-xs text-muted-foreground">
                  <Shield className="w-4 h-4 inline mr-1" />
                  Secure payment protected by 256-bit SSL encryption
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
