import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building2, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { employersApi } from '../services/api';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';

const employerSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters').max(200),
  companyWebPage: z.string().url('Please enter a valid URL').max(255),
  email: z.string().email('Please enter a valid email').max(180),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 characters').max(30),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type EmployerFormData = z.infer<typeof employerSchema>;

export const RegisterEmployer: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmployerFormData>({
    resolver: zodResolver(employerSchema),
  });

  const onSubmit = async (data: EmployerFormData) => {
    try {
      const result = await employersApi.register({
        companyName: data.companyName,
        companyWebPage: data.companyWebPage,
        email: data.email,
        phoneNumber: data.phoneNumber,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      // Handle backend typo: "succes" instead of "success"
      const isSuccess = result.success || result.succes || false;
      
      if (isSuccess) {
        toast.success(result.message || 'Registration successful!');
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
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Employer Registration
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Create your employer account to post job opportunities
                </p>
              </div>
            </div>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Company Name"
                {...register('companyName')}
                error={errors.companyName?.message}
                placeholder="Enter your company name"
                required
              />

              <Input
                label="Company Website"
                type="url"
                {...register('companyWebPage')}
                error={errors.companyWebPage?.message}
                placeholder="https://example.com"
                required
              />

              <Input
                label="Email Address"
                type="email"
                {...register('email')}
                error={errors.email?.message}
                placeholder="contact@company.com"
                required
              />

              <Input
                label="Phone Number"
                type="tel"
                {...register('phoneNumber')}
                error={errors.phoneNumber?.message}
                placeholder="+1-555-123-4567"
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
                  Register as Employer
                </Button>
              </div>

              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link to="/register/jobseeker" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Register as Job Seeker instead
                </Link>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

