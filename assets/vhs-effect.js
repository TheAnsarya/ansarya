/**
 * 🎬 VHS/CRT Effect - Dynamic JavaScript Component
 *
 * Usage:
 *   <script src="assets/vhs-effect.js"></script>
 *   <script>
 *     VHSEffect.init({ intensity: 0.5, showToggle: true });
 *   </script>
 */

const VHSEffect = (function() {
	'use strict';

	// Default configuration
	const defaults = {
		intensity: 1.0,           // Overall effect intensity (0-1)
		scanlines: true,          // Enable scanlines
		noise: true,              // Enable noise/grain
		flicker: true,            // Enable screen flicker
		trackingBar: true,        // Enable VHS tracking bar
		vignette: true,           // Enable vignette
		chromatic: false,         // Enable chromatic aberration (expensive)
		powerOnEffect: true,      // Play power-on animation on load
		showToggle: true,         // Show toggle button
		glitchInterval: 8000,     // Random glitch interval (ms)
		respectReducedMotion: true // Respect prefers-reduced-motion
	};

	let config = { ...defaults };
	let enabled = true;
	let elements = {};
	let glitchTimer = null;

	/**
	 * Initialize the VHS effect
	 * @param {Object} options - Configuration options
	 */
	function init(options = {}) {
		config = { ...defaults, ...options };

		// Check reduced motion preference
		if (config.respectReducedMotion &&
			window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			config.flicker = false;
			config.noise = false;
			config.trackingBar = false;
			config.glitchInterval = 0;
		}

		// Load saved preference
		const saved = localStorage.getItem('vhs-effect-enabled');
		if (saved !== null) {
			enabled = saved === 'true';
		}

		// Create effect elements
		createElements();

		// Apply initial state
		if (enabled) {
			enable();
		} else {
			disable();
		}

		// Create toggle button
		if (config.showToggle) {
			createToggleButton();
		}

		// Start random glitch timer
		if (config.glitchInterval > 0) {
			startGlitchTimer();
		}

		// Power-on effect
		if (config.powerOnEffect && enabled) {
			document.body.classList.add('vhs-power-on');
			setTimeout(() => {
				document.body.classList.remove('vhs-power-on');
			}, 800);
		}

		console.log('🎬 VHS Effect initialized', config);
	}

	/**
	 * Create the overlay elements
	 */
	function createElements() {
		// Add vhs-container class to body
		document.body.classList.add('vhs-container');

		// Create noise layer
		if (config.noise) {
			elements.noise = document.createElement('div');
			elements.noise.className = 'vhs-noise';
			elements.noise.setAttribute('aria-hidden', 'true');
			document.body.appendChild(elements.noise);
		}

		// Create flicker layer
		if (config.flicker) {
			elements.flicker = document.createElement('div');
			elements.flicker.className = 'vhs-flicker';
			elements.flicker.setAttribute('aria-hidden', 'true');
			document.body.appendChild(elements.flicker);
		}

		// Create tracking bar
		if (config.trackingBar) {
			elements.trackingBar = document.createElement('div');
			elements.trackingBar.className = 'vhs-tracking-bar';
			elements.trackingBar.setAttribute('aria-hidden', 'true');
			document.body.appendChild(elements.trackingBar);
		}

		// Apply intensity via CSS variables
		updateIntensity(config.intensity);
	}

	/**
	 * Create the toggle button
	 */
	function createToggleButton() {
		const button = document.createElement('button');
		button.className = 'vhs-toggle';
		button.setAttribute('aria-label', 'Toggle VHS effect');
		button.setAttribute('title', 'Toggle VHS effect');
		updateToggleText(button);

		button.addEventListener('click', () => {
			toggle();
			updateToggleText(button);
		});

		document.body.appendChild(button);
		elements.toggle = button;
	}

	/**
	 * Update toggle button text
	 */
	function updateToggleText(button) {
		button.textContent = enabled ? '📺 VHS: ON' : '📺 VHS: OFF';
	}

	/**
	 * Enable the VHS effect
	 */
	function enable() {
		enabled = true;
		document.body.classList.remove('vhs-disabled');
		localStorage.setItem('vhs-effect-enabled', 'true');

		if (elements.toggle) {
			updateToggleText(elements.toggle);
		}
	}

	/**
	 * Disable the VHS effect
	 */
	function disable() {
		enabled = false;
		document.body.classList.add('vhs-disabled');
		localStorage.setItem('vhs-effect-enabled', 'false');

		if (elements.toggle) {
			updateToggleText(elements.toggle);
		}
	}

	/**
	 * Toggle the VHS effect
	 */
	function toggle() {
		if (enabled) {
			disable();
		} else {
			enable();
		}
		return enabled;
	}

	/**
	 * Update effect intensity
	 * @param {number} value - Intensity value (0-1)
	 */
	function updateIntensity(value) {
		config.intensity = Math.max(0, Math.min(1, value));

		const root = document.documentElement;
		root.style.setProperty('--vhs-scanline-opacity', 0.08 * config.intensity);
		root.style.setProperty('--vhs-noise-opacity', 0.03 * config.intensity);
		root.style.setProperty('--vhs-flicker-intensity', 0.015 * config.intensity);
		root.style.setProperty('--vhs-vignette-strength', 0.25 * config.intensity);
	}

	/**
	 * Start random glitch timer
	 */
	function startGlitchTimer() {
		if (glitchTimer) {
			clearTimeout(glitchTimer);
		}

		function scheduleGlitch() {
			const delay = config.glitchInterval + (Math.random() * config.glitchInterval);
			glitchTimer = setTimeout(() => {
				if (enabled) {
					triggerGlitch();
				}
				scheduleGlitch();
			}, delay);
		}

		scheduleGlitch();
	}

	/**
	 * Trigger a random glitch effect
	 */
	function triggerGlitch() {
		const glitchType = Math.floor(Math.random() * 3);

		switch (glitchType) {
			case 0:
				// Horizontal shift glitch
				document.body.style.transform = `translateX(${Math.random() * 4 - 2}px)`;
				setTimeout(() => {
					document.body.style.transform = '';
				}, 50 + Math.random() * 100);
				break;

			case 1:
				// Color shift glitch
				document.body.style.filter = `hue-rotate(${Math.random() * 20 - 10}deg)`;
				setTimeout(() => {
					document.body.style.filter = '';
				}, 80 + Math.random() * 80);
				break;

			case 2:
				// Brightness flicker
				document.body.style.filter = `brightness(${1 + Math.random() * 0.2})`;
				setTimeout(() => {
					document.body.style.filter = '';
				}, 30 + Math.random() * 50);
				break;
		}
	}

	/**
	 * Manually trigger a tracking glitch (VHS-style distortion)
	 */
	function trackingGlitch() {
		if (!enabled) return;

		document.body.classList.add('vhs-tracking-glitch');
		setTimeout(() => {
			document.body.classList.remove('vhs-tracking-glitch');
		}, 500);
	}

	/**
	 * Check if effect is currently enabled
	 * @returns {boolean}
	 */
	function isEnabled() {
		return enabled;
	}

	/**
	 * Get current configuration
	 * @returns {Object}
	 */
	function getConfig() {
		return { ...config };
	}

	/**
	 * Destroy the VHS effect and clean up
	 */
	function destroy() {
		// Remove elements
		Object.values(elements).forEach(el => {
			if (el && el.parentNode) {
				el.parentNode.removeChild(el);
			}
		});
		elements = {};

		// Remove classes
		document.body.classList.remove('vhs-container', 'vhs-disabled', 'vhs-power-on');

		// Clear timer
		if (glitchTimer) {
			clearTimeout(glitchTimer);
			glitchTimer = null;
		}

		// Clear inline styles
		document.body.style.transform = '';
		document.body.style.filter = '';

		console.log('🎬 VHS Effect destroyed');
	}

	// Public API
	return {
		init,
		enable,
		disable,
		toggle,
		updateIntensity,
		triggerGlitch,
		trackingGlitch,
		isEnabled,
		getConfig,
		destroy
	};
})();

// Auto-initialize if data attribute is present
document.addEventListener('DOMContentLoaded', () => {
	const autoInit = document.querySelector('[data-vhs-auto]');
	if (autoInit) {
		const intensity = parseFloat(autoInit.dataset.vhsIntensity) || 1.0;
		const showToggle = autoInit.dataset.vhsToggle !== 'false';
		VHSEffect.init({ intensity, showToggle });
	}
});
