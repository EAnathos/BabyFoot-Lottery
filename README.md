# BabyGoon

🎯 **BabyGoon** - A fun lottery spinning wheel for babyfoot (table football) games!

## Overview

BabyGoon is a static web application that adds excitement to your babyfoot games with a colorful spinning wheel. Spin the wheel to randomly select fun effects and rule modifications for your game!

## Features

- 🎡 Interactive spinning wheel with smooth animations
- 🎯 **Goal-based bonus system** - spin unlocks after scoring goals
- 📊 Track goals scored with +/- buttons
- 🎨 8 colorful game effects with unique descriptions
- ⚡ Bonuses that stay active for a specific number of goals
- 📱 Responsive design that works on all devices
- 🎯 Easy-to-customize effects via JSON configuration

## Getting Started

### How to Play

1. Open `index.html` in any modern web browser
2. **Track Goals**: Use the +/- buttons to track goals scored during your babyfoot game
3. **Wait for Spin**: You need to score 3 goals before you can spin the wheel (configurable in effects.json)
4. **Spin the Wheel**: Once you've scored enough goals, click "SPIN THE WHEEL!"
5. **Active Bonus**: The selected effect stays active for a specific number of goals (shown as "⚡ Active for X more goals!")
6. **Continue Playing**: Keep scoring goals and the bonus will automatically expire after the required goals are reached

### Simple Usage

1. Open `index.html` in any modern web browser
2. Click the "SPIN THE WHEEL!" button
3. Watch the wheel spin and see which effect you get!

### Running with a Local Server

For the best experience (especially if modifying effects.json):

```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js
npx http-server -p 8000

# Then open http://localhost:8000 in your browser
```

## How It Works

### Goal-Based System

Unlike traditional time-based bonuses, BabyGoon uses a **goal-based system** that integrates seamlessly with your real babyfoot game:

1. **Goal Tracking**: Use the +/- buttons to increment/decrement the goal counter as you play
2. **Spin Requirements**: You must score a certain number of goals (default: 3) before you can spin the wheel
3. **Active Bonuses**: Once you spin and get an effect, it stays active for a specific number of goals (1-3 depending on the effect)
4. **Automatic Expiration**: The bonus automatically disappears once the required goals have been scored
5. **Cycle Repeats**: After spinning, the goal counter resets to 0 and you start accumulating goals again

## Game Effects

The wheel includes 8 exciting effects:

1. **Goal Celebration** - Disco lights flash across the table!
2. **Slow Motion** - Everything moves in slow motion for 30 seconds
3. **Lightning Round** - Next goal counts double!
4. **Swap Teams** - Players switch sides!
5. **Golden Ball** - Next point is worth 2 points!
6. **Freeze Frame** - Defenders can't move for 10 seconds!
7. **Power Shot** - Attackers get extra power!
8. **Penalty Shot** - One player gets a free shot!

## Customization

Edit `effects.json` to customize the game behavior:

```json
{
  "goalsToSpin": 3,
  "effects": [
    {
      "id": 1,
      "name": "Your Effect",
      "description": "Description of your effect",
      "color": "#FF5733",
      "duration": 4000,
      "goalsRequired": 2
    }
  ]
}
```

### Configuration Options:
- `goalsToSpin`: Number of goals required before players can spin the wheel (default: 3)
- `name`: The effect name displayed on the wheel
- `description`: What happens when this effect is selected
- `color`: Hex color code for the wheel segment
- `duration`: Display duration in milliseconds (used for flash animation)
- `goalsRequired`: Number of goals the bonus stays active for (1-3 recommended)

## Technologies Used

- Pure HTML5 Canvas for wheel rendering
- Vanilla JavaScript (no frameworks required)
- CSS3 animations and gradients
- JSON for configuration

## Browser Support

Works on all modern browsers that support:
- HTML5 Canvas
- ES6 JavaScript
- CSS3 animations

---

Have fun and may the odds be ever in your favor! 🎲