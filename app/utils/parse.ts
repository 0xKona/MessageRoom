import { MessageObject } from '../../types/message';

interface ParsedBody {
  userID: string;
  userName: string;
  text: string;
  type: number;
}

export const parseTextMessage = (messageData: { body: string }): MessageObject | null => {
  let newMessage: MessageObject | null = null;
  const parsedBody: ParsedBody = JSON.parse(messageData.body);
  newMessage = {
    userID: parsedBody.userID,
    userName: parsedBody.userName,
    type: parsedBody.type,
    text: parsedBody.text,
  };
  console.log('ParsedTextMessage: ', newMessage);
  return newMessage;
};

export const parseEnterExit = (messageData: {body: string, type: number}): MessageObject | null => {
  let newMessage: MessageObject | null = null;
  const parsedBody = JSON.parse(messageData.body);
  newMessage = {
    userID: parsedBody.UserID,
    userName: parsedBody.UserName,
    type: messageData.type,
    text: parsedBody.Text,
  };

  console.log('ParsedEnterExit: ', newMessage);
  return newMessage;
};
