document.addEventListener('DOMContentLoaded', function() {
    const pwaStatus = document.getElementById('pwa-status');
    
    // Register Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/service-worker.js')
                .then(function(registration) {
                    console.log('Service Worker registered with scope:', registration.scope);
                    pwaStatus.textContent = 'Aplikasi siap untuk digunakan offline';
                    pwaStatus.style.color = '#4CAF50';
                })
                .catch(function(error) {
                    console.log('Service Worker registration failed:', error);
                    pwaStatus.textContent = 'Mode online';
                    pwaStatus.style.color = '#FF9800';
                });
        });
    }

    // Handle PWA Installation
    let deferredPrompt;
    const installButton = document.createElement('button');
    
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        // Create install button
        installButton.innerHTML = '<i class="fas fa-download"></i> Install Aplikasi';
        installButton.className = 'download-btn install-button';
        installButton.style.margin = '10px auto';
        installButton.style.display = 'block';
        
        const footer = document.querySelector('footer');
        footer.insertBefore(installButton, pwaStatus);
        
        installButton.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`User response to the install prompt: ${outcome}`);
                deferredPrompt = null;
                installButton.style.display = 'none';
                pwaStatus.textContent = 'Aplikasi berhasil diinstal!';
                pwaStatus.style.color = '#4CAF50';
            }
        });
        
        pwaStatus.textContent = 'Klik tombol di atas untuk menginstal aplikasi';
        pwaStatus.style.color = '#ff0844';
    });

    window.addEventListener('appinstalled', () => {
        console.log('PWA was installed');
        installButton.style.display = 'none';
        deferredPrompt = null;
    });

    // Check if app is running in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
        pwaStatus.textContent = 'Aplikasi sedang berjalan dalam mode mandiri';
        pwaStatus.style.color = '#4CAF50';
    }

    // Add to Home Screen for iOS
    if (window.navigator.standalone === true) {
        pwaStatus.textContent = 'Aplikasi iOS berjalan dalam mode standalone';
        pwaStatus.style.color = '#4CAF50';
    }

    // Online/Offline detection
    window.addEventListener('online', () => {
        pwaStatus.textContent = 'Aplikasi siap digunakan (online)';
        pwaStatus.style.color = '#4CAF50';
    });

    window.addEventListener('offline', () => {
        pwaStatus.textContent = 'Anda sedang offline - beberapa fitur mungkin tidak tersedia';
        pwaStatus.style.color = '#FF9800';
    });

    // Cache management
    if ('caches' in window) {
        // Clear old caches on load
        caches.keys().then(cacheNames => {
            cacheNames.forEach(cacheName => {
                if (cacheName !== 'tiktok-downloader-v1') {
                    caches.delete(cacheName);
                }
            });
        });
    }
});