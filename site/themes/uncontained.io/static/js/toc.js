// This is a hack to move the asciidoctor generated Table of Contents.
$(document).ready(function() {
  // Move table of contents to the sidebar
  $('#toc_parent').append($('#toc'));

  // Enable bootstrap scrollspy
  //$('#toc').addClass('navbar navbar-light bg-light')
  $('#toc > ul').addClass('nav');
  $('#toc > ul').find('li').addClass('nav-item');
  $('#toc > ul').find('a').addClass('nav-link');
});
