export const handleResponse = (response: any) => {
  if (response.status >= 200 && response.status < 300) {
    return response.data;
  }
  throw new Error(response.data?.message || 'Request failed');
};

export const handleError = (error: any) => {
  console.error('API Error:', error);
  throw new Error(error.response?.data?.message || error.message || 'An unexpected error occurred');
};