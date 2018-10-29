/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("workbox-v3.6.2/workbox-sw.js");
workbox.setConfig({modulePathPrefix: "workbox-v3.6.2"});

workbox.core.setCacheNameDetails({prefix: "gatsby-plugin-offline"});

workbox.skipWaiting();
workbox.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "webpack-runtime-a115d2211ccc84e22efc.js"
  },
  {
    "url": "app-60c344113af69216cbb6.js"
  },
  {
    "url": "component---node-modules-gatsby-plugin-offline-app-shell-js-6343b08ae213af306e85.js"
  },
  {
    "url": "index.html",
    "revision": "bed68ec18eb8a880e8c4c106d5f8679f"
  },
  {
    "url": "offline-plugin-app-shell-fallback/index.html",
    "revision": "e49aa9b8f7bd0e644b4785427675dfbf"
  },
  {
    "url": "component---src-pages-index-tsx.a0e0417aa5c8033eda64.css"
  },
  {
    "url": "component---src-pages-index-tsx-47949c2ede0f0343de56.js"
  },
  {
    "url": "0-ccb0c71a49f56f49e5d4.js"
  },
  {
    "url": "static/d/442/path---index-6a9-njL18oUVyz8ybKq7mL9j8B0DvG4.json",
    "revision": "70dbc00e5f51dc99b608771bb9cc9ab0"
  },
  {
    "url": "component---src-pages-404-tsx.a0e0417aa5c8033eda64.css"
  },
  {
    "url": "component---src-pages-404-tsx-29a4d26a85463703d498.js"
  },
  {
    "url": "static/d/164/path---404-html-516-62a-NZuapzHg3X9TaN1iIixfv1W23E.json",
    "revision": "c2508676a2f33ea9f1f0bf472997f9a0"
  },
  {
    "url": "static/d/520/path---offline-plugin-app-shell-fallback-a-30-c5a-NZuapzHg3X9TaN1iIixfv1W23E.json",
    "revision": "c2508676a2f33ea9f1f0bf472997f9a0"
  },
  {
    "url": "manifest.webmanifest",
    "revision": "ee049201c48e3dbe612473f4614684c7"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerNavigationRoute("/offline-plugin-app-shell-fallback/index.html", {
  whitelist: [/^[^?]*([^.?]{5}|\.html)(\?.*)?$/],
  blacklist: [/\?(.+&)?no-cache=1$/],
});

workbox.routing.registerRoute(/\.(?:png|jpg|jpeg|webp|svg|gif|tiff|js|woff|woff2|json|css)$/, workbox.strategies.staleWhileRevalidate(), 'GET');
workbox.routing.registerRoute(/^https:/, workbox.strategies.networkFirst(), 'GET');
"use strict";

/* global workbox */
self.addEventListener("message", function (event) {
  var api = event.data.api;

  if (api === "gatsby-runtime-cache") {
    var resources = event.data.resources;
    var cacheName = workbox.core.cacheNames.runtime;
    event.waitUntil(caches.open(cacheName).then(function (cache) {
      return Promise.all(resources.map(function (resource) {
        return cache.add(resource).catch(function (e) {
          // ignore TypeErrors - these are usually due to
          // external resources which don't allow CORS
          if (!(e instanceof TypeError)) throw e;
        });
      }));
    }));
  }
});