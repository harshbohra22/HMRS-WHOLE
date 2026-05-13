import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { jobSeekersApi } from '../services/api';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';

const jobSeekerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(100),
  nationalId: z.string().min(10, 'National ID must be at least 10 characters').max(20),
  birthDate: z.string().refine((date) => {
    const d = new Date(date);
    return d < new Date();
  }, 'Birth date must be in the past'),
  email: z.string().email('Please enter a valid email').max(180),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type JobSeekerFormData = z.infer<typeof jobSeekerSchema>;

export const RegisterJobSeeker: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<JobSeekerFormData>({
    resolver: zodResolver(jobSeekerSchema),
  });

  const onSubmit = async (data: JobSeekerFormData) => {
    try {
      const result = await jobSeekersApi.register({
        name: data.name,
        lastName: data.lastName,
        nationalId: data.nationalId,
        birthDate: data.birthDate,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      // Handle backend typo: "succes" instead of "success"
      const isSuccess = result.success || result.succes || false;
      
      if (isSuccess) {
        toast.success(result.message || 'Registration successful!');
        
        // Check if there's a selected job to apply for
        const selectedJobId = localStorage.getItem('selectedJobId');
        if (selectedJobId) {
          // Note: In a real app, you'd need to get the job seeker ID from the registration response
          // For now, we'll just notify the user
          toast.success('You can now apply for jobs!');
          localStorage.removeItem('selectedJobId');
        }
        
        setTimeout(() => navigate('/jobs'), 2000);
      } else {
        toast.error(result.message || 'Registration failed');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'An error occurred during registration');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to home
        </Link>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Job Seeker Registration
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Create your account to start applying for jobs
                </p>
              </div>
            </div>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="First Name"
                  {...register('name')}
                  error={errors.name?.message}
                  placeholder="Enter your first name"
                  required
                />

                <Input
                  label="Last Name"
                  {...register('lastName')}
                  error={errors.lastName?.message}
                  placeholder="Enter your last name"
                  required
                />
              </div>

              <Input
                label="National ID"
                {...register('nationalId')}
                error={errors.nationalId?.message}
                placeholder="Enter your national ID"
                required
              />

              <Input
                label="Birth Date"
                type="date"
                {...register('birthDate')}
                error={errors.birthDate?.message}
                required
              />

              <Input
                label="Email Address"
                type="email"
                {...register('email')}
                error={errors.email?.message}
                placeholder="your.email@example.com"
                required
              />

              <Input
                label="Password"
                type="password"
                {...register('password')}
                error={errors.password?.message}
                placeholder="At least 6 characters"
                required
              />

              <Input
                label="Confirm Password"
                type="password"
                {...register('confirmPassword')}
                error={errors.confirmPassword?.message}
                placeholder="Re-enter your password"
                required
              />

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                >
                  Register as Job Seeker
                </Button>
              </div>

              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                Are you an employer?{' '}
                <Link to="/register/employer" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Register as Employer instead
                </Link>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

