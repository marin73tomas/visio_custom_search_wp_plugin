<?php

function search_endpoint()
{
    register_rest_route('api/', 'search', array(
        'methods'  => WP_REST_Server::READABLE,
        'callback' => 'get_results',
    ));
}
add_action('rest_api_init', 'search_endpoint');




function get_results($request)
{
<<<<<<< HEAD
    $get_list = $request['get_list'];
    if (isset($get_list)) {
        $tissue_children =  get_terms(array(
            'taxonomy' => 'tissue_type',
            'hide_empty' => false
        ));
        $segment_children =  get_terms(array(
            'taxonomy' => 'segment_type',
            'hide_empty' => false
        ));

        $list = [
            "segment_list" => $segment_children,
            "tissue_list" => $tissue_children,
        ];
        return $list;
    }
=======
>>>>>>> 7fb046a28bf18900bb93cc777274bbfd63486886

    $loadmore = true;
    $type = $request['type'];
    $cat = $request['category'];

    $search = $request['search'];
    if (!isset($type)) {
        $type = 'publications';
    }


    $args = array(
        'post_type' => 'knowledge_library',

        'posts_per_page' => 8,
        'paged' => $request["page"],
        'meta_key' => 'select_a_category',
        'meta_value' => $type,
    );
    if ($search) {
        $args['s'] = $search;
        $args['wpse_search_or_tax_query'] =  true;
        $args['tax_query'] = array(
            'relation' => 'OR',
            array(
                'taxonomy' => 'appcats',
                'field'    => 'name',
                'terms'    => $search,
            ),
            array(
                'taxonomy' => 'technique',
                'field'    => 'name',
                'terms'    => $search,
            ),
        );
    }
    if ($cat) {
        $args['category_name'] = 'featured';
    }
    $next_args = array(
        'post_type' => 'knowledge_library',
        's' => $search,
        'posts_per_page' => 8,
        'paged' => $request["page"] + 1,
        'meta_key' => 'select_a_category',
        'meta_value' => $type,
    );
    $posts_next = new WP_Query($next_args);
    if (empty($posts_next->posts)) {
        $loadmore = false;
    }
    wp_reset_query();
    $new_data = [];

    $posts = new WP_Query($args);

    if ($posts->have_posts()) {

        $pattern = '/\s*/m';
        $replace = '';
        while ($posts->have_posts()) :

            $posts->the_post();
            $id = get_the_ID();
            $thumbnail = get_field('thumbnail');
            $title = get_the_title($id);
            $content = apply_filters('the_content', get_the_content());
            $link = get_field('link');
            $journal_name = get_field("journal_name");
            $post_date = get_the_date('F j, Y', $id);
            $my_segment_types = get_the_terms($id, 'segment_type');
            $my_tissue_types = get_the_terms($id, 'tissue_type');
            $my_product_types = get_the_terms($id, 'appcats');

<<<<<<< HEAD

=======
            $tissue_children =  get_terms(array(
                'taxonomy' => 'tissue_type',
                'hide_empty' => false
            ));
            $segment_children =  get_terms(array(
                'taxonomy' => 'segment_type',
                'hide_empty' => false
            ));
>>>>>>> 7fb046a28bf18900bb93cc777274bbfd63486886


            $new_item = [
                "id" => $id,
                "thumbnail" => $thumbnail,
                "title" => $title,
                "content" => $content,
                "link" => $link,
                "date" => $post_date,
                "journal" => $journal_name,
<<<<<<< HEAD

=======
                "segment_list" => $segment_children,
                "tissue_list" => $tissue_children,
>>>>>>> 7fb046a28bf18900bb93cc777274bbfd63486886
                "tissue_types" => $my_tissue_types,
                "segment_types" => $my_segment_types,
                "product_types" => $my_product_types,
                "loadmore" => $loadmore,


            ];


            array_push($new_data, $new_item);

        endwhile;

        return $new_data;
    }

    return [];
}
