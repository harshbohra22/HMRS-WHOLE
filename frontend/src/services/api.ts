import axios from 'axios';
import type {
  Result,
  DataResult,
  Employer,
  JobSeeker,
  JobAdvertisement,
  JobApplication,
  City,
  JobPosition,
  EmployerRegisterRequest,
  JobSeekerRegisterRequest,
  CreateJobAdvertisementRequest,
  ApplyJobRequest,
  UpdateApplicationStatusRequest,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      console.error('CORS Error: The backend at', API_BASE_URL, 'is blocking requests from', window.location.origin);
      console.error('Solution: Deploy the CorsConfig.java file to the backend');
    }
    return Promise.reject(error);
  }
);

// Employers API
export const employersApi = {
  register: async (data: EmployerRegisterRequest): Promise<Result> => {
    const response = await api.post<Result>('/employers/register', data);
    return response.data;
  },
  getAll: async (): Promise<DataResult<Employer[]>> => {
    const response = await api.get<DataResult<Employer[]>>('/employers/getAll');
    return response.data;
  },
};

// Job Seekers API
export const jobSeekersApi = {
  register: async (data: JobSeekerRegisterRequest): Promise<Result> => {
    const response = await api.post<Result>('/candidateController/register', data);
    return response.data;
  },
  getAll: async (): Promise<DataResult<JobSeeker[]>> => {
    const response = await api.get<DataResult<JobSeeker[]>>('/candidateController/getAll');
    return response.data;
  },
};

// Job Advertisements API
export const jobAdvertisementsApi = {
  add: async (data: CreateJobAdvertisementRequest): Promise<Result> => {
    const response = await api.post<Result>('/jobPost/add', data);
    return response.data;
  },
  getAll: async (): Promise<DataResult<JobAdvertisement[]>> => {
    const response = await api.get<DataResult<JobAdvertisement[]>>('/jobPost/getAll');
    return response.data;
  },
  getActive: async (): Promise<DataResult<JobAdvertisement[]>> => {
    const response = await api.get<DataResult<JobAdvertisement[]>>('/jobPost/active');
    return response.data;
  },
  getActiveByEmployer: async (employerId: number): Promise<DataResult<JobAdvertisement[]>> => {
    const response = await api.get<DataResult<JobAdvertisement[]>>('/jobPost/active/by-employer', {
      params: { employerId },
    });
    return response.data;
  },
  getSortedByDeadline: async (): Promise<DataResult<JobAdvertisement[]>> => {
    const response = await api.get<DataResult<JobAdvertisement[]>>('/jobPost/sorted-by-deadline');
    return response.data;
  },
  getByDeadline: async (date: string): Promise<DataResult<JobAdvertisement[]>> => {
    const response = await api.get<DataResult<JobAdvertisement[]>>('/jobPost/by-deadline', {
      params: { date },
    });
    return response.data;
  },
};

// Job Applications API
export const jobApplicationsApi = {
  apply: async (data: ApplyJobRequest): Promise<Result> => {
    const response = await api.post<Result>('/applications/apply', data);
    return response.data;
  },
  updateStatus: async (data: UpdateApplicationStatusRequest): Promise<Result> => {
    const response = await api.post<Result>('/applications/update-status', data);
    return response.data;
  },
  getByAdvertisement: async (adId: number): Promise<DataResult<JobApplication[]>> => {
    const response = await api.get<DataResult<JobApplication[]>>(`/applications/by-advertisement/${adId}`);
    return response.data;
  },
  getByJobSeeker: async (seekerId: number): Promise<DataResult<JobApplication[]>> => {
    const response = await api.get<DataResult<JobApplication[]>>(`/applications/by-jobseeker/${seekerId}`);
    return response.data;
  },
};

// Cities API
export const citiesApi = {
  getAll: async (): Promise<DataResult<City[]>> => {
    const response = await api.get<DataResult<City[]>>('/cities/getAll');
    return response.data;
  },
};

// Job Positions API
export const jobPositionsApi = {
  getAll: async (): Promise<DataResult<JobPosition[]>> => {
    const response = await api.get<DataResult<JobPosition[]>>('/jobPosition/getAll');
    return response.data;
  },
};

export default api;

