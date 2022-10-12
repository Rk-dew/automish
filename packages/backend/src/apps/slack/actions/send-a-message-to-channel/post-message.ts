import { IGlobalVariable, IActionOutput } from '@automatisch/types';

const postMessage = async (
  $: IGlobalVariable,
  channelId: string,
  text: string
) => {
  const headers = {
    Authorization: `Bearer ${$.auth.data.accessToken}`,
  };

  const params = {
    channel: channelId,
    text,
  };

  const response = await $.http.post('/chat.postMessage', params, { headers });

  const message: IActionOutput = {
    data: {
      raw: response?.data?.message,
    },
    error: response?.integrationError,
  };

  if (response.data.ok === false) {
    message.error = response.data;
  }

  return message;
};

export default postMessage;
