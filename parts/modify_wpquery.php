<?php 


add_action( 'init', function()
{   
    if( ! is_admin() && class_exists( 'WPSE_Modify_Query' ) )
    {
        $o = new WPSE_Modify_Query;
        $o->activate();
    }
});


class WPSE_Modify_Query
{
    private $search    = '';

    public function activate()
    {
        add_action( 'pre_get_posts', array( $this, 'pre_get_posts' ) );
    }

    public function pre_get_posts( WP_Query $q )
    {
        if( filter_var( 
                $q->get( 'wpse_search_or_tax_query' ), 
                FILTER_VALIDATE_BOOLEAN 
             ) 
             && $q->get( 'tax_query' ) 
             && $q->get( 's' )
        )
        {                                                           
            add_filter( 'posts_clauses', array( $this, 'posts_clauses' ), 10, 2 );
            add_filter( 'posts_search', array( $this, 'posts_search' ), 10, 2 );
        }
    }

    public function posts_clauses( $clauses, \WP_Query $q )
    {
        remove_filter( current_filter(), array( $this, __FUNCTION__ ) );

        // Generate the tax query:
        $tq = new WP_Tax_Query( $q->query_vars['tax_query'] );

        // Get the generated taxonomy clauses:
        global $wpdb;
        $tc = $tq->get_sql( $wpdb->posts, 'ID' );

        // Remove the search part:
        $clauses['where'] = str_ireplace( 
            $this->search, 
            ' ', 
            $clauses['where'] 
        );

        // Remove the taxonomy part:
        $clauses['where'] = str_ireplace( 
            $tc['where'], 
            ' ', 
            $clauses['where'] 
        );

        // Add the search OR taxonomy part:
        $clauses['where'] .= sprintf( 
            " AND ( ( 1=1 %s ) OR ( 1=1 %s ) ) ", 
            $tc['where'],
            $this->search
        );

        return $clauses;
    }

    public function posts_search( $search, \WP_Query $q )
    {
        remove_filter( current_filter(), array( $this, __FUNCTION__ ) );
        $this->search = $search;
        return $search;
    }

} // end class
