import axios from 'axios';

const apiUrl = 'https://l16yj0f8s6.execute-api.ap-south-1.amazonaws.com/dev/call';

const testData = {
        "uuid": "abcdef12-3456-7890-abcd-ef1234567890",
        "call_to_number": "1122334455",
        "caller_id_number": "5544332211",
        "start_stamp": "2024-08-01 12:00:00",
        "direction": "inbound",
        "answered_agent_number": "6677889900",
        "billing_circle": "Delhi",
        "call_status": "missed",
        "customer_no_with_prefix": "911122334455",
        "customer_ring_time": "20"
    };

async function testApi() {
    try {
        const response = await axios.post(apiUrl, testData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Response status:', response.status);
        console.log('Response data:', response.data);
    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
}

testApi();