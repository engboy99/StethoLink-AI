// StethoLink AI Service Worker - Comprehensive Offline Support
const CACHE_VERSION = '2.0.0';
const CACHE_NAME = `stetholink-ai-v${CACHE_VERSION}`;
const STATIC_CACHE = `stetholink-static-v${CACHE_VERSION}`;
const DYNAMIC_CACHE = `stetholink-dynamic-v${CACHE_VERSION}`;
const MEDICAL_CACHE = `stetholink-medical-v${CACHE_VERSION}`;
const API_CACHE = `stetholink-api-v${CACHE_VERSION}`;

// Core application files to cache immediately
const STATIC_FILES = [
    '/',
    '/index.html',
    '/dashboard.html',
    '/offline.html',
    '/offline-dashboard.html',
    '/offline-api.html',
    '/css/style.css',
    '/js/app.js',
    '/dashboard.js',
    '/manifest.json',
    '/logo.svg',
    '/icons/favicon.ico',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
];

// Medical curriculum and reference data
const MEDICAL_DATA = [
    '/api/curriculum/1st',
    '/api/curriculum/2nd',
    '/api/curriculum/3rd',
    '/api/tools',
    '/api/medical-standards',
    '/api/clinical-guidelines'
];

// API endpoints that should be cached
const CACHEABLE_APIS = [
    '/api/curriculum',
    '/api/tools',
    '/api/medical-standards',
    '/api/clinical-guidelines',
    '/api/student-tasks',
    '/api/medical-calculators'
];

// Offline fallback pages
const OFFLINE_FALLBACKS = {
    '/': '/offline.html',
    '/dashboard': '/offline-dashboard.html',
    '/api/': '/offline-api.html'
};

// Install event - cache static files and medical data
self.addEventListener('install', (event) => {
    console.log('🏥 StethoLink AI Service Worker installing...');
    
    event.waitUntil(
        Promise.all([
            // Cache static files
            caches.open(STATIC_CACHE).then(cache => {
                console.log('📦 Caching static files...');
                return cache.addAll(STATIC_FILES);
            }),
            
            // Cache medical data
            caches.open(MEDICAL_CACHE).then(cache => {
                console.log('🏥 Caching medical data...');
                return cache.addAll(MEDICAL_DATA);
            }),
            
            // Pre-cache offline fallbacks
            caches.open(STATIC_CACHE).then(cache => {
                console.log('📱 Caching offline fallback pages...');
                return cache.addAll([
                    '/offline.html',
                    '/offline-dashboard.html',
                    '/offline-api.html'
                ]).then(() => {
                    console.log('✅ Offline fallback pages cached successfully');
                }).catch(error => {
                    console.error('❌ Error caching offline fallbacks:', error);
                });
            })
        ])
        .then(() => {
            console.log('✅ All files cached successfully');
            return self.skipWaiting();
        })
        .catch(error => {
            console.error('❌ Error during installation:', error);
        })
    );
});

// Activate event - clean up old caches and claim clients
self.addEventListener('activate', (event) => {
    console.log('🚀 StethoLink AI Service Worker activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (![STATIC_CACHE, DYNAMIC_CACHE, MEDICAL_CACHE, API_CACHE].includes(cacheName)) {
                            console.log('🗑️ Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('✅ Service Worker activated successfully');
                return self.clients.claim();
            })
            .then(() => {
                // Notify all clients about the new service worker
                return self.clients.matchAll();
            })
            .then(clients => {
                clients.forEach(client => {
                    client.postMessage({
                        type: 'SW_ACTIVATED',
                        version: CACHE_VERSION
                    });
                });
            })
    );
});

