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
      setTimeout(() => {
        welcomeText.innerHTML = secondPart;
      }, 2000);
    }
  }
  
  setTimeout(typeChar, 500);
}

// Flip impact panel on click
function flipPanel(panel) {
  const statement = panel.querySelector('.impact-statement');
  const metrics = panel.querySelector('.impact-metrics');
  statement.classList.toggle('active');
  metrics.classList.toggle('active');
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
  
  // Initial check for visible nodes
  checkNodes();
});

// Check nodes on scroll
window.addEventListener('scroll', checkNodes);
window.addEventListener('load', checkNodes);