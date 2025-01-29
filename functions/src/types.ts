export type RecipientType = {
  id: string;
  name: string;
  email: string;
  sent?: boolean;
  status?: 'success' | 'error' | 'idle';
};

export type Action = {
  actionType: string;
  userId: string;
};
