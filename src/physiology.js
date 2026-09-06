export function heartScale(elapsed) {
  const cycle = ((elapsed * 1.15) % 1 + 1) % 1;
  const pulse = (start, duration, amplitude) => {
    const x = (cycle - start + 1) % 1;
    return x <= duration ? amplitude * 0.5 * (1 - Math.cos(x / duration * Math.PI * 2)) : 0;
  };
  return 1 - pulse(0.05, 0.14, 0.075) - pulse(0.23, 0.09, 0.025);
}

export function breathingState(elapsed) {
  const phase = (1 - Math.cos(elapsed * Math.PI * 0.4)) * 0.5;
  return {
    phase,
    lungScale: [1 + phase * 0.065, 1 + phase * 0.025, 1 + phase * 0.055],
    diaphragmOffset: -phase * 0.16,
  };
}

export function intestinalRadiusScale(positionY, elapsed) {
  return 1 - 0.025 * Math.pow(Math.max(0, Math.cos(positionY * 14 - elapsed * 2)), 6);
}

export function intestinalTubeScale(pathT, elapsed) {
  return 1 - 0.09 * Math.pow(Math.max(0, Math.cos(pathT * 25 - elapsed * 2)), 8);
}

export function bloodFlowProgress(elapsed, phase, rate, pulsatility = 0) {
  const cycle = elapsed * rate + phase;
  const warped = cycle + pulsatility * Math.sin(cycle * Math.PI * 2) / (Math.PI * 2);
  return ((warped % 1) + 1) % 1;
}
