# Uncontained.io theme

Based on the [Blank starter theme](http://themes.gohugo.io/theme/blank/)

## Developing

Follow the instructions in [setting up your environment](https://github.com/redhat-cop/uncontained.io/blob/master/CONTRIBUTING.md#setting-up-your-environment) to get up and running with Hugo and the tools we use to build uncontained.io.

In the root of this repository, run `hugo serve -D --noHTTPCache` to start the Hugo server.

Then, go to `themes/uncontained.io` and run these commands:
```
npm install
npm run watch
```

Now, when you edit a file in `src`, the following will happen:

1. Gulp will see that a file has changed
2. Gulp will compile the source files and output the results to `static/dist`
3. Hugo will see that files in `static` have changed
4. Hugo will auto-reload the page in your browser.

## Building

To build the site:
```
cd themes/uncontained.io
npm run build
cd ../..
hugo
```

## CSS Framework

We are using a pared-down version of [Bootstrap 4](https://getbootstrap.com/), customized as per the [theming instructions](https://getbootstrap.com/docs/4.0/getting-started/theming/). We've left out parts of Bootstrap CSS and all of Bootstrap JS. To see which Bootstrap modules we're using, see `style.scss`. To see all of the Bootstrap modules that exist, see [bootstrap.scss](https://github.com/twbs/bootstrap/blob/v4-dev/scss/bootstrap.scss).

## Sass/CSS Code Standards

In lieu of formal code standards, here are some general guidelines:

- Minimize selector specificity.
- Use simple, meaningful CSS class names. Use only lowercase letters and dashes (no underscores, double dashes, etc.).
- Use variables for colors and font names.
- Prefer removing styles to overriding them.
- Prefer configuring the framework to overriding it.

### Resources

- [Bootstrap - Approach](https://getbootstrap.com/docs/4.1/extend/approach/)
- [Stop the Cascade](http://markdotto.com/2012/03/02/stop-the-cascade/)
- [STAT's Sass/CSS style guide](https://github.com/statnews/boilermaker/blob/master/sass.md)
