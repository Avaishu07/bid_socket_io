# Live Cars Fetching - Debugging Guide

## Overview
This guide helps troubleshoot why live cars are not fetching from the WebSocket connection.

## Enhanced Debugging Features Added

### 1. **Raw Console Logging** 
Raw console logs are prefixed with `🔧 RAW:` and show actual socket events.
Look for:
- `🔧 RAW: Socket connected event fired`
- `🔧 RAW: liveCars event received`
- `🔧 RAW: Emitted getLiveCars on connect`

### 2. **Timestamped Debug Logs**
Debug logs are prefixed with `[WebSocket Debug]` and include timestamps.
Enable/disable in `WebSocketConnection.tsx`:
```typescript
const ENABLE_SOCKET_DEBUG_LOGS = true; // 🔧 Set to true for debugging
```

### 3. **Wildcard Event Listener**
All Socket.IO events are captured with:
```typescript
s.onAny((eventName: string, ...args: any[]) => {
  console.log(`🔧 RAW WILDCARD EVENT: "${eventName}"`, args);
});
```
This shows EVERY event the server sends (not just `liveCars`).

## Troubleshooting Checklist

### Step 1: Check WebSocket Connection
Look for in console:
```
🔧 RAW: Socket connected event fired, emitting getLiveCars
```

**If NOT seeing this:**
- Server may not be running
- Wrong IP/Port in `SOCKET_IO_URL`
- Network connectivity issue

### Step 2: Check getLiveCars Emission
Look for in console:
```
🔧 RAW: Emitted getLiveCars on connect (immediate)
🔧 RAW: Emitted getLiveCars on connect (delayed 100ms)
```

**If NOT seeing this:**
- Socket connect event didn't fire
- `attachSocketListeners` not being called

### Step 3: Check Server Response
Look for in console:
```
🔧 RAW WILDCARD EVENT: "liveCars" [...]
🔧 RAW: liveCars event received with data: [...]
```

**If NOT seeing "liveCars" event:**
- Server is not sending data
- Server might be sending data with different event name
- Check server logs for errors

### Step 4: Verify Data Format
Check the "liveCars" event data:
```
🔧 RAW: liveCars event received with data: Array(5) [...]
📨 Is array? true, Length: 5
✅ Processing 5 cars
✅ Transformed 5 cars
🚗 Live cars updated: 5 cars (was: null)
```

**If data is not an array:**
- Server sending malformed data
- Need to parse differently

### Step 5: Check State Update
Look for the UI update:
- `filteredLiveCars` should have items
- Cars should appear on home screen

## Key Log Patterns

### ✅ Success Pattern (you should see this sequence):
```
🔧 RAW: WebSocketProvider mounting, calling connectWebSocket
🔧 RAW: connectWebSocket() called, current status: disconnected
🔧 RAW: getSocket called with URL: http://10.0.2.2:3000
🔧 RAW: Creating new socket instance
🔧 RAW: Socket listeners attached successfully
🔧 RAW: Socket connected event fired, emitting getLiveCars
🔧 RAW: Emitted getLiveCars on connect (immediate)
🔧 RAW: Emitted getLiveCars on connect (delayed 100ms)
🔧 RAW WILDCARD EVENT: "liveCars" [Array data...]
🔧 RAW: liveCars event received with data: [...]
✅ Processing X cars
✅ Transformed X cars
```

### ❌ Failure Pattern (connection works, but no data):
```
🔧 RAW: Socket connected event fired, emitting getLiveCars
🔧 RAW: Emitted getLiveCars on connect
[... nothing happens ...]
[No liveCars event received]
```

Solution: Check server - it's not sending `liveCars` event

### ❌ Connection Failure:
```
🔧 RAW: connectWebSocket() called
[... nothing about connect ...]
🔧 RAW Max reconnection attempts reached
```

Solution: Check server is running and IP/port are correct

## Common Issues & Fixes

### Issue 1: Socket connects but no data received
**Symptoms:**
- "Socket.IO connected" appears in logs
- No "liveCars event received" appears
- Loading spinner keeps spinning

**Solutions:**
1. Check server at `http://10.0.2.2:3000` is running
2. Verify server is actually emitting `socket.emit('liveCars', carsData)`
3. Check server logs for errors
4. Try using Network tab in dev tools to see socket connection

### Issue 2: Socket can't connect at all
**Symptoms:**
- No "Socket.IO connected" in logs
- Reconnection attempts logged
- "Max reconnection attempts reached"

**Solutions:**
1. Verify `SOCKET_IO_URL` is correct
2. Check if server is running on port 3000
3. Try from adb shell: `adb shell ping 10.0.2.2`
4. For Android emulator, use `10.0.2.2` instead of `localhost`

### Issue 3: Data received but not showing
**Symptoms:**
- "liveCars event received" appears
- "Transformed X cars" appears
- But screen still shows "No live cars available"

**Solutions:**
1. Check `filteredLiveCars` is set correctly
2. Check countdown timers - cars might be expired
3. Check `useEffect` dependencies in home_screen.tsx
4. Clear app cache and restart

## How to Check Server

From your backend terminal:
```bash
# Check if server is running
netstat -tulpn | grep 3000

# Check if port is open
curl http://localhost:3000/socket.io/?transport=polling
```

## Advanced Debugging

### Enable All Debug Logs
Edit `WebSocketConnection.tsx`:
```typescript
const ENABLE_SOCKET_DEBUG_LOGS = true;
```

### Monitor Network Traffic
Use Android Studio's Network Monitor or Chrome DevTools:
1. Open app in emulator/device
2. Open Chrome: `chrome://inspect`
3. Monitor WebSocket traffic under Network tab

### Test Socket Locally
Use socket.io test client:
```bash
npm install -g socket.io-cli
socket.io-client http://10.0.2.2:3000 emit getLiveCars
```

## Key Files Modified

1. **WebSocketConnection.tsx** - Main WebSocket context provider
   - Added comprehensive debug logging
   - Added raw console.log() calls for debugging
   - Added wildcard event listener
   - Delayed getLiveCars emission

2. **socketio.ts** - Socket.IO initialization
   - Added connection event logging
   - Added error event logging

3. **HomeScreen.tsx** - UI component
   - Already has proper getLiveCars() calls
   - Check useEffect dependencies

## Configuration

**Current Settings:**
- `SOCKET_IO_URL`: `http://10.0.2.2:3000`
- `ENABLE_PERIODIC_LIVE_CARS_POLLING`: `false` (use on-demand only)
- `ENABLE_SOCKET_DEBUG_LOGS`: `true` (enable for debugging)

**To disable debug logging (production):**
```typescript
const ENABLE_SOCKET_DEBUG_LOGS = false;
```

## Performance Tips

1. Don't enable periodic polling - use on-demand `getLiveCars()`
2. Keep debug logs disabled in production
3. Use wildcard listener only during debugging (adds overhead)

## Next Steps

1. Start the app
2. Check console for the success pattern above
3. If not seeing "liveCars event received", check server
4. If cars appear but not updating, check countdown timer logic
