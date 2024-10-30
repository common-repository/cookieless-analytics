<?php

namespace CKLS;

use CKLS\CKLS_DBManager;

class CKLS_Ajax
{
  private $dbm;

  function __construct()
  {
    $this->dbm = CKLS_DBManager::instance();

    add_action('wp_ajax_ckls_top_pages', [$this, 'ckls_get_toppages']);
    add_action('wp_ajax_ckls_top_referrers', [$this, 'ckls_get_topreferrers']);
    add_action('wp_ajax_ckls_three_stats', [$this, 'ckls_get_fourstats']);
    add_action('wp_ajax_ckls_bounce_rate', [$this, 'ckls_get_bouncerate']);
    add_action('wp_ajax_ckls_insights', [$this, 'ckls_get_insights']);
    add_action('wp_ajax_ckls_realtime', [$this, 'ckls_get_realtime_users']);
  }

  private function nonce_handler($GET = true)
  {

    if ($GET) {
      if (!wp_verify_nonce($_GET['nonce'], 'ckls_fetch') || !current_user_can('manage_options')) {
        exit('unauthorized');
      }
    } else {
    }
  }

  public function ckls_get_toppages()
  {
    $this->nonce_handler();

    $start = (int) $_GET['startdate'];
    $end = (int) $_GET['enddate'];

    $this->dbm->db_get_top_pages($start, $end);

    exit();
  }

  public function ckls_get_topreferrers()
  {
    $this->nonce_handler();

    $start = (int) $_GET['startdate'];
    $end = (int) $_GET['enddate'];

    $this->dbm->db_get_top_referrers($start, $end);

    exit();
  }

  public function ckls_get_fourstats()
  {
    $this->nonce_handler();

    $start = (int) $_GET['startdate'];
    $end = (int) $_GET['enddate'];

    $this->dbm->db_get_fourstats($start, $end);

    exit();
  }

  public function ckls_get_bouncerate()
  {
    $this->nonce_handler();

    $start = (int) $_GET['startdate'];
    $end = (int) $_GET['enddate'];

    $this->dbm->db_get_bouncerate($start, $end);

    exit();
  }

  public function ckls_get_insights()
  {
    $this->nonce_handler();

    $start = (int) $_GET['startdate'];
    $end = (int) $_GET['enddate'];
    $term = sanitize_text_field($_GET['term']);

    $this->dbm->db_get_insights($start, $end, $term);

    exit();
  }

  public function ckls_get_realtime_users()
  {
    $this->nonce_handler();

    $this->dbm->db_get_realtime_users();

    exit();
  }
}
