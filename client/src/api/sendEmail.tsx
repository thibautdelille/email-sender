import { useMutation } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

type EmailParams = {
  from: string;
  to: string;
  name: string;
  subject: string;
  message: string;
  password: string;
};

const getEmail = (params: EmailParams): Promise<AxiosResponse<any, any>> => {
  const URLparams = new URLSearchParams(params);
  console.log('import.meta.env:', import.meta.env);
  return axios.get(
    `${import.meta.env.VITE_DOMAIN_NAME}sendMail?${URLparams.toString()}`
  );
};
export const useSendEmail = () =>
  useMutation({
    mutationFn: getEmail,
  });
