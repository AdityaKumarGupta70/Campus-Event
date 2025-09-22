import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { User, X, Search, AlertCircle, UserCheck } from 'lucide-react';
import { AssignedUser, EventAssignedRoles, SearchUser, FormDataUpdateFunction } from '@/types';

interface Props {
  data: {
    assignedRoles: EventAssignedRoles;
    whoFillsForm: 'teacher' | 'host' | null;
  };
  updateData: FormDataUpdateFunction;
}

export const RoleAssignmentForm: React.FC<Props> = ({ data, updateData }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Enhanced mock function to simulate database search with better data
  const searchUsers = async (query: string) => {
    setIsSearching(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Enhanced mock users with better distinction between teachers and students
    const mockUsers: SearchUser[] = [
      // Teachers
      { id: 't1', name: 'Dr. John Smith', branch: 'Computer Science', role: 'teacher', email: 'john.smith@college.edu' },
      { id: 't2', name: 'Prof. Jane Doe', branch: 'Electronics', role: 'teacher', email: 'jane.doe@college.edu' },
      { id: 't3', name: 'Dr. Mike Johnson', branch: 'Mechanical', role: 'teacher', email: 'mike.johnson@college.edu' },
      { id: 't4', name: 'Prof. Sarah Wilson', branch: 'Information Technology', role: 'teacher', email: 'sarah.wilson@college.edu' },
      
      // Students
      { id: 's1', name: 'Alex Kumar', branch: 'Computer Science', role: 'student', email: 'alex.kumar@student.college.edu' },
      { id: 's2', name: 'Priya Patel', branch: 'Electronics', role: 'student', email: 'priya.patel@student.college.edu' },
      { id: 's3', name: 'Rahul Singh', branch: 'Computer Science', role: 'student', email: 'rahul.singh@student.college.edu' },
      { id: 's4', name: 'Sneha Sharma', branch: 'Information Technology', role: 'student', email: 'sneha.sharma@student.college.edu' },
      { id: 's5', name: 'Amit Gupta', branch: 'Mechanical', role: 'student', email: 'amit.gupta@student.college.edu' },
      { id: 's6', name: 'Riya Agarwal', branch: 'Electronics', role: 'student', email: 'riya.agarwal@student.college.edu' },
    ];
    
    const filtered = mockUsers.filter(user => 
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.branch.toLowerCase().includes(query.toLowerCase())
    );
    
    setSearchResults(filtered);
    setIsSearching(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      searchUsers(query);
    } else {
      setSearchResults([]);
    }
  };

  const addUser = (user: SearchUser, role: string) => {
    const newUser: AssignedUser = {
      ...user,
      role: role as AssignedUser['role']
    };
    
    const updatedData = { ...data };
    switch (role) {
      case 'teacher':
        // Prevent duplicate teachers
        if (!updatedData.assignedRoles.teachers.find(t => t.id === user.id)) {
          updatedData.assignedRoles.teachers.push(newUser);
        }
        break;
      case 'host':
        updatedData.assignedRoles.host = newUser;
        break;
      case 'co-host':
        if (!updatedData.assignedRoles.coHosts.find(c => c.id === user.id)) {
          updatedData.assignedRoles.coHosts.push(newUser);
        }
        break;
      case 'coordinator':
        if (!updatedData.assignedRoles.coordinators.find(c => c.id === user.id)) {
          updatedData.assignedRoles.coordinators.push(newUser);
        }
        break;
      case 'volunteer':
        if (!updatedData.assignedRoles.volunteers.find(v => v.id === user.id)) {
          updatedData.assignedRoles.volunteers.push(newUser);
        }
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
            Assign Event Roles
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Search and assign teachers, student host (mandatory), and support team members for your event.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for teachers or students by name or branch..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-8"
            />
            {isSearching && (
              <div className="absolute right-2 top-2.5">
                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
              </div>
            )}
            {searchResults.length > 0 && (
              <div className="absolute w-full mt-1 p-2 bg-white border rounded-md shadow-lg z-10 max-h-64 overflow-y-auto">
                {searchResults.map(user => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 hover:bg-accent rounded-md cursor-pointer border-b last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        user.role === 'teacher' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                      }`}>
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <span>{user.branch}</span>
                          <Badge variant={user.role === 'teacher' ? 'default' : 'secondary'} className="text-xs">
                            {user.role}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {user.role === 'teacher' && (
                        <Button 
                          size="sm" 
                          onClick={() => addUser(user, 'teacher')}
                          disabled={data.assignedRoles.teachers.some(t => t.id === user.id)}
                        >
                          {data.assignedRoles.teachers.some(t => t.id === user.id) ? 'Added' : 'Add as Teacher'}
                        </Button>
                      )}
                      {user.role === 'student' && (
                        <>
                          {!data.assignedRoles.host && (
                            <Button size="sm" onClick={() => addUser(user, 'host')} className="bg-orange-600 hover:bg-orange-700">
                              Set as Host
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => addUser(user, 'co-host')}
                            disabled={data.assignedRoles.coHosts.some(c => c.id === user.id)}
                          >
                            Co-host
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => addUser(user, 'coordinator')}
                            disabled={data.assignedRoles.coordinators.some(c => c.id === user.id)}
                          >
                            Coordinator
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => addUser(user, 'volunteer')}
                            disabled={data.assignedRoles.volunteers.some(v => v.id === user.id)}
                          >
                            Volunteer
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Host Requirement Alert */}
          {!data.assignedRoles.host && (
            <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-md">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <span className="text-sm text-orange-800">
                <strong>Required:</strong> You must assign at least one student as the event host before proceeding.
              </span>
            </div>
          )}

          {/* Assigned Users Display */}
          <div className="space-y-4">
            {/* Teachers */}
            <div>
              <Label className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Assigned Teachers
                <Badge variant="outline" className="text-xs">
                  {data.assignedRoles.teachers.length}
                </Badge>
              </Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {data.assignedRoles.teachers.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No teachers assigned yet</p>
                ) : (
                  data.assignedRoles.teachers.map(teacher => (
                    <Badge key={teacher.id} variant="default" className="flex items-center gap-1 px-3 py-1">
                      <User className="h-3 w-3" />
                      <span>{teacher.name}</span>
                      <span className="text-xs opacity-70">({teacher.branch})</span>
                      <button
                        onClick={() => removeUser(teacher.id, 'teacher')}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))
                )}
              </div>
            </div>

            {/* Host */}
            <div>
              <Label className="flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                Event Host
                <Badge variant="outline" className="text-xs bg-orange-100 text-orange-800">
                  Required
                </Badge>
              </Label>
              <div className="mt-2">
                {data.assignedRoles.host ? (
                  <Badge variant="default" className="flex items-center gap-1 px-3 py-1 bg-orange-600 hover:bg-orange-700">
                    <UserCheck className="h-3 w-3" />
                    <span>{data.assignedRoles.host.name}</span>
                    <span className="text-xs opacity-70">({data.assignedRoles.host.branch})</span>
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
              <Label className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Co-hosts
                <Badge variant="outline" className="text-xs">
                  {data.assignedRoles.coHosts.length}
                </Badge>
              </Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {data.assignedRoles.coHosts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No co-hosts assigned</p>
                ) : (
                  data.assignedRoles.coHosts.map(coHost => (
                    <Badge key={coHost.id} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                      <User className="h-3 w-3" />
                      <span>{coHost.name}</span>
                      <span className="text-xs opacity-70">({coHost.branch})</span>
                      <button
                        onClick={() => removeUser(coHost.id, 'co-host')}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))
                )}
              </div>
            </div>

            {/* Coordinators */}
            <div>
              <Label className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Coordinators
                <Badge variant="outline" className="text-xs">
                  {data.assignedRoles.coordinators.length}
                </Badge>
              </Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {data.assignedRoles.coordinators.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No coordinators assigned</p>
                ) : (
                  data.assignedRoles.coordinators.map(coordinator => (
                    <Badge key={coordinator.id} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                      <User className="h-3 w-3" />
                      <span>{coordinator.name}</span>
                      <span className="text-xs opacity-70">({coordinator.branch})</span>
                      <button
                        onClick={() => removeUser(coordinator.id, 'coordinator')}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))
                )}
              </div>
            </div>

            {/* Volunteers */}
            <div>
              <Label className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Volunteers
                <Badge variant="outline" className="text-xs">
                  {data.assignedRoles.volunteers.length}
                </Badge>
              </Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {data.assignedRoles.volunteers.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No volunteers assigned</p>
                ) : (
                  data.assignedRoles.volunteers.map(volunteer => (
                    <Badge key={volunteer.id} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                      <User className="h-3 w-3" />
                      <span>{volunteer.name}</span>
                      <span className="text-xs opacity-70">({volunteer.branch})</span>
                      <button
                        onClick={() => removeUser(volunteer.id, 'volunteer')}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Form Completion Selection */}
          {data.assignedRoles.host && (
            <div className="space-y-4 pt-6 border-t">
              <div className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-primary" />
                <Label className="text-base font-medium">Who will complete the event details?</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Choose whether you want to fill out the remaining event details yourself, or delegate this task to the assigned host.
              </p>
              <div className="flex gap-4">
                <Button
                  variant={data.whoFillsForm === 'teacher' ? 'default' : 'outline'}
                  onClick={() => handleFormFiller('teacher')}
                  className="flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  I'll complete the details
                </Button>
                <Button
                  variant={data.whoFillsForm === 'host' ? 'default' : 'outline'}
                  onClick={() => handleFormFiller('host')}
                  className="flex items-center gap-2"
                >
                  <UserCheck className="h-4 w-4" />
                  {data.assignedRoles.host.name} will complete the details
                </Button>
              </div>
              
              {data.whoFillsForm === 'host' && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-800">
                    <strong>{data.assignedRoles.host.name}</strong> will receive a notification to complete the event details.
                  </span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};