// Fetch event - intelligent caching strategy
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests and non-HTTP(S) requests
    if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
        return;
    }
    
    console.log('🔄 Fetch event for:', url.pathname);
    
    // Handle different types of requests with appropriate strategies
    if (isStaticFile(url.pathname)) {
        console.log('📁 Static file request, using cache first:', url.pathname);
        event.respondWith(cacheFirst(request, STATIC_CACHE));
    } else if (isMedicalData(url.pathname)) {
        console.log('🏥 Medical data request, using cache first:', url.pathname);
        event.respondWith(cacheFirst(request, MEDICAL_CACHE));
    } else if (isCacheableAPI(url.pathname)) {
        console.log('🔌 Cacheable API request, using network first:', url.pathname);
        event.respondWith(networkFirst(request, API_CACHE));
    } else if (url.pathname.startsWith('/api/')) {
        console.log('🌐 API request, using network first:', url.pathname);
        event.respondWith(networkFirst(request, DYNAMIC_CACHE));
    } else {
        console.log('🌐 Other request, using network first:', url.pathname);
        event.respondWith(networkFirst(request, DYNAMIC_CACHE));
    }
});

// Check if request is for a static file
function isStaticFile(pathname) {
    return STATIC_FILES.includes(pathname) || 
           pathname.endsWith('.css') || 
           pathname.endsWith('.js') || 
           pathname.endsWith('.html') ||
           pathname.endsWith('.svg') ||
           pathname.endsWith('.png') ||
           pathname.endsWith('.ico');
}

// Check if request is for medical data
function isMedicalData(pathname) {
    return MEDICAL_DATA.includes(pathname) || 
           pathname.includes('/curriculum/') ||
           pathname.includes('/medical-standards') ||
           pathname.includes('/clinical-guidelines');
}

// Check if request is for a cacheable API
function isCacheableAPI(pathname) {
    return CACHEABLE_APIS.some(api => pathname.startsWith(api));
}

// Cache First Strategy - for static files and medical data
async function cacheFirst(request, cacheName) {
    try {
        // Try to get from cache first
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            console.log('✅ Serving from cache:', request.url);
            return cachedResponse;
        }
        
        console.log('📥 Not in cache, checking if offline...');
        
        // Check if we're offline by trying a simple fetch
        let isOffline = false;
        try {
            const testResponse = await fetch('/favicon.ico', { method: 'HEAD' });
            isOffline = false;
        } catch (e) {
            isOffline = true;
            console.log('🌐 Appears to be offline, using offline fallback');
        }
        
        if (isOffline) {
            // We're offline, try offline fallback immediately
            const offlineResponse = await getOfflineFallback(request);
            if (offlineResponse) {
                console.log('📱 Serving offline fallback for:', request.url);
                return offlineResponse;
            }
        }
        
        // If online or no offline fallback, try network
        console.log('🌐 Online, fetching from network:', request.url);
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            await cache.put(request, networkResponse.clone());
            console.log('💾 Added to cache:', request.url);
        }
        return networkResponse;
    } catch (error) {
        console.log('❌ Cache first failed, trying offline fallback:', error);
        
        // Try to serve offline fallback
        const offlineResponse = await getOfflineFallback(request);
        if (offlineResponse) {
            console.log('📱 Serving offline fallback for:', request.url);
            return offlineResponse;
        }
        
        console.log('❌ No offline fallback available for:', request.url);
        return new Response('Content not available offline', { 
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/plain' }
        });
    }
}

// Network First Strategy - for API calls and dynamic content
async function networkFirst(request, cacheName) {
    try {
        // Try network first
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            await cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.log('Network first failed, serving from cache:', error);
        
        // Try to serve from cache
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Try offline fallback
        const offlineResponse = await getOfflineFallback(request);
        if (offlineResponse) {
            return offlineResponse;
        }
        
        return new Response('Network error and no cached content', { 
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/plain' }
        });
    }
}

