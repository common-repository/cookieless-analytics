<?php

namespace CKLS;

class CKLS_DBManager
{

  public static $instance;
  public static $wpdb, $table;

  public function __construct()
  {
    global $wpdb;

    self::$wpdb = $wpdb;
    self::$table = $wpdb->prefix . 'ckls_analytics';
  }

  public static function instance()
  {

    if (!isset(self::$instance) && !(self::$instance instanceof CKLS_DBManager)) {
      self::$instance = new CKLS_DBManager();
    }

    return self::$instance;
  }

  public function db_get_top_pages($startdate, $enddate)
  {
    $table = self::$table;
    $prep = self::$wpdb->prepare("SELECT page_url,COUNT(*) as count FROM $table WHERE (time>=%d AND time<=%d) GROUP BY page_url ORDER BY count DESC LIMIT 7", $startdate, $enddate);
    $fetch = self::$wpdb->get_results($prep, ARRAY_A);

    echo json_encode($fetch);
  }

  public function db_get_top_referrers($startdate, $enddate)
  {
    $table = self::$table;
    $site = str_ireplace(['http://', 'https://'], ['', ''], site_url());
    if ($slash = stripos($site, '/')) {
      $site = substr($site, 0, $slash);
    }
    $site = sanitize_text_field($site);
    $prep = self::$wpdb->prepare("SELECT referrer,COUNT(*) as count FROM $table WHERE time>=%d AND time<=%d AND referrer!='' AND `referrer` REGEXP '^((?!$site).)*$' GROUP BY referrer ORDER BY count DESC LIMIT 7", $startdate, $enddate);
    $fetch = self::$wpdb->get_results($prep, ARRAY_A);
    echo json_encode($fetch);
  }

  public function db_get_fourstats($startdate, $enddate)
  {
    $table = self::$table;
    $prep = self::$wpdb->prepare("SELECT COUNT(*) AS pageviews, AVG(time_on_page)/1000 AS average_time,COUNT(DISTINCT fingerprint) AS unique_visitors,SUM(case when device = 'mobile' then 1 else 0 end) AS mobiles FROM $table WHERE(time>=%d AND time <=%d)", $startdate, $enddate);
    $fetch = self::$wpdb->get_results($prep, ARRAY_A);
    echo json_encode($fetch);
  }

  //TODO: sessions
  public function db_get_bouncerate($startdate, $enddate)
  {
    $table = self::$table;

    //get total sessions
    $prep = self::$wpdb->prepare("SELECT COUNT(DISTINCT session_id) FROM $table WHERE(time>=%d AND time<= %d)", $startdate, $enddate);
    $total_sessions = self::$wpdb->get_var($prep);

    //get single sessions
    $prep = self::$wpdb->prepare("SELECT session_id FROM $table WHERE(time>=%d AND time<=%d AND time_on_page<5000) GROUP BY session_id HAVING COUNT(*)=1", $startdate, $enddate);
    $single_sessions = self::$wpdb->get_results($prep, ARRAY_A);
    $single_sessions = count($single_sessions);

    echo json_encode(array(
      'total_sessions' => (int) $total_sessions,
      'single_sessions' => (int) $single_sessions
    ));
  }

  public function db_get_insights($startdate, $enddate, $term)
  {
    $table = self::$table;
    $gterm = '';
    if ($term == 'daily') {
      $gterm = '%d/%m/%Y';
    } else if ($term == 'weekly') {
      $gterm = '%v/%x';
    } else { //monthly
      $gterm = '%m/%Y';
    }

    $startdate = intval($startdate);
    $enddate = intval($enddate);

    $query = "SELECT FROM_UNIXTIME(`time`,'$gterm') as segment, COUNT(*) AS pageviews FROM $table WHERE(time>=$startdate AND time<=$enddate) GROUP BY segment";
    $fetch = self::$wpdb->get_results($query, ARRAY_A);

    echo json_encode($fetch);
  }

  public function db_get_realtime_users()
  {
    $table = self::$table;
    $time_recent = strtotime('10 minutes ago');
    $now = time();

    $query = self::$wpdb->prepare("SELECT count(*) FROM ( SELECT DISTINCT(fingerprint) as FP FROM $table WHERE time > %d AND (time + time_on_page / 1000 + 60) > %d ) AS realtime_visitors", $time_recent, $now);

    $fetch = self::$wpdb->get_var($query);
    $fetch = (int) $fetch;
    echo intval($fetch);
  }
}
