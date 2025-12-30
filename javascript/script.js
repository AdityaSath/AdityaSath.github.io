let canvas, ctx;
let isInLightspeed = false;
let stars = [];
let animationFrame;
let currentSpeed = 0;

function initCanvas() {
    canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '0';
    canvas.style.pointerEvents = 'none';
    document.body.insertBefore(canvas, document.body.firstChild);
    ctx = canvas.getContext('2d');
}

function createStars(count) {
    stars = [];
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    for (let i = 0; i < count; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const angle = Math.atan2(y - centerY, x - centerX);
        
        stars.push({
            x, y, angle,
            length: 1,
            targetLength: 1,
            color: { r: 255, g: 255, b: 255 }
        });
    }
}

function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Define color values
    const whiteColor = { r: 255, g: 255, b: 255 };
    const blueColor = { r: 74, g: 158, b: 255 };
    const maxLength = Math.min(canvas.height, canvas.width);
    
    stars.forEach(star => {
        if (isInLightspeed) {
            star.targetLength = Math.min(canvas.height, star.length + 20);
        } else {
            star.targetLength = 1;
        }
        
        const easingSpeed = isInLightspeed ? 0.6 : 0.06;  // 0.2 = faster forward, 0.05 = slower reverse
    	star.length += (star.targetLength - star.length) * easingSpeed;
        
        // Calculate color progress based on star length
        // Normalize length to 0-1 range (short = white, long = blue)
        // Use a smooth transition curve for better visual effect
        const minLength = 1;
        const normalizedLength = Math.min((star.length - minLength) / (maxLength - minLength), 1);
        const colorProgress = Math.max(0, Math.min(1, normalizedLength));
        
        // Interpolate color based on progress (0 = white, 1 = blue)
        star.color = {
            r: Math.round(whiteColor.r + (blueColor.r - whiteColor.r) * colorProgress),
            g: Math.round(whiteColor.g + (blueColor.g - whiteColor.g) * colorProgress),
            b: Math.round(whiteColor.b + (blueColor.b - whiteColor.b) * colorProgress)
        };
        
        const endX = star.x + Math.cos(star.angle) * star.length;
        const endY = star.y + Math.sin(star.angle) * star.length;
        
        const gradient = ctx.createLinearGradient(star.x, star.y, endX, endY);
        gradient.addColorStop(0, `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, 0)`);
        gradient.addColorStop(1, `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, 1)`);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
    });
    
    animationFrame = requestAnimationFrame(animate);
}

function toggleLightspeed() {
    isInLightspeed = !isInLightspeed;
}

// Initialize
initCanvas();
createStars(1500);
animate();

// Toggle on Enter
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        toggleLightspeed();
    }
});

// Handle resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createStars(1500);
});

// Welcome text character glow effect
function initWelcomeTextGlow() {
    const welcomeText = document.getElementById('welcomeText');
    if (!welcomeText) return;

    const text = welcomeText.textContent;
    welcomeText.innerHTML = '';

    for (let i = 0; i < text.length; i++) {
        const char = document.createElement('span');
        char.className = 'char';
        char.textContent = text[i];
        welcomeText.appendChild(char);
    }

    const chars = welcomeText.querySelectorAll('.char');
    const glowRadius = 3;

    welcomeText.addEventListener('mousemove', (e) => {
        const rect = welcomeText.getBoundingClientRect();
        const x = e.clientX - rect.left;

        let closestCharIndex = 0;
        let minDistance = Infinity;

        chars.forEach((char, index) => {
            const charRect = char.getBoundingClientRect();
            const charX = charRect.left - rect.left + charRect.width / 2;
            const charY = charRect.top - rect.top + charRect.height / 2;
            const distance = Math.sqrt((x - charX) ** 2 + (e.clientY - rect.top - charY) ** 2);

            if (distance < minDistance) {
                minDistance = distance;
                closestCharIndex = index;
            }
        });

        chars.forEach(char => char.classList.remove('glow'));

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
            setTimeout(typeSecondPart, 500);
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

const moonQuoteFirstHalf = "If you shoot for the Moon and miss...";
const moonQuoteSecondHalf = "You'll land among the stars";

document.addEventListener('DOMContentLoaded', () => {
    initTypewriterEffect(moonQuoteFirstHalf, moonQuoteSecondHalf);
    
    setTimeout(() => {
        isInLightspeed = true;
        
        setTimeout(() => {
            isInLightspeed = false;
        }, 4500);
    }, 2500);
});