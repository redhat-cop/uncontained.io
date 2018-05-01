PLAYBOOKS_SITE=~/src/openshift-playbooks/playbooks/
UNCONTAINED_SITE=~/src/uncontained.io/content/
PLAYBOOK=${1}
DOC=${2}

# Grab content from existing playbook
content="$(cat ${PLAYBOOKS_SITE}${PLAYBOOK})"

# Strip existing frontmatter
content=$(echo "${content}" | sed -n '/^= .*/,$p')

# Do some reformatting of content
content=$(echo "${content}" | sed 's/include::..\/..\/_includes\/variables.adoc\[\]/include::layouts\/variables.adoc\[\]/')
# TODO: Reformat anchor tags.
# Old format: link:#syncing-images-using-satellite-6
# new format: link:#_syncing_images_using-satellite-6
# regex: link:#[a-z0-9]+[a-z-]*[a-z0-9]+
anchors=$(echo "${content}" | grep -o 'link:#[a-z0-9-]*')

for anchor in ${anchors}; do
  content=$(echo "${content}" | sed "s/${anchor}/${anchor//-/_}/g")
done
content=${content//link:#/link:#_}

# Create uncontained doc
rm -f ${UNCONTAINED_SITE}${DOC}
hugo new ${DOC}

# Grab frontmatter and combine with content
frontmatter=$(cat ${UNCONTAINED_SITE}${DOC})
frontmatter=$(echo "${frontmatter}" | sed "s/draft: true/draft: false/")
cat > ${UNCONTAINED_SITE}${DOC} <<zz_uncontained_content
${frontmatter}
${content}
zz_uncontained_content
