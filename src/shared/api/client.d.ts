import { AxiosError } from 'axios';
export declare const apiClient: import("axios").AxiosInstance;
export declare const handleApiError: (error: AxiosError) => string;
export declare const isNetworkError: (error: AxiosError) => boolean;
export default apiClient;
