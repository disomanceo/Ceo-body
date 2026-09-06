export function sphereFitDistance(radius, fovDegrees, aspect, margin = 1.16) {
  if (!(radius > 0) || !(fovDegrees > 0) || !(aspect > 0) || !(margin > 0)) return 0.8;
  const verticalFov = fovDegrees * Math.PI / 180;
  const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * aspect);
  const limitingFov = Math.min(verticalFov, horizontalFov);
  return Math.max(0.8, radius / Math.sin(limitingFov / 2) * margin);
}

export function isPointerClick(start, end, threshold = 7) {
  if (!start || !end) return false;
  return Math.hypot(end.x - start.x, end.y - start.y) <= threshold;
}

export function viewMoveStep(distance) {
  if (!(distance > 0)) return 0.35;
  return Math.max(0.35, Math.min(2.2, distance * 0.07));
}
