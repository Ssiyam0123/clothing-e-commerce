import axios from "axios"


const sendTestEvent = async () => {
  const pixelId = '1578316914337510'; // Your Pixel ID
  const accessToken = 'EAAXqQai2HGcBRMyeXmiDwRiykI5yZABtOp4w2I8xRonzIugkqyyzZA5efJKZAuwZASv4Xn7JgJX4L4qZBN703QvbyIuxojPacxPwGMx76ExnQHjItCUrvZCV0RP1vaaOKDp4i3UdkmPjhf01bYmFZAoktaA5y1fXKy6CZAqlDZBWTutbdVzi2XBKNRBZChzTCqYwkrfAZDZD'; // The token you generated
  const testCode = 'TEST2252'; // Replace with the code from the Test Events tab

  const data = {
    data: [
      {
        event_name: 'cheggy',
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        event_source_url: 'https://yourdomain.com',
        user_data: {
          client_ip_address: '127.0.0.1',
          client_user_agent: 'Mozilla/5.0...'
        }
      }
    ],
    // ADD THIS LINE FOR TESTING:
    test_event_code: testCode 
  };

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken}`,
      data
    );
    console.log('Facebook CAPI Response:', response.data);
  } catch (error) {
    console.error('Error sending event:', error.response.data);
  }
};

sendTestEvent();