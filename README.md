# DAON WebRTC Video Capture

A small Angular single-page application that uses the browser WebRTC `getUserMedia` API to show a live camera preview and automatically capture a snapshot after 5 seconds.

## Features

- Requests camera access from the user
- Shows a live video preview
- Displays a countdown before capturing the snapshot
- Captures a mirrored snapshot from the video stream
- Displays the captured image on the same page
- Handles camera access errors
- Works in the browser without a backend

## Tech Stack

- Angular
- TypeScript
- SCSS
- WebRTC `getUserMedia` API

## How to Run

Clone the repository:

```bash
git clone <https://github.com/stevanfilipovic89/daon-webrtc-angular>
```

Open the project folder:

```bash
cd daon-webrtc
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
ng serve
```

Open the application in the browser:

```text
http://localhost:4200
```

## Run Tests

Run unit tests:

```bash
ng test
```

Run unit tests once:

```bash
ng test --watch=false
```

## Camera Access Note

Camera access through `getUserMedia` requires a secure context. It should work on `localhost`.

If the camera does not start, make sure browser camera permissions are enabled for the page.

## Demo

A short demo video showing the application running in the browser and successfully capturing a photo is included in the repository.