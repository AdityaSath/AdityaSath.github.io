let isInLightspeed = false;
let stars = [];
let speedometer = null;
let currentSpeed = 0;
const STAR_AREA_DIVISOR = 800;
let centerEl = null;

function calcCenter() {
	let center = document.createElement("div");
	center.setAttribute("class", "center");
	center.style.top = scy + "px";
	center.style.left = scx + "px";
	document.body.appendChild(center);
}

function calcAngle(p1, p2) {
	var angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
	return radToDegree(angle);
}

function radToDegree(rad) {
	return ((rad > 0 ? rad : 2 * Math.PI + rad) * 360) / (2 * Math.PI);
}

function toggleLightspeed() {
	if (!isInLightspeed) {
		// Entering lightspeed
		isInLightspeed = true;
		
		stars.forEach(star => {
			star.classList.remove('slowing');
			star.classList.add('traveling');
			star.speedInterval = speedInterval; // Store for later clearing
		});
	} else {
		// Exiting lightspeed
		isInLightspeed = false;
		
		// Clear speed interval and reset
		if (stars.length > 0 && stars[0].speedInterval) {
			clearInterval(stars[0].speedInterval);
		}
		
		
		stars.forEach(star => {
			star.classList.remove('traveling');
			star.classList.add('slowing');
		});
	}
}

function calcViewport() {
	sch = window.innerHeight;
	scw = window.innerWidth;
	scx = scw / 2;
	scy = sch / 2;
}

function positionCenter() {
	if (!centerEl) centerEl = document.querySelector('.center');
	if (centerEl) {
		centerEl.style.top = scy + "px";
		centerEl.style.left = scx + "px";
	}
}

function targetStarCount() {
	return Math.min(1000, Math.max(300, Math.floor((scw * sch) / STAR_AREA_DIVISOR)));
}

function clearStars() {
	for (const s of stars) s.remove();
	stars = [];
}

function createStars(count) {
	for (let i = 0; i < count; i++) {
		let div = document.createElement("div");
		let top = Math.floor(Math.random() * sch);
		let left = Math.floor(Math.random() * scw);
		let angle = calcAngle({ x: left, y: top }, { x: scx, y: scy });
		div.setAttribute("class", "star");
		div.style.top = top + "px";
		div.style.left = left + "px";
		div.style.transform = "rotate(" + (angle + 180) + "deg)";
		if (
			top >= scy - centerBounds &&
			top <= scy + centerBounds &&
			left >= scx - centerBounds &&
			left <= scx + centerBounds
		) {
			div.style.maxWidth = "1px";
		}
		document.body.appendChild(div);
		stars.push(div);
	}
}

function rebuildScene() {
	const inLS = isInLightspeed;
	if (stars.length > 0 && stars[0].speedInterval) {
		clearInterval(stars[0].speedInterval);
	}
	calcViewport();
	positionCenter();
	const count = targetStarCount();
	clearStars();
	createStars(count);
	if (inLS) {
		stars.forEach(star => {
			star.classList.remove('slowing');
			star.classList.add('traveling');
		});
	} else {
		stars.forEach(star => {
			star.classList.remove('traveling');
			star.classList.add('slowing');
		});
	}
}

// Calculate window size
let scw, sch, scx, scy;
calcViewport();
centerBounds = 40;

// Place central point
calcCenter();
positionCenter();

// Get references to existing HTML elements
const welcomeText = document.querySelector('.welcome-text');
speedometer = document.querySelector('.speedometer');

// Create stars responsively
createStars(targetStarCount());

// Listen for Enter key
document.addEventListener('keydown', (event) => {
	if (event.key === 'Enter') {
		toggleLightspeed();
	}
});

// Responsive rebuild on resize/orientation
let resizeTO;
function handleResize() {
	clearTimeout(resizeTO);
	resizeTO = setTimeout(rebuildScene, 150);
}
window.addEventListener('resize', handleResize, { passive: true });
window.addEventListener('orientationchange', handleResize);


// Welcome text character glow effect
function initWelcomeTextGlow() {
	const welcomeText = document.getElementById('welcomeText');
	if (!welcomeText) return;
	
	const text = welcomeText.textContent;
	welcomeText.innerHTML = '';
	
	// Create individual character spans
	for (let i = 0; i < text.length; i++) {
		const char = document.createElement('span');
		char.className = 'char';
		char.textContent = text[i];
		welcomeText.appendChild(char);
	}
	
	const chars = welcomeText.querySelectorAll('.char');
	const glowRadius = 3; // Number of characters around cursor to glow
	
	welcomeText.addEventListener('mousemove', (e) => {
		const rect = welcomeText.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		
		// Find which character is closest to cursor
		let closestCharIndex = 0;
		let minDistance = Infinity;
		
		chars.forEach((char, index) => {
			const charRect = char.getBoundingClientRect();
			const charX = charRect.left - rect.left + charRect.width / 2;
			const charY = charRect.top - rect.top + charRect.height / 2;
			
			const distance = Math.sqrt((x - charX) ** 2 + (y - charY) ** 2);
			
			if (distance < minDistance) {
				minDistance = distance;
				closestCharIndex = index;
			}
		});
		
		// Remove glow from all characters
		chars.forEach(char => char.classList.remove('glow'));
		
		// Add glow to characters around cursor
		for (let i = Math.max(0, closestCharIndex - glowRadius); 
			 i <= Math.min(chars.length - 1, closestCharIndex + glowRadius); 
			 i++) {
			chars[i].classList.add('glow');
		}
	});
	
	welcomeText.addEventListener('mouseleave', () => {
		chars.forEach(char => char.classList.remove('glow'));
	});
}

