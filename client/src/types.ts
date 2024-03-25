export type RecipientType = {
  name: string;
  email: string;
  sent: boolean;
};

export type SenderData = {
  appPassword: string;
  name: string;
};

export type MessageData = {
  subject: string;
  message: string;
};

export type UserData = SenderData &
  MessageData & {
    recipients?: RecipientType[];
  };
