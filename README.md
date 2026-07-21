<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/junkerderprovinz/stellarium/main/.github/assets/stellarium-banner-dark.png">
    <img src="https://raw.githubusercontent.com/junkerderprovinz/stellarium/main/.github/assets/stellarium-banner.png" alt="Stellarium — clear skies, guaranteed" width="100%">
  </picture>
</p>

<p align="center">
  <a href="https://github.com/junkerderprovinz/stellarium/actions/workflows/build.yml"><img src="https://img.shields.io/github/actions/workflow/status/junkerderprovinz/stellarium/build.yml?branch=main&label=Build&style=for-the-badge&logo=githubactions&logoColor=white" alt="Build" height="36"></a>&nbsp;
  <a href="https://github.com/junkerderprovinz/stellarium/actions/workflows/lint.yml"><img src="https://img.shields.io/github/actions/workflow/status/junkerderprovinz/stellarium/lint.yml?branch=main&label=Lint&style=for-the-badge&logo=githubactions&logoColor=white" alt="Lint" height="36"></a>&nbsp;
  <a href="https://hub.docker.com/r/junkerderprovinz/stellarium"><img src="https://img.shields.io/docker/pulls/junkerderprovinz/stellarium?style=for-the-badge&logo=docker&logoColor=white&label=Pulls&color=1d99f3" alt="Docker Pulls" height="36"></a>&nbsp;
  <a href="https://hub.docker.com/r/junkerderprovinz/stellarium"><img src="https://img.shields.io/docker/image-size/junkerderprovinz/stellarium/latest?style=for-the-badge&logo=docker&logoColor=white&label=Size&color=1d99f3" alt="Image Size" height="36"></a>&nbsp;
  <a href="https://github.com/junkerderprovinz/stellarium/pkgs/container/stellarium"><img src="https://img.shields.io/badge/Arch-amd64%20%7C%20arm64-success?style=for-the-badge&logo=linux&logoColor=white" alt="Arch" height="36"></a>&nbsp;
  <a href="https://github.com/Stellarium/stellarium"><img src="https://img.shields.io/badge/Engine-Stellarium-191970?style=for-the-badge&logoColor=white" alt="Stellarium" height="36"></a>&nbsp;
  <a href="https://unraid.net"><img src="https://img.shields.io/badge/Unraid-Template-f15a2c?style=for-the-badge&logo=unraid&logoColor=white" alt="Unraid" height="36"></a>&nbsp;
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge&logo=opensourceinitiative&logoColor=white" alt="License" height="36"></a>
</p>

<p align="center">
<b>Stellarium, in your browser.</b> Explore the night sky from any device — no VNC client, no local install.<br>
This runs the full Stellarium desktop planetarium inside a single container and streams it to your
browser over <a href="https://github.com/selkies-project/selkies">Selkies</a> (WebRTC), so panning
the sky, zooming into a nebula and scrubbing through time stay smooth — the part of a real-time
planetarium where the old noVNC containers feel laggy.
</p>

<p align="center">
  <a href="https://buymeacoffee.com/junkerderprovinz">
    <img src="https://raw.githubusercontent.com/junkerderprovinz/stellarium/main/.github/assets/button-buy-me-a-coffee.svg" alt="Buy me a coffee" width="220">
  </a>
</p>

<br>

## Table of Contents

