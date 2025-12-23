// // TODO - import typeWriter func

// function initTypewriterEffect(firstPart, secondPart) {
// 	const welcomeText = document.getElementById('welcomeText');
// 	if (!welcomeText) return;
	
// 	const fullText = welcomeText.textContent;
	
// 	welcomeText.innerHTML = '';
	
// 	let i = 0;
// 	const typeSpeed = 50; // milliseconds per character
// 	const eraseSpeed = 30; // milliseconds per character (faster erasing)
// 	let isErasing = false;
	
// 	function typeChar() {
// 		if (!isErasing && i < firstPart.length) {
// 			// Typing first part
// 			const typedSpan = document.createElement('span');
// 			typedSpan.textContent = firstPart.substring(0, i + 1);
			
// 			const cursorSpan = document.createElement('span');
// 			cursorSpan.textContent = '|';
// 			cursorSpan.style.color = '#00ffff';
// 			cursorSpan.style.animation = 'blink 1s infinite';
// 			cursorSpan.style.fontWeight = 'normal';
// 			cursorSpan.style.opacity = '0.8';
			
// 			welcomeText.innerHTML = '';
// 			welcomeText.appendChild(typedSpan);
// 			welcomeText.appendChild(cursorSpan);
			
// 			i++;
// 			setTimeout(typeChar, typeSpeed);
// 		} else if (!isErasing && i >= firstPart.length) {
// 			// Finished typing first part, pause then start erasing
// 			setTimeout(() => {
// 				isErasing = true;
// 				i = firstPart.length - 1;
// 				typeChar();
// 			}, 1500); // Pause for 1.5 seconds
// 		} else if (isErasing && i >= 0) {
// 			// Erasing first part
// 			const typedSpan = document.createElement('span');
// 			typedSpan.textContent = firstPart.substring(0, i);
			
// 			const cursorSpan = document.createElement('span');
// 			cursorSpan.textContent = '|';
// 			cursorSpan.style.color = '#00ffff';
// 			cursorSpan.style.animation = 'blink 1s infinite';
// 			cursorSpan.style.fontWeight = 'normal';
// 			cursorSpan.style.opacity = '0.8';
			
// 			welcomeText.innerHTML = '';
// 			welcomeText.appendChild(typedSpan);
// 			welcomeText.appendChild(cursorSpan);
			
// 			i--;
// 			setTimeout(typeChar, eraseSpeed);
// 		} else if (isErasing && i < 0) {
// 			// Finished erasing, start typing second part
// 			i = 0;
// 			setTimeout(() => {
// 				typeSecondPart();
// 			}, 500); // Brief pause before typing second part

// 			setTimeout(() => {
// 				typeJumpInstructions();
// 			}, 500);
// 		}
// 	}
	
// 	function typeSecondPart() {
// 		if (i < secondPart.length) {
// 			const typedSpan = document.createElement('span');
// 			typedSpan.textContent = secondPart.substring(0, i + 1);
			
// 			const cursorSpan = document.createElement('span');
// 			cursorSpan.textContent = '|';
// 			cursorSpan.style.color = '#00ffff';
// 			cursorSpan.style.animation = 'blink 1s infinite';
// 			cursorSpan.style.fontWeight = 'normal';
// 			cursorSpan.style.opacity = '0.8';
			
// 			welcomeText.innerHTML = '';
// 			welcomeText.appendChild(typedSpan);
// 			welcomeText.appendChild(cursorSpan);
			
// 			i++;
// 			setTimeout(typeSecondPart, typeSpeed);
// 		} else {
// 			// Typing complete, remove cursor after a delay
// 			setTimeout(() => {
// 				welcomeText.innerHTML = secondPart;
// 			}, 2000);
// 		}
// 	}
	
// 	// Start typing after a short delay
// 	setTimeout(typeChar, 500);
// }

// quoteFirstHalf = "Some look at things and ask why...";
// quoteSecondHalf = "Others dream and think why not";
// // Initialize typewriter effect when DOM is loaded
// document.addEventListener('DOMContentLoaded', initTypewriterEffect(quoteFirstHalf, quoteSecondHalf));

