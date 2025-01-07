import { useMutation } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';
import { useUser } from '../hooks/useUser';

type EmailParams = {
  from: string;
  to: string;
  name: string;
  subject: string;
  message: string;
  // password: string;
};

const sendEmail = (
  params: EmailParams,
  accessToken: string | undefined
): Promise<AxiosResponse<unknown, unknown>> => {
  if (!accessToken) {
    return new Promise((_, reject) => {
      reject(new Error('No access token'));
    });
  }

  return axios.post(`${import.meta.env.VITE_DOMAIN_NAME}sendMail`, {
    ...params,
    accessToken,
  });
};
export const useSendEmail = () => {
  const { accessToken } = useUser();
  return useMutation({
    mutationFn: (params: EmailParams) => sendEmail(params, accessToken),
  });
};
