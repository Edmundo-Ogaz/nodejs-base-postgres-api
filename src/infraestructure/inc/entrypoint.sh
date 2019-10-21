#!/bin/sh
./consul-template -config src/infraestructure/inc/create-ecosystem.hcl -once -vault-renew-token=false

./consul-template -config src/infraestructure/inc/create-cert.hcl -once -vault-renew-token=false

yarn start:docker
