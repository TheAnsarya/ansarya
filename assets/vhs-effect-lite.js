/**
 * 🎬 VHS Effect - Lightweight Version
 * Minimal JS - just toggle functionality
 */

const VHSEffect = (function() {
	'use strict';

	let enabled = true;
	let toggleBtn = null;

	function init(options = {}) {
		// Load saved preference
		const saved = localStorage.getItem('vhs-effect-enabled');
		if (saved !== null) {
			enabled = saved === 'true';
		}

		// Add container class to body
		document.body.classList.add('vhs-container');

		// Apply initial state
		if (!enabled) {
			document.body.classList.add('vhs-disabled');
		}

		// Create toggle if requested
		if (options.showToggle !== false) {
			createToggle();
		}
	}

	function createToggle() {
		toggleBtn = document.createElement('button');
		toggleBtn.className = 'vhs-toggle';
		toggleBtn.setAttribute('aria-label', 'Toggle CRT effect');
		updateToggleText();
		toggleBtn.addEventListener('click', toggle);
		document.body.appendChild(toggleBtn);
	}

	function updateToggleText() {
		if (toggleBtn) {
			toggleBtn.textContent = enabled ? '📺 CRT: ON' : '📺 CRT: OFF';
		}
	}

	function toggle() {
		enabled = !enabled;
		document.body.classList.toggle('vhs-disabled', !enabled);
		localStorage.setItem('vhs-effect-enabled', enabled);
		updateToggleText();
		return enabled;
	}

	function enable() {
		enabled = true;
		document.body.classList.remove('vhs-disabled');
		localStorage.setItem('vhs-effect-enabled', 'true');
		updateToggleText();
	}

	function disable() {
		enabled = false;
		document.body.classList.add('vhs-disabled');
		localStorage.setItem('vhs-effect-enabled', 'false');
		updateToggleText();
	}

	function isEnabled() {
		return enabled;
	}

	return { init, toggle, enable, disable, isEnabled };
})();
