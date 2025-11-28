// Preview script for Clock_Wizard.js
// Computes rotation values and prints CSS-style transform outputs

function computeTransforms(date = new Date()) {
  const seconds = date.getSeconds();
  const minutes = date.getMinutes();
  const hours = date.getHours();
  const secondsRotation = 6 * seconds;
  const minutesRotation = 6 * minutes;
  const hoursRotation = 30 * (hours % 12) + 0.5 * minutes;
  return {
    secondsRotation,
    minutesRotation,
    hoursRotation,
    secondsTransform: `rotate(${secondsRotation}deg)`,
    minutesTransform: `rotate(${minutesRotation}deg)`,
    hoursTransform: `rotate(${hoursRotation}deg)`
  };
}

// Print current transforms
const transforms = computeTransforms();
console.log('Computed transforms for current time:', new Date().toLocaleTimeString());
console.log('- #seconds transform:', transforms.secondsTransform);
console.log('- #minutes transform:', transforms.minutesTransform);
console.log('- #hours transform:', transforms.hoursTransform);

// Also print some sample timestamps
console.log('\nSample timestamps:');
const samples = [
  new Date('2025-11-28T00:00:00'),
  new Date('2025-11-28T03:15:30'),
  new Date('2025-11-28T12:30:45'),
  new Date('2025-11-28T23:59:59')
];
for (const s of samples) {
  const t = computeTransforms(s);
  console.log(`${s.toISOString()} -> seconds: ${t.secondsTransform}, minutes: ${t.minutesTransform}, hours: ${t.hoursTransform}`);
}
