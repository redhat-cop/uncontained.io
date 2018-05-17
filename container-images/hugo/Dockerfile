FROM centos

# Download and install hugo
ENV HUGO_VERSION 0.25.1
ENV HUGO_BINARY hugo_${HUGO_VERSION}_Linux-64bit.tar.gz
ARG HUGO_URL
ENV HUGO_URL https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/${HUGO_BINARY}
ENV HOME /opt/hugo
ENV USER 1001

USER root

ADD . /opt/hugo/

RUN chown -R ${USER} /opt/hugo

RUN curl -sLo /tmp/hugo.tar.gz ${HUGO_URL} \
  && tar zxf /tmp/hugo.tar.gz \
  && mv hugo /bin/hugo

ADD ./container-images/hugo/root /

USER ${USER}
WORKDIR ${HOME}

ENTRYPOINT ["/usr/bin/entrypoint"]
