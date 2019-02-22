FROM ruby:2.5.1

ENV NODE_VERSION v10.15.1
ENV PATH /node/node-${NODE_VERSION}-linux-x64/bin:${PATH}
ENV HOME /uncontained.io

WORKDIR /uncontained.io

COPY . .
COPY container-images/local-builder/root /

RUN mkdir -p /node && \
  curl -o /node/node.tar.xz https://nodejs.org/dist/${NODE_VERSION}/node-${NODE_VERSION}-linux-x64.tar.xz && \
  tar -xf /node/node.tar.xz --directory=/node

RUN /usr/local/bin/user_setup

RUN bundle install

USER 1001

ENTRYPOINT ["entrypoint"]
