# Uncontained.io theme

Based on the [Blank starter theme](http://themes.gohugo.io/theme/blank/)

## Developing

Follow the instructions in [setting up your environment](https://github.com/redhat-cop/uncontained.io/blob/master/CONTRIBUTING.md#setting-up-your-environment) to get up and running with Hugo and the tools we use to build uncontained.io.

In the root of this repository, run `hugo serve -D` to start the Hugo server.

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
