import { defer, from, of, throwError } from 'rxjs';
import { retryWhen, delay, mergeMap } from 'rxjs/operators';
import { flow, assign } from 'lodash';
/**
 *  Wrapper for Fetch API (https://developer.mozilla.org/en/docs/Web/API/Fetch_API)
 *  The purpose of this is to enhance `fetch()` but still remain its API,
 *  except the result data are converted into JSON which is inspired by Angular 1's $http service.
 *  Enhanced features:
 *    - Convert response data to json implicitly.
 *    - Provide .addDefaultHeader() to setup default headers.
 *    - Interceptors - do something before or after every request.
 *    - Retry (GET only) on error.
 *    - Some utils method to parse request data.
 *  Future note: Above features can be considerd implemented by service worker
 *  when it is supported by all major browsers.
 *  Usage sample:
 *    const [data, status] = await fetchHelper.fetch('http://my.api.com/do-sth', {
 *      method: 'POST',
 *      body: JSON.stringify({id: 1, name: 'ABC'})
 *    })
 */

class FetchHelper {
  // CONFIGURATION
  static RETRY = true;
  static MAX_RETRY = 3;
  static RETRY_DELAY = 500;
  // END OF CONFIGURATION

  FORM_URL_ENCODED = 'application/x-www-form-urlencoded';

  constructor() {
    this.defaultInit = {
      // credentials: "include"
    };
    this.defaultHeaders = {
      'Content-Type': 'application/json'
    };
    this.beforeRequestInterceptors = [];
    this.afterResponseInterceptors = [];
  }

  addDefaultHeader = (key, value) => {
    this.defaultHeaders[key] = value;
  };

