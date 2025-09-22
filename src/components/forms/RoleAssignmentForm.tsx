import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { User, X, Search, Users } from 'lucide-react';

interface AssignedUser {
  id: string;
  name: string;
  branch: string;
  role: 'teacher' | 'host' | 'co-host' | 'coordinator' | 'volunteer';
}

interface Props {
  data: {
    assignedRoles: {
      teachers: AssignedUser[];
      host: AssignedUser | null;
      coHosts: AssignedUser[];
      coordinators: AssignedUser[];
      volunteers: AssignedUser[];
    };
    whoFillsForm: 'teacher' | 'host' | null;
  };
  updateData: (section: string, data: any) => void;
}

export const RoleAssignmentForm: React.FC<Props> = ({ data, updateData }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<AssignedUser[]>([]);

  // Mock function to simulate database search
  const searchUsers = (query: string) => {
    // This would be replaced with actual API call
    const mockUsers: AssignedUser[] = [
      { id: '1', name: 'John Doe', branch: 'Computer Science', role: 'teacher' },
      { id: '2', name: 'Jane Smith', branch: 'Electronics', role: 'student' },
      // Add more mock users as needed
    ];
    
    setSearchResults(mockUsers.filter(user => 
      user.name.toLowerCase().includes(query.toLowerCase())
    ));
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      searchUsers(query);
    } else {
      setSearchResults([]);
    }
  };

  const addUser = (user: AssignedUser, role: string) => {
    const updatedData = { ...data };
    switch (role) {
      case 'teacher':
        updatedData.assignedRoles.teachers.push({ ...user, role: 'teacher' });
        break;
      case 'host':
        updatedData.assignedRoles.host = { ...user, role: 'host' };
        break;
      case 'co-host':
        updatedData.assignedRoles.coHosts.push({ ...user, role: 'co-host' });
        break;
      case 'coordinator':
        updatedData.assignedRoles.coordinators.push({ ...user, role: 'coordinator' });
        break;
      case 'volunteer':
        updatedData.assignedRoles.volunteers.push({ ...user, role: 'volunteer' });
        break;
    }
    updateData('assignedRoles', updatedData.assignedRoles);
    setSearchQuery('');
    setSearchResults([]);
  };

  const removeUser = (userId: string, role: string) => {
    const updatedData = { ...data };
    switch (role) {
      case 'teacher':
        updatedData.assignedRoles.teachers = updatedData.assignedRoles.teachers.filter(t => t.id !== userId);
        break;
      case 'host':
        updatedData.assignedRoles.host = null;
        break;
      case 'co-host':
        updatedData.assignedRoles.coHosts = updatedData.assignedRoles.coHosts.filter(c => c.id !== userId);
        break;
      case 'coordinator':
        updatedData.assignedRoles.coordinators = updatedData.assignedRoles.coordinators.filter(c => c.id !== userId);
        break;
      case 'volunteer':
        updatedData.assignedRoles.volunteers = updatedData.assignedRoles.volunteers.filter(v => v.id !== userId);
        break;
    }
    updateData('assignedRoles', updatedData.assignedRoles);
  };

  const handleFormFiller = (filler: 'teacher' | 'host') => {
    updateData('whoFillsForm', filler);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="h-2 w-2 bg-primary rounded-full"></div>
            Assign Roles
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for teachers or students..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-8"
            />
            {searchResults.length > 0 && (
              <div className="absolute w-full mt-1 p-2 bg-white border rounded-md shadow-lg z-10">
                {searchResults.map(user => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-2 hover:bg-accent rounded-md cursor-pointer"
                  >
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.branch}</div>
                    </div>
                    <div className="space-x-2">
                      {user.role === 'teacher' && (
                        <Button size="sm" onClick={() => addUser(user, 'teacher')}>Add as Teacher</Button>
                      )}
                      {user.role !== 'teacher' && !data.assignedRoles.host && (
                        <Button size="sm" onClick={() => addUser(user, 'host')}>Set as Host</Button>
                      )}
                      {user.role !== 'teacher' && (
                        <>
                          <Button size="sm" onClick={() => addUser(user, 'co-host')}>Add as Co-host</Button>
                          <Button size="sm" onClick={() => addUser(user, 'coordinator')}>Add as Coordinator</Button>
                          <Button size="sm" onClick={() => addUser(user, 'volunteer')}>Add as Volunteer</Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Assigned Users */}
          <div className="space-y-4">
            {/* Teachers */}
            <div>
              <Label>Assigned Teachers</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {data.assignedRoles.teachers.map(teacher => (
                  <Badge key={teacher.id} variant="secondary" className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {teacher.name}
                    <button
                      onClick={() => removeUser(teacher.id, 'teacher')}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Host */}
            <div>
              <Label>Event Host</Label>
              <div className="mt-2">
                {data.assignedRoles.host ? (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {data.assignedRoles.host.name}
                    <button
                      onClick={() => removeUser(data.assignedRoles.host!.id, 'host')}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ) : (
                  <p className="text-sm text-muted-foreground">No host assigned</p>
                )}
              </div>
            </div>

            {/* Co-hosts */}
            <div>
              <Label>Co-hosts</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {data.assignedRoles.coHosts.map(coHost => (
                  <Badge key={coHost.id} variant="secondary" className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {coHost.name}
                    <button
                      onClick={() => removeUser(coHost.id, 'co-host')}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Coordinators */}
            <div>
              <Label>Coordinators</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {data.assignedRoles.coordinators.map(coordinator => (
                  <Badge key={coordinator.id} variant="secondary" className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {coordinator.name}
                    <button
                      onClick={() => removeUser(coordinator.id, 'coordinator')}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Volunteers */}
            <div>
              <Label>Volunteers</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {data.assignedRoles.volunteers.map(volunteer => (
                  <Badge key={volunteer.id} variant="secondary" className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {volunteer.name}
                    <button
                      onClick={() => removeUser(volunteer.id, 'volunteer')}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Form Completion Selection */}
          {data.assignedRoles.host && (
            <div className="space-y-4 pt-4 border-t">
              <Label>Who will complete the rest of the event details?</Label>
              <div className="flex gap-4">
                <Button
                  variant={data.whoFillsForm === 'teacher' ? 'default' : 'outline'}
                  onClick={() => handleFormFiller('teacher')}
                >
                  I'll fill the details
                </Button>
                <Button
                  variant={data.whoFillsForm === 'host' ? 'default' : 'outline'}
                  onClick={() => handleFormFiller('host')}
                >
                  Assigned Host will fill details
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};