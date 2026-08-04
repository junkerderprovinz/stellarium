# syntax=docker/dockerfile:1
# ---------------------------------------------------------------------------
# Stellarium for Unraid — Selkies web desktop
# ---------------------------------------------------------------------------
# Stellarium packaged on top of LinuxServer.io's baseimage-selkies and streamed
# to the browser via Selkies (WebRTC). Stellarium is a real-time OpenGL
# planetarium — a continuously rendered sky you pan, zoom and time-scrub — which
# is exactly the interactive workload that stutters over the old noVNC stack and
# stays smooth over WebRTC. There is no maintained browser-desktop build of the
# actual Stellarium application, so this fills a genuine gap.
#
# Why apt: Debian trixie — which this base IS (baseimage-selkies:debiantrixie) —
# carries `stellarium` in main for both amd64 and arm64, so apt is the simplest
# and most robust source and it tracks trixie security updates for free.
#
# Repository:  https://github.com/junkerderprovinz/stellarium
# ---------------------------------------------------------------------------

ARG BASE_TAG=debiantrixie
FROM ghcr.io/linuxserver/baseimage-selkies:${BASE_TAG}

LABEL maintainer="junkerderprovinz"
LABEL org.opencontainers.image.title="stellarium"
LABEL org.opencontainers.image.description="Stellarium for Unraid with a Selkies web desktop — the open-source planetarium in your browser, no VNC client"
LABEL org.opencontainers.image.source="https://github.com/junkerderprovinz/stellarium"
LABEL org.opencontainers.image.licenses="AGPL-3.0-only"
LABEL org.opencontainers.image.vendor="junkerderprovinz"

# TITLE feeds the PWA manifest; SELKIES_UI_TITLE is the visible tab/sidebar
# title of the Selkies web client. SELKIES_ENABLE_BASIC_AUTH=false keeps the
# no-login-by-default behaviour (see init-nologin); the base's nginx still
# enforces HTTP basic auth once a real CUSTOM_USER/PASSWORD is set.
ENV TITLE="Stellarium" \
    SELKIES_UI_TITLE="Stellarium" \
    SELKIES_ENABLE_BASIC_AUTH="false"

# ---------------------------------------------------------------------------
# Packages: Stellarium + the OpenGL/font runtime the headless desktop needs.
# The `stellarium` package pulls its own Qt dependency chain; we add:
#   * mesa DRI drivers (libgl1-mesa-dri) so the sky renders via llvmpipe when no
#     GPU is present (the base wires zink/virgl when one is); Stellarium is a
#     real-time OpenGL app, so this software-GL fallback is what makes it work
#     on a GPU-less Unraid host,
#   * libglu1-mesa (GLU) + mesa-utils (glxinfo, used to sanity-check GL),
#   * dbus-x11 for the dbus-launch in the openbox autostart,
#   * fontconfig + Noto/DejaVu so star/constellation/UI labels render (missing
#     fonts show as blank boxes), incl. CJK for localized sky-culture names,
#     plus locales.
# ---------------------------------------------------------------------------
RUN set -eux; \
    apt-get update; \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
        stellarium \
        libgl1-mesa-dri libglu1-mesa mesa-utils \
        dbus-x11 \
        fontconfig \
        fonts-noto fonts-noto-cjk fonts-noto-color-emoji \
        fonts-dejavu fonts-dejavu-core \
        locales coreutils sed; \
    fc-cache -f >/dev/null 2>&1 || true; \
    apt-get clean; \
    rm -rf /var/lib/apt/lists/*

# ---------------------------------------------------------------------------
# Overlay: rootfs (s6 services, openbox autostart, startwm.sh) + init banner.
# ---------------------------------------------------------------------------
COPY rootfs/ /

# Init-log banner: single source at .github/assets/banner-raw.txt (CR stripped
# so a Windows checkout can't break it). Also blank the base's own adduser
# branding banner so the log shows only our print-banner.sh block.
COPY .github/assets/banner-raw.txt /usr/local/share/banner-raw.txt
RUN tr -d '\r' < /usr/local/share/banner-raw.txt > /usr/local/share/banner.txt; \
    rm -f /usr/local/share/banner-raw.txt; \
    : > /etc/s6-overlay/s6-rc.d/init-adduser/branding 2>/dev/null || true

# CA/PWA icon shown in the Selkies web client tab + sidebar.
COPY .github/assets/icon.png /usr/share/selkies/www/icon.png

RUN chmod +x /usr/local/bin/print-banner.sh \
             /etc/s6-overlay/s6-rc.d/init-stellarium/run \
             /etc/s6-overlay/s6-rc.d/init-nologin/run \
             /etc/s6-overlay/s6-rc.d/svc-stellarium-ready/run \
             /defaults/autostart \
             /defaults/startwm.sh

EXPOSE 3001
VOLUME /config
