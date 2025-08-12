/**
 * Quick Actions JavaScript Module
 * Handles interactive functionality for quick action buttons
 */

class QuickActionsManager {
    constructor() {
        this.activeActions = new Set();
        this.actionHistory = [];
        this.maxHistory = 50;
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupTooltips();
        this.setupKeyboardShortcuts();
        this.loadUserPreferences();
    }

    bindEvents() {
        // Bind click events to all quick action buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.quick-action-btn')) {
                this.handleActionClick(e.target.closest('.quick-action-btn'));
            }
        });

        // Bind hover events for enhanced interactions
        document.addEventListener('mouseenter', (e) => {
            if (e.target.closest('.quick-action-btn')) {
                this.handleActionHover(e.target.closest('.quick-action-btn'));
            }
        }, true);

        // Bind focus events for accessibility
        document.addEventListener('focusin', (e) => {
            if (e.target.closest('.quick-action-btn')) {
                this.handleActionFocus(e.target.closest('.quick-action-btn'));
            }
        });
    }

    handleActionClick(actionBtn) {
        const actionType = this.getActionType(actionBtn);
        const actionData = this.getActionData(actionBtn);
        
        // Add to history
        this.addToHistory(actionData);
        
        // Track active state
        this.toggleActiveState(actionBtn);
        
        // Execute action based on type
        this.executeAction(actionType, actionData);
        
        // Add click animation
        this.addClickAnimation(actionBtn);
        
        // Update UI state
        this.updateUIState(actionBtn);
    }

    handleActionHover(actionBtn) {
        if (!actionBtn.classList.contains('disabled')) {
            // Add hover effects
            this.addHoverEffects(actionBtn);
            
            // Show tooltip if available
            this.showTooltip(actionBtn);
            
            // Add subtle animation
            this.addHoverAnimation(actionBtn);
        }
    }

    handleActionFocus(actionBtn) {
        // Add focus styles
        actionBtn.classList.add('focused');
        
        // Announce action for screen readers
        this.announceAction(actionBtn);
    }

    getActionType(actionBtn) {
        // Determine action type from classes or data attributes
        if (actionBtn.classList.contains('medical')) return 'medical';
        if (actionBtn.classList.contains('study')) return 'study';
        if (actionBtn.classList.contains('practice')) return 'practice';
        if (actionBtn.classList.contains('emergency')) return 'emergency';
        return 'general';
    }

    getActionData(actionBtn) {
        const label = actionBtn.querySelector('.action-label')?.textContent || '';
        const description = actionBtn.querySelector('.action-description')?.textContent || '';
        const icon = actionBtn.querySelector('.action-icon')?.className || '';
        
        return {
            label,
            description,
            icon,
            type: this.getActionType(actionBtn),
            timestamp: new Date().toISOString(),
            element: actionBtn
        };
    }

    executeAction(actionType, actionData) {
        // Execute different actions based on type
        switch (actionType) {
            case 'medical':
                this.executeMedicalAction(actionData);
                break;
            case 'study':
                this.executeStudyAction(actionData);
                break;
            case 'practice':
                this.executePracticeAction(actionData);
                break;
            case 'emergency':
                this.executeEmergencyAction(actionData);
                break;
            default:
                this.executeGeneralAction(actionData);
        }
    }

    executeMedicalAction(actionData) {
        console.log('Executing medical action:', actionData.label);
        
        // Show medical-specific feedback
        this.showActionFeedback(actionData, 'medical');
        
        // Trigger medical system events
        this.triggerSystemEvent('medical-action', actionData);
    }

    executeStudyAction(actionData) {
        console.log('Executing study action:', actionData.label);
        
        // Show study-specific feedback
        this.showActionFeedback(actionData, 'study');
        
        // Trigger study system events
        this.triggerSystemEvent('study-action', actionData);
    }

    executePracticeAction(actionData) {
        console.log('Executing practice action:', actionData.label);
        
        // Show practice-specific feedback
        this.showActionFeedback(actionData, 'practice');
        
        // Trigger practice system events
        this.triggerSystemEvent('practice-action', actionData);
    }

    executeEmergencyAction(actionData) {
        console.log('Executing emergency action:', actionData.label);
        
        // Show emergency-specific feedback
        this.showActionFeedback(actionData, 'emergency');
        
        // Trigger emergency system events
        this.triggerSystemEvent('emergency-action', actionData);
        
        // Add urgency indicators
        this.addUrgencyIndicators(actionData.element);
    }

    executeGeneralAction(actionData) {
        console.log('Executing general action:', actionData.label);
        
        // Show general feedback
        this.showActionFeedback(actionData, 'general');
        
        // Trigger general system events
        this.triggerSystemEvent('general-action', actionData);
    }

    showActionFeedback(actionData, type) {
        // Create feedback element
        const feedback = document.createElement('div');
        feedback.className = `action-feedback ${type}`;
        feedback.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${actionData.label} activated</span>
        `;
        
        // Add to page
        document.body.appendChild(feedback);
        
        // Animate in
        setTimeout(() => feedback.classList.add('show'), 100);
        
        // Remove after animation
        setTimeout(() => {
            feedback.classList.remove('show');
            setTimeout(() => feedback.remove(), 300);
        }, 2000);
    }

    addClickAnimation(actionBtn) {
        // Add ripple effect
        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect';
        actionBtn.appendChild(ripple);
        
        // Trigger ripple animation
        setTimeout(() => ripple.classList.add('active'), 10);
        
        // Remove ripple after animation
        setTimeout(() => ripple.remove(), 600);
    }

    addHoverEffects(actionBtn) {
        // Add glow effect
        actionBtn.style.boxShadow = '0 0 20px rgba(37, 99, 235, 0.3)';
        
        // Add scale effect
        actionBtn.style.transform = 'scale(1.05)';
    }

    addHoverAnimation(actionBtn) {
        // Add subtle bounce
        actionBtn.style.animation = 'bounce 0.6s ease';
        
        // Reset animation after completion
        setTimeout(() => {
            actionBtn.style.animation = '';
        }, 600);
    }

    addUrgencyIndicators(actionBtn) {
        // Add pulsing border
        actionBtn.style.animation = 'pulse 1s infinite';
        
        // Add urgency class
        actionBtn.classList.add('urgent');
        
        // Remove after 5 seconds
        setTimeout(() => {
            actionBtn.style.animation = '';
            actionBtn.classList.remove('urgent');
        }, 5000);
    }

    toggleActiveState(actionBtn) {
        if (actionBtn.classList.contains('active')) {
            actionBtn.classList.remove('active');
            this.activeActions.delete(actionBtn);
        } else {
            actionBtn.classList.add('active');
            this.activeActions.add(actionBtn);
        }
    }

    updateUIState(actionBtn) {
        // Update button appearance based on state
        if (actionBtn.classList.contains('active')) {
            actionBtn.style.background = 'var(--primary-dark)';
            actionBtn.style.borderColor = 'var(--primary-dark)';
        } else {
            // Reset to default styles
            actionBtn.style.background = '';
            actionBtn.style.borderColor = '';
        }
    }

    addToHistory(actionData) {
        this.actionHistory.unshift(actionData);
        
        // Limit history size
        if (this.actionHistory.length > this.maxHistory) {
            this.actionHistory.pop();
        }
        
        // Save to localStorage
        this.saveHistory();
    }

    saveHistory() {
        try {
            localStorage.setItem('quickActionsHistory', JSON.stringify(this.actionHistory));
        } catch (e) {
            console.warn('Could not save quick actions history:', e);
        }
    }

    loadHistory() {
        try {
            const saved = localStorage.getItem('quickActionsHistory');
            if (saved) {
                this.actionHistory = JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Could not load quick actions history:', e);
        }
    }

    setupTooltips() {
        // Create tooltip container
        const tooltipContainer = document.createElement('div');
        tooltipContainer.className = 'tooltip-container';
        document.body.appendChild(tooltipContainer);
        
        // Add tooltip event listeners
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('.quick-action-btn')) {
                this.showTooltip(e.target.closest('.quick-action-btn'));
            }
        });
        
        document.addEventListener('mouseout', (e) => {
            if (e.target.closest('.quick-action-btn')) {
                this.hideTooltip();
            }
        });
    }

    showTooltip(actionBtn) {
        const tooltip = document.querySelector('.tooltip-container');
        if (!tooltip) return;
        
        const label = actionBtn.querySelector('.action-label')?.textContent || '';
        const description = actionBtn.querySelector('.action-description')?.textContent || '';
        
        tooltip.innerHTML = `
            <div class="tooltip-content">
                <strong>${label}</strong>
                ${description ? `<br><small>${description}</small>` : ''}
            </div>
        `;
        
        // Position tooltip
        const rect = actionBtn.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) + 'px';
        tooltip.style.top = rect.top - 10 + 'px';
        tooltip.style.display = 'block';
    }

    hideTooltip() {
        const tooltip = document.querySelector('.tooltip-container');
        if (tooltip) {
            tooltip.style.display = 'none';
        }
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Alt + number keys for quick actions
            if (e.altKey && e.key >= '1' && e.key <= '9') {
                const actionIndex = parseInt(e.key) - 1;
                const actions = document.querySelectorAll('.quick-action-btn');
                
                if (actions[actionIndex]) {
                    this.handleActionClick(actions[actionIndex]);
                    actions[actionIndex].focus();
                }
            }
        });
    }

    loadUserPreferences() {
        // Load user preferences from localStorage
        try {
            const preferences = localStorage.getItem('quickActionsPreferences');
            if (preferences) {
                const prefs = JSON.parse(preferences);
                this.applyUserPreferences(prefs);
            }
        } catch (e) {
            console.warn('Could not load user preferences:', e);
        }
    }

    applyUserPreferences(preferences) {
        // Apply user preferences to quick actions
        if (preferences.theme) {
            document.documentElement.setAttribute('data-theme', preferences.theme);
        }
        
        if (preferences.gridSize) {
            const grids = document.querySelectorAll('.quick-actions-grid');
            grids.forEach(grid => {
                grid.className = `quick-actions-grid ${preferences.gridSize}`;
            });
        }
    }

    triggerSystemEvent(eventType, data) {
        // Create and dispatch custom events
        const event = new CustomEvent(`quick-action-${eventType}`, {
            detail: data,
            bubbles: true
        });
        
        document.dispatchEvent(event);
    }

    announceAction(actionBtn) {
        // Announce action for screen readers
        const label = actionBtn.querySelector('.action-label')?.textContent || '';
        const description = actionBtn.querySelector('.action-description')?.textContent || '';
        
        const announcement = description ? `${label}: ${description}` : label;
        
        // Create announcement element
        const announcementEl = document.createElement('div');
        announcementEl.setAttribute('aria-live', 'polite');
        announcementEl.setAttribute('aria-atomic', 'true');
        announcementEl.className = 'sr-only';
        announcementEl.textContent = announcement;
        
        document.body.appendChild(announcementEl);
        
        // Remove after announcement
        setTimeout(() => announcementEl.remove(), 1000);
    }

    // Public methods for external use
    getActiveActions() {
        return Array.from(this.activeActions);
    }

    getActionHistory() {
        return [...this.actionHistory];
    }

    resetActions() {
        this.activeActions.clear();
        this.actionHistory = [];
        this.saveHistory();
        
        // Reset all button states
        document.querySelectorAll('.quick-action-btn.active').forEach(btn => {
            btn.classList.remove('active');
            this.updateUIState(btn);
        });
    }

    exportHistory() {
        return JSON.stringify(this.actionHistory, null, 2);
    }

    importHistory(historyData) {
        try {
            const history = JSON.parse(historyData);
            if (Array.isArray(history)) {
                this.actionHistory = history.slice(0, this.maxHistory);
                this.saveHistory();
                return true;
            }
        } catch (e) {
            console.error('Invalid history data:', e);
        }
        return false;
    }
}

// Initialize Quick Actions Manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.quickActionsManager = new QuickActionsManager();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuickActionsManager;
} 