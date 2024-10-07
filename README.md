# Livestream Overlay Management App

This app allows users to manage overlay text on top of a livestream video feed, using CRUD operations to create, update, and delete overlays. The video is played using an RTSP (Real-Time Streaming Protocol) URL with basic video controls such as play, pause, and volume adjustments.

## Features

- **Livestream Player**: Play a live RTSP video stream.
- **Overlay Management**: Dynamically add, update, and delete overlays on the livestream.
- **Real-Time Updates**: Changes to overlays are reflected immediately on the video without page refresh.
- **API**: A simple API to handle CRUD operations for overlays.
- **Video Controls**: Play, pause, and volume controls for the video stream.

## Tech Stack

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Python (Flask)
- **Database**: MongoDB
- **RTSP Support**: Real-Time Streaming Protocol for video feeds

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/abhishekdhar999/livestream-overlay-app.git
cd livestream-overlay-app
