# The Front-End Monitoring Handbook: Track Performance, Errors, and User Behavior

source : https://www.freecodecamp.org/news/the-front-end-monitoring-handbook/?ref=dailydev

A complete frontend monitoring system is essential for tracking application performance, errors, and user behavior. It consists of three main components: data collection and reporting, data processing and storage, and data visualization.

This article focuses specifically on the first component – data collection and reporting – and guides you through building a monitoring SDK from scratch. By the end of this article, you'll know how to gather critical metrics about your application's performance, capture errors, track user behavior, and implement efficient reporting mechanisms. The provided code snippets and diagrams will help you understand and implement these concepts effectively.

---

## Below is an outline of the topics we'll cover

The following diagram illustrates the categories of data we’ll collect, including performance, error, and behavior metrics:

```mermaid
graph TD
A[Data Collection] --> B[Error Monitoring]
A --> C[Performance Monitoring]
A --> D[Behavior Monitoring]
B --> E[Resource Errors]
B --> F[JS Errors]
B --> G[Promise Errors]
B --> H[Custom Errors]
C --> I[Time Metrics]
I --> I1[API Requests]
I --> I2[DNS/TCP/First Byte]
I --> I3[FPS Rate]
I --> I4[First Screen Render]
C --> J[Cache Hit Rate]
J --> J1[FP/FCP/LCP]
J --> J2[DOMContentLoaded]
J --> J3[Onload]
D --> K[UV/PV]
D --> L[Page Access Depth]
D --> M[Page Stay Duration]
D --> N[Custom Events]
D --> O[User Clicks]
D --> P[Page Navigation]
```

---

## Once data is collected, it needs to be reported to your backend systems for processing and analysis

This diagram shows the methods and timing strategies for reporting the collected data:

```mermaid
graph TD
A[Data Reporting] --> B[Reporting Methods]
A --> C[Reporting Timing]
B --> D[xhr]
B --> E[image]
B --> F[sendBeacon]
C --> G[requestIdleCallback]
C --> H[setTimeout]
C --> I[Cache Limit Upload]
C --> J[beforeunload]
```

---

## Prerequisites

Before diving into this tutorial, you should have:

- Basic knowledge of JavaScript and web development
- Familiarity with browser APIs and event handling
- Understanding of asynchronous programming concepts
- Some experience with performance optimization concepts

Since theoretical knowledge alone can be challenging to grasp, I've created a simple monitoring SDK that implements these technical concepts. You can use it to create demos and gain a better understanding. Reading this article while experimenting with the SDK will provide the best learning experience.

---

## Table of Contents

<!-- toc -->

