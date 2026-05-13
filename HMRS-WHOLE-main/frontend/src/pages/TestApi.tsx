import React, { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { jobAdvertisementsApi } from '../services/api';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const TestApi: React.FC = () => {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<{
    active?: { success: boolean; message: string; data?: any };
    all?: { success: boolean; message: string; data?: any };
  }>({});

  const testEndpoint = async (fn: () => Promise<any>) => {
    try {
      const result = await fn();
      // Handle backend typo: "succes" instead of "success"
      const isSuccess = result.success || result.succes || false;
      return {
        success: isSuccess,
        message: result.message || 'Success',
        data: result.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Unknown error',
        error: error.response?.status || error.code,
      };
    }
  };

  const testAll = async () => {
    setTesting(true);
    setResults({});

    const [active, all] = await Promise.all([
      testEndpoint(() => jobAdvertisementsApi.getActive()),
      testEndpoint(() => jobAdvertisementsApi.getAll()),
    ]);

    setResults({ active, all });
    setTesting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardBody>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              API Connection Test
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Test the connection to the backend API at <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">https://hmrs.onrender.com/api</code>
            </p>

            <Button onClick={testAll} isLoading={testing} disabled={testing} className="mb-6">
              {testing ? 'Testing...' : 'Test API Endpoints'}
            </Button>

            {results.active && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Active Jobs Endpoint
                </h3>
                <div className={`p-4 rounded-lg flex items-start space-x-3 ${results.active.success
                  ? 'bg-green-50 dark:bg-green-900/20'
                  : 'bg-red-50 dark:bg-red-900/20'
                  }`}>
                  {results.active.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className={`font-medium ${results.active.success
                      ? 'text-green-900 dark:text-green-200'
                      : 'text-red-900 dark:text-red-200'
                      }`}>
                      {results.active.success ? '✓ Success' : '✗ Failed'}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                      {results.active.message}
                    </p>
                    {results.active.data && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        Found {Array.isArray(results.active.data) ? results.active.data.length : 0} jobs
                      </p>
                    )}
                    {results.active && (results.active as any).error && (
                      <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                        Error Code: {(results.active as any).error}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {results.all && (
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  All Jobs Endpoint
                </h3>
                <div className={`p-4 rounded-lg flex items-start space-x-3 ${results.all.success
                  ? 'bg-green-50 dark:bg-green-900/20'
                  : 'bg-red-50 dark:bg-red-900/20'
                  }`}>
                  {results.all.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className={`font-medium ${results.all.success
                      ? 'text-green-900 dark:text-green-200'
                      : 'text-red-900 dark:text-red-200'
                      }`}>
                      {results.all.success ? '✓ Success' : '✗ Failed'}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                      {results.all.message}
                    </p>
                    {results.all.data && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        Found {Array.isArray(results.all.data) ? results.all.data.length : 0} jobs
                      </p>
                    )}
                    {results.all && (results.all as any).error && (
                      <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                        Error Code: {(results.all as any).error}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

