import React, { useState, useEffect, useMemo } from 'react';
import { MapPin, Briefcase, DollarSign, Calendar, Filter, Globe, Database } from 'lucide-react';
import { jobAdvertisementsApi } from '../services/api';
import type { JobAdvertisement } from '../types';
import { Card, CardBody } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { ExternalJobs } from '../components/ExternalJobs';
import toast from 'react-hot-toast';

export const Jobs: React.FC = () => {
  const [jobs, setJobs] = useState<JobAdvertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [sortBy, setSortBy] = useState<'deadline' | 'none'>('none');
  const [jobSource, setJobSource] = useState<'internal' | 'external'>('internal');

  useEffect(() => {
    loadJobs();
  }, [showActiveOnly, sortBy]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      let result;
      
      if (sortBy === 'deadline') {
        result = await jobAdvertisementsApi.getSortedByDeadline();
      } else if (showActiveOnly) {
        result = await jobAdvertisementsApi.getActive();
      } else {
        result = await jobAdvertisementsApi.getAll();
      }

      // Handle backend typo: "succes" instead of "success"
      const isSuccess = result.success || result.succes || false;
      
      if (isSuccess) {
        setJobs(result.data || []);
        if (result.data && result.data.length === 0) {
          toast.info('No jobs found in the database');
        }
      } else {
        toast.error(result.message || 'Failed to load jobs');
        setJobs([]);
      }
    } catch (error: any) {
      console.error('Error loading jobs:', error);
      
      // More detailed error messages
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const message = error.response.data?.message || error.response.statusText;
        
        if (status === 404) {
          toast.error('API endpoint not found. Please check the backend URL.');
        } else if (status === 500) {
          toast.error('Server error. Please check if the backend is running.');
        } else if (status === 0 || error.code === 'ERR_NETWORK') {
          toast.error('Cannot connect to backend. Check if https://hmrs.onrender.com is accessible.');
        } else {
          toast.error(`Error ${status}: ${message}`);
        }
      } else if (error.request) {
        // Request was made but no response received - likely CORS issue
        console.error('CORS or network error:', error);
        toast.error('CORS error: Backend needs CORS configuration. Check browser console for details.', {
          duration: 6000,
        });
      } else {
        // Something else happened
        toast.error(`Error: ${error.message || 'Failed to load jobs'}`);
      }
      
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch = 
        job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.companyName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCity = !selectedCity || job.city === selectedCity;
      return matchesSearch && matchesCity;
    });
  }, [jobs, searchTerm, selectedCity]);

  const cities = useMemo(() => {
    const uniqueCities = Array.from(new Set(jobs.map((job) => job.city)));
    return uniqueCities.map((city) => ({ value: city, label: city }));
  }, [jobs]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return 'Salary not specified';
    if (!min) return `Up to $${max?.toLocaleString()}`;
    if (!max) return `From $${min.toLocaleString()}`;
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Job Opportunities
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Discover your next career opportunity
              </p>
            </div>
            
            {/* Job Source Toggle */}
            <div className="mt-4 md:mt-0 flex items-center space-x-2 bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setJobSource('internal')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  jobSource === 'internal'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Database className="h-4 w-4" />
                <span>Our Jobs</span>
              </button>
              <button
                onClick={() => setJobSource('external')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  jobSource === 'external'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Globe className="h-4 w-4" />
                <span>External Jobs</span>
              </button>
            </div>
          </div>
        </div>

        {/* External Jobs Component */}
        {jobSource === 'external' && (
          <ExternalJobs />
        )}

        {/* Internal Jobs */}
        {jobSource === 'internal' && (
          <>

        {/* Filters */}
        <Card className="mb-6">
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="Search jobs or companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select
                options={cities}
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                label="City"
              />
              <div className="flex items-end">
                <Button
                  variant={showActiveOnly ? 'primary' : 'outline'}
                  onClick={() => setShowActiveOnly(!showActiveOnly)}
                  className="w-full"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {showActiveOnly ? 'Active Only' : 'All Jobs'}
                </Button>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                variant={sortBy === 'deadline' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setSortBy(sortBy === 'deadline' ? 'none' : 'deadline')}
              >
                Sort by Deadline
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Jobs List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading jobs...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12">
              <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No jobs found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search criteria
              </p>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredJobs.map((job) => (
              <Card key={job.id} hover>
                <CardBody>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                            {job.jobTitle}
                          </h3>
                          <p className="text-lg text-blue-600 dark:text-blue-400 font-medium">
                            {job.companyName}
                          </p>
                        </div>
                        {job.active && (
                          <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <MapPin className="h-5 w-5 mr-2" />
                          {job.city}
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <Briefcase className="h-5 w-5 mr-2" />
                          {job.openPositionCount} position{job.openPositionCount > 1 ? 's' : ''}
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <DollarSign className="h-5 w-5 mr-2" />
                          {formatSalary(job.minSalary, job.maxSalary)}
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <Calendar className="h-5 w-5 mr-2" />
                          Deadline: {formatDate(job.applicationDeadline)}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 md:ml-4 flex flex-col gap-2">
                      <Button
                        onClick={() => {
                          // Store job ID in localStorage for application
                          localStorage.setItem('selectedJobId', job.id.toString());
                          toast.success('Job selected! Please register as a job seeker to apply.');
                        }}
                        className="w-full md:w-auto"
                      >
                        Apply Now
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          alert(`Job ID: ${job.id}\nCompany: ${job.companyName}\nPosition: ${job.jobTitle}\nCity: ${job.city}`);
                        }}
                        className="w-full md:w-auto"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredJobs.length > 0 && (
          <div className="mt-8 text-center text-gray-600 dark:text-gray-400">
            Showing {filteredJobs.length} of {jobs.length} jobs
          </div>
        )}
          </>
        )}
      </div>
    </div>
  );
};

