// TODO - import typeWriter func

function initTypewriterEffect(firstPart, secondPart) {
	const welcomeText = document.getElementById('welcomeText');
	if (!welcomeText) return;
	
	const fullText = welcomeText.textContent;
	
	welcomeText.innerHTML = '';
	
	let i = 0;
	const typeSpeed = 50; // milliseconds per character
	const eraseSpeed = 30; // milliseconds per character (faster erasing)
	let isErasing = false;
	let isTypingThirdPart = false;
	
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
			isTypingThirdPart = true;
			setTimeout(() => {
				welcomeText.innerHTML = secondPart;
			}, 2000);
		}
	}
	
	// Start typing after a short delay
	setTimeout(typeChar, 500);
}

quoteFirstHalf = "Do not go gentle into that goodnight...";
quoteSecondHalf = "Rage, rage, rage against the dying of the light";

// Initialize typewriter effect when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initTypewriterEffect(quoteFirstHalf, quoteSecondHalf);
  initConstellationInteractions();
});

// Initialize constellation interactions
function initConstellationInteractions() {
  // Animate stars on scroll into view
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'scale(1)';
        }, index * 100);
      }
    });
  }, observerOptions);

  // Observe all star elements
  const stars = document.querySelectorAll('.course-star, .honor-star, .extracurricular-satellite');
  stars.forEach(star => {
    star.style.opacity = '0';
    star.style.transform = 'scale(0.8)';
    star.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(star);
  });

  // Add click handlers for detailed info (optional - could show tooltip or modal)
  stars.forEach(star => {
    star.addEventListener('click', function() {
      const data = this.dataset.course || this.dataset.honor || this.dataset.extracurricular;
      if (data) {
        // Could show a tooltip or modal with full information
        console.log(data);
      }
    });
  });
}