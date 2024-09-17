import { MessageObject } from '../../types/message';

interface ParsedData {
  body: string;
  type: number;
}

interface ParsedBody {
  userID: string;
  userName: string;
  text: string;
}

export const parseTextMessage = (messageData: { data: string }): MessageObject | null => {
  let newMessage: MessageObject | null = null; // Ensure newMessage is always defined

  // Check if messageData.data is a string
  if (typeof messageData.data === 'string') {
    try {
      // Parse the messageData.data string
      const parsedData: ParsedData = JSON.parse(messageData.data);
      console.log('Parsed Data: ', parsedData);

      // Check if 'body' inside 'parsedData' is a JSON string
      if (typeof parsedData.body === 'string') {
        const parsedBody: ParsedBody = JSON.parse(parsedData.body);

        // Log parsed body information
        console.log('Parsed Body:', parsedBody);
        console.log('User ID:', parsedBody.userID);
        console.log('Text:', parsedBody.text);

        // Assign newMessage based on parsed data
        newMessage = {
          userID: String(parsedBody.userID),
          userName: String(parsedBody.userName),
          text: parsedBody.text,
          type: parsedData.type,
        };
      }
    } catch (error) {
      console.error('Error parsing message data:', error);
    }
  }

  return newMessage;
};

export const parseEnterExit = (messageData: {data: string}) => {
  console.log('EnterExitMessageData: ', messageData);
  let newMessage: MessageObject | null = null;
  if (typeof messageData.data === 'string') {
    const data = JSON.parse(messageData.data);
    console.log('EnterExitData', data);
    newMessage = {text: data.body, type: 2, userID: data.body, userName: data.body};
  }


  return newMessage;
};
