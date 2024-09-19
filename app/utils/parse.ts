import { MessageObject } from '../../types/message';

interface ParsedBody {
  userID: string;
  userName: string;
  text: string;
  type: number;
}

// message obj
// userID: string;
//     userName: string;
//     text: string;
//     type: number

export const parseTextMessage = (messageData: { body: string }): MessageObject | null => {
  let newMessage: MessageObject | null = null;
  // console.log('New Message:', messageData);
  // Check if messageData.data is a string
  const parsedBody: ParsedBody = JSON.parse(messageData.body);
  // console.log('[ParseTextMessage]: parsedBody', parsedBody);
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
  // console.log('[parseEnterExit]: Input Data: ', messageData);
  let newMessage: MessageObject | null = null;
  const parsedBody = JSON.parse(messageData.body);
  // console.log('ENTEREXIT PARSED BODY: ', parsedBody);
  // if (typeof messageData.body === 'string') {
  //   const data = JSON.parse(JSON.parse(messageData.body).body);
  //   console.log('[parseEnterExit]: Parsed Data', data);
  //   newMessage = {text: data.Text, type: 2, userID: data.UserID, userName: data.UserName};
  // }
  newMessage = {
    userID: parsedBody.UserID,
    userName: parsedBody.UserName,
    type: messageData.type,
    text: parsedBody.Text,
  };

  console.log('ParsedEnterExit: ', newMessage);
  return newMessage;
};
