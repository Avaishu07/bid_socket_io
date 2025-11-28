# Live Cars Fetching - Complete Troubleshooting Checklist

## Phase 1: Pre-Flight Check ✈️

- [ ] Backend server is running on port 3000
  - Run: `netstat -tulpn | grep 3000` or check server process
  - Backend URL: http://10.0.2.2:3000 (for Android emulator) or http://localhost:3000 (for web)

- [ ] Backend Socket.IO is configured
  - Check backend has: `socket.on('getLiveCars', callback)`
  - Check backend has: `socket.emit('liveCars', carData)`

- [ ] Network connectivity
  - For Android emulator: `adb shell ping 10.0.2.2`
  - For device: Ensure same WiFi network as backend

- [ ] Debug logging enabled
  - In `WebSocketConnection.tsx`: `const ENABLE_SOCKET_DEBUG_LOGS = true`

## Phase 2: Connection Establishment 🔌

Run the app and check console for these logs in order:

- [ ] WebSocketProvider mounted
  ```
  🔧 RAW: WebSocketProvider mounting, calling connectWebSocket
  ```

- [ ] Socket instance created
  ```
  🔧 RAW: Creating new socket instance
  ```

- [ ] Socket connected event fired
  ```
  🔧 RAW: Socket connected event fired
  ✅ Socket.IO connected Socket ID: [some-id]
  ```

**If stuck here:** Backend not running or wrong URL. Check Phase 1.

## Phase 3: GetLiveCars Emission 📤

- [ ] getLiveCars emitted immediately
  ```
  🔧 RAW: Emitted getLiveCars on connect (immediate)
  ```

- [ ] getLiveCars emitted with delay
  ```
  🔧 RAW: Emitted getLiveCars on connect (delayed 100ms)
  ```

**If stuck here:** Socket listeners not attached. Check listener attachment logs.

## Phase 4: Data Reception 📨

- [ ] liveCars event received from server
  ```
  🔧 RAW: liveCars event received with data: [...]
  🔧 RAW WILDCARD EVENT: "liveCars" [...]
  ```

- [ ] Data is valid array
  ```
  📨 Is array? true, Length: X
  ```

- [ ] Data contains car objects
  ```
  ✅ Processing X cars
  ```

**If stuck here:** Server not sending liveCars event OR sending with different name.

**Fix options:**
1. Check server is emitting: `socket.emit('liveCars', carArray)`
2. Check server code for event name (might be 'liveCarData', 'liveBidCars', etc.)
3. Add wildcard listener on server to see all events

## Phase 5: Data Transformation 🔄

- [ ] Cars are being transformed
  ```
  📝 Transforming 5 cars...
    Car 1: [Make] [Model] (ID: [id])
    Car 2: [Make] [Model] (ID: [id])
  ```

- [ ] Cars transformed successfully
  ```
  ✅ Transformed X cars
  ```

- [ ] State is updated with cars
  ```
  🚗 Live cars updated: X cars (was: null)
  ```

**If stuck here:** Data transformation error. Check transformCars() function.

## Phase 6: UI Update 🎨

- [ ] liveCars state updated (check React DevTools)
  - filteredLiveCars should have items

- [ ] Cars appear on HomeScreen
  - Should show car cards instead of "No live cars available"

- [ ] Car countdown timers work
  - Timer should decrease every second

**If stuck here:** Cars data received but UI not updating. Check:
- filteredLiveCars depends on liveCars
- Check countdown timer logic
- Check if cars are being filtered out by auction time

## Phase 7: Real-Time Updates (Optional) 🔄

- [ ] Car price updates appear
  ```
  🔧 RAW: liveCarUpdate event received
  🚗 Live car update received
  ```

- [ ] New cars appear
  ```
  🔧 RAW: newLiveCar event received
  🚗 New live car added
  ```

## Debug Commands Reference

### In Browser Console

