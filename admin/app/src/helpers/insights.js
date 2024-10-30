import { API_Connector } from "../api/connector";
import Promise from "promise-polyfill";

const getInsights = (startDate, endDate) => {

  const diff = startDate.diff(endDate, 'day');

  let term = '';
  if (diff >= -30) {
    term = 'daily';
    // } else if (diff >= -60) {
    //   term = 'weekly';
  } else {
    term = 'monthly';
  }

  return new Promise((resolve) => {

    const request = {
      type: 'get',
      action: 'ckls_insights',
      params: {
        startdate: startDate.format('X'),
        enddate: endDate.format('X'),
        term: term
      }
    };

    API_Connector(request).then((res) => {
      //fill empty slots
      if (term == 'daily') {

        let all_dates = [];
        let start_date = startDate;
        let end_date = endDate;
        let current_date = start_date;

        let diffr = end_date.diff(start_date, 'days');

        while (diffr >= 0) {
          let obj = {
            segment: current_date.format('DD/MM/YYYY'),
            pageviews: 0
          };

          all_dates.push(obj);
          diffr--;
          current_date = current_date.add(1, 'day');
        }

        all_dates.map(row => {
          const chk = res.find(a => a.segment === row.segment);

          chk ? row.pageviews = chk.pageviews : row;
        })

        resolve(all_dates);

      } else { //monthly

        let all_months = [];
        let start_month = startDate;
        let end_month = endDate;
        let current_month = start_month.subtract(1, 'month');

        let diffr = end_month.diff(start_month, 'months');

        while (diffr >= 0) {

          let obj = {
            segment: current_month.add(1, 'month').format('MM/YYYY'),
            pageviews: 0
          };

          all_months.push(obj);
          diffr--;
          current_month = current_month.add(1, 'month');
        }

        all_months.map(row => {
          const chk = res.find(a => a.segment === row.segment);

          chk ? row.pageviews = chk.pageviews : row;
        })

        resolve(all_months);

      }
    });

  });

}

export { getInsights };