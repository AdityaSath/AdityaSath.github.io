// experience.js

function initTypewriterEffect(firstPart, secondPart) {
  const welcomeText = document.getElementById('welcomeText');
  if (!welcomeText) return;
  
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
			// Typing complete, remove cursor after a delay
			isTypingThirdPart = true;
			setTimeout(() => {
				welcomeText.innerHTML = secondPart;
				
				// Add author name with fade-in
				const authorSpan = document.createElement('div');
				authorSpan.textContent = '— Terry Russell';  // CHANGE THIS per page
				authorSpan.style.fontSize = 'clamp(14px, 3vw, 24px)';
				authorSpan.style.color = 'rgba(255, 255, 255, 0.7)';
				authorSpan.style.fontStyle = 'italic';
				authorSpan.style.opacity = '0';
				authorSpan.style.transition = 'opacity 2s ease';
				authorSpan.style.position = 'absolute';
				authorSpan.style.top = '100%';
				authorSpan.style.left = '50%';
				authorSpan.style.transform = 'translateX(-50%)';
				authorSpan.style.marginTop = '20px';
				authorSpan.style.whiteSpace = 'nowrap';
				
				welcomeText.appendChild(authorSpan);
				
				// Trigger fade-in
				setTimeout(() => {
					authorSpan.style.opacity = '1';
				}, 100);
			}, 2000);
		}
	}
  
  setTimeout(typeChar, 500);
}

// Toggle panel expansion on click
function togglePanelExpansion(node) {
  const leftPanel = node.querySelector('.timeline-content.left');
  const rightPanel = node.querySelector('.timeline-content.right');
  
  if (leftPanel) {
    leftPanel.classList.toggle('expanded');
  }
  if (rightPanel) {
    rightPanel.classList.toggle('expanded');
  }
}

// Flip impact panel between statement and metrics on click
function flipPanel(panel, event) {
  event.stopPropagation(); // Prevent triggering the expansion toggle
  const statement = panel.querySelector('.impact-statement');
  const metrics = panel.querySelector('.impact-metrics');
  if (statement && metrics) {
    statement.classList.toggle('active');
    metrics.classList.toggle('active');
  }
}

// Initialize click handlers for timeline nodes
function initTimelineClickHandlers() {
  const timelineNodes = document.querySelectorAll('.timeline-node');
  
  timelineNodes.forEach(node => {
    const wrapper = node.querySelector('.timeline-panel-wrapper');
    const leftPanel = node.querySelector('.timeline-content.left');
    const rightPanel = node.querySelector('.timeline-content.right');
    
    // Make wrapper clickable for expansion (both panels expand together)
    if (wrapper) {
      wrapper.addEventListener('click', function(e) {
        // Don't trigger if clicking on a link or button inside
        if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
          return;
        }
        togglePanelExpansion(node);
      });
    }
    
    // Make left panel clickable for expansion
    if (leftPanel) {
      leftPanel.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent wrapper click from firing
        togglePanelExpansion(node);
      });
    }
    
    // Make right panel clickable for expansion
    if (rightPanel) {
      rightPanel.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent wrapper click from firing
        // When expanded, clicking on statement/metrics flips between them
        if (rightPanel.classList.contains('expanded') && 
            (e.target.closest('.impact-statement') || e.target.closest('.impact-metrics'))) {
          flipPanel(rightPanel, e);
        } else {
          // Otherwise, expand/collapse both panels
          togglePanelExpansion(node);
        }
      });
    }
  });
}

// Scroll animation for timeline nodes
function checkNodes() {
  const nodes = document.querySelectorAll('.timeline-node');
  const triggerBottom = window.innerHeight * 0.85;

  nodes.forEach(node => {
    const nodeTop = node.getBoundingClientRect().top;
    if(nodeTop < triggerBottom) {
      node.classList.add('visible');
    }
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  const quoteFirstHalf = "Adventure is not in the guidebook...";
  const quoteSecondHalf = "And beauty is not on the map";
  initTypewriterEffect(quoteFirstHalf, quoteSecondHalf);
  
  // Initialize timeline click handlers
  initTimelineClickHandlers();
  
  // Extract role titles and populate right panels
  extractRoleTitles();
  
  // Initial check for visible nodes
  checkNodes();
});

// Extract role title from left panel and add to right panel
function extractRoleTitles() {
  const timelineNodes = document.querySelectorAll('.timeline-node');
  
  timelineNodes.forEach(node => {
    const leftPanel = node.querySelector('.timeline-content.left');
    const rightPanel = node.querySelector('.timeline-content.right.impact-panel');
    
    if (leftPanel && rightPanel) {
      // Find the role paragraph in the left panel
      const roleParagraphs = leftPanel.querySelectorAll('p');
      let roleText = '';
      
      roleParagraphs.forEach(p => {
        const strong = p.querySelector('strong');
        if (strong && strong.textContent.includes('Role:')) {
          roleText = p.textContent.replace('Role:', '').trim();
        }
      });
      
      if (roleText) {
        // Check if role-title already exists, if not create it
        let roleTitle = rightPanel.querySelector('.role-title');
        if (!roleTitle) {
          roleTitle = document.createElement('div');
          roleTitle.className = 'role-title';
          // Insert at the very beginning of the panel
          rightPanel.insertBefore(roleTitle, rightPanel.firstChild);
        }
        roleTitle.textContent = roleText;
      }
    }
  });
}

// Check nodes on scroll
window.addEventListener('scroll', checkNodes);
window.addEventListener('load', checkNodes);