<?php
class OSMHelloBlock{
	public function __construct(){
		add_action( 'init', [$this, 'onInit'] );
	}


	function onInit() {
		wp_register_style( 'osm-hello-style', OSM_DIR_URL . 'dist/style.css', [ ], OSM_VERSION ); // Style
		wp_register_style( 'osm-hello-editor-style', OSM_DIR_URL . 'dist/editor.css', [ 'osm-hello-style' ], OSM_VERSION ); // Backend Style

		register_block_type( __DIR__, [
			'editor_style'		=> 'osm-hello-editor-style',
			'render_callback'	=> [$this, 'render']
		] ); // Register Block

		wp_set_script_translations( 'osm-hello-editor-script', 'osm-block', OSM_DIR_PATH . 'languages' );
	}

	function render( $attributes ){
		extract( $attributes );

		wp_enqueue_style( 'osm-hello-style' );
		wp_enqueue_script( 'osm-hello-script', OSM_DIR_URL . 'dist/script.js', [ 'react', 'react-dom' ], OSM_VERSION, true );
		wp_set_script_translations( 'osm-hello-script', 'osm-block', OSM_DIR_PATH . 'languages' );

		$className = $className ?? '';
		$blockClassName = "wp-block-osm-hello $className align$align";

		ob_start(); ?>
		<div class='<?php echo esc_attr( $blockClassName ); ?>' id='wrapper-<?php echo esc_attr( $cId ) ?>' data-attributes='<?php echo esc_attr( wp_json_encode( $attributes ) ); ?>'></div>

		<?php return ob_get_clean();
	}
}
new OSMHelloBlock();
