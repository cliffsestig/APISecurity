FROM semrekkers/caddy-node

LABEL maintainer "Sem Rekkers <rekkers.sem@gmail.com>"

WORKDIR /var/app
COPY . /var/app
RUN [ "config/build.sh" ]

ENTRYPOINT [ "config/run.sh" ]