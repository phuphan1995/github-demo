import fetchHelper from './FetchHelper';
import { toast } from 'react-toastify';
 export const API_URL = process.env.REACT_APP_API_ROOT;
export const SUCCESS_CODE = [200, 201, 204];
export const UNAUTHORIZED_CODE = 401;
export const NOTFOUND_CODE = [404];

const Api = {
  async get(url, params, headers, showError) {
    url = createUrl(url, params);
    return await request(url, { params, headers, showError });
  },

  async post(url, body, params, headers, showError, isFormSubmit) {
    url = createUrl(url, params);
    return await request(url, {
      method: 'POST',
      body,
      headers,
      showError,
      isFormSubmit,
    });
  },

  async put(url, body, params, headers, showError, isFormSubmit) {
    url = createUrl(url, params);
    return await request(url, {
      method: 'PUT',
      body,
      headers,
      showError,
      isFormSubmit,
    });
  },

  async delete(url, params, headers, showError) {
    url = createUrl(url, params);
    return await request(url, { method: 'DELETE', params, headers, showError });
  },
};

export default Api;

const createUrl = (url, params) => {
  const args = [];
  for (const key in params) {
    if (
      params.hasOwnProperty(key) &&
      params[key] !== undefined &&
      params[key] !== null &&
      params[key] !== ''
    ) {
      const value = params[key];
      args.push(`${key}=${value}`);
    }
  }
  url = args.length > 0 ? url + '?' + args.join('&') : url;
  return API_URL + url;
};

const request = async (
  url,
  {
    method = 'GET',
    params,
    body,
    headers,
    showError = true,
    isFormSubmit = false,
  }
) => {
  try {
    const config = { method };
    if (body) {
      if (body instanceof FormData) {
        config.body = body;
      } else config.body = JSON.stringify(body);
    }
    if (headers) config.headers = headers;
    const [data, status] = await fetchHelper.fetch(url, config, isFormSubmit);

    if (status === UNAUTHORIZED_CODE) {
      console.log('UNAUTHORIZED', data.Message);
    }
    if (SUCCESS_CODE.includes(status)) return { result: data, status };

    showError &&
      toast.error(data.Message || data.message || 'Something went wrong');
    return { result: null, message: data.message, status };
  } catch (exception) {
    console.log('exception', exception);
  }
};
