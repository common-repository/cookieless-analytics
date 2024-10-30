import { API_Connector } from "../api/connector";
import Promise from "promise-polyfill";

const getRealTime = () => {

  return new Promise((resolve) => {

    const request = {
      type: 'get',
      action: 'ckls_realtime',
      params: {
      }
    };

    API_Connector(request).then((res) => {
      resolve(res);
    });

  });

}

export { getRealTime };