// Get appropriate offline fallback
async function getOfflineFallback(request) {
    const url = new URL(request.url);
    
    console.log('🔍 Looking for offline fallback for:', url.pathname);
    
    // For dashboard-related pages, return offline dashboard
    if (url.pathname.includes('dashboard') || url.pathname.includes('offline-dashboard')) {
        console.log('📊 Using offline dashboard fallback');
        const offlineDashboard = await caches.match('/offline-dashboard.html');
        if (offlineDashboard) {
            console.log('✅ Found offline dashboard fallback');
            return offlineDashboard;
        } else {
            console.log('❌ Offline dashboard not found in cache');
        }
    }
    
    // For API calls, return offline API response
    if (url.pathname.startsWith('/api/')) {
        console.log('🔌 Using offline API fallback');
        const offlineAPI = await caches.match('/offline-api.html');
        if (offlineAPI) {
            console.log('✅ Found offline API fallback');
            return offlineAPI;
        } else {
            console.log('❌ Offline API not found in cache');
        }
    }
    
    // For other HTML pages, return general offline page
    if (url.pathname.endsWith('.html') || url.pathname === '/') {
        console.log('📱 Using general offline page fallback');
        const offlinePage = await caches.match('/offline.html');
        if (offlinePage) {
            console.log('✅ Found general offline page fallback');
            return offlinePage;
        } else {
            console.log('❌ General offline page not found in cache');
        }
    }
    
    console.log('❌ No offline fallback found for:', url.pathname);
    return null;
}

// Background Sync for offline data
self.addEventListener('sync', (event) => {
    console.log('🔄 Background sync triggered:', event.tag);
    
    if (event.tag === 'offline-data-sync') {
        event.waitUntil(syncOfflineData());
    } else if (event.tag === 'medical-data-update') {
        event.waitUntil(updateMedicalData());
    } else if (event.tag === 'student-progress-sync') {
        event.waitUntil(syncStudentProgress());
    }
});

// Sync offline data when connection is restored
async function syncOfflineData() {
    try {
        const clients = await self.clients.matchAll();
        
        // Notify clients that sync is starting
        clients.forEach(client => {
            client.postMessage({
                type: 'SYNC_STARTED',
                message: '🔄 Syncing offline data...',
                timestamp: Date.now()
            });
        });

        // Get offline data from IndexedDB or localStorage
        const offlineData = await getOfflineData();
        
        if (offlineData && offlineData.length > 0) {
            // Sync each piece of offline data
            for (const data of offlineData) {
                await syncDataToServer(data);
            }
        }
        
        console.log('✅ Offline data sync completed');
        
        // Notify clients that sync is complete
        clients.forEach(client => {
            client.postMessage({
                type: 'SYNC_COMPLETED',
                message: '✅ Offline data synced successfully',
                timestamp: Date.now(),
                syncedItems: offlineData ? offlineData.length : 0
            });
        });
        
        // Clear offline data after successful sync
        await clearOfflineData();
        
    } catch (error) {
        console.error('❌ Error during background sync:', error);
        
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({
                type: 'SYNC_FAILED',
                message: '❌ Failed to sync offline data',
                error: error.message,
                timestamp: Date.now()
            });
        });
    }
}

// Update medical data periodically
async function updateMedicalData() {
    try {
        console.log('🏥 Updating medical data...');
        
        // Fetch latest medical guidelines and curriculum
        const medicalEndpoints = [
            '/api/medical-standards',
            '/api/clinical-guidelines',
            '/api/curriculum/1st',
            '/api/curriculum/2nd',
            '/api/curriculum/3rd'
        ];
        
        for (const endpoint of medicalEndpoints) {
            try {
                const response = await fetch(endpoint);
                if (response.ok) {
                    const cache = await caches.open(MEDICAL_CACHE);
                    cache.put(endpoint, response);
                    console.log(`✅ Updated: ${endpoint}`);
                }
            } catch (error) {
                console.log(`⚠️ Failed to update: ${endpoint}`, error);
            }
        }
        
        console.log('✅ Medical data update completed');
        
    } catch (error) {
        console.error('❌ Error updating medical data:', error);
    }
}

// Sync student progress
async function syncStudentProgress() {
    try {
        console.log('📚 Syncing student progress...');
        
        // This would sync student progress, completed tasks, etc.
        // Implementation depends on your data structure
        
        console.log('✅ Student progress sync completed');
        
    } catch (error) {
        console.error('❌ Error syncing student progress:', error);
    }
}

// Get offline data (placeholder - implement based on your storage)
async function getOfflineData() {
    // This should return data stored offline (e.g., from IndexedDB)
    // For now, return empty array
    return [];
}

