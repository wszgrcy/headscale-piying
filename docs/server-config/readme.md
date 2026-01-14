# Headscale-Piying `traefik` Deployment Guide

## Overview

This guide explains how to deploy the `headscale-piying` service using Docker Compose and expose it via `traefik` with reverse proxying and HTTPS encryption.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed
- `traefik` already deployed (on an external network named `traefik`)
- Certificate resolver (`letsenc`) configured and enabled
- A registered domain name (e.g., `your.web.site`)
- Copy configuration files from server-config to their respective locations

## Step 1: Start the Headscale-Piying Container

- Copy `docker/docker-compose.yml` to your server and navigate to the directory
- Run: `docker-compose up -d`

## Step 2: Deploy `traefik` Dynamic Configuration

### Modify `traefik/headscale-piying.yml`

- Replace `your.web.site` with your actual domain
- Update `https://your.web.site:4443/` to match the port configured in `headscale`
  > The listening address can be found in the `headscale` config file:

```yml
listen_addr: 0.0.0.0:4443
```

- Update the certificate resolver name `letsenc` to match your Traefik configuration
  > You can find this in your Traefik static configuration:

```yml
certificatesResolvers:
  letsenc:
    acme:
      email: aaa@bbb.com
      storage: /cert/acme.json
      keyType: RSA2048
      httpChallenge:
        entryPoint: web
```

### Move the File

- Copy the modified `traefik/headscale-piying.yml` file into Traefik’s mounted dynamic configuration directory
  > The mount path is defined in your Traefik container configuration:

```yml
volumes:
  # Dynamic config mount point
  - ./dynamic:/dynamic
```
