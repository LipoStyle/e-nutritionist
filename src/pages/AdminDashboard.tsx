import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import HeroSlideManager from '@/components/admin/HeroSlideManager';
import ServiceManager from '@/components/admin/ServiceManager';
import RecipeManager from '@/components/admin/RecipeManager';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  BookOpen, 
  Utensils,
  Settings,
  BarChart3,
  Mail,
  Palette
} from 'lucide-react';

interface DashboardStats {
  totalBookings: number;
  totalMessages: number;
  totalSubscribers: number;
  totalBlogs: number;
  totalRecipes: number;
  totalServices: number;
}

interface Booking {
  id: string;
  client_name: string;
  client_email: string;
  appointment_date: string;
  status: string;
  service_id: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const AdminDashboard = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'services' | 'blogs' | 'recipes'>('dashboard');
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    totalMessages: 0,
    totalSubscribers: 0,
    totalBlogs: 0,
    totalRecipes: 0,
    totalServices: 0
  });
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [recentMessages, setRecentMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch stats
        const [bookings, messages, subscribers, blogs, recipes, services] = await Promise.all([
          supabase.from('bookings_2025_12_11_13_27').select('*', { count: 'exact' }),
          supabase.from('contact_messages_2025_12_11_13_27').select('*', { count: 'exact' }),
          supabase.from('subscribers_2025_12_11_13_27').select('*', { count: 'exact' }),
          supabase.from('blogs_2025_12_11_13_27').select('*', { count: 'exact' }),
          supabase.from('recipes_2025_12_11_13_27').select('*', { count: 'exact' }),
          supabase.from('services_2025_12_11_13_27').select('*', { count: 'exact' })
        ]);

        setStats({
          totalBookings: bookings.count || 0,
          totalMessages: messages.count || 0,
          totalSubscribers: subscribers.count || 0,
          totalBlogs: blogs.count || 0,
          totalRecipes: recipes.count || 0,
          totalServices: services.count || 0
        });

        // Fetch recent data
        const { data: recentBookingsData } = await supabase
          .from('bookings_2025_12_11_13_27')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        const { data: recentMessagesData } = await supabase
          .from('contact_messages_2025_12_11_13_27')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        setRecentBookings(recentBookingsData || []);
        setRecentMessages(recentMessagesData || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const statsCards = [
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      icon: Calendar,
      color: "text-blue-600"
    },
    {
      title: "Messages",
      value: stats.totalMessages,
      icon: MessageSquare,
      color: "text-green-600"
    },
    {
      title: "Subscribers",
      value: stats.totalSubscribers,
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Published Blogs",
      value: stats.totalBlogs,
      icon: BookOpen,
      color: "text-orange-600"
    },
    {
      title: "Recipes",
      value: stats.totalRecipes,
      icon: Utensils,
      color: "text-red-600"
    },
    {
      title: "Services",
      value: stats.totalServices,
      icon: Settings,
      color: "text-indigo-600"
    }
  ];

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Render different views based on current view
  if (currentView === 'services') {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <ServiceManager onBack={() => setCurrentView('dashboard')} />
        </div>
      </Layout>
    );
  }

  if (currentView === 'blogs') {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Blog Management</h2>
            <p className="text-muted-foreground mb-6">Blog management coming soon...</p>
            <Button onClick={() => setCurrentView('dashboard')} variant="outline">
              Back to Dashboard
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (currentView === 'recipes') {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <RecipeManager onBack={() => setCurrentView('dashboard')} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your nutrition practice and track your business metrics
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statsCards.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                    <IconComponent className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="visual">Visual Components</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Bookings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    Recent Bookings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentBookings.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">
                        No bookings yet
                      </p>
                    ) : (
                      recentBookings.map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{booking.client_name}</p>
                            <p className="text-sm text-muted-foreground">{booking.client_email}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(booking.appointment_date).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className={`${getStatusColor(booking.status)} text-white`}>
                            {booking.status}
                          </Badge>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Messages */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Recent Messages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentMessages.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">
                        No messages yet
                      </p>
                    ) : (
                      recentMessages.map((message) => (
                        <div key={message.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium">{message.name}</p>
                            <Badge variant={message.is_read ? "secondary" : "default"}>
                              {message.is_read ? "Read" : "Unread"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{message.email}</p>
                          <p className="text-sm font-medium">{message.subject}</p>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {message.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Booking Management</CardTitle>
                <p className="text-muted-foreground">
                  View and manage client appointments
                </p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Booking Management</h3>
                  <p className="text-muted-foreground mb-4">
                    Advanced booking management features will be available here.
                  </p>
                  <Button>Add New Booking</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Message Center</CardTitle>
                <p className="text-muted-foreground">
                  Manage client inquiries and communications
                </p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Message Management</h3>
                  <p className="text-muted-foreground mb-4">
                    Advanced message management features will be available here.
                  </p>
                  <Button>View All Messages</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="mr-2 h-5 w-5" />
                    Service Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      Create and manage nutrition services
                    </p>
                    <Button onClick={() => setCurrentView('services')} className="gradient-accent text-white">
                      Manage Services
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Blog Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      Create and manage blog posts
                    </p>
                    <Button onClick={() => setCurrentView('blogs')}>
                      Manage Blogs
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Utensils className="mr-2 h-5 w-5" />
                    Recipe Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      Create and manage recipes
                    </p>
                    <Button onClick={() => setCurrentView('recipes')}>
                      Manage Recipes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="visual" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="mr-2 h-5 w-5" />
                  Visual Components Manager
                </CardTitle>
              </CardHeader>
              <CardContent>
                <HeroSlideManager />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminDashboard;