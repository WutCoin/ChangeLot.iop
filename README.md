# ChangeLot.iop

A lightweight web app that displays user profile cards and lets each user update their profile picture.

## Features

- Responsive grid of user profile cards
- Click the **✎** button on any card to open the update modal
- Live preview of the chosen image before saving
- Changes are persisted in `localStorage` and survive page reloads

## Usage

Open `index.html` directly in a browser – no build step required.

## Files

| File | Description |
|------|-------------|
| `index.html` | Page structure and modal markup |
| `styles.css` | All styles (grid, cards, modal) |
| `profiles.js` | User data, rendering logic, and picture-update flow |
