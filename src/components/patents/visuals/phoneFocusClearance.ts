const PHONE_FOCUS_CLEARANCE_PX = 8;

export interface PhoneFocusRect {
  readonly bottom: number;
  readonly left: number;
  readonly right: number;
  readonly top: number;
}

export interface PhoneFocusClearancePlan {
  readonly canvasPlacement: "above-header" | "below-header";
  readonly scrollTopDelta: number;
}

function rectanglesIntersect(first: PhoneFocusRect, second: PhoneFocusRect) {
  return (
    first.left < second.right &&
    first.right > second.left &&
    first.top < second.bottom &&
    first.bottom > second.top
  );
}

/**
 * Choose the shortest document scroll that clears an intersecting WebGL
 * canvas from the real sticky header without moving the focused control out
 * of its usable phone lane. This deliberately consumes measured rectangles:
 * safe-area insets and compact-header variants make a fixed offset brittle.
 */
export function planPhoneFocusClearance(
  canvas: PhoneFocusRect,
  header: PhoneFocusRect,
  control: PhoneFocusRect,
  viewportHeight: number,
  gap = PHONE_FOCUS_CLEARANCE_PX,
): PhoneFocusClearancePlan | null {
  if (!rectanglesIntersect(canvas, header)) return null;

  const safeControlTop = header.bottom + gap;
  const safeControlBottom = viewportHeight - gap;
  if (safeControlBottom <= safeControlTop) return null;

  // Positive scroll moves document content up. These bounds retain the whole
  // active control in the lane beneath the sticky masthead.
  const minimumControlScroll = control.bottom - safeControlBottom;
  const maximumControlScroll = control.top - safeControlTop;
  if (minimumControlScroll > maximumControlScroll) return null;

  const candidates: PhoneFocusClearancePlan[] = [];

  // Put the canvas directly below the masthead (a negative scroll in the
  // Hull range-focus case). More-negative values still clear the header, so
  // take the closest feasible correction.
  const maximumBelowHeaderScroll = Math.min(canvas.top - header.bottom - gap, maximumControlScroll);
  if (minimumControlScroll <= maximumBelowHeaderScroll) {
    candidates.push({
      canvasPlacement: "below-header",
      scrollTopDelta: maximumBelowHeaderScroll,
    });
  }

  // Put the canvas directly above the masthead (the Clavel/Colt claim-chip
  // cases). More-positive values still clear it, so again retain the minimum
  // movement compatible with the active control.
  const minimumAboveHeaderScroll = Math.max(canvas.bottom - header.top + gap, minimumControlScroll);
  if (minimumAboveHeaderScroll <= maximumControlScroll) {
    candidates.push({
      canvasPlacement: "above-header",
      scrollTopDelta: minimumAboveHeaderScroll,
    });
  }

  return candidates.reduce<PhoneFocusClearancePlan | null>((closest, candidate) => {
    if (!closest || Math.abs(candidate.scrollTopDelta) < Math.abs(closest.scrollTopDelta)) {
      return candidate;
    }
    return closest;
  }, null);
}
