import axios from 'axios';

// Adzuna API Configuration
// Get your free API key from: https://developer.adzuna.com/
const ADZUNA_APP_ID = import.meta.env.VITE_ADZUNA_APP_ID || '';
const ADZUNA_APP_KEY = import.meta.env.VITE_ADZUNA_APP_KEY || '';
const ADZUNA_BASE_URL = '/adzuna';

export interface ExternalJob {
  id: string;
  title: string;
  company: string;
  location: string[];
  description: string;
  salary_min?: number;
  salary_max?: number;
  created: string;
  redirect_url: string;
  category?: {
    label: string;
  };
}

export interface ExternalJobsResponse {
  results: ExternalJob[];
  count: number;
}

// Adzuna API Service
export const externalJobsApi = {
  /**
   * Search jobs from Adzuna API
   * @param country - Country code (e.g., 'us', 'gb', 'ca')
   * @param query - Search query (job title, keywords)
   * @param location - Location (city, state, etc.)
   * @param resultsPerPage - Number of results per page (max 50)
   * @param page - Page number
   */
  searchJobs: async (
    country: string = 'us',
    query: string = '',
    location: string = '',
    resultsPerPage: number = 20,
    page: number = 1
  ): Promise<ExternalJobsResponse> => {
    if (!ADZUNA_APP_ID || !ADZUNA_APP_KEY) {
      throw new Error('Adzuna API credentials not configured. Please add VITE_ADZUNA_APP_ID and VITE_ADZUNA_APP_KEY to your .env file');
    }

    try {
      const params: Record<string, string | number> = {
        app_id: ADZUNA_APP_ID,
        app_key: ADZUNA_APP_KEY,
        results_per_page: Math.min(resultsPerPage, 50),
      };

      if (query) {
        params.what = query;
      }
      if (location) {
        params.where = location;
      }

      const response = await axios.get<ExternalJobsResponse>(
        `${ADZUNA_BASE_URL}/${country}/search/${page}`,
        { params }
      );

      return response.data;
    } catch (error: any) {
      console.error('Error fetching external jobs:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch external jobs');
    }
  },

  /**
   * Get jobs by category
   */
  getJobsByCategory: async (
    country: string = 'us',
    category: string,
    resultsPerPage: number = 20,
    page: number = 1
  ): Promise<ExternalJobsResponse> => {
    if (!ADZUNA_APP_ID || !ADZUNA_APP_KEY) {
      throw new Error('Adzuna API credentials not configured');
    }

    try {
      const response = await axios.get<ExternalJobsResponse>(
        `${ADZUNA_BASE_URL}/${country}/search/${page}`,
        {
          params: {
            app_id: ADZUNA_APP_ID,
            app_key: ADZUNA_APP_KEY,
            category: category,
            results_per_page: Math.min(resultsPerPage, 50),
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Error fetching jobs by category:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch jobs by category');
    }
  },
};

// Alternative: JSearch API (via RapidAPI) - uncomment if you prefer this
/*
const JSEARCH_API_KEY = import.meta.env.VITE_JSEARCH_API_KEY || '';
const JSEARCH_BASE_URL = 'https://jsearch.p.rapidapi.com';

export const jSearchApi = {
  searchJobs: async (query: string, location: string = '', page: number = 1) => {
    if (!JSEARCH_API_KEY) {
      throw new Error('JSearch API key not configured');
    }

    const response = await axios.get(`${JSEARCH_BASE_URL}/search`, {
      params: {
        query,
        location,
        page,
        num_pages: 1,
      },
      headers: {
        'X-RapidAPI-Key': JSEARCH_API_KEY,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
      },
    });

    return response.data;
  },
};
*/