// Existing typewriter code
function initTypewriterEffect(firstPart, secondPart) {
	const welcomeText = document.getElementById('welcomeText');
	if (!welcomeText) return;
	
	const fullText = welcomeText.textContent;
	
	welcomeText.innerHTML = '';
	
	let i = 0;
	const typeSpeed = 50;
	const eraseSpeed = 30;
	let isErasing = false;
	
	function typeChar() {
		if (!isErasing && i < firstPart.length) {
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
			setTimeout(() => {
				isErasing = true;
				i = firstPart.length - 1;
				typeChar();
			}, 1500);
		} else if (isErasing && i >= 0) {
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
			i = 0;
			setTimeout(() => {
				typeSecondPart();
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
			setTimeout(() => {
				welcomeText.innerHTML = secondPart;
			}, 2000);
		}
	}
	
	setTimeout(typeChar, 500);
}

const quoteFirstHalf = "Some look at things and ask why...";
const quoteSecondHalf = "Others dream and think why not";

// Skills data
const skillsData = {
	'Languages': ['C++', 'C', 'Python', 'Java', 'JavaScript', 'TypeScript', 'HTML', 'CSS'],
	'Libraries': ['OpenGL', 'OpenCV', 'Boost', 'Requests', 'Chrono', 'BeautifulSoup', 'Selenium'],
	'Frameworks': ['Dear ImGui', 'JUnit', 'Jest', 'GTest'],
	'Technologies': ['Git', 'Windows', 'Linux', 'Github', 'Gitlab', 'Visual Studio', 'Microsoft Office', 'Jama', 'Wireshark', 'Putty'],
	'Other': ['Object-Oriented Design', 'Computer Vision', 'Version Control', 'Embedded Systems', 'Controls', 'Data Pipelines', 'System Verification', 'Communication', 'Collaboration', 'Machine Learning', 'Testing', 'Integration', 'Simulation', 'API (REST)', 'Networking', 'Agile']
};

// Particle animation class
class Particle {
	constructor(bar, index, totalParticles) {
		this.bar = bar;
		this.element = document.createElement('div');
		this.element.className = 'particle';
		this.bar.appendChild(this.element);
		
		this.delay = (index / totalParticles) * 2000;
		this.duration = 2000 + Math.random() * 1000;
		this.startTime = Date.now() + this.delay;
		
		this.animate();
	}
	
	animate() {
		const update = () => {
			const now = Date.now();
			if (now < this.startTime) {
				requestAnimationFrame(update);
				return;
			}
			
			const elapsed = (now - this.startTime) % this.duration;
			const progress = elapsed / this.duration;
			
			const barWidth = this.bar.offsetWidth;
			const position = progress * barWidth;
			const opacity = Math.sin(progress * Math.PI) * 0.8;
			
			this.element.style.left = position + 'px';
			this.element.style.opacity = opacity;
			
			requestAnimationFrame(update);
		};
		
		requestAnimationFrame(update);
	}
	
	destroy() {
		if (this.element && this.element.parentNode) {
			this.element.parentNode.removeChild(this.element);
		}
	}
}

// Initialize skills bars
function initSkillsBars() {
	const container = document.getElementById('skillsContainer');
	if (!container) return;
	
	const proficiencyMap = {
		'C++': 90, 'C': 85, 'Python': 88, 'Java': 82, 'JavaScript': 85, 'TypeScript': 80, 'HTML': 92, 'CSS': 90,
		'OpenGL': 85, 'OpenCV': 80, 'Boost': 75, 'Requests': 85, 'Chrono': 78, 'BeautifulSoup': 82, 'Selenium': 80,
		'Dear ImGui': 85, 'JUnit': 80, 'Jest': 78, 'GTest': 82,
		'Git': 90, 'Windows': 88, 'Linux': 85, 'Github': 88, 'Gitlab': 82, 'Visual Studio': 85, 'Microsoft Office': 90, 'Jama': 75, 'Wireshark': 78, 'Putty': 80,
		'Object-Oriented Design': 88, 'Computer Vision': 82, 'Version Control': 90, 'Embedded Systems': 85, 'Controls': 80, 'Data Pipelines': 82, 'System Verification': 85, 'Communication': 90, 'Collaboration': 92, 'Machine Learning': 80, 'Testing': 88, 'Integration': 85, 'Simulation': 82, 'API (REST)': 85, 'Networking': 80, 'Agile': 88
	};
	
	let skillIndex = 0;
	const particles = [];
	
	Object.keys(skillsData).forEach((category, catIndex) => {
		const categoryDiv = document.createElement('div');
		categoryDiv.className = 'skills-category';
		
		const categoryTitle = document.createElement('h3');
		categoryTitle.className = 'category-title';
		categoryTitle.textContent = category;
		categoryDiv.appendChild(categoryTitle);
		
		skillsData[category].forEach((skill, idx) => {
			const skillItem = document.createElement('div');
			skillItem.className = 'skill-item';
			
			const skillHeader = document.createElement('div');
			skillHeader.className = 'skill-header';
			
			const skillName = document.createElement('span');
			skillName.className = 'skill-name';
			skillName.textContent = skill;
			skillHeader.appendChild(skillName);
			
			const barContainer = document.createElement('div');
			barContainer.className = 'skill-bar-container';
			
			const barFill = document.createElement('div');
			barFill.className = 'skill-bar-fill';
			const proficiency = proficiencyMap[skill] || (70 + Math.random() * 25);
			barFill.style.setProperty('--skill-width', proficiency + '%');
			barContainer.appendChild(barFill);
			
			skillItem.appendChild(skillHeader);
			skillItem.appendChild(barContainer);
			categoryDiv.appendChild(skillItem);
			
			// Animate in skill items with delay
			setTimeout(() => {
				skillItem.classList.add('visible');
				
				// Create particles after bar is visible
				setTimeout(() => {
					const particleCount = 4;
					for (let i = 0; i < particleCount; i++) {
						const particle = new Particle(barContainer, i, particleCount);
						particles.push(particle);
					}
					
					// Add hover effect to increase particles
					let hoverParticles = [];
					skillItem.addEventListener('mouseenter', () => {
						for (let i = 0; i < 4; i++) {
							const particle = new Particle(barContainer, i + particleCount, particleCount * 2);
							hoverParticles.push(particle);
						}
					});
					
					skillItem.addEventListener('mouseleave', () => {
						hoverParticles.forEach(p => p.destroy());
						hoverParticles = [];
					});
				}, 800);
			}, skillIndex * 50);
			
			skillIndex++;
		});
		
		container.appendChild(categoryDiv);
	});
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
	initTypewriterEffect(quoteFirstHalf, quoteSecondHalf);
	initSkillsBars();
});