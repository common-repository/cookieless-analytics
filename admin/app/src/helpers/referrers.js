import { API_Connector } from "../api/connector";
import Promise from "promise-polyfill";

const getTopReferrers = (startDate, endDate) => {

  return new Promise((resolve) => {

    const request = {
      type: 'get',
      action: 'ckls_top_referrers',
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

export { getTopReferrers };