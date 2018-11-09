import blc from "broken-link-checker";
import chalk from "chalk";
import humanizeDuration from "humanize-duration";

function linkChecker() {
  this.run = run;
}

function run(siteUrl, options) {

  var handlers,instance;

  var data =
  {
    delay: null,
    page: {},
    total:
    {
      brokenLinks: 0,
      excludedLinks: 0,
      links: 0,
      pages: 0,
      startTime: Date.now()
    }
  };

  handlers =
  {
    html: function(tree, robots, response, pageUrl)
    {
      resetPageData(data);

      logPage(data, pageUrl);
    },
    junk: function(result)
    {

      data.page.totalLinks++;
      data.total.links++;

      pushResult(data, result);

      logResults_delayed(data);
    },
    link: function(result)
    {
      // Exclude cached links only if not broken
      if (result.broken===false && result.http.cached===true)
      {
        result.__cli_excluded = true;

        data.page.excludedLinks++;
        data.total.excludedLinks++;
      }
      else if (result.broken === true)
      {
        data.page.brokenLinks++;
        data.total.brokenLinks++;
      }

      data.page.totalLinks++;
      data.total.links++;

      pushResult(data, result);

      logResults_delayed(data);
    },
    page: function(error, pageUrl)
    {
      if (error != null)
      {
        // "html" handler will not have been called
        logPage(data, pageUrl);

        console.log( chalk[ error.code!==200 ? "red" : "gray" ](error.name+": "+error.message) );
      }
      else
      {
        data.page.done = true;

        logMetrics_delayed(data.page.brokenLinks, data.page.excludedLinks, data.page.totalLinks);
      }
    },
    end: function()
    {
      if (data.total.pages <= 0)
      {
        process.exit(1);
      }
      else if (data.total.pages === 1)
      {
        process.exit(data.page.done===true && data.total.brokenLinks===0 ? 0 : 1);
      }
      else if (data.total.pages > 1)
      {
        logMetrics_delayed(data.total.brokenLinks, data.total.excludedLinks, data.total.links, Date.now()-data.total.startTime, true, true);
      }
    }
  };

  var siteChecker = new blc.SiteChecker(options, handlers);

  siteChecker.enqueue(siteUrl, data);

}

function resetPageData(data)
{
	data.page.brokenLinks = 0;
	data.page.currentIndex = 0;
	data.page.done = false;
	data.page.excludedLinks = 0;
	data.page.results = [];
	//data.page.startTime = Date.now();
	data.page.totalLinks = 0;
}

function logPage(data, pageUrl)
{
	var output = "";

	if (++data.total.pages > 1) output += "\n";

	output += "Getting links from: " + pageUrl;

	console.log(output);
}

/*
	Logs links in the order that they are found in their containing HTML
	document, even if later links receive an earlier response.
*/
function logResults(data)
{
	var done,output,result;
	var nextIsReady = true;

	while (nextIsReady)
	{
		result = data.page.results[data.page.currentIndex];

		if (result !== undefined)
		{
			done = data.page.done===true && data.page.currentIndex>=data.page.results.length-1;

			output = logResult(result, done);

			if (output !== "") console.log(output);
			if (done === true) return;

			data.page.currentIndex++;
		}
		else
		{
			nextIsReady = false;
		}
	}
}

function logResult(result, finalResult)
{
	var output = "";

	if (result.__cli_excluded !== true)
	{
		// TODO :: if later results are skipped, the last RENDERED result will not be "└─"
		output = chalk.gray(finalResult!==true ? "├─" : "└─" );

		if (result.broken === true)
		{
			output += chalk.red("BROKEN");
			output += chalk.gray("─ ");
		}
		else if (result.excluded === true)
		{
			output += chalk.gray("─SKIP── ");
		}
		else
		{
			output += chalk.gray("──");
			output += chalk.green("OK");
			output += chalk.gray("─── ");
		}

		if (result.url.resolved != null)
		{
			output += chalk.yellow( result.url.resolved );
		}
		else
		{
			// Excluded scheme
			output += chalk.yellow( result.url.original );
		}

		if (result.broken === true)
		{
			output += chalk.gray(" ("+ result.brokenReason +")");
		}
		else if (result.excluded === true)
		{
			output += chalk.gray(" ("+ result.excludedReason +")");
		}
		// Don't display cached message if broken/excluded message is displayed
		else if (result.http.cached === true)
		{
			output += chalk.gray(" (CACHED)");
		}
	}

	return output;
}


/*
	Ensure that `logResults()` is called after `data.page.done=true`.
*/
function logResults_delayed(data)
{
	// Avoid more than one delay via multiple synchronous iterations
	if (data.delay === null)
	{
		data.delay = setImmediate( function()
		{
			logResults(data);
			data.delay = null;
		});
	}
}

function pushResult(data, result)
{
		data.page.results.push(result);
}

function logMetrics(brokenLinks, excludedLinks, totalLinks, duration, preBreak, exit)
{
	var output = preBreak===true ? "\n" : "";

	output += chalk.gray("Finished! "+totalLinks+" links found.");

	if (excludedLinks > 0)
	{
		output += chalk.gray(" "+excludedLinks+" excluded.");
	}

	if (totalLinks > 0)
	{
		output += chalk.gray(" ");
		output += chalk[ brokenLinks>0 ? "red" : "green" ](brokenLinks+" broken");
		output += chalk.gray(".");
	}

	if (duration != null)
	{
		output += chalk.gray("\nElapsed time: ");
		output += chalk.gray( humanizeDuration(duration, {round:true, largest:2}) );
	}

	console.log(output);

	if (exit === true)
	{
		process.exit(brokenLinks===0 ? 0 : 1);
	}
}

/*
	Ensure that `logMetrics()` is called after `logResults_delayed()`.
*/
function logMetrics_delayed(brokenLinks, excludedLinks, totalLinks, duration, preBreak, exit)
{
	setImmediate( function()
	{
		logMetrics(brokenLinks, excludedLinks, totalLinks, duration, preBreak, exit);
	});
}

module.exports = linkChecker;
