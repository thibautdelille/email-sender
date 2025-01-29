import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';
import { useUser } from '../hooks/useUser';
import { useToast } from '@chakra-ui/react';

const createFetchEmailsAction = (
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

  return axios.post(
    `${import.meta.env.VITE_DOMAIN_NAME}createFetchEmailsAction`,
    {
      accessToken,
      googleAccessToken,
      userId,
    }
  );
};

const triggerFetchAction = (): Promise<AxiosResponse<unknown, unknown>> => {
  return axios.post(
    `${import.meta.env.VITE_DOMAIN_NAME}triggerFetchEmailAction`
  );
};

export const useCreateFetchEmailsAction = () => {
  const { accessToken, googleAccessToken, user } = useUser();
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: () =>
      createFetchEmailsAction(accessToken, googleAccessToken, user?.uid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userData'] });
      toast({
        title: 'Success',
        description: 'Action created successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create action',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });
};

export const useTriggerFetchAction = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: triggerFetchAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userData'] });
      toast({
        title: 'Success',
        description: 'Action triggered successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to trigger action',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });
};
