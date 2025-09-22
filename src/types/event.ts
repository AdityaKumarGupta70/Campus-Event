// Event workflow types for the Faculty Portal

export interface AssignedUser {
  id: string;
  name: string;
  branch: string;
  role: 'teacher' | 'host' | 'co-host' | 'coordinator' | 'volunteer';
}

export interface EventAssignedRoles {
  teachers: AssignedUser[];
  host: AssignedUser | null;
  coHosts: AssignedUser[];
  coordinators: AssignedUser[];
  volunteers: AssignedUser[];
}

export interface EventBasicDetails {
  eventTitle?: string;
  tagline?: string;
  banner?: File | null;
  organizerName?: string;
  contactEmail?: string;
  contactPhone?: string;
  websiteUrl?: string;
  assignedRoles?: EventAssignedRoles;
  whoFillsForm?: 'teacher' | 'host' | null;
}

export interface EventAboutDetails {
  description?: string;
  category?: string;
  mode?: 'online' | 'offline' | 'hybrid';
  location?: string;
}

export interface EventEligibility {
  minTeamSize?: number;
  maxTeamSize?: number;
  allowSoloParticipation?: boolean;
  restrictions?: string[];
  requirements?: string[];
}

export interface EventRound {
  id: string;
  title: string;
  description: string;
  duration?: string;
  maxParticipants?: number;
}

export interface EventRewards {
  prizes?: Array<{
    position: string;
    prize: string;
  }>;
  certificates?: boolean;
  otherRewards?: string[];
}

export interface EventFeatures {
  features?: string[];
  requirements?: string[];
}

export interface EventData {
  basicDetails: EventBasicDetails;
  aboutEvent: EventAboutDetails;
  eligibility: EventEligibility;
  rounds: EventRound[];
  rewards: EventRewards;
  features: EventFeatures;
  publishSettings?: {
    publishDate?: Date;
    registrationDeadline?: Date;
    eventDate?: Date;
  };
}

export interface EventStatus {
  status: 'draft' | 'submitted' | 'approved' | 'published' | 'rejected';
  submittedAt?: Date;
  approvedAt?: Date;
  publishedAt?: Date;
  rejectedAt?: Date;
  remarks?: string;
}

export interface Event extends EventData {
  id: string;
  createdBy: {
    id: string;
    name: string;
    role: string;
  };
  status: EventStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Search result interface for user search
export interface SearchUser {
  id: string;
  name: string;
  branch: string;
  role: 'teacher' | 'student';
  email?: string;
}

// Form data update function type
export type FormDataUpdateFunction<T = unknown> = (section: string, data: T) => void;