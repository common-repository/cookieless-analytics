import axios from "axios"
import Promise from "promise-polyfill";

const API_Error = (error) => {
  alert(error);
  return false;
}

const API_Connector = (req) => {
  return new Promise((resolve, reject) => {

    if (req.type === 'get') { //get request

      try {
        let args = req.params;
        let args_eq = [];

        for (const [key, val] of Object.entries(args)) {
          args_eq.push(key + '=' + val);
        }

        const query_url = '?action=' + req.action + '&nonce=' + cookieless_analytics.nonce + '&' + args_eq.join('&');

        axios.get(cookieless_analytics.ajaxURL + query_url).then((response) => {

          //console.log(response); //full information
          resolve(response.data);

        });


      } catch (error) {
        API_Error(error);
      }

    } else { //post request
    //nothing yet
    }

  });
}

export { API_Connector }