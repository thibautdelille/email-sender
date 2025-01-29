export type RecipientType = {
  id?: string;
  name: string;
  email: string;
  sent: boolean;
  status?: 'success' | 'error' | 'idle';
};

export type SenderData = {
  appPassword: string;
  name: string;
};

export type MessageData = {
  subject: string;
  message: string;
};

export type Action = {
  userId?: string;
  status?: 'success' | 'error' | 'idle' | 'running' | 'unauthorized';
};

export type UserData = SenderData &
  MessageData & {
    recipients?: RecipientType[];
    fetchAction?: Action;
  };
