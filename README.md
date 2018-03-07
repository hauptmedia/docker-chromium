About
=====
This docker container runs a headless X-Server with a minimal window manager and
runs Chromium in it. You can connect to the X-Session via your webbrowser using
the integrated novnc client.

Every time Chromium is started the profile directory will be cleared.

Environment Variables
=====================

`VNC_PASSWORD` VNC Password needed to connect to the instance

`SCREEN_SIZE` The virtual screen size of the headless X-Server

`CHROMIUM_ARGS` Arguments passed to Chromium. Can be used to autoload a specified url.


Example Run
===========

```
docker run -it --rm -p 3000:3000 -e VNC_PASSWORD=changeme -e SCREEN_SIZE=800x600 -e CHROMIUM_ARGS=www.hauptmedia.de hauptmedia/surfbox
```

Then connect to http://127.0.0.1:3000 with your webbrowser.
