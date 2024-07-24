<?php
/**
 * Plugin Name: OSM Block
 * Description: Insert a custom map featuring your own locations or an interactive map where anyone can add location pins without registering by Noornabi.
 * Version: 1.0.0
 * Author: bPlugins LLC
 * Author URI: http://bplugins.com
 * License: GPLv3
 * License URI: https://www.gnu.org/licenses/gpl-3.0.txt
 * Text Domain: osm-block
 */

// ABS PATH
if ( !defined( 'ABSPATH' ) ) { exit; }

// Constant
define( 'OSM_VERSION', isset( $_SERVER['HTTP_HOST'] ) && 'localhost' === $_SERVER['HTTP_HOST'] ? time() : '1.0.0' );
define( 'OSM_DIR_URL', plugin_dir_url( __FILE__ ) );
define( 'OSM_DIR_PATH', plugin_dir_path( __FILE__ ) );




require_once OSM_DIR_PATH . 'inc/block.php';