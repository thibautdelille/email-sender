import { useQuery } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';
import { useUser } from '../hooks/useUser';

const fetchContactEmail = (
  email: string | undefined,
  accessToken: string | undefined,
  googleAccessToken: string | undefined
): Promise<AxiosResponse<unknown, unknown>> => {
  if (!email) {
    return new Promise((_, reject) => {
      reject(new Error('No email'));
    });
  }
  if (!accessToken || !googleAccessToken) {
    return new Promise((_, reject) => {
      reject(new Error('No access token'));
    });
  }

  return axios.post(`${import.meta.env.VITE_DOMAIN_NAME}fetchContactEmail`, {
    email,
    accessToken,
    googleAccessToken,
  });
};
export const useFetchContactEmail = (email: string | undefined) => {
  const { accessToken, googleAccessToken } = useUser();

  return useQuery({
    queryKey: ['fetchContactEmail'],
    queryFn: () => fetchContactEmail(email, accessToken, googleAccessToken),
    enabled: !!email && !!accessToken && !!googleAccessToken,
  });
};