- [Collect Performance Data](#collect-performance-data)
  - [FP (First Paint)](#fp-first-paint)
  - [FCP (First Contentful Paint)](#fcp-first-contentful-paint)
  - [LCP (Largest Contentful Paint)](#lcp-largest-contentful-paint)
  - [CLS (Cumulative Layout Shift)](#cls-cumulative-layout-shift)
  - [DOMContentLoaded and Load Events](#domcontentloaded-and-load-events)
  - [First Screen Rendering Time](#first-screen-rendering-time)
  - [API Request Timing](#api-request-timing)
  - [Resource Loading Time and Cache Hit Rate](#resource-loading-time-and-cache-hit-rate)
  - [Browser Back/Forward Cache](#browser-backforward-cache)
  - [FPS](#fps)
  - [Vue Router Change Rendering Time](#vue-router-change-rendering-time)
- [Error Data Collection](#error-data-collection)
  - [Resource Loading Errors](#resource-loading-errors)
  - [JavaScript Errors](#javascript-errors)
  - [Promise Errors](#promise-errors)
  - [Sourcemap](#sourcemap)
  - [Vue Errors](#vue-errors)
- [Behavior Data Collection](#behavior-data-collection)
  - [PV and UV](#pv-and-uv)
  - [Page Stay Duration](#page-stay-duration)
  - [Page Access Depth](#page-access-depth)
  - [User Clicks](#user-clicks)
  - [Page Navigation](#page-navigation)
  - [Vue Router Changes](#vue-router-changes)
- [Data Reporting](#data-reporting)
  - [Reporting Methods](#reporting-methods)
  - [Reporting Timing](#reporting-timing)
- [Summary](#summary)
- [References](#references)
  - [Performance Monitoring](#performance-monitoring)
  - [Error Monitoring](#error-monitoring)
  - [Behavior Monitoring](#behavior-monitoring)

<!-- tocstop -->

---

## Collect Performance Data

### FP (First Paint)

First Paint (FP) marks the time when the browser first renders any visual content, such as a background color or border. This metric helps gauge how quickly the user sees initial feedback.

```javascript
const observer = new PerformanceObserver((list) => {
  const entries = list.getEntries()
  for (const entry of entries) {
    if (entry.name === "first-paint") {
      console.log(`FP: ${entry.startTime}ms`)
    }
  }
})
observer.observe({ entryTypes: ["paint"] })
```

---

### FCP (First Contentful Paint)

First Contentful Paint (FCP) measures the time when the first piece of DOM content (e.g., text, image, or canvas) is rendered. It indicates when meaningful content becomes visible.

```javascript
const observer = new PerformanceObserver((list) => {
  const entries = list.getEntries()
  for (const entry of entries) {
    if (entry.name === "first-contentful-paint") {
      console.log(`FCP: ${entry.startTime}ms`)
    }
  }
})
observer.observe({ entryTypes: ["paint"] })
```

---

### LCP (Largest Contentful Paint)

Largest Contentful Paint (LCP) tracks the render time of the largest visible content element (e.g., image, video, or text block). It’s a key metric for perceived load speed.

```javascript
const observer = new PerformanceObserver((list) => {
  const entries = list.getEntries()
  for (const entry of entries) {
    console.log(`LCP: ${entry.startTime}ms`)
  }
})
observer.observe({ entryTypes: ["largest-contentful-paint"] })
```

---

### CLS (Cumulative Layout Shift)

Cumulative Layout Shift (CLS) measures visual stability by tracking unexpected layout shifts that occur during the page lifecycle. A lower CLS score indicates a more stable user experience.

```javascript
let cls = 0
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (!entry.hadRecentInput) {
      cls += entry.value
      console.log(`CLS: ${cls}`)
    }
  }
})
observer.observe({ entryTypes: ["layout-shift"] })
```

---

### DOMContentLoaded and Load Events

`DOMContentLoaded` fires when the initial HTML document is fully parsed, while `load` fires when all resources (images, scripts, etc.) are loaded. These events help measure overall page load times.

```javascript
document.addEventListener("DOMContentLoaded", () => {
  console.log(`DOMContentLoaded: ${performance.now()}ms`)
})
window.addEventListener("load", () => {
  console.log(`Load: ${performance.now()}ms`)
})
```

---

### First Screen Rendering Time

First Screen Rendering Time measures how long it takes for the content above the fold (the first screen) to be fully rendered. This often requires observing key elements using `IntersectionObserver`.

```javascript
const target = document.querySelector("#first-screen-element")
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      console.log(`First Screen Rendered: ${performance.now()}ms`)
      observer.disconnect()
    }
  })
})
observer.observe(target)
```

---

### API Request Timing

Monitor the performance of API requests to identify bottlenecks in data fetching. Use the `fetch` API with performance marks to measure duration.

```javascript
const start = performance.now()
fetch("https://api.example.com/data").then(() => {
  const duration = performance.now() - start
  console.log(`API Request Time: ${duration}ms`)
})
```

---

### Resource Loading Time and Cache Hit Rate

Track the time taken to load resources (e.g., images, scripts) and determine if they were served from the cache. Use the Performance API to analyze resource entries.

```javascript
const resources = performance.getEntriesByType("resource")
resources.forEach((resource) => {
  console.log(`Resource: ${resource.name}, Duration: ${resource.duration}ms`)
  if (resource.transferSize === 0) {
    console.log("Cache Hit")
  }
})
```

---

### Browser Back/Forward Cache

The back/forward cache (bfcache) allows pages to load instantly when navigating back or forward. Detect if a page is loaded from bfcache using the `pageshow` event.

```javascript
window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    console.log("Page loaded from bfcache")
  }
})
```

---

### FPS

Frames Per Second (FPS) measures the smoothness of animations and interactions. Calculate FPS using `requestAnimationFrame` to track frame rendering times.

```javascript
let lastFrame = performance.now()
let fps = 0
function calculateFPS() {
  const now = performance.now()
  const delta = now - lastFrame
  fps = 1000 / delta
  console.log(`FPS: ${Math.round(fps)}`)
  lastFrame = now
  requestAnimationFrame(calculateFPS)
}
requestAnimationFrame(calculateFPS)
```

---

### Vue Router Change Rendering Time

For Vue applications, measure the rendering time after a route change to ensure smooth navigation. Use Vue’s `afterEach` hook and `nextTick` for accurate timing.

```javascript
router.afterEach((to, from) => {
  const start = performance.now()
  nextTick(() => {
    const duration = performance.now() - start
    console.log(`Vue Router Render Time: ${duration}ms`)
  })
})
```

---

## Error Data Collection

### Resource Loading Errors

Capture errors when resources like images or scripts fail to load. Use the `error` event on the window with event capturing to detect these failures.

```javascript
window.addEventListener(
  "error",
  (event) => {
    if (event.target.tagName) {
      console.log(`Resource Error: ${event.target.src || event.target.href}`)
    }
  },
  true
)
```

---

### JavaScript Errors

Catch runtime JavaScript errors using `window.onerror`. This handler provides details like the error message, source file, and line number.

```javascript
window.onerror = (message, source, lineno, colno, error) => {
  console.log(`JS Error: ${message} at ${source}:${lineno}:${colno}`)
}
```

---

### Promise Errors

Handle uncaught Promise rejections with the `unhandledrejection` event to catch errors in asynchronous code.

```javascript
window.addEventListener("unhandledrejection", (event) => {
  console.log(`Promise Error: ${event.reason}`)
})
```

---

### Sourcemap

Sourcemaps map minified code back to its original source, making debugging easier. Ensure your build process generates sourcemaps (e.g., via Webpack with `devtool: 'source-map'`), and use a library like `source-map` to parse them in your SDK for accurate error reporting.

---

### Vue Errors

In Vue applications, capture component-level errors using Vue’s global error handler. This helps track errors specific to Vue’s lifecycle or rendering.

```javascript
Vue.config.errorHandler = (err, vm, info) => {
  console.log(`Vue Error: ${err.message}, Info: ${info}`)
}
```

---

## Behavior Data Collection

### PV and UV

Track Page Views (PV) and Unique Visitors (UV) to measure traffic. Use a unique identifier for UV and log page loads for PV.

```javascript
window.addEventListener("load", () => {
  const userId = localStorage.getItem("userId") || generateUniqueId()
  console.log(`PV: ${location.href}, UV: ${userId}`)
})

function generateUniqueId() {
  const id = "user_" + Math.random().toString(36).substr(2, 9)
  localStorage.setItem("userId", id)
  return id
}
```

---

### Page Stay Duration

Measure how long a user stays on a page by tracking the time between page load and unload. Use `beforeunload` to capture the final duration.

```javascript
const start = performance.now()
window.addEventListener("beforeunload", () => {
  const duration = performance.now() - start
  console.log(`Page Stay Duration: ${duration}ms`)
})
```

---

### Page Access Depth

Track scroll depth to understand how far users scroll down a page. Calculate the percentage of the page height scrolled.

```javascript
window.addEventListener("scroll", () => {
  const depth = (window.scrollY / document.body.scrollHeight) * 100
  console.log(`Page Access Depth: ${depth}%`)
})
```

---

### User Clicks

Log user clicks to analyze interaction patterns. Capture the element clicked and its position on the screen.

```javascript
document.addEventListener("click", (event) => {
  console.log(
    `Click at: ${event.target.tagName}, Position: (${event.clientX}, ${event.clientY})`
  )
})
```

---

### Page Navigation

Track navigation events using the `popstate` event or History API to monitor how users move between pages.

```javascript
window.addEventListener("popstate", () => {
  console.log(`Navigated to: ${location.href}`)
})
```

---

### Vue Router Changes

In Vue applications, monitor route changes to track navigation behavior. Use Vue Router’s `afterEach` hook to log transitions.

```javascript
router.afterEach((to, from) => {
  console.log(`Navigated from ${from.path} to ${to.path}`)
})
```

---

## Data Reporting

### Reporting Methods

Choose efficient methods to send collected data to your backend, balancing reliability and performance impact:

- **`xhr`**: Use `XMLHttpRequest` for reliable, synchronous uploads.
- **`image`**: Send data via a tracking pixel (e.g., `new Image().src = 'backend?data=...'`). Lightweight but limited by URL length.
- **`sendBeacon`**: Preferred for reliable, asynchronous reporting, especially during page unload:

```javascript
window.addEventListener("beforeunload", () => {
  navigator.sendBeacon(
    "https://backend.example.com/report",
    JSON.stringify(data)
  )
})
```

---

### Reporting Timing

Optimize when data is sent to minimize performance impact:

- **`requestIdleCallback`**: Send data during idle periods to avoid blocking the main thread:

```javascript
requestIdleCallback(() => {
  fetch("https://backend.example.com/report", {
    method: "POST",
    body: JSON.stringify(data),
  })
})
```

- **`setTimeout`**: Delay reporting to batch data and reduce frequency.
- **Upload when cache limit is reached**: Store data in `localStorage` or `IndexedDB` and upload when a size limit (e.g., 1MB) is reached.
- **`beforeunload`**: Ensure critical data is sent before the page unloads using `sendBeacon`.

---

## Summary

This handbook provides a comprehensive guide to front-end monitoring, covering the collection of performance, error, and behavior data, and efficient reporting strategies. The included code snippets demonstrate how to implement these techniques in a monitoring SDK, helping you improve your application’s reliability and user experience. The Mermaid diagrams offer a clear, visual overview of the data collection and reporting processes. Experiment with the SDK to solidify your understanding and adapt it to your specific needs.

---

## References

### Performance Monitoring

- [Web Vitals](https://web.dev/vitals/): Official documentation on core web vitals like LCP, CLS, and FCP.
- [MDN Performance API](https://developer.mozilla.org/en-US/docs/Web/API/Performance): Guide to using the Performance API for timing metrics.

### Error Monitoring

- [MDN Error Handling](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling): JavaScript error handling techniques.
- [Source Maps](https://web.dev/source-maps/): Introduction to using sourcemaps for debugging.

### Behavior Monitoring

- [MDN Event Reference](https://developer.mozilla.org/en-US/docs/Web/Events): Comprehensive list of browser events.
- [Vue Router Documentation](https://router.vuejs.org/): Official Vue Router guide for navigation tracking.
