import axios from 'axios';

const post = (url, payload, headers = {}) =>
  axios.post(url, payload, headers).then(({ data }) => data);

export default { post };
