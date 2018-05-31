FROM registry.centos.org/centos/centos7-atomic

# Download and install hugo
ENV HUGO_VERSION 0.36.1
ENV HUGO_BINARY hugo_${HUGO_VERSION}_Linux-64bit.tar.gz
ARG HUGO_URL
ENV HUGO_URL https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/${HUGO_BINARY}
ENV HOME /opt/hugo
ENV USER 1001

USER root

COPY . /opt/hugo/

RUN chown -R ${USER} /opt/hugo

ADD ${HUGO_URL} /tmp/
RUN microdnf install tar gzip \
  && tar -zxf /tmp/${HUGO_BINARY} -C /tmp/ \
  && mv /tmp/hugo /bin/hugo \
  && rm -rf /tmp/* \
  && microdnf remove tar gzip \
  && microdnf clean all

COPY ./container-images/hugo/root /

USER ${USER}
WORKDIR ${HOME}

ENTRYPOINT ["/usr/bin/entrypoint"]
