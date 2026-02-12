// Load effects from JSON
let effects = [];
let isSpinning = false;
let wheelRadius = 200;
let centerCircleRadius = 30;
let currentRotation = 0;
let hasSpun = false;

// Canvas setup
const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const resultDisplay = document.getElementById('resultDisplay');
const effectName = document.getElementById('effectName');
const effectDescription = document.getElementById('effectDescription');
const bonusStatus = document.getElementById('bonusStatus');
const wheelHint = document.querySelector('.wheel-hint');

// Configuration constants
const MIN_SPIN_DURATION = 3000;
const SPIN_DURATION_VARIANCE = 2000;
const MIN_ROTATIONS = 5;
const ROTATION_VARIANCE = 5;

// Load effects data
fetch('effects.json')
fetch('effects.json', { cache: 'no-store' })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (!Array.isArray(data.effects) || data.effects.length === 0) {
            throw new Error('Invalid effects.json format');
        }
        effects = data.effects;
        resizeCanvas();
        drawWheel(0);
        updateSpinButton();
    })
    .catch(error => {
        console.error('Error loading effects:', error);
        effects = [];
        resizeCanvas();
        drawWheel(0);
        updateSpinButton();
        showLoadError();
    });

function showLoadError() {
    effectName.textContent = 'Chargement impossible';
    effectDescription.textContent = 'Ouvre la page avec un serveur local pour lire effects.json.';
    bonusStatus.textContent = '';
    bonusStatus.classList.remove('active');
    resultDisplay.style.background = 'rgba(17, 16, 26, 0.9)';
    resultDisplay.classList.remove('hidden');
}

function resizeCanvas() {
    const maxSize = Math.min(window.innerWidth * 0.78, 520);
    const size = Math.max(240, Math.floor(maxSize));
    canvas.width = size;
    canvas.height = size;
    wheelRadius = Math.max(120, Math.floor(size / 2 - 18));
    centerCircleRadius = Math.max(18, Math.floor(size * 0.06));
}

// Draw the wheel
function drawWheel(rotation = 0) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const numSegments = effects.length;
    const anglePerSegment = numSegments > 0 ? (2 * Math.PI) / numSegments : 0;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (numSegments === 0) {
        return;
    }

    // Draw segments
    effects.forEach((effect, index) => {
        const startAngle = rotation + (index * anglePerSegment);
        const endAngle = rotation + ((index + 1) * anglePerSegment);

        // Draw segment
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, wheelRadius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = effect.color;
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw text
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + anglePerSegment / 2);
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
        const fontSize = Math.max(12, Math.floor(wheelRadius * 0.085));
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 3;
        ctx.fillText(effect.name, wheelRadius * 0.65, 5);
        ctx.restore();
    });

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, centerCircleRadius, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.stroke();
}

// Update spin button state
function updateSpinButton() {
    // No button anymore; keep API for enabling/disabling spin via click.
}

// Spin the wheel
function spinWheel() {
    if (isSpinning || effects.length === 0) return;

    isSpinning = true;
    resultDisplay.classList.add('hidden');

    // Random spin duration and final position
    const spinDuration = MIN_SPIN_DURATION + Math.random() * SPIN_DURATION_VARIANCE; // 3-5 seconds
    const rotations = MIN_ROTATIONS + Math.random() * ROTATION_VARIANCE; // 5-10 full rotations
    const finalRotation = rotations * 2 * Math.PI;
    
    // Determine winning segment
    const segmentAngle = (2 * Math.PI) / effects.length;
    const normalizedRotation = finalRotation % (2 * Math.PI);
    const winningIndex = Math.floor((2 * Math.PI - normalizedRotation) / segmentAngle) % effects.length;
    const winningEffect = effects[winningIndex];

    // Animation
    const startTime = Date.now();
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / spinDuration, 1);

        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        currentRotation = easeOut * finalRotation;

        drawWheel(currentRotation);

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // Spin complete
            showResult(winningEffect);
            isSpinning = false;
        }
    }

    animate();
}

// Show the result
function showResult(effect) {
    effectName.textContent = effect.name;
    effectDescription.textContent = effect.description;
    
    // Set background color based on effect
    resultDisplay.style.background = `linear-gradient(135deg, ${effect.color}88, ${effect.color}44)`;
    
    if (typeof effect.goalsRequired === 'number') {
        bonusStatus.textContent = `⚡ Durée: ${effect.goalsRequired} but${effect.goalsRequired === 1 ? '' : 's'}`;
        bonusStatus.classList.add('active');
    } else {
        bonusStatus.textContent = '';
        bonusStatus.classList.remove('active');
    }
    
    resultDisplay.classList.remove('hidden');
    resultDisplay.classList.add('effect-flash');

    if (!hasSpun) {
        hasSpun = true;
        if (wheelHint) {
            wheelHint.classList.add('hidden');
        }
    }

    // Remove flash animation after it completes
    setTimeout(() => {
        resultDisplay.classList.remove('effect-flash');
    }, 500);
    
    // Note: No auto-hide timer - bonus stays until goals are scored
}

// Event listeners
canvas.addEventListener('click', () => {
    if (effects.length === 0) {
        showLoadError();
        return;
    }
    if (!isSpinning) {
        spinWheel();
    }
});
window.addEventListener('resize', () => {
    resizeCanvas();
    drawWheel(currentRotation);
});

// Allow Enter key to spin
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !isSpinning) {
        spinWheel();
    }
});
