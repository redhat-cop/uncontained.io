FROM centos/ruby-24-centos7

ENV RUBY_PACKER_BIN http://enclose.io/rubyc/rubyc-linux-x64.gz
ENV INSTALL_PKGS "squashfs-tools bison"

USER root

# Will use ruby-packer (https://github.com/pmq20/ruby-packer) to generate binary
RUN yum install -y ${INSTALL_PKGS} && \
  curl -sL ${RUBY_PACKER_BIN} | gunzip > /usr/bin/rubyc && \
  chmod +x /usr/bin/rubyc

ADD bin/assemble /usr/bin/assemble

CMD ["/usr/bin/assemble"]
