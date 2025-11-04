import { TREAFIK_DYNAMIC_PATH } from '../utils/remote-server/config';

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
        certResolver: letsencrypt
api:
  insecure: true
certificatesResolvers:
  letsencrypt:
    acme:
      email: test@email.com
      storage: ${TREAFIK_DYNAMIC_PATH}/acme.json
      httpChallenge:
        entryPoint: web`;
};
