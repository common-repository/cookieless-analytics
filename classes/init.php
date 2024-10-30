<?php

namespace CKLS;

use CKLS\CKLS_Analytics;
use CKLS\CKLS_Ajax;
use CKLS\CKLS_Restbot;

class CKLS_Engine
{
  private static $instance;

  private function __construct()
  {
  }

  public static function instance()
  {

    if (!isset(self::$instance) && !(self::$instance instanceof CKLS_Engine)) {
      self::$instance = new CKLS_Engine();

      self::$instance->reg_admin_hooks();
      self::$instance->reg_rest_endpoints();
      self::$instance->reg_frontend_hooks();
    }

    return self::$instance;
  }

  private function reg_admin_hooks()
  {
    add_action('wp_dashboard_setup', [$this, 'ckls_add_dashboard_widgets'], 20);

    add_action('admin_enqueue_scripts', [$this, 'ckls_rct_script']);

    add_action('admin_menu', [$this, 'ckls_admin_menu_page']);

    new CKLS_Ajax();
  }

  public function reg_rest_endpoints()
  {
    add_action('rest_api_init', [$this, 'ckls_rest_endpoint']);
  }
  public function ckls_rest_endpoint()
  {
    register_rest_route('cookieless-analytics', 'track', array(
      'methods' => 'POST',
      'callback' => [$this, 'ckls_track_sessions'],
      'permission_callback' => '__return_true'
    ));
  }
  public function ckls_track_sessions($req)
  {
    $data = $req->get_json_params();

    new CKLS_Restbot($data);

    //return ['success' => 'session_updated'];
  }

  private function reg_frontend_hooks()
  {
    add_action('wp_enqueue_scripts', [$this, 'ckls_frontend_js']);
  }

  public function ckls_add_dashboard_widgets()
  {
    wp_add_dashboard_widget('ckls-analytics', 'Cookieless Analytics', [$this, 'ckls_dashboard_widget']);
  }

  public function ckls_dashboard_widget()
  {
    echo '<div id="cookieless-analytics"></div>';
  }

  public function ckls_rct_script($suffix)
  {

    $deps = array('react', 'react-dom', 'wp-element', 'wp-i18n');
    wp_enqueue_script('ckls-rct', CKLS_URL . 'admin/app/dist/bundle.js', $deps, CKLS_VERSION, false);

    $ckls_vars = array(
      'ajaxURL' => admin_url('admin-ajax.php'),
      'nonce' => wp_create_nonce('ckls_fetch'),
      'plugin_url' => CKLS_URL
    );
    wp_localize_script('ckls-rct', 'cookieless_analytics', $ckls_vars);

    wp_enqueue_style('ckls-css', CKLS_URL . 'admin/css/dashboard.min.css');
  }

  public function ckls_frontend_js()
  {
    wp_enqueue_script('ckls-js', CKLS_URL . 'inc/public/cookieless-analytics.js', false, CKLS_VERSION, false);

    $vars = array(
      'url' => get_rest_url(),
      'beacon' => trailingslashit(get_site_url()) . 'ckls-beacon-endpoint.php',
      'page_id' => get_the_ID()
    );

    wp_localize_script('ckls-js', 'ckls', $vars);
  }

  public function ckls_admin_menu_page()
  {
    add_submenu_page('index.php', CKLS_NAME, CKLS_NAME, 'manage_options', CKLS_SLUG, [$this, 'ckls_analytics_page']);
  }

  public function ckls_analytics_page()
  {
    $instance = CKLS_Analytics::instance();
    $instance->render_page();
  }
}