// Initialize the glow effect when DOM is loaded
document.addEventListener('DOMContentLoaded', initWelcomeTextGlow);

// Typewriter animation for welcome text
function initTypewriterEffect(firstPart, secondPart) {
	const welcomeText = document.getElementById('welcomeText');
	if (!welcomeText) return;
	
	const fullText = welcomeText.textContent;
	
	welcomeText.innerHTML = '';
	
	let i = 0;
	const typeSpeed = 50; // milliseconds per character
	const eraseSpeed = 30; // milliseconds per character (faster erasing)
	let isErasing = false;
	
	function typeChar() {
		if (!isErasing && i < firstPart.length) {
			// Typing first part
			const typedSpan = document.createElement('span');
			typedSpan.textContent = firstPart.substring(0, i + 1);
			
			const cursorSpan = document.createElement('span');
			cursorSpan.textContent = '|';
			cursorSpan.style.color = '#00ffff';
			cursorSpan.style.animation = 'blink 1s infinite';
			cursorSpan.style.fontWeight = 'normal';
			cursorSpan.style.opacity = '0.8';
			
			welcomeText.innerHTML = '';
			welcomeText.appendChild(typedSpan);
			welcomeText.appendChild(cursorSpan);
			
			i++;
			setTimeout(typeChar, typeSpeed);
		} else if (!isErasing && i >= firstPart.length) {
			// Finished typing first part, pause then start erasing
			setTimeout(() => {
				isErasing = true;
				i = firstPart.length - 1;
				typeChar();
			}, 1500); // Pause for 1.5 seconds
		} else if (isErasing && i >= 0) {
			// Erasing first part
			const typedSpan = document.createElement('span');
			typedSpan.textContent = firstPart.substring(0, i);
			
			const cursorSpan = document.createElement('span');
			cursorSpan.textContent = '|';
			cursorSpan.style.color = '#00ffff';
			cursorSpan.style.animation = 'blink 1s infinite';
			cursorSpan.style.fontWeight = 'normal';
			cursorSpan.style.opacity = '0.8';
			
			welcomeText.innerHTML = '';
			welcomeText.appendChild(typedSpan);
			welcomeText.appendChild(cursorSpan);
			
			i--;
			setTimeout(typeChar, eraseSpeed);
		} else if (isErasing && i < 0) {
			// Finished erasing, start typing second part
			i = 0;
			setTimeout(() => {
				typeSecondPart();
			}, 500); // Brief pause before typing second part

			setTimeout(() => {
				typeJumpInstructions();
			}, 500);
		}
	}
	
	function typeSecondPart() {
		if (i < secondPart.length) {
			const typedSpan = document.createElement('span');
			typedSpan.textContent = secondPart.substring(0, i + 1);
			
			const cursorSpan = document.createElement('span');
			cursorSpan.textContent = '|';
			cursorSpan.style.color = '#00ffff';
			cursorSpan.style.animation = 'blink 1s infinite';
			cursorSpan.style.fontWeight = 'normal';
			cursorSpan.style.opacity = '0.8';
			
			welcomeText.innerHTML = '';
			welcomeText.appendChild(typedSpan);
			welcomeText.appendChild(cursorSpan);
			
			i++;
			setTimeout(typeSecondPart, typeSpeed);
		} else {
			// Typing complete, remove cursor after a delay
			setTimeout(() => {
				welcomeText.innerHTML = secondPart;
			}, 2000);
		}
	}
	
	// Start typing after a short delay
	setTimeout(typeChar, 500);
}

moonQuoteFirstHalf = "If you shoot for the Moon and miss...";
moonQuoteSecondHalf = "You'll land among the stars";
// Initialize typewriter effect when DOM is loaded
document.addEventListener('DOMContentLoaded', initTypewriterEffect(moonQuoteFirstHalf, moonQuoteSecondHalf));

document.addEventListener('DOMContentLoaded', () => {
	const stars = document.querySelectorAll('.star');
  
	// delay before lightspeed starts
	setTimeout(() => {
	  // Start animation
	  stars.forEach(star => star.classList.add('traveling'));
  
	  // After animation + delay, reverse it
	  setTimeout(() => {
		stars.forEach(star => {
		  star.classList.remove('traveling');
		  star.classList.add('slowing');
		});
	  }, 3500); // (3s anim + 0.5s)
	}, 2500);
  });
  
  