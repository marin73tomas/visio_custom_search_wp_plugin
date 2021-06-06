<?php
function my_load_files()
{
    wp_enqueue_script('search_js', '../js/customsearch.js', array('jquery'), date("h:i:s"));
    wp_enqueue_style('search_style', '../css/index.css', [], date("h:i:s"));
    wp_localize_script('search_js', 'ajax_var', array(
        'url'    => rest_url('/api/search'),
        'nonce'  => wp_create_nonce('wp_rest'),
    ));
}
add_action('wp_enqueue_scripts', 'my_load_scripts');
