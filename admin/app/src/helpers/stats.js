import { API_Connector } from "../api/connector";
import Promise from "promise-polyfill";

const getFourStats = (startDate, endDate) => {

  return new Promise((resolve) => {

    const request = {
      type: 'get',
      action: 'ckls_three_stats',
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

const getBounceRate = (startDate, endDate) => {

  return new Promise((resolve) => {

    const request = {
      type: 'get',
      action: 'ckls_bounce_rate',
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

export { getFourStats, getBounceRate };