# Survey App - Progressive Web App (PWA)

This survey application has been enhanced with Progressive Web App (PWA) functionality, making it installable and usable offline.

## PWA Features

### 🚀 **Installable**
- Users can install the app on their devices (desktop, mobile, tablet)
- App appears in the app drawer/home screen
- Works like a native app with standalone display

### 📱 **Responsive Design**
- Optimized for mobile devices
- Touch-friendly interface
- Responsive layout that adapts to different screen sizes

### 🔄 **Offline Support**
- Works without internet connection
- Form data is stored locally using IndexedDB
- Service worker caches app resources for offline use
- Automatic sync when connection is restored

### ⚡ **Fast Loading**
- Service worker caches static assets
- Instant loading on subsequent visits
- Background updates for improved performance

## How to Install

### Desktop (Chrome, Edge, Firefox)
1. Open the app in your browser
2. Look for the install button in the address bar or click the "Install App" button
3. Click "Install" when prompted
4. The app will be added to your desktop and app drawer

### Mobile (Android)
1. Open the app in Chrome
2. Tap the menu (three dots) in the address bar
3. Select "Add to Home screen" or "Install app"
4. Tap "Add" to confirm
5. The app icon will appear on your home screen

### Mobile (iOS)
1. Open the app in Safari
2. Tap the Share button (square with arrow)
3. Select "Add to Home Screen"
4. Tap "Add" to confirm
5. The app icon will appear on your home screen

## PWA Files Added

- `manifest.json` - App metadata and configuration
- `sw.js` - Service worker for offline functionality
- `browserconfig.xml` - Windows tile configuration
- `icons/` - App icons in various sizes
- Updated HTML files with PWA meta tags
- Enhanced CSS with PWA-specific styles

## Technical Details

### Service Worker
- Caches app resources for offline use
- Handles background sync for form submissions
- Manages cache updates and cleanup

### Manifest
- Defines app name, icons, and display properties
- Configures app shortcuts for quick access
- Sets theme colors and display mode

### Offline Storage
- Uses IndexedDB for local data storage
- Form submissions are queued when offline
- Automatic sync when connection is restored

## Browser Support

- ✅ Chrome (Android, Desktop)
- ✅ Edge (Windows)
- ✅ Firefox (Android, Desktop)
- ✅ Safari (iOS 11.3+)
- ✅ Samsung Internet

## Testing PWA Features

1. **Install Test**: Try installing the app on different devices
2. **Offline Test**: Disconnect internet and test form submission
3. **Performance Test**: Check loading speed and responsiveness
4. **Mobile Test**: Test on various mobile devices and screen sizes

## Development Notes

- Service worker is registered on both pages
- Install prompt only shows when criteria are met
- Offline indicator appears when connection is lost
- Form data persists locally using IndexedDB
- App works in standalone mode when installed

## Troubleshooting

- Clear browser cache if service worker doesn't update
- Check browser console for service worker errors
- Ensure HTTPS is used for PWA features to work
- Verify manifest.json is accessible and valid

## Future Enhancements

- Push notifications for new surveys
- Background sync improvements
- Advanced offline capabilities
- App shortcuts for quick actions
- Enhanced mobile experience
