import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Calendar,
  Phone,
  Mail,
  ArrowLeft,
  Star,
  MessageSquare,
  RefreshCw
} from "lucide-react";

interface OrderItem {
  id: string;
  petName: string;
  designName: string;
  style: string;
  fabric: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

interface TrackingEvent {
  id: string;
  status: string;
  description: string;
  location: string;
  timestamp: string;
  completed: boolean;
}

interface Order {
  id: string;
  orderNumber: string;
  orderDate: string;
  status: 'processing' | 'production' | 'shipped' | 'delivered';
  estimatedDelivery: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  trackingNumber?: string;
  deliveryAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  trackingEvents: TrackingEvent[];
}

export default function OrderTracking() {
  // Sample order data
  const [order] = useState<Order>({
    id: "1",
    orderNumber: "JD-2024-001234",
    orderDate: "2024-01-15",
    status: "shipped",
    estimatedDelivery: "2024-01-20",
    trackingNumber: "1Z999AA1234567890",
    items: [
      {
        id: "1",
        petName: "Buddy",
        designName: "Summer Casual",
        style: "Modern",
        fabric: "Cotton Blend",
        size: "M",
        color: "Purple/Orange",
        quantity: 1,
        price: 44.99
      }
    ],
    subtotal: 44.99,
    shipping: 0,
    tax: 3.60,
    total: 48.59,
    deliveryAddress: {
      name: "John Smith",
      address: "123 Main Street",
      city: "San Francisco",
      state: "CA",
      zipCode: "94102"
    },
    trackingEvents: [
      {
        id: "1",
        status: "Order Confirmed",
        description: "Your order has been confirmed and payment processed",
        location: "JOGGYDOGGY HQ",
        timestamp: "2024-01-15T10:30:00Z",
        completed: true
      },
      {
        id: "2", 
        status: "In Production",
        description: "Your custom dog clothing is being crafted by our artisans",
        location: "Production Facility",
        timestamp: "2024-01-16T09:00:00Z",
        completed: true
      },
      {
        id: "3",
        status: "Quality Check",
        description: "Quality inspection and final touches completed",
        location: "Quality Control",
        timestamp: "2024-01-17T14:30:00Z",
        completed: true
      },
      {
        id: "4",
        status: "Shipped",
        description: "Package picked up by courier and on its way to you",
        location: "Distribution Center",
        timestamp: "2024-01-18T11:15:00Z",
        completed: true
      },
      {
        id: "5",
        status: "In Transit",
        description: "Package is traveling to your delivery address",
        location: "En Route",
        timestamp: "2024-01-19T08:00:00Z",
        completed: false
      },
      {
        id: "6",
        status: "Out for Delivery",
        description: "Package is out for delivery and will arrive today",
        location: "Local Depot",
        timestamp: "",
        completed: false
      },
      {
        id: "7",
        status: "Delivered",
        description: "Package successfully delivered",
        location: "Delivery Address",
        timestamp: "",
        completed: false
      }
    ]
  });

  const getStatusProgress = (status: string) => {
    const statusMap = {
      'processing': 20,
      'production': 40,
      'shipped': 70,
      'delivered': 100
    };
    return statusMap[status as keyof typeof statusMap] || 0;
  };

  const getStatusIcon = (status: string, completed: boolean) => {
    if (completed) return CheckCircle;
    
    switch (status.toLowerCase()) {
      case 'shipped':
      case 'in transit':
      case 'out for delivery':
        return Truck;
      case 'delivered':
        return CheckCircle;
      default:
        return Package;
    }
  };

  const getStatusColor = (completed: boolean) => {
    return completed ? 'text-green-600' : 'text-muted-foreground';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Pending';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-dogzilla-purple/5 to-dogzilla-yellow/10">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" asChild className="mr-4">
            <Link to="/orders">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Order Tracking</h1>
            <p className="text-muted-foreground">Track your custom dog clothing order</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Tracking Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Order #{order.orderNumber}</CardTitle>
                    <CardDescription>
                      Placed on {new Date(order.orderDate).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Badge 
                    variant={order.status === 'delivered' ? 'default' : 'secondary'}
                    className={order.status === 'delivered' ? 'bg-green-600' : ''}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Order Progress</span>
                    <span>{getStatusProgress(order.status)}% Complete</span>
                  </div>
                  <Progress value={getStatusProgress(order.status)} className="h-2" />
                </div>

                {/* Estimated Delivery */}
                <div className="flex items-center justify-between p-4 bg-dogzilla-purple/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-dogzilla-purple" />
                    <div>
                      <p className="font-medium">Estimated Delivery</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long', 
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  {order.trackingNumber && (
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Tracking Number</p>
                      <p className="font-mono text-sm">{order.trackingNumber}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tracking Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="w-5 h-5 mr-2 text-dogzilla-orange" />
                  Tracking Timeline
                </CardTitle>
                <CardDescription>Follow your order's journey from creation to delivery</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {order.trackingEvents.map((event, index) => {
                    const Icon = getStatusIcon(event.status, event.completed);
                    return (
                      <div key={event.id} className="flex space-x-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                            event.completed 
                              ? 'bg-green-100 border-green-500 text-green-600' 
                              : 'bg-muted border-muted-foreground text-muted-foreground'
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          {index < order.trackingEvents.length - 1 && (
                            <div className={`w-0.5 h-12 mt-2 ${
                              event.completed ? 'bg-green-500' : 'bg-muted'
                            }`} />
                          )}
                        </div>
                        
                        <div className="flex-1 pb-8">
                          <div className="flex items-center justify-between">
                            <h3 className={`font-medium ${getStatusColor(event.completed)}`}>
                              {event.status}
                            </h3>
                            <span className="text-sm text-muted-foreground">
                              {formatDate(event.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                          <div className="flex items-center mt-2 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3 mr-1" />
                            {event.location}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
                <CardDescription>Contact us if you have questions about your order</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Support
                </Button>
                <Button variant="outline" className="justify-start">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Support
                </Button>
                <Button variant="outline" className="justify-start">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Live Chat
                </Button>
                <Button variant="outline" className="justify-start">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Report Issue
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-dogzilla-purple" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <p className="font-medium">{order.deliveryAddress.name}</p>
                  <p>{order.deliveryAddress.address}</p>
                  <p>
                    {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
                <CardDescription>{order.items.length} item(s)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items.map(item => (
                  <div key={item.id} className="flex space-x-3 p-3 border rounded-lg">
                    <div className="w-16 h-16 bg-gradient-to-br from-dogzilla-purple/20 to-dogzilla-orange/20 rounded-lg flex items-center justify-center">
                      <Star className="w-6 h-6 text-dogzilla-purple" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{item.designName}</h4>
                      <p className="text-sm text-muted-foreground">For {item.petName}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.style} • {item.fabric} • Size {item.size}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm">Qty: {item.quantity}</span>
                        <span className="font-medium">${item.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Order Total */}
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping:</span>
                    <span>{order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax:</span>
                    <span>${order.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium pt-2 border-t">
                    <span>Total:</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Star className="w-4 h-4 mr-2" />
                  Rate & Review
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Package className="w-4 h-4 mr-2" />
                  Reorder
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Return/Exchange
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
