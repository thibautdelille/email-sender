import { useMutation } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';
import { useUser } from '../hooks/useUser';

type EmailParams = {
  to: string;
  name: string;
  subject: string;
  message: string;
};

const sendEmail = (
  params: EmailParams,
  accessToken: string | undefined,
  googleAccessToken: string | undefined
): Promise<AxiosResponse<unknown, unknown>> => {
  if (!accessToken || !googleAccessToken) {
    return new Promise((_, reject) => {
      reject(new Error('No access token'));
    });
  }

  return axios.post(`${import.meta.env.VITE_DOMAIN_NAME}sendMail`, {
    ...params,
    accessToken,
    googleAccessToken,
  });
};
export const useSendEmail = () => {
  const { accessToken, googleAccessToken } = useUser();
  return useMutation({
    mutationFn: (params: EmailParams) =>
      sendEmail(params, accessToken, googleAccessToken),
  });
};
