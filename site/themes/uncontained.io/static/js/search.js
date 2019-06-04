var store, lunrIndex, $results;

// Initialize lunrjs using our generated index file
function initLunr(callback) {
  // First retrieve the index file

  $.getJSON("/lunr-index.json")
    .done(function(index) {
      store = index.store;
      lunrIndex = lunr.Index.load(index.index);
      callback();
    })
    .fail(function(jqxhr, textStatus, error) {
      var err = textStatus + ", " + error;
      console.error("Error getting Hugo index flie:", err);
    });
}

// Nothing crazy here, just hook up a listener on the input field
function initUI() {
  $results = $("#results");

  // Run a search if there is a search parameter

  $("#search").keyup(function() {
    $results.find("ul").empty();

    // Only trigger a search when 2 chars. at least have been provided
    var query = $(this).val();
    if (query.length < 2) {
      $results.css("visibility", "hidden");
      return;
    }

    var results = lunrIndex.search(query);

    $results.css("visibility", "visible");
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
    if ($results.attr('class').includes('full')) {
      $result.append($("<p>").html(store[result.ref].summary));
    }
    $results.find("ul").append($result);
  });
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function getUrlParam(parameter, defaultvalue){
    var urlparameter = defaultvalue;
    if(window.location.href.indexOf(parameter) > -1){
        urlparameter = getUrlVars()[parameter];
        }
    return urlparameter;
}

function searchFromParam() {
  if ( getUrlParam('search', 'XXX') != 'XXX') {
    $("#search").val(getUrlParam('search'))
    console.log("User is searching: \n" + getUrlParam('search'))
    var results = lunrIndex.search(getUrlParam('search'));
    renderResults(results);
  }
  console.log("No search param")
}

// Let's get started
initLunr(searchFromParam);

$(document).ready(function() {
  initUI();

});
