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
This project is an attempt at establish and document some guiding principles and, dare we say it, best practices in the open source emerging technology space. Currently that space, as we see it, is predominantly made up of technologies that enable DevOps practices, such as "Cloud" (API-automated Infrastructure), CI/CD tooling, container technologies, microservices frameworks, and probably more. This project was started by a community of thought leaders from Red Hat so if it initially appears as if this site is only about Red Hat technologies, it's not intended to be, its just impassioned people writing about what they know.

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

This site is powered by [Hugo](https://gohugo.io/). Running it on your local machine only requires a working [Hugo](https://gohugo.io/getting-started/installing) installation, either natively or a docker container. We recommend using the docker container method (for obvious reasons) instead of your native operating system, but you may choose either environment setup.

### Containerized Hugo Environment QuickStart Guide

Uncontained.io is built with Hugo and the Minimo theme. To run it in a container:

1. Clone git repository
```
git clone https://github.com/redhat-cop/uncontained.io.git
```
2. Start Site Builder Container
```
cd uncontained.io
docker run \
  -u `id -u` -it \
  -v ${PWD}:/opt/hugo:z \
  -p 1313:1313 \
  redhatcop/hugo serve --bind 0.0.0.0
```
3. Launch browser and navigate to `http://localhost:1313`

For more info about the container image, see the link:container-images/hugo/[hugo image doc].

### Installing Asciidoc and Asciidoctor on native OS

<b>Fedora / RHEL</b>

`Asciidoc` is installed through the standard repos. `Asciidoctor` can be installed using the gem command.

```
yum install asciidoc
gem install asciidoctor
```

<b>Mac OS</b>

`Asciidoc` and `Asciidoctor` can be installed easily using Homebrew.

```
brew install asciidoc
brew install asciidoctor
```

For more detailed installation information, visit the following installation guides:

- [Asciidoc](http://asciidoc.org/INSTALL.html)
- [Asciidoctor](http://asciidoctor.org/docs/install-toolchain/)


### Installing Hugo on native OS

The best guide for [installing Hugo](https://gohugo.io/getting-started/installing/) is on their website.


### Native Hugo Environment QuickStart Guide

Uncontained.io is built with Hugo and the Minimo theme. To run it locally:

1. Clone git repository
```
git clone https://github.com/redhat-cop/uncontained.io.git
```
2. Navigate to the top level of the repository
```
cd uncontained.io.git
```
3. Run the site locally
```
hugo server
```
Alternately, add the `-D` switch to preview drafts
```
hugo server -D
```

### Migrating Content from OpenShift-Playbooks

A migration script can be used to translate documents from the `openshift-playbooks` repo.

Usage:
```
./migrate-doc.sh [path/playbook-doc] [path/uncontained-doc]
```

Example:
```
./migrate-doc.sh continuous_delivery/external-jenkins-integration.adoc guides/external-jenkins-integration.adoc
```

## Contribution review process

This repo is currently maintained by @jaredburck, @etsauer, and @sabre1041, who have commit access. They will likely review your contribution. If you haven't heard from anyone in 10 days, feel free to bump the thread or @-mention a maintainer or `@redhat-cop/cant-contain-this` to review your contribution.

## Community

Discussions about uncontained.io takes place within this repository's [Issues](https://github.com/redhat-cop/uncontained.io/issues) and [Pull Requests](https://github.com/redhat-cop/uncontained.io/pulls) sections and Trello's [Cant-Contain-This](https://trello.com/b/JMaxIjCy/cant-contain-this) board. Red Hatter's can also find us on RocketChat's #cant-contain-this channel. Anybody is welcome to join these conversations. There is also a [mailing list](http://uncontained.io/) for regular updates.

Wherever possible, do not take these conversations to private channels, including contacting the maintainers directly. Keeping communication public means everybody can benefit and learn from the conversation.
