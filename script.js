// Load effects from JSON
let effects = [];
let isSpinning = false;
let goalsToSpin = 3; // Default value
let currentGoals = 0;
let activeBonus = null;
let bonusGoalsRemaining = 0;

// Canvas setup
const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spinButton');
const resultDisplay = document.getElementById('resultDisplay');
const effectName = document.getElementById('effectName');
const effectDescription = document.getElementById('effectDescription');
const bonusStatus = document.getElementById('bonusStatus');
const goalCount = document.getElementById('goalCount');
const incrementGoalsBtn = document.getElementById('incrementGoals');
const decrementGoalsBtn = document.getElementById('decrementGoals');
const spinInfo = document.getElementById('spinInfo');
const goalsNeeded = document.getElementById('goalsNeeded');

// Configuration constants
const WHEEL_RADIUS = 200;
const CENTER_CIRCLE_RADIUS = 30;
const MIN_SPIN_DURATION = 3000;
const SPIN_DURATION_VARIANCE = 2000;
const MIN_ROTATIONS = 5;
const ROTATION_VARIANCE = 5;

// Load effects data
fetch('effects.json')
    .then(response => response.json())
    .then(data => {
        effects = data.effects;
        goalsToSpin = data.goalsToSpin || 3;
        goalsNeeded.textContent = goalsToSpin;
        drawWheel(0);
        updateSpinButton();
    })
    .catch(error => {
        console.error('Error loading effects:', error);
        // Fallback effects if JSON fails to load
        effects = [
            { id: 1, name: "Effect 1", description: "First effect", color: "#FFD700", duration: 3000, goalsRequired: 2 },
            { id: 2, name: "Effect 2", description: "Second effect", color: "#4169E1", duration: 3000, goalsRequired: 2 }
        ];
        drawWheel(0);
        updateSpinButton();
    });

// Draw the wheel
function drawWheel(rotation = 0) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const numSegments = effects.length;
    const anglePerSegment = (2 * Math.PI) / numSegments;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw segments
    effects.forEach((effect, index) => {
        const startAngle = rotation + (index * anglePerSegment);
        const endAngle = rotation + ((index + 1) * anglePerSegment);

        // Draw segment
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, WHEEL_RADIUS, startAngle, endAngle);
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
        ctx.font = 'bold 16px Arial';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 3;
        ctx.fillText(effect.name, WHEEL_RADIUS * 0.65, 5);
        ctx.restore();
    });

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, CENTER_CIRCLE_RADIUS, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.stroke();
}

// Update goal count display and spin button state
function updateGoalDisplay() {
    goalCount.textContent = currentGoals;
    updateSpinButton();
}

// Update spin button state based on goals
function updateSpinButton() {
    if (currentGoals > 0 && currentGoals % goalsToSpin === 0) {
        spinButton.disabled = isSpinning;
        spinInfo.textContent = "Ready to spin!";
        spinInfo.classList.add('ready');
    } else {
        const goalsUntilSpin = goalsToSpin - (currentGoals % goalsToSpin);
        spinButton.disabled = true;
        spinInfo.innerHTML = `Score <span id="goalsNeeded">${goalsUntilSpin}</span> more goal${goalsUntilSpin === 1 ? '' : 's'} to spin!`;
        spinInfo.classList.remove('ready');
    }
}

// Increment goals
function incrementGoals() {
    currentGoals++;
    updateGoalDisplay();
    
    // If there's an active bonus, decrement its goal counter
    if (activeBonus && bonusGoalsRemaining > 0) {
        bonusGoalsRemaining--;
        updateBonusStatus();
        
        if (bonusGoalsRemaining === 0) {
            // Bonus expired
            setTimeout(() => {
                resultDisplay.classList.add('hidden');
                activeBonus = null;
            }, 1000);
        }
    }
}

// Decrement goals
function decrementGoals() {
    if (currentGoals > 0) {
        currentGoals--;
        updateGoalDisplay();
        
        // If there's an active bonus and result display is visible, increment its goal counter
        if (activeBonus && bonusGoalsRemaining < activeBonus.goalsRequired && !resultDisplay.classList.contains('hidden')) {
            bonusGoalsRemaining++;
            updateBonusStatus();
        }
    }
}

// Update bonus status display
function updateBonusStatus() {
    if (activeBonus && bonusGoalsRemaining > 0) {
        bonusStatus.textContent = `⚡ Active for ${bonusGoalsRemaining} more goal${bonusGoalsRemaining === 1 ? '' : 's'}!`;
        bonusStatus.classList.add('active');
    } else {
        bonusStatus.textContent = '';
        bonusStatus.classList.remove('active');
    }
}

// Spin the wheel
function spinWheel() {
    if (isSpinning || effects.length === 0) return;
    if (currentGoals === 0 || currentGoals % goalsToSpin !== 0) return;

    isSpinning = true;
    spinButton.disabled = true;
    resultDisplay.classList.add('hidden');
    
    // Reset goals after spinning
    currentGoals = 0;
    updateGoalDisplay();

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
    let currentRotation = 0;

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
            spinButton.disabled = false;
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
    
    // Set active bonus
    activeBonus = effect;
    bonusGoalsRemaining = effect.goalsRequired;
    updateBonusStatus();
    
    resultDisplay.classList.remove('hidden');
    resultDisplay.classList.add('effect-flash');

    // Remove flash animation after it completes
    setTimeout(() => {
        resultDisplay.classList.remove('effect-flash');
    }, 500);
    
    // Note: No auto-hide timer - bonus stays until goals are scored
}

// Event listeners
spinButton.addEventListener('click', spinWheel);
incrementGoalsBtn.addEventListener('click', incrementGoals);
decrementGoalsBtn.addEventListener('click', decrementGoals);

// Allow Enter key to spin
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !isSpinning) {
        spinWheel();
    }
});
