import React, { useState, useEffect } from 'react';
import { ExternalLink, MapPin, Building2, DollarSign, Calendar, Loader2, AlertCircle } from 'lucide-react';
import { externalJobsApi, type ExternalJob } from '../services/externalJobsApi';
import { Card, CardBody } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import toast from 'react-hot-toast';

export const ExternalJobs: React.FC = () => {
  const [jobs, setJobs] = useState<ExternalJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [country, setCountry] = useState('us');
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    // Check if API keys are configured
    const appId = import.meta.env.VITE_ADZUNA_APP_ID;
    const appKey = import.meta.env.VITE_ADZUNA_APP_KEY;
    const configured = !!(appId && appKey && appId !== 'your_app_id_here' && appKey !== 'your_app_key_here');
    setHasApiKey(configured);

    // Debug log (remove in production)
    if (!configured) {
      console.log('Adzuna API keys not configured:', { appId, appKey });
    }
  }, []);

  const handleSearch = async () => {
    if (!hasApiKey) {
      toast.error('Please configure Adzuna API keys in your .env file');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await externalJobsApi.searchJobs(country, searchQuery, location, 20, 1);
      const jobs = result.results || [];
      setJobs(jobs);

      if (jobs.length === 0) {
        toast.success('No jobs found. Try different search terms.');
      } else {
        toast.success(`Found ${result.count} jobs`);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch external jobs';
      setError(errorMessage);
      toast.error(errorMessage);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Date not available';
    }
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Salary not specified';
    if (!min) return `Up to $${max?.toLocaleString()}`;
    if (!max) return `From $${min.toLocaleString()}`;
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  };

  if (!hasApiKey) {
    return (
      <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20">
        <CardBody>
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-2">
                External Jobs API Not Configured
              </h3>
              <p className="text-sm text-yellow-800 dark:text-yellow-300 mb-4">
                <strong>Note:</strong> You don't need to register as a user on this site. You only need API keys from Adzuna (which are developer credentials, not user accounts).
              </p>
              <p className="text-sm text-yellow-800 dark:text-yellow-300 mb-4">
                To enable external job listings, you need to:
              </p>
              <ol className="list-decimal list-inside text-sm text-yellow-800 dark:text-yellow-300 space-y-1 mb-4">
                <li>Get a free API key from{' '}
                  <a
                    href="https://developer.adzuna.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-medium"
                  >
                    Adzuna Developer Portal
                  </a>
                  {' '}(developer account, not a job seeker account)
                </li>
                <li>Create a <code className="bg-yellow-100 dark:bg-yellow-900/50 px-1 py-0.5 rounded">.env</code> file in the frontend directory</li>
                <li>Add these variables:
                  <pre className="bg-yellow-100 dark:bg-yellow-900/50 p-2 rounded mt-2 text-xs overflow-x-auto">
                    {`VITE_ADZUNA_APP_ID=your_app_id
VITE_ADZUNA_APP_KEY=your_app_key`}
                  </pre>
                </li>
                <li>Restart the dev server (the server has been restarted, refresh your browser)</li>
              </ol>
              <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-4 p-2 bg-yellow-100 dark:bg-yellow-900/50 rounded">
                💡 <strong>Tip:</strong> If you just added the .env file, make sure to refresh your browser page after restarting the server.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <Card>
        <CardBody>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Search External Job Listings
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Search for jobs from Adzuna API (millions of job listings worldwide)
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Input
              placeholder="Job title, keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Input
              placeholder="Location (city, state, country)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="us">United States</option>
              <option value="gb">United Kingdom</option>
              <option value="ca">Canada</option>
              <option value="au">Australia</option>
              <option value="de">Germany</option>
              <option value="fr">France</option>
            </select>
          </div>

          <Button
            onClick={handleSearch}
            isLoading={loading}
            disabled={loading}
            className="w-full md:w-auto"
          >
            {loading ? 'Searching...' : 'Search Jobs'}
          </Button>
        </CardBody>
      </Card>

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
          <CardBody>
            <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Searching for jobs...</p>
        </div>
      )}

      {/* Jobs List */}
      {!loading && jobs.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Found {jobs.length} Jobs
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {jobs.map((job) => (
              <Card key={job.id} hover>
                <CardBody>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {job.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-4 mb-3 text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                          <Building2 className="h-4 w-4 mr-1" />
                          <span>{job.company || 'Company not specified'}</span>
                        </div>
                        {job.location && job.location.length > 0 && (
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{job.location.join(', ')}</span>
                          </div>
                        )}
                        {(job.salary_min || job.salary_max) && (
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            <span>{formatSalary(job.salary_min, job.salary_max)}</span>
                          </div>
                        )}
                        {job.created && (
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{formatDate(job.created)}</span>
                          </div>
                        )}
                      </div>
                      {job.description && (
                        <p className="text-gray-700 dark:text-gray-300 line-clamp-2 mb-3">
                          {job.description.replace(/<[^>]*>/g, '').substring(0, 200)}...
                        </p>
                      )}
                      {job.category?.label && (
                        <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-sm">
                          {job.category.label}
                        </span>
                      )}
                    </div>
                    <div className="mt-4 md:mt-0 md:ml-4">
                      <a
                        href={job.redirect_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center"
                      >
                        <Button variant="primary">
                          Apply
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </Button>
                      </a>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {!loading && jobs.length === 0 && !error && (
        <Card>
          <CardBody className="text-center py-12">
            <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No jobs found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try searching with different keywords or location
            </p>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