// Sync data to server (placeholder - implement based on your API)
async function syncDataToServer(data) {
    // This should send data to your server
    // Implementation depends on your API structure
    console.log('Syncing data to server:', data);
}

// Clear offline data after successful sync
async function clearOfflineData() {
    // Clear offline data storage
    console.log('Clearing offline data storage');
}

// Push notifications for medical updates
self.addEventListener('push', (event) => {
    if (event.data) {
        try {
            const data = event.data.json();
            const options = {
                body: data.body || 'New medical update available',
                icon: '/icons/icon-192x192.png',
                badge: '/icons/icon-192x192.png',
                vibrate: [200, 100, 200],
                tag: data.tag || 'medical-update',
                data: {
                    url: data.url || '/',
                    timestamp: Date.now(),
                    type: data.type || 'general'
                },
                actions: [
                    {
                        action: 'view',
                        title: '👁️ View',
                        icon: '/icons/icon-192x192.png'
                    },
                    {
                        action: 'dismiss',
                        title: '❌ Dismiss'
                    }
                ],
                requireInteraction: data.requireInteraction || false,
                silent: data.silent || false
            };

            event.waitUntil(
                self.registration.showNotification('🏥 StethoLink AI', options)
            );
            
            console.log('📱 Push notification sent:', data);
            
        } catch (error) {
            console.error('❌ Error processing push notification:', error);
            
            // Fallback notification
            const fallbackOptions = {
                body: 'New medical update available',
                icon: '/icons/icon-192x192.png',
                badge: '/icons/icon-192x192.png'
            };
            
            event.waitUntil(
                self.registration.showNotification('🏥 StethoLink AI', fallbackOptions)
            );
        }
    }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'view') {
        event.waitUntil(
            self.clients.matchAll()
                .then(clients => {
                    if (clients.length > 0) {
                        // Focus existing client and navigate
                        clients[0].focus();
                        return clients[0].navigate(event.notification.data.url);
                    } else {
                        // Open new window if no clients exist
                        return self.clients.openWindow(event.notification.data.url);
                    }
                })
        );
    } else if (event.action === 'dismiss') {
        // Notification was dismissed
        console.log('Notification dismissed');
    }
});

// Handle messages from the main thread
self.addEventListener('message', (event) => {
    const { type, data } = event.data;
    
    switch (type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
            
        case 'GET_CACHE_STATUS':
            getCacheStatus().then(status => {
                event.ports[0].postMessage(status);
            });
            break;
            
        case 'CLEAR_CACHE':
            clearAllCaches().then(() => {
                event.ports[0].postMessage({ success: true });
            });
            break;
            
        case 'UPDATE_MEDICAL_DATA':
            updateMedicalData().then(() => {
                event.ports[0].postMessage({ success: true });
            });
            break;
            
        default:
            console.log('Unknown message type:', type);
    }
});

// Get cache status
async function getCacheStatus() {
    const cacheNames = await caches.keys();
    const status = {};
    
    for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        status[cacheName] = keys.length;
    }
    
    return status;
}

// Clear all caches
async function clearAllCaches() {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
    console.log('🗑️ All caches cleared');
}

// Periodic background sync for medical data updates
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'medical-data-update') {
        console.log('🔄 Periodic sync for medical data updates');
        event.waitUntil(updateMedicalData());
    }
});

// Handle offline/online status
let isOnline = navigator.onLine;

// Listen for online/offline events
self.addEventListener('online', () => {
    isOnline = true;
    console.log('🌐 Network connection restored');
    
    // Trigger sync when coming back online
    self.registration.sync.register('offline-data-sync');
});

self.addEventListener('offline', () => {
    isOnline = false;
    console.log('📴 Network connection lost');
});

// Health check for service worker
setInterval(() => {
    console.log('🏥 StethoLink AI Service Worker heartbeat - Online:', isOnline);
}, 300000); // Every 5 minutes

console.log('🏥 StethoLink AI Service Worker v' + CACHE_VERSION + ' loaded successfully');
console.log('📱 Offline functionality enabled');
console.log('🔄 Background sync ready');
console.log('📱 Push notifications ready'); 