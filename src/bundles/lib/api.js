import axios from 'axios';
import { getApiError } from '../../utils';

const API_URL = process.env.DEMO_API_URL;

export default {
  name: 'apiv1',
  // note that the store gets passed in here:
  getExtraArgs: store => ({
    /**
     *  Call to Axios instance
     *  @param   {object}  config  Config object for the axios intance
     *  @param   {string}  config.url - request URL
     *  @param   {string}  [config.method]
     *  @param   {object}  [config.param] - request query params
     *  @param   {object}  [config.data] - request body
     *  @param   {Boolean} [config.redirectOnNotFound] Redirect to not found component
     *  @param   {Boolean} [config.alertOnFail]        Throw general alert on BAD REQUEST
     *  @return  {Promise} Axios Intance
     */
    apiFetch: config =>
      axios({
        ...config,
        method: config.method || 'get',
        url: `${API_URL}/api/v1/${config.endpoint}`,
        params: config.params || {},
        timeout: config.timeout || '5000',
        ...(config.headers
          ? { headers: config.headers }
          : {
              headers: {
                Authorization: store.selectAuthDataRaw().loginToken || undefined,
              },
            }),
      })
        .then(res => res.data)
        .catch(err => {
          console.error('API request error', err);
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          if (err.response) {
            if (err.response.status === 401) {
              store.dispatch({
                actionCreator: 'doUserLogout',
              });
            }
            const apiHandledResponse = getApiError(err.response);

            // TO DO:
            // Create a route for handling 404 errors
            // if (err.response.status === 404 && config.redirectOnNotFound) {
            //   store.doUpdateUrl('/not-found');
            // }

            // if (err.response.status === 400 && config.alertOnFail) {
            //   const { message } = apiHandledResponse;
            //   store.dispatch({
            //     actionCreator: 'doCreateAlert',
            //     args: [
            //       {
            //         msg: message,
            //         title: 'Error',
            //       },
            //     ],
            //   });
            // }

            throw apiHandledResponse;
          }

          // Otherwise return the error message from axios instance
          // Here we need the error message only but lets keep the error object format { message: err.message}
          const errorInstance = { message: err.message };
          throw errorInstance;
        }),
  }),
};
