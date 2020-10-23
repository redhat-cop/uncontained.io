FROM registry.access.redhat.com/ubi8-minimal

ENV NODE_VERSION v10.15.1
ENV PATH /node/node-${NODE_VERSION}-linux-x64/bin:${PATH}
ENV HOME /uncontained.io
ENV USER_UID 1001

WORKDIR /uncontained.io

RUN microdnf update &&\
  microdnf -y install tar git xz ruby rubygem-bundler && \
  mkdir -p /node && \
  curl -o /node/node.tar.xz https://nodejs.org/dist/${NODE_VERSION}/node-${NODE_VERSION}-linux-x64.tar.xz && \
  tar -xf /node/node.tar.xz --directory=/node

COPY . ${HOME}
COPY container-images/local-dev/root /

RUN /usr/local/bin/user_setup && \
  bundle install

USER ${USER_UID}
EXPOSE 8080

ENTRYPOINT ["entrypoint"]
