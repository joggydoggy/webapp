import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  Star,
  RotateCcw,
  Eye,
  Download,
  Filter,
  Search,
  Calendar,
  ShoppingCart
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
  rating?: number;
  reviewed?: boolean;
}

interface Order {
  id: string;
  orderNumber: string;
  orderDate: string;
  status: 'processing' | 'production' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  total: number;
  trackingNumber?: string;
  canReorder: boolean;
  canReview: boolean;
  canReturn: boolean;
}

export default function Orders() {
  // Sample orders data
  const [orders] = useState<Order[]>([
    {
      id: "1",
      orderNumber: "JD-2024-001234",
      orderDate: "2024-01-15",
      status: "delivered",
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
          price: 44.99,
          rating: 5,
          reviewed: true
        }
      ],
      total: 48.59,
      trackingNumber: "1Z999AA1234567890",
      canReorder: true,
      canReview: false,
      canReturn: true
    },
    {
      id: "2",
      orderNumber: "JD-2024-001189",
      orderDate: "2024-01-08",
      status: "delivered",
      items: [
        {
          id: "2",
          petName: "Luna",
          designName: "Winter Warmth",
          style: "Classic",
          fabric: "Fleece",
          size: "S",
          color: "Red/White",
          quantity: 1,
          price: 54.99
        },
        {
          id: "3",
          petName: "Luna",
          designName: "Playtime Fun",
          style: "Sporty",
          fabric: "Waterproof",
          size: "S",
          color: "Blue/Yellow",
          quantity: 1,
          price: 49.99
        }
      ],
      total: 117.97,
      canReorder: true,
      canReview: true,
      canReturn: false
    },
    {
      id: "3",
      orderNumber: "JD-2024-001156",
      orderDate: "2024-01-02",
      status: "shipped",
      items: [
        {
          id: "4",
          petName: "Max",
          designName: "Holiday Special",
          style: "Classic",
          fabric: "Wool",
          size: "L",
          color: "Green/Gold",
          quantity: 1,
          price: 59.99
        }
      ],
      total: 67.19,
      trackingNumber: "1Z999AA1234567891",
      canReorder: true,
      canReview: false,
      canReturn: false
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return Clock;
      case 'production':
        return Package;
      case 'shipped':
        return Truck;
      case 'delivered':
        return CheckCircle;
      default:
        return Package;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'production':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const handleReorder = (order: Order) => {
    // In real app, add items to cart and redirect to checkout
    console.log('Reordering:', order);
    alert(`Added ${order.items.length} item(s) to cart from order ${order.orderNumber}`);
  };

  const handleReorderItem = (item: OrderItem) => {
    // In real app, add specific item to cart
    console.log('Reordering item:', item);
    alert(`Added "${item.designName}" for ${item.petName} to cart`);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.some(item => 
                           item.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.designName.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const orderStats = {
    total: orders.length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    inProgress: orders.filter(o => ['processing', 'production', 'shipped'].includes(o.status)).length,
    canReview: orders.filter(o => o.canReview).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-dogzilla-purple/5 to-dogzilla-yellow/10">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Order History</h1>
            <p className="text-muted-foreground">Track and manage your JOGGYDOGGY orders</p>
          </div>
          
          <Button className="bg-dogzilla-purple hover:bg-dogzilla-purple/90 mt-4 md:mt-0">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Continue Shopping
          </Button>
        </div>

        {/* Order Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{orderStats.total}</p>
                </div>
                <Package className="w-8 h-8 text-dogzilla-purple" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Delivered</p>
                  <p className="text-2xl font-bold">{orderStats.delivered}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold">{orderStats.inProgress}</p>
                </div>
                <Truck className="w-8 h-8 text-dogzilla-orange" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Reviews</p>
                  <p className="text-2xl font-bold">{orderStats.canReview}</p>
                </div>
                <Star className="w-8 h-8 text-dogzilla-yellow" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search orders by number, pet name, or design..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-input rounded-md bg-background text-foreground"
                >
                  <option value="all">All Status</option>
                  <option value="processing">Processing</option>
                  <option value="production">In Production</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Orders Found</h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm || statusFilter !== 'all' 
                  ? 'No orders match your current filters. Try adjusting your search.'
                  : "You haven't placed any orders yet. Start designing custom clothing for your pets!"
                }
              </p>
              <Button className="bg-dogzilla-purple hover:bg-dogzilla-purple/90">
                <Link to="/customize">Start Designing</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map(order => {
              const StatusIcon = getStatusIcon(order.status);
              return (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center space-x-3">
                          <span>Order #{order.orderNumber}</span>
                          <Badge className={`border ${getStatusColor(order.status)}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(order.orderDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </CardDescription>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-2xl font-bold text-dogzilla-purple">${order.total.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">{order.items.length} item(s)</p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Order Items */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                              <span className="font-medium">${item.price}</span>
                              {item.rating && (
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3 h-3 ${
                                        i < item.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleReorderItem(item)}
                              disabled={!order.canReorder}
                              className="w-full mt-2"
                            >
                              <RotateCcw className="w-3 h-3 mr-1" />
                              Reorder
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Order Actions */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/tracking/${order.id}`}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Link>
                      </Button>
                      
                      {order.trackingNumber && (
                        <Button variant="outline" size="sm">
                          <Truck className="w-4 h-4 mr-2" />
                          Track Package
                        </Button>
                      )}
                      
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download Invoice
                      </Button>
                      
                      {order.canReorder && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReorder(order)}
                          className="text-dogzilla-purple border-dogzilla-purple hover:bg-dogzilla-purple hover:text-white"
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Reorder All
                        </Button>
                      )}
                      
                      {order.canReview && (
                        <Button variant="outline" size="sm">
                          <Star className="w-4 h-4 mr-2" />
                          Write Review
                        </Button>
                      )}
                      
                      {order.canReturn && (
                        <Button variant="outline" size="sm">
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Return/Exchange
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
