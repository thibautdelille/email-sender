import { useMutation } from '@tanstack/react-query';

type EmailParams = {
  from: string;
  to: string;
  name: string;
  subject: string;
  message: string;
  password: string;
};

const getEmail = (params: EmailParams): Promise<Response> => {
  const URLparams = new URLSearchParams(params);
  return fetch(
    `http://127.0.0.1:5001/email-sender-backend/us-central1/sendMail?${URLparams.toString()}`,
    {
      method: 'GET',
    }
  );
};
export const useSendEmail = () =>
  useMutation({
    mutationFn: getEmail,
  });
