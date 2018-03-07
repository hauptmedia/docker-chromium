About
=====
This docker container runs a headless X-Server with a minimal window manager and
runs Chromium in it. You can connect to the X-Session via your webbrowser using
the integrated novnc client.

Example Run
===========

```
docker run -it --rm -p 3000 -e VNC_PASSWORD=changeme -e SCREEN_SIZE=800x600 hauptmedia/surfbox
```

Then connect to http://127.0.0.1:3000 with your webbrowser.
