# BabyGoon

🎯 **BabyGoon** - A fun lottery spinning wheel for babyfoot (table football) games!

## Overview

BabyGoon is a static web application that adds excitement to your babyfoot games with a colorful spinning wheel. Spin the wheel to randomly select fun effects and rule modifications for your game!

## Features

- 🎡 Interactive spinning wheel with smooth animations
- 🎨 8 colorful game effects with unique descriptions
- ⚡ Auto-hiding results with customizable durations
- 📱 Responsive design that works on all devices
- 🎯 Easy-to-customize effects via JSON configuration

## Getting Started

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

Edit `effects.json` to add your own effects:

```json
{
  "effects": [
    {
      "id": 1,
      "name": "Your Effect",
      "description": "Description of your effect",
      "color": "#FF5733",
      "duration": 4000
    }
  ]
}
```

- `name`: The effect name displayed on the wheel
- `description`: What happens when this effect is selected
- `color`: Hex color code for the wheel segment
- `duration`: How long (in milliseconds) the result is displayed

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