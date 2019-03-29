FROM ruby:2.5.3-slim

ENV NODE_VERSION v10.15.1
ENV PATH /node/node-${NODE_VERSION}-linux-x64/bin:${PATH}
ENV HOME /uncontained.io
ENV USER_UID 1001

WORKDIR /uncontained.io

COPY . .
COPY container-images/local-dev/root /

RUN apt-get update &&\
  apt-get -y install curl tar xz-utils && \
  mkdir -p /node && \
  curl -o /node/node.tar.xz https://nodejs.org/dist/${NODE_VERSION}/node-${NODE_VERSION}-linux-x64.tar.xz && \
  tar -xf /node/node.tar.xz --directory=/node && \
  /usr/local/bin/user_setup && \
  bundle install

USER ${USER_UID}

ENTRYPOINT ["entrypoint"]
