# Contributing to Uncontained.io

Thanks for checking out the uncontained.io guides! We're excited to hear and learn from you. Your experiences will benefit others who read and use these guides.

We've put together the following guidelines to help you figure out where you can best be helpful.

## Table of Contents

0. [Types of contributions we're looking for](#types-of-contributions-were-looking-for)
0. [Ground rules & expectations](#ground-rules--expectations)
0. [How to contribute](#how-to-contribute)
0. [Style guide](#style-guide)
0. [Setting up your environment](#setting-up-your-environment)
0. [Contribution review process](#contribution-review-process)
0. [Community](#community)

## Types of contributions we're looking for
First and foremost, this project is a forum to discuss DevOps technical practices and container automation approaches using Red Hat commercial open source products, then document them in a guide when we've found consensus. Your first contribution might be starting a new conversation, or adding to an existing conversation, around best practices. You can do so under our [GitHub issues](https://github.com/redhat-cop/uncontained.io/issues) or [Trello board cards](https://trello.com/b/JMaxIjCy/cant-contain-this).

There are also many ways you can directly contribute to the guides (in descending order of need):

* Fix editorial inconsistencies, inaccuracies, or stale content
* Add tutorials, examples, or anecdotes that help illustrate a point
* Revise language to be more approachable and friendly
* Propose a new guide ([here's how](./docs/new_guides.md))

Interested in making a contribution? Read on!

## Ground rules & expectations

Before we get started, here are a few things we expect from you (and that you should expect from others):

* Be kind and thoughtful in your conversations around this project. We all come from different backgrounds and projects, which means we likely have different perspectives on "how open source is done." Try to listen to others rather than convince them that your way is correct.
* Uncontained.io guides are released with a [Contributor Code of Conduct](./CODE_OF_CONDUCT.md). By participating in this project, you agree to abide by its terms.
* If you open a pull request, please ensure that your contribution passes all tests. If there are test failures, you will need to address them before we can merge your contribution.
* When adding content, please consider if it is widely valuable. Please don't add references or links to things you or your employer have created as others will do so if they appreciate it.

## How to contribute

If you'd like to contribute, start by searching through the GitHub [issues](https://github.com/redhat-cop/uncontained.io/issues), [pull requests](https://github.com/redhat-cop/uncontained.io/pulls), and Trello  [cards](https://trello.com/b/JMaxIjCy/cant-contain-this) to see whether someone else has raised a similar idea or question.

If you don't see your idea listed, and you think it fits into the goals of this guide, do one of the following:
* **If your contribution is minor,** such as a typo fix, open a pull request.
* **If your contribution is major,** such as a new article or category, start by opening an issue first. That way, other people can weigh in on the discussion before you do any work.

## Style guide

This site is written in asciidoc format and is built using the [Asciidoctor plugin for Jekyll](https://github.com/asciidoctor/jekyll-asciidoc). If you're writing content, see the [style guide](./docs/style_guide.md) to help your prose match the rest of the Guides.

## Setting up your environment

This site is powered by [Jekyll](https://jekyllrb.com/). Running it on your local machine requires a working [Ruby](https://www.ruby-lang.org/en/) installation with [Bundler](http://bundler.io/). We recommend using the docker container method (for obvious reasons) instead of your native operating system, but you may choose either environment setup.  

### Docker QuickStart Guide

1. Clone git repositories
```
git clone https://github.com/redhat-cop/openshift-playbooks.git
```
2. Building the image
```
cd openshift-playbooks/container-images/local-builder
docker build -t redhatcop/jekyll-local-builder:latest .
```
2. Start Site Builder Container
```
cd openshift-playbooks
docker run \
  -u `id -u` -it \
  -v $PWD/:/home/jekyll/src/:Z \
  -p 4000:4000 \
  redhatcop/jekyll-local-builder
```
3. Launch browser and navigate to `http://localhost:4000`

### RHEL/CentOS/Fedora (or derivatives) Quickstart Guide

1. Install necessary packages.
```
sudo yum install -y libyaml-devel autoconf gcc-c++ readline-devel zlib-devel libffi-devel openssl-devel automake libtool bison sqlite-devel
```
2. Install Node.js Version Manager (nvm -- see https://github.com/creationix/nvm)
```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.29.0/install.sh | bash
```
3. [Install RVM](https://rvm.io/)
```
NOTE: For `gnome-terminal` users, you'll need to do this [additional step](https://rvm.io/integration/gnome-terminal)
```
4. Install and use Ruby 2.4
```
rvm install 2.4.0
rvm use 2.4.0
```
5. Install and set up RubyGems
```
rvm rubygems latest
```
6. Install bundler
```
gem install bundler
```
7. Install project dependencies
```
bundle install
```
8. Build site source
```
bundle exec jekyll build
```
9. Run local Jekyll server to view site
```
bundle exec jekyll serve
```
10. Launch browser and navigate to `http://localhost:4000`


### Other OSs / Mac / Windows Quickstart Guide

1. Install and configure Ruby with Bundler for your operating system
2. Once you have that set up, run:

```
  script/bootstrap
  script/server
```

…and open `http://localhost:4000` in your web browser.

## Contribution review process

This repo is currently maintained by @jaredburck, @etsauer, and @sabre1041, who have commit access. They will likely review your contribution. If you haven't heard from anyone in 10 days, feel free to bump the thread or @-mention a maintainer or `@redhat-cop/cant-contain-this` to review your contribution.

## Community

Discussions about uncontained.io takes place within this repository's [Issues](https://github.com/redhat-cop/uncontained.io/issues) and [Pull Requests](https://github.com/redhat-cop/uncontained.io/pulls) sections and Trello's [Cant-Contain-This](https://trello.com/b/JMaxIjCy/cant-contain-this) board. Red Hatter's can also find us on RocketChat's #cant-contain-this channel. Anybody is welcome to join these conversations. There is also a [mailing list](http://uncontained.io/) for regular updates.

Wherever possible, do not take these conversations to private channels, including contacting the maintainers directly. Keeping communication public means everybody can benefit and learn from the conversation.
