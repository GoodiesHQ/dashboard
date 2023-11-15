# dashboard
A simple dashboard for displaying commonly used applications, links, and bookmarks.

## Environment Variables
#### Runtime:
- `DASHBOARD_CONFIG=/config/dashboard.yml` is a variable which points to the YML configuration file.
- `DASHBOARD_CACHE_TTL=60000` is the time (in ms) that the configuration is cached within the web server (default: 60 seconds) until it is re-read and the icon data is re-gathered.
#### Build-time:
- `DASHBOARD_INSTALL_ICONS=0` if set to `1`, it will install the `@iconify/json` package which contains all of the icon sets in JSON format, removing the need for the Iconify public API.

## Configuration
`dashboard` is driven by a single YAML configuration file. The YAML configuration should look something like:

```yml
title: My Custom Dashboard            # Optional (Default: 'Dashboard')
datetime: '%A, %b %d %Y %I:%M:%S %p'  # Optional (Default: empty, no time displayed)
apps:                                 # A list of application objects
  - name: Google                      # Required
    icon: google                      # Required (if no family is provided, mdi is assumed)
    url: https://google.com           # Required
    url_display: google.com           # Optional (Default: extract hostname from `url`)
    category: search-engine           # Optional (Default: 'uncategorized')
    tab: true                         # Optional (Default: false) - Opens URL in a new tab
  - name: Bing                        # 2nd entry
    icon: bi:bing                     # (this icon uses bi/bootstrap icon family)
    url: https://bing.com
    category: search-engine
    tab: true
  - name: Facebook
    icon: basil:facebook-solid
    url: https://facebook.com
    category: social-media
    tab: true
bookmarks:
  - name: Github
    url: https://github.com
    category: development
    tab: true
  - name: MSDN Reference
    url: https://learn.microsoft.com/en-us/windows/win32/api/            
    category: development
    tab: true
  - name: Docker Hub
    url: https://hub.docker.com
    category: development
    tab: true
  - name: CBS News
    url: https://www.cbsnews.com/
    category: news
    tab: true
  - name: NBC News
    url: https://www.nbcnews.com/
    category: news
    tab: true
  - name: Netflix
    url: https://www.netflix.com/
    category: streaming
    tab: true
  - name: Hulu
    url: https://www.hulu.com/
    category: streaming
    tab: true
  - name: Peacock
    url: https://www.peacocktv.com
    category: streaming
    tab: true
```

This example configuration yields the following page:
<img width="995" alt="image" src="https://github.com/GoodiesHQ/dashboard/assets/4576046/4e8710e4-ef9d-4f19-b7d6-d1ea5c0d5473">

## Icons
`dashboard` uses [Iconify](https://icon-sets.iconify.design/) for its icons. This is made of of two parts:
```
<icon family>:<icon name> (e.g. "mdi:google" or "bi:bing")
```
If no icon family is provided, then `mdi:` will be used as the default. Note that the `@iconify/svelte` package and its `<Icon>` component require javascript to load the icon if you are using the public API. For those that want icons to load on browsers without javascript, or who want to provide the icons directly for any reason, the package `@iconify/json` must be installed. I have provided docker containers built with this.

## Docker
`dashboard` is ran as a single NodeJS service. There are two docker tags that may be of use:
- `goodieshq/dashboard:latest` (~200MB) uses an image built without icons. This service requires javascript to be enabled on client browsers.
- `goodieshq/dashboard:icons-latest` (~600MB) uses an image built with all icon libraries. This service works with or without javascript enabled on client browsers.

## Docker Compose
An example docker-compose service might look something like this:
```
version: "3.9"

services:
  dashboard:
    image: goodieshq/dashboard:icons-latest
    container_name: dashboard
    restart: unless-stopped
    env_file:
      - ./env/dashboard.env
    volumes:
      - ./config/dashboard.yml:/config/dashboard.yml:ro
    ports:
      - 80:3000

volumes:
  dashboard-config:
    name: dashboard-config
    driver: local
    driver_opts:
      type: none
      device: "/app/volumes/dashboard"
      o: bind

networks:
  proxy:
    external: true
```

Personally, I run this behind Traefik using an external volume and external proxy network that Traefik uses internally:
```
version: "3.9"

services:
  dashboard:
    image: goodieshq/dashboard:icons-latest
    container_name: dashboard
    restart: unless-stopped
    env_file:
      - ./env/dashboard.env
    volumes:
      - dashboard-config:/config:ro
    networks:
      - proxy
    labels:
      traefik.enable: "true"
      traefik.docker.network: "proxy"
      #
      traefik.http.routers.dashboard-web.rule: Host(`dash.example.com`)
      traefik.http.routers.dashboard-web.entrypoints: websecure
      traefik.http.routers.dashboard-web.tls: "true"
      traefik.http.routers.dashboard-web.tls.certresolver: my_resolver
      traefik.http.services.dashboard-web.loadbalancer.server.port: 3000
      traefik.http.services.dashboard-web.loadbalancer.server.scheme: http

volumes:
  dashboard-config:
    name: dashboard-config
    driver: local
    driver_opts:
      type: none
      device: "/app/volumes/dashboard"
      o: bind

networks:
  proxy:
    external: true
```
