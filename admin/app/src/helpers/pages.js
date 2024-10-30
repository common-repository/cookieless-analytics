import { API_Connector } from "../api/connector";
import Promise from "promise-polyfill";

const getTopPages = (startDate, endDate) => {

  return new Promise((resolve) => {

    const request = {
      type: 'get',
      action: 'ckls_top_pages',
      params: {
        startdate: startDate,
        enddate: endDate
      }
    };

    API_Connector(request).then((res) => {
      resolve(res);
    });

  });

}

export { getTopPages };