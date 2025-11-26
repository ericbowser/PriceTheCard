import config from '../env.json';
import axios from 'axios';


export default async function sendMail(formData) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    };
    const response = await axios.post(config.ASSIST_EMAIL_URL, {...formData}, {headers});
    console.log('Received email response: ', response);
    return response;
  } catch (err) {
    console.log(err);
    throw err;
  }
}