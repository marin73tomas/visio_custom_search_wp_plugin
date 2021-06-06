<?php
add_shortcode('custom_search_shortcode', 'custom_search_shortcode');
function custom_search_shortcode()
{


?>


    <div class="custom-search-wrapper">
        <div class="featured-wrapper">
            <h2>Featured publications</h2>
            <div class="results-container">
                <div class="lds-ring">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <div class="results-wrapper featured">

                </div>
            </div>
        </div>
        <div class="search-wrapper">
            <div class="box-search">
                <h2 class="search-title">Search by Segment</h2>
                <select name="" id="" class="segment-select">
                    <option value="all">All Segments</option>
                </select>
            </div>
            <div class="box-search">
                <h2 class="search-title">Tissue type</h2>
                <select name="" id="" class="tissue-select">
                    <option value="all">All types</option>
                </select>
            </div>
            <div class="box-search field">
                <h2 class="search-title"></h2>
                <input type="text" class='search-input'>
                <div class="line"></div>
            </div>
        </div>
    </div>
    <div class="results-container">
        <div class="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
        <div class="results-wrapper normal">

        </div>
    </div>
    <div class="load-more-wrapper">
        <a>Load More</a>

    </div>


<?php
}
