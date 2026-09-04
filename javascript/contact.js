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
				
				// Add author name with fade-in
				const authorSpan = document.createElement('div');
				authorSpan.textContent = '— Latin Proverb';  // CHANGE THIS per page
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
	
	// Start typing after a short delay
	setTimeout(typeChar, 500);
}

quoteFirstHalf = "Ad Astra Per Aspera...";
quoteSecondHalf = "To the stars through hardship";
// Initialize typewriter effect when DOM is loaded
document.addEventListener('DOMContentLoaded', initTypewriterEffect(quoteFirstHalf, quoteSecondHalf));

// Terminal animation script
function initTerminal() {
  const output = document.getElementById('terminalOutput');
  if (!output) return;
  
  const resumePath = '../Aditya_Sathishkumar_Master_Resume.pdf';
  
  const lines = [
    { type: 'prompt', text: '> ', delay: 50 },
    { type: 'loading', text: 'Initializing connection...', delay: 50 },
    { type: 'loading', text: 'Establishing secure channel...', delay: 50 },
    { type: 'success', text: '✓ Connection established', delay: 50 },
    { type: 'prompt', text: '> ', delay: 50 },
    { type: 'loading', text: 'Loading contact_info.exe...', delay: 50 },
    { type: 'success', text: '✓ Module loaded successfully', delay: 40 },
    { type: 'blank', text: '', delay: 10 },
    { type: 'header', text: '========================================', delay: 40 },
    { type: 'header', text: '         CONTACT INFORMATION', delay: 40 },
    { type: 'header', text: '========================================', delay: 40 },
    { type: 'blank', text: '', delay: 10 },
    { type: 'info', label: 'EMAIL:', text: 'adityasathishkumar5@gmail.com', link: 'mailto:adityasathishkumar5@gmail.com', delay: 50 },
    { type: 'blank', text: '', delay: 10 },
    { type: 'info', label: 'LINKEDIN:', text: 'linkedin.com/in/adityasathish', link: 'https://www.linkedin.com/in/adityasathish/', delay: 50 },
    { type: 'blank', text: '', delay: 10 },
    { type: 'info', label: 'GITHUB:', text: 'github.com/AdityaSath', link: 'https://github.com/AdityaSath', delay: 50 },
    { type: 'blank', text: '', delay: 10 },
    { type: 'resume', label: 'RESUME:', delay: 50 },
    { type: 'blank', text: '', delay: 10 },
    { type: 'header', text: '========================================', delay: 50 },
    { type: 'blank', text: '', delay: 10 },
    { type: 'prompt', text: '> ', delay: 50, cursor: true }
  ];
  
  let totalDelay = 0;
  
  function addLine(line, index) {
    setTimeout(() => {
      const lineDiv = document.createElement('div');
      lineDiv.className = 'terminal-line';
      lineDiv.style.animationDelay = '0s';
      
      switch(line.type) {
        case 'prompt':
          lineDiv.innerHTML = `<span class="terminal-prompt">${line.text}</span>`;
          if (line.cursor) {
            lineDiv.innerHTML += '<span class="terminal-cursor"></span>';
          }
          break;
          
        case 'loading':
          lineDiv.innerHTML = `<span class="terminal-loading">${line.text}</span>`;
          lineDiv.className += ' terminal-loading';
          break;
          
        case 'success':
          lineDiv.innerHTML = `<span class="terminal-success">${line.text}</span>`;
          break;
          
        case 'header':
          lineDiv.innerHTML = `<span style="color: #00ffff;">${line.text}</span>`;
          break;
          
        case 'info':
          if (line.link) {
            lineDiv.innerHTML = `<span class="terminal-label">${line.label}</span> <a href="${line.link}" class="terminal-link" target="_blank" rel="noopener noreferrer">${line.text}</a>`;
          } else {
            lineDiv.innerHTML = `<span class="terminal-label">${line.label}</span> <span>${line.text}</span>`;
          }
          break;
          
        case 'resume':
          lineDiv.innerHTML = `
            <span class="terminal-label">${line.label}</span>
            <div class="resume-actions">
              <a href="${resumePath}" class="resume-btn" target="_blank" rel="noopener noreferrer">[VIEW]</a>
              <a href="${resumePath}" class="resume-btn" download="Aditya_Sathishkumar_Master_Resume.pdf">[DOWNLOAD]</a>
            </div>
          `;
          break;
          
        case 'blank':
          lineDiv.innerHTML = '&nbsp;';
          break;
      }
      
      output.appendChild(lineDiv);
      
      // Scroll to bottom
      output.parentElement.scrollTop = output.parentElement.scrollHeight;
      
      // Process next line
      if (index < lines.length - 1) {
        addLine(lines[index + 1], index + 1);
      }
    }, totalDelay);
    
    totalDelay += line.delay;
  }
  
  // Start the animation
  addLine(lines[0], 0);
}

// Initialize terminal when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTerminal);
} else {
  initTerminal();
}
