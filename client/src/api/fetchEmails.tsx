import { useMutation } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';
import { useUser } from '../hooks/useUser';

const fetchEmail = (
  accessToken: string | undefined,
  googleAccessToken: string | undefined,
  userId: string | undefined
): Promise<AxiosResponse<unknown, unknown>> => {
  if (!accessToken || !googleAccessToken) {
    return new Promise((_, reject) => {
      reject(new Error('No access token'));
    });
  }
  if (!userId) {
    return new Promise((_, reject) => {
      reject(new Error('No user id'));
    });
  }

  return axios.post(`${import.meta.env.VITE_DOMAIN_NAME}fetchEmail`, {
    accessToken,
    googleAccessToken,
    userId,
  });
};

const triggerFetchAction = (): Promise<AxiosResponse<unknown, unknown>> => {
  return axios.post(
    `${import.meta.env.VITE_DOMAIN_NAME}triggerFetchEmailAction`
  );
};

export const useFetchEmail = () => {
  const { accessToken, googleAccessToken, user } = useUser();
  return useMutation({
    mutationFn: () => fetchEmail(accessToken, googleAccessToken, user?.uid),
  });
};

export const useTriggerFetchAction = () => {
  return useMutation({
    mutationFn: triggerFetchAction,
  });
};
