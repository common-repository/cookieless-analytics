<?php

namespace CKLS;

class CKLS_Restbot
{
  public function __construct($data)
  {
    global $wpdb;

    $defaults = array(
      'fingerprint' => null,
      'page_url' => null,
      'time' => null,
      'page_id' => null,
      'time_on_page' => 0,
      'referrer' => null,
      'browser' => null,
      'browser_version' => null,
      'platform' => null,
      'device' => null,
      'device_resolution' => null,
      'user_agent' => null,
      'session_id' => null
    );

    $data = wp_parse_args($data, $defaults);

    $session_ID = $this->get_last_session($data);

    if ($session_ID === NULL) {
      $top_session = $wpdb->get_var("SELECT max(session_id) FROM {$wpdb->prefix}ckls_analytics");

      $data['session_id'] = $top_session === NULL ? 1 : (int) $top_session + 1;
    } else {
      $data['session_id'] = $session_ID;
    }

    if ($data['time'] !== null) { //new pageview

      $success = $wpdb->insert($wpdb->prefix . 'ckls_analytics', $data);

      if (!$success) {
        echo $wpdb->last_error;
      }

      echo intval($success);
    } else { //existing time update

      $fp = sanitize_text_field($data['fingerprint']);
      $last_insert = $wpdb->get_row(
        $wpdb->prepare("SELECT * FROM {$wpdb->prefix}ckls_analytics WHERE fingerprint=%s ORDER BY time DESC LIMIT 1", $fp),
        ARRAY_A
      );

      if ($last_insert['page_url'] == $data['page_url']) {
        //update the time on page
        $ID = (int) $last_insert['ID'];
        $newtime = (int) $data['time_on_page'];
        $success = $wpdb->query(
          $wpdb->prepare("UPDATE {$wpdb->prefix}ckls_analytics SET time_on_page=time_on_page+%s WHERE ID=%d", $newtime, $ID)
        );
        echo intval($success);
      }
      //print_r($last_insert);
    }

    exit();
  }

  private function get_last_session($data)
  {

    global $wpdb;

    $FP = sanitize_text_field($data['fingerprint']);
    $last30 = strtotime('-30 minutes');
    $sessionID = $wpdb->get_var(
      $wpdb->prepare("SELECT session_id from {$wpdb->prefix}ckls_analytics WHERE fingerprint=%s AND time > %d ORDER BY ID DESC LIMIT 1", $FP, $last30)
    );

    return intval($sessionID);
  }
}
