<?php
function my_load_files()
{
<<<<<<< HEAD
    wp_enqueue_script('search_js', plugins_url('/js/customsearch.js', __FILE__), array('jquery'), date("h:i:s"));
    wp_enqueue_style('search_style', plugins_url('/css/index.css', __FILE__), [], date("h:i:s"));
=======
    wp_enqueue_script('search_js', '../js/customsearch.js', array('jquery'), date("h:i:s"));
    wp_enqueue_style('search_style', '../css/index.css', [], date("h:i:s"));
>>>>>>> 7fb046a28bf18900bb93cc777274bbfd63486886
    wp_localize_script('search_js', 'ajax_var', array(
        'url'    => rest_url('/api/search'),
        'nonce'  => wp_create_nonce('wp_rest'),
    ));
}
<<<<<<< HEAD
add_action('wp_enqueue_scripts', 'my_load_files');
=======
add_action('wp_enqueue_scripts', 'my_load_scripts');
>>>>>>> 7fb046a28bf18900bb93cc777274bbfd63486886
