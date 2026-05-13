// API Response Types
// Note: Backend has a typo - returns "succes" instead of "success"
export interface Result {
  success?: boolean;
  succes?: boolean; // Backend typo - handle both
  message: string;
}

export interface DataResult<T> {
  success?: boolean;
  succes?: boolean; // Backend typo - handle both
  message: string;
  data: T;
}

// Entity Types
export interface City {
  id: number;
  name: string;
}

export interface JobPosition {
  id: number;
  name: string;
}

export interface Employer {
  id: number;
  companyName: string;
  companyWebPage: string;
  email: string;
  phoneNumber: string;
}

export interface JobSeeker {
  id: number;
  name: string;
  lastName: string;
  nationalId: string;
  birthDate: string;
  email: string;
}

export interface JobAdvertisement {
  id: number;
  jobTitle: string;
  companyName: string;
  city: string;
  openPositionCount: number;
  minSalary: number | null;
  maxSalary: number | null;
  releaseDate: string;
  applicationDeadline: string;
  active: boolean;
}

export interface JobApplication {
  id: number;
  jobAdvertisementId: number;
  jobSeekerId: number;
  applicationDate: string;
  status: string;
}

// Request Types
export interface EmployerRegisterRequest {
  companyName: string;
  companyWebPage: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

export interface JobSeekerRegisterRequest {
  name: string;
  lastName: string;
  nationalId: string;
  birthDate: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface CreateJobAdvertisementRequest {
  jobPositionId: number;
  cityId: number;
  employerId: number;
  description: string;
  openPositionCount: number;
  minSalary: number | null;
  maxSalary: number | null;
  applicationDeadline: string;
}

export interface ApplyJobRequest {
  jobAdvertisementId: number;
  jobSeekerId: number;
}

export interface UpdateApplicationStatusRequest {
  applicationId: number;
  status: string;
}

