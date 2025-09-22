import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, TrendingUp, Award, Plus, ArrowUpRight, Activity, Zap } from 'lucide-react';

const DashboardHome: React.FC = () => {
  const { user } = useAuth();

  const getDashboardContent = () => {
    switch (user?.role) {
      case 'admin':
        return (
          <div className="space-y-8">
            {/* Header Section */}
            <div className="animate-fade-up">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold text-gradient mb-2">Admin Dashboard</h1>
                  <p className="text-lg text-muted-foreground">Welcome back, {user.name}</p>
                </div>
                <Button className="btn-modern btn-glow hover-lift">
                  <Plus className="h-4 w-4 mr-2" />
                  Quick Action
                </Button>
              </div>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-delay-200">
              <Card className="card-modern hover-lift animate-delay-100">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Events</CardTitle>
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">45</div>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowUpRight className="h-3 w-3 text-success" />
                    <p className="text-xs text-success font-medium">+12% from last month</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="card-modern hover-lift animate-delay-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Students</CardTitle>
                  <div className="p-2 bg-info/10 rounded-lg">
                    <Users className="h-4 w-4 text-info" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">2,350</div>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowUpRight className="h-3 w-3 text-success" />
                    <p className="text-xs text-success font-medium">+8% from last month</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="card-modern hover-lift animate-delay-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Engagement Rate</CardTitle>
                  <div className="p-2 bg-warning/10 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-warning" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">73.2%</div>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowUpRight className="h-3 w-3 text-success" />
                    <p className="text-xs text-success font-medium">+2.1% from last month</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="card-modern hover-lift animate-delay-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Certificates Issued</CardTitle>
                  <div className="p-2 bg-success/10 rounded-lg">
                    <Award className="h-4 w-4 text-success" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">1,247</div>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowUpRight className="h-3 w-3 text-success" />
                    <p className="text-xs text-success font-medium">+15% from last month</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity Section */}
            <Card className="card-modern animate-delay-300">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold flex items-center gap-2">
                      <Activity className="h-5 w-5 text-primary" />
                      Recent Activity
                    </CardTitle>
                    <CardDescription>Your latest event management activities</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="hover-lift">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { title: "Tech Symposium 2024 approved", time: "2 hours ago", type: "success" },
                    { title: "New event registration: AI Workshop", time: "4 hours ago", type: "info" },
                    { title: "Cultural Fest budget updated", time: "6 hours ago", type: "warning" },
                    { title: "Certificate template uploaded", time: "1 day ago", type: "success" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className={`status-dot status-${activity.type === 'success' ? 'online' : activity.type === 'warning' ? 'busy' : 'offline'}`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {activity.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'faculty':
        return (
          <div className="space-y-8">
            <div className="animate-fade-up">
              <h1 className="text-4xl font-bold text-gradient mb-2">Faculty Dashboard</h1>
              <p className="text-lg text-muted-foreground">Manage your events and track student engagement</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="card-modern hover-lift">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    <CardTitle>Quick Actions</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start btn-modern">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Event
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    View Schedule
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Award className="h-4 w-4 mr-2" />
                    Generate Certificates
                  </Button>
                </CardContent>
              </Card>

              <Card className="card-modern hover-lift">
                <CardHeader>
                  <CardTitle>My Events</CardTitle>
                  <CardDescription>Events you're organizing</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">12</div>
                  <p className="text-sm text-muted-foreground mt-1">Active events</p>
                </CardContent>
              </Card>

              <Card className="card-modern hover-lift">
                <CardHeader>
                  <CardTitle>Student Participation</CardTitle>
                  <CardDescription>Total registrations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-success">342</div>
                  <p className="text-sm text-muted-foreground mt-1">This semester</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'student':
      case 'alumni':
        return (
          <div className="space-y-8">
            <div className="animate-fade-up">
              <h1 className="text-4xl font-bold text-gradient mb-2">Student Dashboard</h1>
              <p className="text-lg text-muted-foreground">Discover events and track your participation</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="card-modern hover-lift">
                <CardHeader>
                  <CardTitle>Available Events</CardTitle>
                  <CardDescription>Events you can join</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-info">8</div>
                  <p className="text-sm text-muted-foreground mt-1">Open for registration</p>
                </CardContent>
              </Card>

              <Card className="card-modern hover-lift">
                <CardHeader>
                  <CardTitle>My Registrations</CardTitle>
                  <CardDescription>Events you've joined</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">5</div>
                  <p className="text-sm text-muted-foreground mt-1">Upcoming events</p>
                </CardContent>
              </Card>

              <Card className="card-modern hover-lift">
                <CardHeader>
                  <CardTitle>Certificates Earned</CardTitle>
                  <CardDescription>Your achievements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-success">23</div>
                  <p className="text-sm text-muted-foreground mt-1">Total certificates</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return <div className="text-center text-muted-foreground">Dashboard loading...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      <div className="container-fluid py-8">
        {getDashboardContent()}
      </div>
    </div>
  );
};

export default DashboardHome;
