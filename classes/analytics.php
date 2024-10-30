<?php

namespace CKLS;

class CKLS_Analytics
{
  private static $instance;

  public static function instance()
  {

    if (!isset(self::$instance) && !(self::$instance instanceof CKLS_Analytics)) {
      self::$instance = new CKLS_Analytics();
    }

    return self::$instance;
  }

  public function render_page()
  {
    echo '<div id="ckls-analytics-page"></div>';
  }
}