  removeDefaultHeader = key => {
    delete this.defaultHeaders[key];
  };
  /**
   *  To define something to do before every fetch request.
   *  Params:
   *      TBD
   *  Result:
   *      Returns a function to remove added interceptor.
   */
  addBeforeRequestInterceptor = interceptor => {
    this.beforeRequestInterceptors.push(interceptor);
    return () => {
      const index = this.beforeRequestInterceptors.indexOf(interceptor);
      this.beforeRequestInterceptors.splice(index, 1);
    };
  };
  /**
   *  To define something to do after every fetch response.
   *  If one of interceptors returns false, the process will be stop immediately.
   *  Params:
   *      interceptor: function ({response, jsonData, init})
   *  Result:
   *      Returns a function to remove added interceptor.
   */
  addAfterResonseInterceptor = interceptor => {
    this.afterResponseInterceptors.push(interceptor);
    return () => {
      const index = this.afterResponseInterceptors.indexOf(interceptor);
      this.afterResponseInterceptors.splice(index, 1);
    };
  };
  jsonToForm(json = {}) {
    return Object.keys(json)
      .map(key => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
      })
      .join('&');
  }
  /**
   * Convert object to query string (without '?' in the beginning)
   * @param {*} json
   */
  jsonToQueryString(json = {}) {
    return Object.keys(json)
      .map(key => {
        const value = json[key];
        if (value && value.constructor === Array) {
          return value
            .map(valueItem => `${key}=${encodeURIComponent(valueItem)}`)
            .join('&');
        } else if (value && typeof value === 'object') {
          return `${key}=${encodeURIComponent(JSON.stringify(value))}`;
        } else if (value || value === 0) {
          return `${key}=${encodeURIComponent(value)}`;
        } else {
          return '';
        }
      })
      .filter(Boolean)
      .join('&');
  }

  fetch = async (input, init = {}, isFormSubmit) => {
    let initWithDefaultHeaders = {
      ...this.defaultInit,
      ...init,
      headers: mergeWithDefaultHeaders(
        init.headers,
        this.defaultHeaders,
        isFormSubmit
      )
    };

    //run interceptors before each request
    let beforeRequestInterceptorsResult = applyBeforeRequestInterceptors(
      this.beforeRequestInterceptors,
      initWithDefaultHeaders
    );
    if (beforeRequestInterceptorsResult === false) {
      throw new Error(
        'Fetch Promise was canceled by interceptor before requested'
      );
    }
    let response;

    // run fetch() to request api...
    try {
      //...create difference kind of fetches to handle errors
      const customFetch = flow([this._fetchWith5XXRetry])(fetch);

      response = await customFetch(input, initWithDefaultHeaders);
    } catch (e) {
      console.warn('[FetchHelper]', e);
      applyAfterResponseInterceptors({
        response: e,
        interceptors: this.afterResponseInterceptors,
        initWithDefaultHeaders
      });

      return [e, -1];
    }

    //handle response
    const responseStatus = response.status;

    let jsonData = null;
    try {
      jsonData = await response.json();

      // run interceptors after each requests
      let afterResponseInterceptorsResult = applyAfterResponseInterceptors({
        response,
        interceptors: this.afterResponseInterceptors,
        jsonData,
        initWithDefaultHeaders
      });
      if (afterResponseInterceptorsResult === false) {
        throw new Error(
          'Fetch Promise was canceled by interceptor after responded'
        );
      }
      return [jsonData, responseStatus];
    } catch (e) {
      if (!jsonData) {
        let afterResponseInterceptorsResult = applyAfterResponseInterceptors({
          response,
          interceptors: this.afterResponseInterceptors,
          jsonData,
          initWithDefaultHeaders
        });
        if (afterResponseInterceptorsResult === false) {
          throw new Error(
            'Fetch Promise was canceled by interceptor after responded'
          );
        }
      }
      if (!(responseStatus + '').startsWith('2'))
        console.warn(
          `Can not parse json from response of API "${input}" with code ${responseStatus}.`,
          e
        );
      return [response, responseStatus];
    }
  };
  uploadFile = (url, opts = {}, onProgress) => {
    return new Promise((res, rej) => {
      var xhr = new XMLHttpRequest();
      xhr.open(opts.method || 'post', url);
      const headers = opts.headers || {};
      for (var k in headers) xhr.setRequestHeader(k, headers[k]);
      xhr.onload = e => {
        try {
          const json = JSON.parse(e.target.responseText);
          res([json, xhr.status]);
        } catch (err) {
          res([e.target.responseText, xhr.status]);
        }
      };
      xhr.onerror = rej;
      xhr.withCredentials = true;
      if (xhr.upload && onProgress) xhr.upload.onprogress = onProgress; // event.loaded / event.total * 100 ; //event.lengthComputable
      xhr.send(opts.body);
    });
  };
  getHeader = () => {
    return this.defaultHeaders;
  };
  _fetchWith5XXRetry = previousFetch => (input, init = {}) => {
    if (
      FetchHelper.RETRY &&
      (!init.method || init.method.toUpperCase() === 'GET')
    ) {
      let count = 0;

      return defer(() =>
        from(
          previousFetch(input, init).then(response => {
            if ((response.status + '').startsWith('5')) throw response;
            return response;
          })
        )
      )
        .pipe(
          retryWhen(errors => {
            return errors.pipe(
              mergeMap(error => {
                if (++count >= FetchHelper.MAX_RETRY) {
                  return throwError(error);
                }
                return of(error).pipe(delay(FetchHelper.RETRY_DELAY));
              })
            );
          })
        )

        .toPromise()
        .then(
          response => response,
          response => {
            if (response.status === 500) return response;
            throw response;
          }
        );
    } else {
      return previousFetch(input, init);
    }
  };
}

export function mergeWithDefaultHeaders(
  headers = {},
  defaultHeaders,
  isFormSubmit
) {
  var headerObj = {};
  if (headers instanceof Headers) {
    headers.forEach(([key, value]) => {
      headerObj[key] = value;
    });
  } else {
    headerObj = headers;
  }
  let temp = { ...defaultHeaders };
  delete temp['Content-Type'];

  return isFormSubmit ? temp : assign(defaultHeaders, headerObj);
}

export function applyBeforeRequestInterceptors(
  interceptors,
  initWithDefaultHeaders
) {
  interceptors.forEach(interceptor => {
    try {
      const interceptorResult = interceptor(initWithDefaultHeaders);
      if (interceptorResult === false) {
        console.error(
          new Error(
            `Interceptor ${interceptor} has cancel signal. This makes the request stop immediately`
          )
        );
        return false;
      }
    } catch (e) {
      console.error(e);
      return false;
    }
  });
}

export function applyAfterResponseInterceptors({
  response,
  interceptors,
  jsonData,
  initWithDefaultHeaders
}) {
  interceptors.forEach(interceptor => {
    try {
      const interceptorResult = interceptor({
        response,
        jsonData,
        init: initWithDefaultHeaders
      });
      if (interceptorResult === false) {
        console.error(
          new Error(
            `Interceptor ${interceptor} has cancel signal. This makes the request stop immediately.`
          )
        );
        return false;
      }
    } catch (e) {
      console.error(e);
      return false;
    }
  });
}

const fetchHelper = new FetchHelper();

export default fetchHelper;
