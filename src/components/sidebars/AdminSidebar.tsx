import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  LayoutDashboard, 
  Calendar, 
  Instagram, 
  BarChart3, 
  LogOut,
  Settings,
  Sparkles
} from 'lucide-react';

const adminMenuItems = [
  { title: 'Admin Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'College Events', url: '/dashboard/events', icon: Calendar },
  { title: 'Instagram Media', url: '/dashboard/media', icon: Instagram },
  { title: 'Analytics', url: '/dashboard/analytics', icon: BarChart3 },
  { title: 'Settings', url: '/dashboard/settings', icon: Settings },
];

export const AdminSidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userInitials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'A';

  return (
    <Sidebar className={`${collapsed ? 'w-14' : 'w-64'} border-r border-border/50 bg-card/50 backdrop-blur-sm`} collapsible="icon">
      <SidebarHeader className="border-b border-border/50 p-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-8 w-8 border-2 border-primary/20">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="bg-gradient-primary text-primary-foreground text-sm font-semibold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-success border-2 border-card status-online"></div>
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <h2 className="font-semibold text-sm text-foreground truncate">{user?.name}</h2>
              <div className="flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-primary" />
                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
              </div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground/80 px-2 mb-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {adminMenuItems.map((item, index) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === '/dashboard'}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group hover:scale-[1.02] animate-delay-${index * 100} ${
                          isActive 
                            ? 'bg-primary text-primary-foreground shadow-colored hover:shadow-medium' 
                            : 'hover:bg-accent/50 hover:text-accent-foreground'
                        }`
                      }
                    >
                      <item.icon className={`h-4 w-4 transition-all duration-200 ${collapsed ? 'mx-auto' : ''} group-hover:scale-110`} />
                      {!collapsed && (
                        <span className="font-medium text-sm truncate">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50 p-4">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200 hover:scale-[1.02] group"
        >
          <LogOut className="h-4 w-4 group-hover:scale-110 transition-transform" />
          {!collapsed && <span className="ml-2 font-medium">Logout</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};