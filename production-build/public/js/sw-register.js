// StethoLink AI Service Worker Registration
class ServiceWorkerManager {
    constructor() {
        this.swRegistration = null;
        this._isOnline = navigator.onLine;
        this.updateAvailable = false;
        this.init();
    }

    async init() {
        if ('serviceWorker' in navigator) {
            try {
                await this.registerServiceWorker();
                this.setupEventListeners();
                this.checkForUpdates();
                console.log('🏥 Service Worker Manager initialized successfully');
            } catch (error) {
                console.error('❌ Failed to initialize Service Worker Manager:', error);
            }
        } else {
            console.warn('⚠️ Service Worker not supported in this browser');
        }
    }

    async registerServiceWorker() {
        try {
            this.swRegistration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            });

            console.log('✅ Service Worker registered successfully:', this.swRegistration);

            // Handle service worker updates
            this.swRegistration.addEventListener('updatefound', () => {
                console.log('🔄 Service Worker update found');
                const newWorker = this.swRegistration.installing;
                
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed') {
                        if (navigator.serviceWorker.controller) {
                            this.updateAvailable = true;
                            this.showUpdateNotification();
                        }
                    }
                });
            });

            // Handle service worker state changes
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                console.log('🔄 Service Worker controller changed');
                this.updateAvailable = false;
                this.hideUpdateNotification();
            });

            return this.swRegistration;
        } catch (error) {
            console.error('❌ Service Worker registration failed:', error);
            throw error;
        }
    }

    setupEventListeners() {
        // Listen for online/offline events
        window.addEventListener('online', () => {
            this._isOnline = true;
            this.onConnectionRestored();
        });

        window.addEventListener('offline', () => {
            this._isOnline = false;
            this.onConnectionLost();
        });

        // Listen for messages from service worker
        navigator.serviceWorker.addEventListener('message', (event) => {
            this.handleServiceWorkerMessage(event.data);
        });

        // Listen for service worker errors
        navigator.serviceWorker.addEventListener('error', (error) => {
            console.error('❌ Service Worker error:', error);
        });
    }

    handleServiceWorkerMessage(data) {
        const { type, message, timestamp, syncedItems, error } = data;

        switch (type) {
            case 'SW_ACTIVATED':
                console.log('🔄 Service Worker activated:', data);
                this.showNotification('Service Worker Updated', 'New version activated successfully', 'success');
                break;

            case 'SYNC_STARTED':
                console.log('🔄 Sync started:', message);
                this.showSyncStatus('🔄 Syncing offline data...', 'info');
                break;

            case 'SYNC_COMPLETED':
                console.log('✅ Sync completed:', message);
                this.showSyncStatus(`✅ Sync completed! ${syncedItems || 0} items synced`, 'success');
                this.hideSyncStatus(3000);
                break;

            case 'SYNC_FAILED':
                console.error('❌ Sync failed:', error);
                this.showSyncStatus(`❌ Sync failed: ${error}`, 'error');
                this.hideSyncStatus(5000);
                break;

            default:
                console.log('📨 Unknown message from Service Worker:', data);
        }
    }

    onConnectionRestored() {
        console.log('🌐 Connection restored');
        this.showNotification('Connection Restored', 'You are back online!', 'success');
        
        // Trigger background sync
        if (this.swRegistration && this.swRegistration.sync) {
            this.swRegistration.sync.register('offline-data-sync')
                .then(() => {
                    console.log('🔄 Background sync registered');
                })
                .catch(error => {
                    console.error('❌ Background sync registration failed:', error);
                });
        }
    }

    onConnectionLost() {
        console.log('📴 Connection lost');
        this.showNotification('Connection Lost', 'You are now offline', 'warning');
    }

    async checkForUpdates() {
        if (this.swRegistration) {
            try {
                await this.swRegistration.update();
                console.log('🔄 Update check completed');
            } catch (error) {
                console.error('❌ Update check failed:', error);
            }
        }
    }

    async updateServiceWorker() {
        if (this.updateAvailable && this.swRegistration && this.swRegistration.waiting) {
            try {
                this.swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
                console.log('🔄 Update message sent to waiting service worker');
            } catch (error) {
                console.error('❌ Failed to update service worker:', error);
            }
        }
    }

    async getCacheStatus() {
        if ('caches' in window) {
            try {
                const cacheNames = await caches.keys();
                const status = {};
                
                for (const cacheName of cacheNames) {
                    const cache = await caches.open(cacheName);
                    const keys = await cache.keys();
                    status[cacheName] = keys.length;
                }
                
                return status;
            } catch (error) {
                console.error('❌ Failed to get cache status:', error);
                return {};
            }
        }
        return {};
    }

    async clearAllCaches() {
        if ('caches' in window) {
            try {
                const cacheNames = await caches.keys();
                await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
                console.log('🗑️ All caches cleared');
                return true;
            } catch (error) {
                console.error('❌ Failed to clear caches:', error);
                return false;
            }
        }
        return false;
    }

    async updateMedicalData() {
        if (this.swRegistration) {
            try {
                await this.swRegistration.sync.register('medical-data-update');
                console.log('🔄 Medical data update sync registered');
                return true;
            } catch (error) {
                console.error('❌ Failed to register medical data update sync:', error);
                return false;
            }
        }
        return false;
    }

    showUpdateNotification() {
        const notification = document.createElement('div');
        notification.id = 'sw-update-notification';
        notification.className = 'sw-update-notification';
        notification.innerHTML = `
            <div class="sw-update-content">
                <span>🔄 New version available!</span>
                <button onclick="swManager.updateServiceWorker()" class="sw-update-btn">Update Now</button>
                <button onclick="swManager.hideUpdateNotification()" class="sw-update-dismiss">Dismiss</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-hide after 30 seconds
        setTimeout(() => {
            this.hideUpdateNotification();
        }, 30000);
    }

    hideUpdateNotification() {
        const notification = document.getElementById('sw-update-notification');
        if (notification) {
            notification.remove();
        }
    }

    showSyncStatus(message, type = 'info') {
        let statusElement = document.getElementById('sw-sync-status');
        
        if (!statusElement) {
            statusElement = document.createElement('div');
            statusElement.id = 'sw-sync-status';
            statusElement.className = `sw-sync-status sw-sync-${type}`;
            document.body.appendChild(statusElement);
        }
        
        statusElement.textContent = message;
        statusElement.className = `sw-sync-status sw-sync-${type} sw-sync-show`;
    }

    hideSyncStatus(delay = 0) {
        setTimeout(() => {
            const statusElement = document.getElementById('sw-sync-status');
            if (statusElement) {
                statusElement.classList.remove('sw-sync-show');
                setTimeout(() => {
                    if (statusElement.parentNode) {
                        statusElement.remove();
                    }
                }, 300);
            }
        }, delay);
    }

    showNotification(title, message, type = 'info') {
        // Check if browser supports notifications
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                body: message,
                icon: '/icons/icon-192x192.png',
                badge: '/icons/icon-192x192.png'
            });
        } else {
            // Fallback to console and status bar
            console.log(`${title}: ${message}`);
            this.showSyncStatus(`${title}: ${message}`, type);
        }
    }

    async requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            try {
                const permission = await Notification.requestPermission();
                console.log('📱 Notification permission:', permission);
                return permission === 'granted';
            } catch (error) {
                console.error('❌ Failed to request notification permission:', error);
                return false;
            }
        }
        return Notification.permission === 'granted';
    }

    // Public API methods
    get isUpdateAvailable() {
        return this.updateAvailable;
    }

    get isOnline() {
        return this._isOnline;
    }

    get registration() {
        return this.swRegistration;
    }
}

// Initialize the Service Worker Manager
let swManager;

// Check if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSWManager);
} else {
    // DOM is already loaded, initialize immediately
    initializeSWManager();
}

function initializeSWManager() {
    swManager = new ServiceWorkerManager();
    
    // Make it globally accessible
    window.swManager = swManager;
    
    // Request notification permission
    swManager.requestNotificationPermission();
    
    // Add CSS for notifications
    addServiceWorkerStyles();
    
    console.log('🌐 Service Worker Manager made globally available as window.swManager');
}

// Add CSS styles for service worker notifications
function addServiceWorkerStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .sw-update-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        }
        
        .sw-update-content {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .sw-update-btn {
            background: rgba(255,255,255,0.2);
            border: 1px solid rgba(255,255,255,0.3);
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .sw-update-btn:hover {
            background: rgba(255,255,255,0.3);
            transform: translateY(-1px);
        }
        
        .sw-update-dismiss {
            background: transparent;
            border: 1px solid rgba(255,255,255,0.3);
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .sw-update-dismiss:hover {
            background: rgba(255,255,255,0.1);
        }
        
        .sw-sync-status {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: white;
            padding: 12px 25px;
            border-radius: 25px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .sw-sync-status.sw-sync-show {
            opacity: 1;
        }
        
        .sw-sync-info {
            border-left: 4px solid #17a2b8;
        }
        
        .sw-sync-success {
            border-left: 4px solid #28a745;
        }
        
        .sw-sync-warning {
            border-left: 4px solid #ffc107;
        }
        
        .sw-sync-error {
            border-left: 4px solid #dc3545;
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @media (max-width: 768px) {
            .sw-update-notification {
                top: 10px;
                right: 10px;
                left: 10px;
                right: auto;
            }
            
            .sw-update-content {
                flex-direction: column;
                gap: 10px;
            }
            
            .sw-sync-status {
                left: 20px;
                right: 20px;
                transform: none;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ServiceWorkerManager;
} 