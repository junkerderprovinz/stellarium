#!/usr/bin/env bash
# Overrides the Selkies base image's /defaults/startwm.sh and matches it,
# Nvidia/zink block included. The session goes to /dev/null like in the base
# script: it prints continuously, and the "STELLARIUM IS READY" banner from
# svc-stellarium-ready has to stay the last block in `docker logs`. Lift the
# redirect only while debugging the desktop.

# Enable Nvidia GPU support if detected
if which nvidia-smi > /dev/null 2>&1 && ls -A /dev/dri 2>/dev/null && [ "${DISABLE_ZINK}" == "false" ]; then
  export LIBGL_KOPPER_DRI2=1
  export MESA_LOADER_DRIVER_OVERRIDE=zink
  export GALLIUM_DRIVER=zink
fi

exec dbus-launch --exit-with-session /usr/bin/openbox-session > /dev/null 2>&1
