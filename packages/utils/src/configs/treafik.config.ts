import {
    TRAEFIK_ACME_EMAIL,
    TRAEFIK_CERT_RESOLVER,
    TREAFIK_DYNAMIC_PATH,
} from './config';

export const getTraefikConfig = () => {
    return `global:
  sendAnonymousUsage: false
providers:
  swarm:
    exposedByDefault: false
    watch: true
  docker:
    exposedByDefault: false
    watch: true
  file:
    directory: ${TREAFIK_DYNAMIC_PATH}
    watch: true
entryPoints:
  web:
    address: :80
  websecure:
    address: :443
    http3:
      advertisedPort: 443
    http:
      tls:
        certResolver: ${TRAEFIK_CERT_RESOLVER}
api:
  insecure: true
certificatesResolvers:
  ${TRAEFIK_CERT_RESOLVER}:
    acme:
      email: ${TRAEFIK_ACME_EMAIL}
      storage: ${TREAFIK_DYNAMIC_PATH}/acme.json
      httpChallenge:
        entryPoint: web`;
};
