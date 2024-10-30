<?php

/**
 *
 * Cookieless Analytics
 *
 * Plugin Name:       Cookieless Analytics
 * Description:       Self hosted analytics solution for WordPress without any use of cookies
 * Version:           1.0.0
 * Author:            Go Web Smarty
 * Author URI:        https://gowebsmarty.com
 * License:           GNU General Public License v3.0
 * License URI:       http://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain:       cl-analytics
 * Domain Path:       /languages *
 * 
 * @category    Plugin
 * @license     http://www.gnu.org/licenses/gpl-3.0.html GNU General Public License v3.0
 *
 */

//exit on direct access
if (!defined('WPINC')) {
  die();
}

use CKLS\CKLS_Engine;

/**
 * Definitions
 */

define('CKLS_VERSION', '1.0.0');
define('CKLS_BASENAME', plugin_basename(__FILE__));
define('CKLS_NAME', 'Cookieless Analytics');
define('CKLS_PATH', trailingslashit(plugin_dir_path(__FILE__)));
define('CKLS_URL', trailingslashit(plugin_dir_url(__FILE__)));
define('CKLS_SLUG', 'cookieless-analytics');

/**
 * Activation & De-activation hooks
 */

function ckls_activate()
{
  global $wpdb;

  $query = "CREATE TABLE IF NOT EXISTS `{$wpdb->prefix}ckls_analytics` (
    `ID` int NOT NULL AUTO_INCREMENT,
    `fingerprint` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `page_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL,
    `time` int NOT NULL,
    `time_on_page` int DEFAULT '0',
    `page_id` int DEFAULT NULL,
    `referrer` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
    `browser` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
    `browser_version` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
    `platform` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
    `device` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
    `device_resolution` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
    `user_agent` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
    `session_id` int DEFAULT NULL,
    PRIMARY KEY (`ID`),
    KEY `time_index` (`time`)
  ) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;";

  $create_table = $wpdb->query($query);

  if (!$create_table) {
    wp_die("Failed to create analytics table. Please open support ticket for help.");
  }
}

function ckls_deactivate()
{
}

register_activation_hook(__FILE__, 'ckls_activate');
register_deactivation_hook(__FILE__, 'ckls_deactivate');


/**
 * Initiate
 */
require_once CKLS_PATH . 'vendor/autoload.php';
require_once CKLS_PATH . 'classes/init.php';

function ckls_init()
{
  return CKLS_Engine::instance();
}
add_action("plugins_loaded", "ckls_init", 10);
