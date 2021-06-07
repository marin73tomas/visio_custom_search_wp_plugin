



function truncate(input) {
  if (input.length > 5) {
    return input.substring(0, 5) + "...";
  }
  return input;
}
function termsArrayToHtml(data, type = "types") {
  if (data){
  return (
    `<option value="all">All ${type}</option>` +
    data
      .map(
        (item) =>
          `<option class='kw-option-${item.term_id}' value='${item.name}' >${item.name} </option>`
      )
      .join("")
  );
      }
}
async function setLists(segmentSelect,tissueSelect){
  const item = await getKnowledgeResults(null,null,'all','all',true)
  if (item){
    
  segmentSelect.innerHTML = termsArrayToHtml(item.segment_list);
  tissueSelect.innerHTML = termsArrayToHtml(item.tissue_list);
  }
}
async function getKnowledgeFeatured(type, page) {
  const headers = new Headers({
    "Content-Type": "application/json",
    "X-WP-Nonce": ajax_var.nonce,
  });

  const response = await fetch(
    `${ajax_var.url}?type=${type}&page=${page}&category=featured`,
    {
      headers,
      credentials: "same-origin",
    }
  );
  const data = await response.json();
  return data;
}
async function getKnowledgeResultsSearch(type, page, searchText) {
  const headers = new Headers({
    "Content-Type": "application/json",
    "X-WP-Nonce": ajax_var.nonce,
  });
  console.log(`${ajax_var.url}?type=${type}&page=${page}&search=${searchText}`);
  const response = await fetch(
    `${ajax_var.url}?type=${type}&page=${page}&search=${searchText}`,
    {
      headers,
      credentials: "same-origin",
    }
  );
  const data = await response.json();
  return data;
}
async function getKnowledgeResults(
  type,
  page,
  segmentType = "all",
  tissueType = "all",
  list = false
) {
  const headers = new Headers({
    "Content-Type": "application/json",
    "X-WP-Nonce": ajax_var.nonce,
  });
  const url = list ? `${ajax_var.url}?get_list=true` : `${ajax_var.url}?type=${type}&page=${page}`

  const response = await fetch(url, {
    headers,
    credentials: "same-origin",
  });
  const data = await response.json();

  if (segmentType != "all")
    return data.filter((item) => {
      console.log(item.segment_types && item.segment_types.map((e) => e.name));
      if (
        item.segment_types &&
        item.segment_types.map((e) => e.name).includes(segmentType)
      )
        return true;
      return false;
    });
  if (tissueType != "all")
    return data.filter((item) => {
      if (
        item.tissue_types &&
        item.tissue_types.map((e) => e.name).includes(tissueType)
      )
        return true;
      return false;
    });
  return data;
}
async function addResults(
  array,
  wrapper,
  segmentSelect,
  tissueSelect,
  
  replace = false,
  thenloadMore = false
) {
  let loadMore = true;
  if (replace) wrapper.innerHTML = "";
  if (array.length) {
    for (let item of array) {
      let cardWrapper = document.createElement("a");
      cardWrapper.href = item.link;
      let card = document.createElement("div");
      card.className = `kw-card-container ${item.id}`;
      let cardThumb = document.createElement("img");
      cardThumb.src = item.thumbnail;
      let cardTitle = document.createElement("h3");
      cardTitle.innerHTML = item.title;
      let cardContent = document.createElement("div");
      cardContent.className = "kw-content-wrapper";
      cardContent.innerHTML = `${item.content.substring(0,254)}${item.content.length > 255 ? '...' : ''}`
      let cardBelowImg = document.createElement("p");
      cardBelowImg.className = "kw-below-img";
    
      if (item.product_types)
        cardBelowImg.innerHTML = item.product_types
          .map((e) => e.name)
          .join(" ");
      let cardFooter = document.createElement("div");
      cardFooter.className = "kw-footer-wrapper";
      let cardDate = document.createElement("p");
      cardDate.innerHTML = item.date;
      let cardJournal = document.createElement("p");
      cardJournal.innerHTML = item.journal;
      cardFooter.append(cardDate, cardJournal);
      card.append(cardBelowImg, cardTitle, cardContent, cardFooter);
      cardWrapper.append(cardThumb, card);
      wrapper.appendChild(cardWrapper);
      
       
       
      
      loadMore = item.loadmore;
    }
  } else {
    if (thenloadMore == false)
      wrapper.innerHTML = "<h3 class='no-results'>No results found</h3>";
  }
 
}
jQuery(document).ready(async function ($) {
  const resultsWrapper = document.querySelector(".results-wrapper.normal");
  const resultsWrapperF = document.querySelector(".results-wrapper.featured");
  currentPage = 1;
  segmentType = "all";
  tissueType = "all";

  current = null;
  const segmentSelect = document.querySelector("select.segment-select");
  const tissueSelect = document.querySelector(".tissue-select");
  const searchInput = document.querySelector("input.search-input");
  const loader = document.querySelector(".lds-ring");
  setLists(segmentSelect,tissueSelect)
  if (resultsWrapper) {
    await getKnowledgeFeatured("publications", currentPage).then((data) =>
      addResults(data, resultsWrapperF, segmentSelect, tissueSelect)
    );
    await getKnowledgeResults("publications", currentPage).then((data) =>
      addResults(data, resultsWrapper, segmentSelect, tissueSelect)
    );

    const loadMore = document.querySelector(".load-more-wrapper a");
    loadMore.addEventListener("click", async function () {
      if (current == "search") {
        await getKnowledgeResultsSearch(
          "publications",
          ++currentPage,
          searchInput.value
        ).then((data) => {
          addResults(
            data,
            resultsWrapper,
            segmentSelect,
            tissueSelect,
            false,
            true
          );
          if (!data.length){ loadMore.style.display = "none";
	const noMore = document.createElement('h3')
	noMore.innerHTML = "No more results found"
	noMore.className = 'nomore'
 	resultsWrapper.appendChild(noMore)
						   }
        });
      } else if (current == "type") {
        const data = await getKnowledgeResults(
          "publications",
          ++currentPage,
          segmentType,
          tissueType
        ).then((data) => {
          addResults(
            data,
            resultsWrapper,
            segmentSelect,
            tissueSelect,
            false,
            true
          );
          if (!data.length){ loadMore.style.display = "none";
	const noMore = document.createElement('h3')
	noMore.innerHTML = "No more results found"
	noMore.className = 'nomore'
 	resultsWrapper.appendChild(noMore)
						   }
        });
      } else {
        const data = await getKnowledgeResults(
          "publications",
          ++currentPage
        ).then((data) => {
          if (!data.length){ loadMore.style.display = "none";
	const noMore = document.createElement('h3')
	noMore.innerHTML = "No more results found"
	noMore.className = 'nomore'
 	resultsWrapper.appendChild(noMore)
						   }
          addResults(
            data,
            resultsWrapper,
            segmentSelect,
            tissueSelect,
            false,
            true
          );
        });
      }
    });

    segmentSelect.onchange = async function (e) {
      loader.style.display = "flex";
      resultsWrapper.style.opacity = 0.5;
      loadMore.style.display = "block";
      tissueSelect.selectedIndex = 0;
      searchInput.value = "";
      const selection = this.options[this.selectedIndex].text;
      currentPage = 1;
      segmentType = selection;
      tissueType = "all";
      current = "type";
      if (this.selectedIndex == 0) segmentType = "all";

      const data = await getKnowledgeResults(
        "publications",
        currentPage,
        segmentType,
        tissueType
      ).then((data) => {
        addResults(data, resultsWrapper, segmentSelect, tissueSelect, true);
        if (!data.length){ loadMore.style.display = "none";
	const noMore = document.createElement('h3')
	noMore.innerHTML = "No more results found"
	noMore.className = 'nomore'
 	resultsWrapper.appendChild(noMore)
						   }
      });
      loader.style.display = "none";
      resultsWrapper.style.opacity = 1;
    };
    tissueSelect.onchange = async function (e) {
      loader.style.display = "flex";
      resultsWrapper.style.opacity = 0.5;
      loadMore.style.display = "block";
      segmentSelect.selectedIndex = 0;
      searchInput.value = "";
      const selection = this.options[this.selectedIndex].text;
      currentPage = 1;
      tissueType = selection;
      segmentType = "all";
      current = "type";
      if (this.selectedIndex == 0) tissueType = "all";
      const data = await getKnowledgeResults(
        "publications",
        currentPage,
        segmentType,
        tissueType
      ).then((data) => {
        addResults(data, resultsWrapper, segmentSelect, tissueSelect, true);
       if (!data.length){ loadMore.style.display = "none";
	const noMore = document.createElement('h3')
	noMore.innerHTML = "No more results found"
	noMore.className = 'nomore'
 	resultsWrapper.appendChild(noMore)
						   }
      });
      loader.style.display = "none";
      resultsWrapper.style.opacity = 1;
    };
    // Init a timeout variable to be used below
    let timeout = null;
    searchInput.onkeyup = async function () {
      clearTimeout(timeout);

      // Make a new timeout set to go off in 1000ms (1 second)
      timeout = setTimeout(async function () {
        loader.style.display = "flex";
        resultsWrapper.style.opacity = 0.5;
        loadMore.style.display = "block";
        segmentSelect.selectedIndex = 0;
        segmentType = "all";
        tissueType = "all";
        current = "search";
        tissueSelect.selectedIndex = 0;
        await getKnowledgeResultsSearch(
          "publications",
          1,
          searchInput.value
        ).then((data) => {
          console.log(data);
          addResults(data, resultsWrapper, segmentSelect, tissueSelect, true);
          if (!data.length){ loadMore.style.display = "none";
	const noMore = document.createElement('h3')
	noMore.innerHTML = "No more results found"
	noMore.className = 'nomore'
 	resultsWrapper.appendChild(noMore)
						   }
        });
        loader.style.display = "none";
        resultsWrapper.style.opacity = 1;
      }, 1000);
    };
  }
});