1. [What is this?](#1-what-is-this)
2. [Why Selkies?](#2-why-selkies)
3. [Install on Unraid](#3-install-on-unraid)
4. [Configuration](#4-configuration)
5. [First use](#5-first-use)
6. [How it works](#6-how-it-works)
7. [Credits](#7-credits)

<br>

## 1. What is this?

An **own-image container** that packages [**Stellarium**](https://github.com/Stellarium/stellarium) —
the free, open-source desktop planetarium — on top of
[**LinuxServer.io's baseimage-selkies**](https://github.com/linuxserver/docker-baseimage-selkies)
and serves its desktop UI straight to your browser. No X client, no VNC viewer, no separate install
on your workstation: open the WebUI and look up.

There is **no maintained browser-desktop build of the actual Stellarium application** — the only
"in a browser" option is *Stellarium Web*, a separate and much lighter JavaScript reimplementation,
not the full desktop program with its plugins, catalogues and sky cultures. This is a maintained,
modern **Selkies (WebRTC)** build of the real thing for **amd64 and arm64**.

Stellarium itself is installed from **Debian trixie's `stellarium` package**, so it tracks Debian's
security updates and works natively on both architectures.

<br>

## 2. Why Selkies?

A planetarium is a continuous-rendering workload: you drag across the sky, zoom into a star cluster,
speed up time to watch the planets move, and swing the whole celestial sphere around. Over the older
**noVNC** stack that constantly changing canvas feels laggy because the whole frame is re-encoded on
every change. **Selkies streams the desktop over WebRTC**, the same reason LinuxServer moved Blender
and FreeCAD onto it — so the sky stays fluid. When the host has a GPU the base wires it through; without
one it falls back to software rendering (Mesa llvmpipe) so it still works.

<br>

## 3. Install on Unraid

Requires **Unraid 6.12+**. Install via **Community Applications** — search for **Stellarium**
(look for the `junkerderprovinz` maintainer). Or add the template repository manually under
**Docker → Add Container → Template repositories**:

```
https://github.com/junkerderprovinz/unraid-apps
```

Then open the WebUI on the mapped **HTTPS** port (default `3001`).

<br>

## 4. Configuration

| Variable | Required | Description |
|---|---|---|
| `CUSTOM_USER` | No | WebUI login user. Leave empty (with `PASSWORD`) for **no login** on a trusted LAN. |
| `PASSWORD` | No | WebUI login password. Empty = no login; set both to enable HTTP basic auth on the WebUI. |
| `CUSTOM_HTTPS_PORT` | No | HTTPS port the WebUI is served on (default `3001`). |
| `PUID` / `PGID` | No | User/group the app runs as, so files it writes match your share ownership. The Unraid template sets `99`/`100` (nobody/users). |
| `TZ` | No | Timezone (e.g. `Europe/Berlin`). Also sets Stellarium's clock when it follows system time. |

Stellarium's configuration, chosen location, downloaded star catalogues, landscapes, plugins and
screenshots all persist under **`/config`** (in `/config/.stellarium`), so nothing is lost across
image updates.

> [!NOTE]
> The WebUI has **no login by default** for trusted-LAN use. Never expose it directly to the
> internet — put it behind a VPN or a reverse proxy that adds authentication, or set
> `CUSTOM_USER` + `PASSWORD` to enable the built-in basic auth.

<br>

## 5. First use

1. Open the WebUI — Stellarium starts maximised, showing the sky for its default location.
2. Set your **location** (press `F6`, or the location button in the left toolbar) so the sky matches
   where you are; it is remembered for next time.
3. Explore: drag to pan, scroll to zoom, use the bottom toolbar to toggle constellations, atmosphere,
   grids and labels, and the time controls (`J` / `K` / `L`) to slow, pause or speed up time.
4. Want more? Stellarium's **Configuration** window (`F2`) enables plugins — the telescope control,
   satellites, exoplanets, meteor showers and more.

Closing the Stellarium window simply reopens a fresh instance — it is the container's single app
(kiosk model), so there is nothing else to manage.

<br>

## 6. How it works

```
Browser ──WebRTC (Selkies)──> Stellarium container
                              ├─ nginx (Selkies WebUI, HTTPS :3001)
                              ├─ openbox + Selkies desktop
                              └─ /usr/bin/stellarium  (Debian trixie package)
                                 └─ /config/.stellarium  (location, catalogues, plugins, persisted)
```

Built on `ghcr.io/linuxserver/baseimage-selkies:debiantrixie`. A small s6 overlay seeds the
openbox autostart (which launches Stellarium as the session's single app), keeps the WebUI
login-free unless you set credentials, and prints a **`STELLARIUM IS READY`** banner to the
container log once the WebUI is serving. Images are built natively per architecture, boot-smoke
tested (the binary is present **and** the WebUI answers) before publishing, and scanned for CVEs.

<br>

## 7. Credits

- **[Stellarium](https://github.com/Stellarium/stellarium)** by the Stellarium developers (GPL-2.0) —
  the planetarium this image packages. Installed from the Debian `stellarium` package. This project is
  **not affiliated with or endorsed by the Stellarium project**.
- **[LinuxServer.io baseimage-selkies](https://github.com/linuxserver/docker-baseimage-selkies)**
  (GPL-3.0) — the Selkies web-desktop base.
- **[Selkies](https://github.com/selkies-project/selkies)** — the WebRTC desktop streaming stack.

See [`NOTICE`](NOTICE) for the full bundled-software license list. This repository's own wrapper
(Dockerfile, rootfs, scripts, artwork) is MIT — see [`LICENSE`](LICENSE).

<br>

<p align="center">
  If this saved you a planetarium setup, consider buying me a coffee:<br><br>
  <a href="https://buymeacoffee.com/junkerderprovinz">
    <img src="https://raw.githubusercontent.com/junkerderprovinz/stellarium/main/.github/assets/button-buy-me-a-coffee.svg" alt="Buy me a coffee" width="220">
  </a>
</p>

---

<sub>Part of a family of self-hosted Unraid apps + plugins by <b>junkerderprovinz</b> — see them all at <a href="https://github.com/junkerderprovinz">github.com/junkerderprovinz</a>, or install from <a href="https://unraid.net/community/apps">Community Applications</a>.</sub>
