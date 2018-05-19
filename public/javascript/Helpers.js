/**
 * @author Vladimir Taytor <cetncat@gmail.com>
 */

window.DOM_Helpers = {
  hideHTML(element) {
    if (element)
      element.style.display = 'none';
  },
  showHTML(element) {
    if (element)
      element.style.display = 'block'
  },
  _ajaxRequest(method, url, data, token) {
    console.log(data);
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      const isFormData = data instanceof FormData;
      xhr.open(method, url);

      if (!isFormData)
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
      if (token)
        xhr.setRequestHeader('x-access-token', token);

      xhr.onload = function () {
        return resolve({
          response: JSON.parse(this.responseText),
          state: this.readyState,
          status: this.status
        });
      };
      if (data) {
        return isFormData ?
          xhr.send(data) :
          xhr.send(JSON.stringify(data));
      }
      xhr.send();
    })
      .then(_readResponse)
      .catch(_catchChainError);

    function _catchChainError(err) {
      console.log(err.message);
      return Promise.reject(err);
    }

    function _readResponse(xhr) {
      if (xhr.state === 4 && xhr.status === 200) {
        return Promise.resolve(xhr.response);
      } else {
        const message = xhr.response[0] ? xhr.response[0].msg : 'Unknown error';
        return Promise.reject(new Error(message));
      }
    }
  },

};