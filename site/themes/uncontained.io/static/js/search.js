var store, lunrIndex, $results;

// Initialize lunrjs using our generated index file
function initLunr() {
  // First retrieve the index file

  $.getJSON("/lunr-index.json")
    .done(function(index) {
      store = index.store;
      lunrIndex = lunr.Index.load(index.index);
    })
    .fail(function(jqxhr, textStatus, error) {
      var err = textStatus + ", " + error;
      console.error("Error getting Hugo index flie:", err);
    });
}

// Nothing crazy here, just hook up a listener on the input field
function initUI() {
  $results = $("#results");
  $("#search").keyup(function() {
    $results.empty();

    // Only trigger a search when 2 chars. at least have been provided
    var query = $(this).val();
    if (query.length < 2) {
      return;
    }

    var results = lunrIndex.search(query);

    renderResults(results);
  });
}

/**
 * Display the 10 first results
 *
 * @param  {Array} results to display
 */
function renderResults(results) {
  if (!results.length) {
    return;
  }

  // Only show the ten first results
  results.slice(0, 20).forEach(function(result) {
    var $result = $("<li>");
    $result.append(
      $("<a>", {
        href: result.ref,
        text: store[result.ref].title
      })
    );
    $result.append($("<p>").html(store[result.ref].summary));
    $results.append($result);
  });
}

// Let's get started
initLunr();

$(document).ready(function() {
  initUI();
});