```javascript
// Check current state
WebSocketDebug.socketState()
// Returns: {connected: bool, id: string, status: string, liveCarsCount: number}

// Force request cars
WebSocketDebug.forceLiveCars()

// Force reconnect
WebSocketDebug.forceConnect()

// Emit custom event
WebSocketDebug.emitDirect('getLiveCars')

// Check socket directly
window.socket.emit('getLiveCars')
```

### Terminal Commands

```bash
# Check server is running
netstat -tulpn | grep 3000
curl http://localhost:3000

# Test Android emulator connectivity
adb shell ping 10.0.2.2

# Check Socket.IO server
curl http://localhost:3000/socket.io/?transport=polling
```

## Common Issues & Quick Fixes

| Issue | Symptom | Fix |
|-------|---------|-----|
| Backend not running | No socket connection | Start backend server on port 3000 |
| Wrong URL | Connection times out | Change SOCKET_IO_URL to 10.0.2.2:3000 for emulator |
| Server not emitting liveCars | Connected but no data | Check backend emit: `socket.emit('liveCars', [])` |
| Different event name | No liveCars event in wildcard | Check actual event name and update listener |
| Data not array | Error logs: "not an array" | Verify server sends array: `[]` |
| Cars show but expired | All cars disappear | Check AUCTION_DURATION_MS setting |
| Partial data | Only some cars show | Check server filtering or auction times |

## Log Message Meanings

### Success Messages
- ✅ Action completed successfully
- 📤 Data sent to server
- 📨 Data received from server
- 🚗 Car-related operation
- 💰 Bid-related operation

### Warning Messages
- ⚠️ Non-critical issue, continuing
- 🔄 Retry in progress
- ℹ️ Informational message

### Error Messages
- ❌ Error occurred
- 🛑 Critical failure
- ❌ Data validation failed

### Debug Indicators
- 🔧 RAW: Raw socket.io event
- 🔗 Connection-related
- ⏳ Processing/waiting
- 📊 State information

## Files Involved

1. **WebSocketConnection.tsx** - Main WebSocket provider with all debug logging
2. **socketio.ts** - Socket initialization with connection logging
3. **HomeScreen.tsx** - UI component that uses the WebSocket
4. **main.tsx** - App entry point wrapping with WebSocketProvider

## Performance Tips

After debugging is complete:

1. **Disable debug logging** (improves performance):
   ```typescript
   const ENABLE_SOCKET_DEBUG_LOGS = false;
   ```

2. **Disable periodic polling** (already off):
   ```typescript
   const ENABLE_PERIODIC_LIVE_CARS_POLLING = false;
   ```

3. **Remove wildcard listener** (optional - adds minor overhead):
   - Not automatically run, only in attached listeners

## Testing Checklist

- [ ] App loads without errors
- [ ] WebSocket connects within 3 seconds
- [ ] Live cars appear on screen within 5 seconds
- [ ] At least 5 cars visible
- [ ] Countdown timers work
- [ ] Car details modal opens on tap
- [ ] Bid modal opens on bid button tap
- [ ] Prices update in real-time
- [ ] Refresh button works
- [ ] Console has no red errors

## Final Verification

1. ✅ Console shows success pattern (see CONSOLE_OUTPUT_REFERENCE.md)
2. ✅ Cars visible on screen
3. ✅ No red errors in console
4. ✅ Debug logging can be disabled
5. ✅ App works on actual device or emulator

## Still Not Working?

1. Check `LIVE_CARS_DEBUGGING_GUIDE.md` for detailed troubleshooting
2. Review `CONSOLE_OUTPUT_REFERENCE.md` for expected output
3. Check backend logs for errors
4. Verify network connectivity with `adb shell`
5. Test with simple socket.io test client
6. Post console logs and error messages for analysis

## Support Info to Gather

If asking for help, provide:
1. Full console output (copy all logs)
2. Backend URL and port
3. Platform (Android emulator, iOS simulator, web)
4. Network setup (same WiFi? firewall?)
5. Backend logs showing what events it receives
6. Any error messages shown in console
