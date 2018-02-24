# uncontained.io

## Developing

Uncontained.io is built with Hugo and the Minimo theme. To run it locally:

1. Check out this repo.
1. [Install Hugo](https://gohugo.io/getting-started/installing/).
1. [Install Asciidoctor](https://asciidoctor.org/docs/install-toolchain/)
1. Run git submodule update --init --recursive to download the theme.
1. Navigate to the top level of the repo.
1. Run `hugo server` to run the site locally.

Alternately, you can run `hugo server -D` to preview drafts.

## Migrating Content from OpenShift Playbooks

A migration script can be used to translate documents from the openshift-playbooks repo.

Usage:
```
./migrate-doc.sh [path/playbook-doc] [path/uncontained-doc]
```

Example:
```
./migrate-doc.sh continuous_delivery/external-jenkins-integration.adoc guides/external-jenkins-integration.adoc
```
