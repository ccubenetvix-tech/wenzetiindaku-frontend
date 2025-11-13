import { io, Socket } from 'socket.io-client';
import { getApiBaseUrl } from './api';

let socket: Socket | null = null;

export const getSocket = (token: string | null): Socket | null => {
  // Validate token
  if (!token || typeof token !== 'string' || token.trim().length === 0) {
    console.warn('Invalid token provided to getSocket');
    return null;
  }

  // If socket already exists and is connected, return it
  if (socket && socket.connected) {
    return socket;
  }

  // If socket exists but is disconnected, disconnect it first
  if (socket && !socket.connected) {
    socket.disconnect();
    socket = null;
  }

  try {
    // Get base URL (remove /api suffix if present, and ensure no trailing slash)
    let baseURL = getApiBaseUrl().replace(/\/api$/, '').replace(/\/$/, '');
    
    // In development, use localhost:5000 directly (not through proxy)
    if (baseURL.includes('localhost:5173') || baseURL.includes('localhost:3000')) {
      baseURL = 'http://localhost:5000';
    }
    
    // Validate baseURL
    if (!baseURL || baseURL.length === 0) {
      console.error('Invalid baseURL for socket connection');
      return null;
    }
    
    // Log the connection attempt for debugging
    console.log('Attempting WebSocket connection to:', baseURL);
    
    // Create new socket connection with improved error handling
    // Use path: '/socket.io/' explicitly for Socket.io
    socket = io(baseURL, {
      path: '/socket.io/',
      auth: {
        token: token
      },
      transports: ['polling', 'websocket'], // Try polling first (better for serverless)
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5, // Reduced attempts to fail faster
      timeout: 10000, // 10 second connection timeout (reduced)
      forceNew: false, // Reuse connection if possible
      upgrade: true, // Allow upgrade from polling to websocket
      rememberUpgrade: true // Remember upgrade preference
    });

    socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      
      // If disconnected due to server error, don't auto-reconnect
      if (reason === 'io server disconnect') {
        socket?.connect();
      }
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      
      // Handle specific error types
      if (error.message?.includes('timeout')) {
        console.error('Socket connection timeout');
      } else if (error.message?.includes('xhr poll error')) {
        console.error('Socket polling error');
      }
    });

    // Handle reconnection attempts
    socket.io.on('reconnect_attempt', (attemptNumber) => {
      console.log(`WebSocket reconnection attempt ${attemptNumber}`);
    });

    socket.io.on('reconnect', (attemptNumber) => {
      console.log(`WebSocket reconnected after ${attemptNumber} attempts`);
    });

    socket.io.on('reconnect_error', (error) => {
      console.error('WebSocket reconnection error:', error);
    });

    socket.io.on('reconnect_failed', () => {
      console.error('WebSocket reconnection failed after all attempts');
    });

    return socket;
  } catch (error) {
    console.error('Failed to create socket connection:', error);
    return null;
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export default { getSocket, disconnectSocket };

