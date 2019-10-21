FROM [REGISTRY]/[IMAGE]:TAG

COPY . .

COPY --chown=node:node src/infraestructure src/infraestructure

ADD --chown=node:node "https://releases.hashicorp.com/consul-template/0.19.4/consul-template_0.19.4_linux_amd64.tgz" /

RUN sudo apk --update --no-cache add curl && \
  yarn && \
  tar zxf /consul-template_0.19.4_linux_amd64.tgz

ENTRYPOINT [ "src/infraestructure/inc/entrypoint.sh" ]
