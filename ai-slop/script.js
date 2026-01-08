"use strict";
        
        /**
         * @typedef {Object} Position
         * @property {number} x
         * @property {number} y
         */
        
        /**
         * Window Manager - Handles dragging and window management
         */
        class WindowManager {
            constructor() {
                /** @type {HTMLElement | null} */
                this.draggedWindow = null;
                /** @type {Position} */
                this.offset = { x: 0, y: 0 };
                this.zIndexCounter = 100;
                
                this.init();
            }
            
            /**
             * Initialize window manager
             * @returns {void}
             */
            init() {
                this.attachDragListeners();
                this.attachCloseListeners();
                this.bringToFrontOnClick();
            }
            
            /**
             * Attach drag listeners to title bars
             * @returns {void}
             */
            attachDragListeners() {
                const titleBars = document.querySelectorAll('.title-bar');
                
                titleBars.forEach(titleBar => {
                    titleBar.addEventListener('mousedown', (e) => {
                        this.startDrag(e);
                    });
                });
                
                document.addEventListener('mousemove', (e) => {
                    this.drag(e);
                });
                
                document.addEventListener('mouseup', () => {
                    this.endDrag();
                });
            }
            
            /**
             * Start dragging a window
             * @param {MouseEvent} e
             * @returns {void}
             */
            startDrag(e) {
                const titleBar = e.currentTarget;
                if (!(titleBar instanceof HTMLElement)) return;
                
                const windowEl = titleBar.parentElement;
                if (!windowEl) return;
                
                this.draggedWindow = windowEl;
                this.draggedWindow.classList.add('dragging');
                
                const rect = windowEl.getBoundingClientRect();
                this.offset = {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                };
                
                this.bringToFront(windowEl);
            }
            
            /**
             * Drag the window
             * @param {MouseEvent} e
             * @returns {void}
             */
            drag(e) {
                if (!this.draggedWindow) return;
                
                e.preventDefault();
                
                const x = e.clientX - this.offset.x;
                const y = e.clientY - this.offset.y;
                
                this.draggedWindow.style.left = Math.max(0, x) + 'px';
                this.draggedWindow.style.top = Math.max(0, y) + 'px';
            }
            
            /**
             * End dragging
             * @returns {void}
             */
            endDrag() {
                if (this.draggedWindow) {
                    this.draggedWindow.classList.remove('dragging');
                    this.draggedWindow = null;
                }
            }
            
            /**
             * Bring window to front
             * @param {HTMLElement} windowEl
             * @returns {void}
             */
            bringToFront(windowEl) {
                windowEl.style.zIndex = String(++this.zIndexCounter);
            }
            
            /**
             * Bring window to front on click
             * @returns {void}
             */
            bringToFrontOnClick() {
                const windows = document.querySelectorAll('.window');
                
                windows.forEach(windowEl => {
                    windowEl.addEventListener('mousedown', () => {
                        if (windowEl instanceof HTMLElement) {
                            this.bringToFront(windowEl);
                        }
                    });
                });
            }
            
            /**
             * Attach close button listeners
             * @returns {void}
             */
            attachCloseListeners() {
                const closeButtons = document.querySelectorAll('[data-action="close"]');
                
                closeButtons.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const windowEl = btn.closest('.window');
                        if (windowEl instanceof HTMLElement) {
                            this.closeWindow(windowEl);
                        }
                    });
                });
            }
            
            /**
             * Close a window with animation
             * @param {HTMLElement} windowEl
             * @returns {void}
             */
            closeWindow(windowEl) {
                windowEl.classList.remove('visible');
            }
            
            /**
             * Open a window by ID
             * @param {string} windowId
             * @returns {void}
             */
            openWindow(windowId) {
                const windowEl = document.getElementById(windowId);
                if (windowEl instanceof HTMLElement) {
                    windowEl.classList.add('visible');
                    this.bringToFront(windowEl);
                }
            }
        }
        
        /**
         * Desktop Icon Manager - Handles icon selection and double-click
         */
        class IconManager {
            constructor(windowManager) {
                /** @type {WindowManager} */
                this.windowManager = windowManager;
                /** @type {HTMLElement | null} */
                this.selectedIcon = null;
                
                this.init();
            }
            
            /**
             * Initialize icon manager
             * @returns {void}
             */
            init() {
                this.attachIconListeners();
            }
            
            /**
             * Attach icon listeners
             * @returns {void}
             */
            attachIconListeners() {
                const icons = document.querySelectorAll('.desktop-icon');
                
                icons.forEach(icon => {
                    icon.addEventListener('click', (e) => {
                        this.selectIcon(e.currentTarget);
                    });
                    
                    icon.addEventListener('dblclick', (e) => {
                        this.openIcon(e.currentTarget);
                    });
                });
                
                // Deselect on desktop click
                document.addEventListener('click', (e) => {
                    if (e.target instanceof HTMLElement && 
                        !e.target.closest('.desktop-icon') && 
                        !e.target.closest('.window')) {
                        this.deselectAll();
                    }
                });
            }
            
            /**
             * Select an icon
             * @param {EventTarget | null} iconEl
             * @returns {void}
             */
            selectIcon(iconEl) {
                if (!(iconEl instanceof HTMLElement)) return;
                
                this.deselectAll();
                iconEl.classList.add('selected');
                this.selectedIcon = iconEl;
            }
            
            /**
             * Deselect all icons
             * @returns {void}
             */
            deselectAll() {
                const icons = document.querySelectorAll('.desktop-icon');
                icons.forEach(icon => icon.classList.remove('selected'));
                this.selectedIcon = null;
            }
            
            /**
             * Open an icon (double-click)
             * @param {EventTarget | null} iconEl
             * @returns {void}
             */
            openIcon(iconEl) {
                if (!(iconEl instanceof HTMLElement)) return;
                
                const iconId = iconEl.id;
                const windowId = iconId.replace('icon-', 'window-');
                this.windowManager.openWindow(windowId);
            }
        }
        
        /**
         * Menu Manager - Handles menu interactions
         */
        class MenuManager {
            constructor(windowManager) {
                /** @type {WindowManager} */
                this.windowManager = windowManager;
                /** @type {HTMLElement | null} */
                this.activeMenu = null;
                
                this.init();
            }
            
            /**
             * Initialize menu manager
             * @returns {void}
             */
            init() {
                this.attachMenuListeners();
                this.attachDropdownListeners();
            }
            
            /**
             * Attach menu listeners
             * @returns {void}
             */
            attachMenuListeners() {
                const menuFile = document.getElementById('menu-file');
                
                if (menuFile) {
                    menuFile.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.toggleMenu('dropdown-file');
                    });
                }
                
                // Close menu on outside click
                document.addEventListener('click', () => {
                    this.closeAllMenus();
                });
            }
            
            /**
             * Toggle menu visibility
             * @param {string} menuId
             * @returns {void}
             */
            toggleMenu(menuId) {
                const menu = document.getElementById(menuId);
                if (!(menu instanceof HTMLElement)) return;
                
                const isActive = menu.classList.contains('active');
                this.closeAllMenus();
                
                if (!isActive) {
                    menu.classList.add('active');
                    this.activeMenu = menu;
                }
            }
            
            /**
             * Close all menus
             * @returns {void}
             */
            closeAllMenus() {
                const menus = document.querySelectorAll('.dropdown-menu');
                menus.forEach(menu => menu.classList.remove('active'));
                this.activeMenu = null;
            }
            
            /**
             * Attach dropdown listeners
             * @returns {void}
             */
            attachDropdownListeners() {
                const dropdownItems = document.querySelectorAll('.dropdown-item');
                
                dropdownItems.forEach(item => {
                    item.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const target = e.currentTarget;
                        if (target instanceof HTMLElement) {
                            const action = target.dataset.action;
                            this.handleDropdownAction(action || '');
                        }
                        this.closeAllMenus();
                    });
                });
            }
            
            /**
             * Handle dropdown action
             * @param {string} action
             * @returns {void}
             */
            handleDropdownAction(action) {
                switch(action) {
                    case 'open-about':
                        this.windowManager.openWindow('window-about');
                        break;
                    case 'open-project':
                        this.windowManager.openWindow('window-project');
                        break;
                    case 'open-system':
                        this.windowManager.openWindow('window-system');
                        break;
                }
            }
        }
        
        /**
         * Button Handler - Manages button interactions
         */
        class ButtonHandler {
            constructor() {
                this.init();
            }
            
            /**
             * Initialize button handlers
             * @returns {void}
             */
            init() {
                const viewProjectBtn = document.getElementById('view-project');
                const learnMoreBtn = document.getElementById('learn-more');
                
                if (viewProjectBtn) {
                    viewProjectBtn.addEventListener('click', () => {
                        this.handleViewProject();
                    });
                }
                
                if (learnMoreBtn) {
                    learnMoreBtn.addEventListener('click', () => {
                        this.handleLearnMore();
                    });
                }
            }
            
            /**
             * Handle view project button
             * @returns {void}
             */
            handleViewProject() {
                this.showAlert('Project Link', 'The Overgrown project link coming soon!');
            }
            
            /**
             * Handle learn more button
             * @returns {void}
             */
            handleLearnMore() {
                this.showAlert('Info', 'More information about The Overgrown coming soon!');
            }
            
            /**
             * Show Mac System 7 style alert
             * @param {string} title
             * @param {string} message
             * @returns {void}
             */
            showAlert(title, message) {
                const alertDiv = document.createElement('div');
                alertDiv.className = 'window visible';
                alertDiv.style.cssText = 'left: 50%; top: 50%; transform: translate(-50%, -50%); z-index: 10000; max-width: 400px;';
                
                alertDiv.innerHTML = `
                    <div class="title-bar">
                        <div class="title-bar-text">${title}</div>
                    </div>
                    <div class="window-content">
                        <p>${message}</p>
                        <button class="mac-button" onclick="this.closest('.window').remove()">OK</button>
                    </div>
                `;
                
                document.body.appendChild(alertDiv);
            }
        }
        
        /**
         * Application initialization
         * @returns {void}
         */
        function initApp() {
            try {
                const windowManager = new WindowManager();
                new IconManager(windowManager);
                new MenuManager(windowManager);
                new ButtonHandler();
                
                console.log('%c💾 PB System 7.0 Loaded', 'font-family: Monaco; font-size: 12px;');
            } catch (error) {
                console.error('Failed to initialize app:', error);
            }
        }
        
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initApp);
        } else {
            initApp();
        }
