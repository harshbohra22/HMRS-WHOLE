import api from './api';

export interface ExternalJob {
  id: string;
  title: string;
  company: {
    display_name: string;
  };
  location: {
    display_name: string;
  };
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

// Adzuna API Service (via Backend Proxy)
export const externalJobsApi = {
  /**
   * Search jobs from Adzuna API via backend proxy
   * @param country - Country code (e.g., 'us', 'gb', 'ca')
   * @param query - Search query (job title, keywords)
   * @param location - Location (city, state, etc.)
   */
  searchJobs: async (
    country: string = 'us',
    query: string = '',
    location: string = '',
    _resultsPerPage: number = 20,
    _page: number = 1
  ): Promise<ExternalJobsResponse> => {
    try {
      const response = await api.get<ExternalJobsResponse>('/external-jobs', {
        params: {
          what: query,
          where: location,
          country: country
        }
      });

      return response.data;
    } catch (error: any) {
      console.error('Error fetching external jobs:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch external jobs');
    }
  },

  /**
   * Get jobs by category (not implemented in backend yet, reusing search)
   */
  getJobsByCategory: async (
    country: string = 'us',
    category: string,
    _resultsPerPage: number = 20,
    _page: number = 1
  ): Promise<ExternalJobsResponse> => {
    // Fallback to search since backend doesn't support category specific endpoint yet
    return externalJobsApi.searchJobs(country, category, '', _resultsPerPage, _page);
  }
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

