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
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-AGPL--3.0-blue?style=for-the-badge&logo=gnu&logoColor=white" alt="License: AGPL-3.0" height="36"></a>
</p>

<p align="center">
<b>Stellarium, in your browser.</b> Explore the night sky from any device — no VNC client, no local install.<br>
This runs the full Stellarium desktop planetarium inside a single container and streams it to your
browser over <a href="https://github.com/selkies-project/selkies">Selkies</a> (WebRTC), so panning
the sky, zooming into a nebula and scrubbing through time stay smooth — the part of a real-time
planetarium where the old noVNC containers feel laggy.
</p>

<p align="center">
A one-knight job: I build it, keep it running, work through the issues and add what people ask for, until nothing is missing. It is free, with no accounts, no telemetry, no ads and no paid tier. No asterisk anywhere. Nothing readable ever leaves your own walls. Forged on evenings and weekends, with heart and stubbornness.
</p>

<p align="center">
If it has earned a place on your server or computer, toss a coin to your knight: it helps cover the costs and keeps the project alive. It also makes this knight's heart beat a little faster. Three ways below, whichever suits you.
</p>

<p align="center">
  <a href="https://buymeacoffee.com/junkerderprovinz"><img src="https://raw.githubusercontent.com/junkerderprovinz/junkerderprovinz/main/donate/buttons/give.svg#svgView(viewBox(0,0,841.9,245.3))" alt="Buy me a coffee" width="160" height="46.62"></a>
  &nbsp;
  <a href="https://www.paypal.com/donate/?hosted_button_id=76FVV52TKXTUS"><img src="https://raw.githubusercontent.com/junkerderprovinz/junkerderprovinz/main/donate/buttons/give.svg#svgView(viewBox(841.9,0,841.9,245.3))" alt="PayPal" width="160" height="46.62"></a>
  &nbsp;
  <a href="https://junkerderprovinz.github.io/junkerderprovinz/"><img src="https://raw.githubusercontent.com/junkerderprovinz/junkerderprovinz/main/donate/buttons/give.svg#svgView(viewBox(1683.8,0,841.9,245.3))" alt="Donate with crypto" width="160" height="46.62"></a>
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
8. [License](#8-license)
9. [How AI is used here](#9-how-ai-is-used-here)
10. [Support this project](#10-support-this-project)

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
| `MAX_RES` | No | Virtual screen the container serves, picked from a dropdown of presets. This is where the container's memory goes, see below. |
| `MAX_RES_CUSTOM` | No | Your own `WIDTHxHEIGHT` instead of a preset, e.g. `3440x1440`. Wins over `MAX_RES` when set. |

Stellarium's configuration, chosen location, downloaded star catalogues, landscapes, plugins and
screenshots all persist under **`/config`** (in `/config/.stellarium`), so nothing is lost across
image updates.

### Screen size and memory use

The X server reserves its whole virtual framebuffer up front, at roughly **4 bytes per pixel**, no
matter how big your browser window actually is. At the full `15360x8640` that is 530 MB before
anything else runs, which is most of what this container uses.

The image ships that full size, so every resolution stays available. If you would rather have the
RAM back, pick a smaller screen in the template: the dropdown lists sizes from 1080p upwards with
the cost of each, and the free field next to it takes anything not in the list. A value that is not
a `WIDTHxHEIGHT` pair is ignored with a note in the container log rather than stopping the
container. Above the size you picked, the picture is scaled to your window rather than cut off.

> [!NOTE]
> Closing Stellarium in the browser starts a fresh one instead of leaving a black screen. That is
> the base image's watchdog, enabled here by default.

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
(Dockerfile, rootfs, scripts, artwork) is AGPL-3.0; see [`LICENSE`](LICENSE).

<br>

## 8. License

**Copyright (C) 2026 Junker der Provinz.**

This repository packages Stellarium as a container for Unraid. The packaging in this repository (Dockerfile, scripts, theme, web assets and everything else original here) is free software under the **GNU Affero General Public License v3.0** (AGPL-3.0); see [LICENSE](LICENSE). If you distribute it, or run a modified version as a network service, you must release your source under the same AGPL-3.0 terms and keep the existing copyright and attribution notices intact.

**Scope.** The AGPL applies to this repository's own code and assets. Stellarium itself is a separate project under its own license and name; this repository does not claim it. The banner, logo, theme and other branding original to this repository remain reserved: a fork must use its own branding and may not present itself as this project.

<br>

## 9. How AI is used here

One knight builds this, and AI is one of the tools I work with, the same way I work with an editor or a compiler. It helps me write code and documentation and it checks my work, and that saves me a good many evenings. It does not make the decisions, though. I read and understand everything before it ships, and if something here breaks, that is on me and not on the tool.

You do not have to take my word for it. The code is open and every release note is written by hand. The issue tracker shows how problems actually get handled, including the ones I got wrong the first time. If you find something that is not right, open an issue and I will look at it.

<br>

## 10. Support this project

Questions, bugs, ideas or feature requests? Please [open a GitHub issue](https://github.com/junkerderprovinz/stellarium/issues).

A one-knight job: I build it, keep it running, work through the issues and add what people ask for, until nothing is missing. It is free, with no accounts, no telemetry, no ads and no paid tier. No asterisk anywhere. Nothing readable ever leaves your own walls. Forged on evenings and weekends, with heart and stubbornness.

If it has earned a place on your server or computer, toss a coin to your knight: it helps cover the costs and keeps the project alive. It also makes this knight's heart beat a little faster. Three ways below, whichever suits you.

<p align="center">
  <a href="https://buymeacoffee.com/junkerderprovinz"><img src="https://raw.githubusercontent.com/junkerderprovinz/junkerderprovinz/main/donate/buttons/give.svg#svgView(viewBox(0,0,841.9,245.3))" alt="Buy me a coffee" width="160" height="46.62"></a>
  &nbsp;
  <a href="https://www.paypal.com/donate/?hosted_button_id=76FVV52TKXTUS"><img src="https://raw.githubusercontent.com/junkerderprovinz/junkerderprovinz/main/donate/buttons/give.svg#svgView(viewBox(841.9,0,841.9,245.3))" alt="PayPal" width="160" height="46.62"></a>
  &nbsp;
  <a href="https://junkerderprovinz.github.io/junkerderprovinz/"><img src="https://raw.githubusercontent.com/junkerderprovinz/junkerderprovinz/main/donate/buttons/give.svg#svgView(viewBox(1683.8,0,841.9,245.3))" alt="Donate with crypto" width="160" height="46.62"></a>
</p>
