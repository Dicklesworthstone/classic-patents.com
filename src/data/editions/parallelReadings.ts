/**
 * Hand-authored, paragraph-level companion readings for published archival
 * editions. These are editorial source notes, not OCR cleanup or generated
 * summaries. Keys are the explicit block positions in the edition file.
 */
export const ARCHIVAL_PARALLEL_READINGS: Readonly<
  Record<string, Readonly<Record<number, string>>>
> = {
  "us-821393-wright-flyer": {
    4: "A formal public notice. The inventors are addressing anyone who may read or be affected by the patent.",
    5: "The Wright brothers identify themselves, their home, and the subject of the legal document: an improvement to flying machines.",
    6: "This covers aircraft whose wings make lift by moving through air, whether an engine pushes them forward or gravity supplies the motion in a glide.",
    7: "Their practical target is controllability: stop a wing from dropping, steer left and right, control climb and descent, and do it with an airframe light enough to fly.",
    8: "First they explain the machine. At the end they state the numbered legal boundaries of what they claim to own.",
    9: "The drawing set gives a three-dimensional overview, a plan, a side view, and enlarged joint details. Every figure reference is deliberately linked to the primary facsimile.",
    10: "A wing gets lift from moving air, whether the craft is gliding or powered. The hard part is not merely getting airborne: gusts and changes in speed keep knocking the machine out of balance. Their invention is the control system that corrects those disturbances.",
    11: "Their preferred version is a biplane: two broad, shallow wings stacked one above the other. The letters in the figures name the corners and edges so the text can describe exactly which wingtip moves.",
    12: "Before explaining how the controls work, they describe the flexible biplane structure that makes wing warping possible.",
    13: "The wing is a light wood frame covered in fabric. Cutting the cloth diagonally makes its fibers act like diagonal bracing, so the wing resists loads while still twisting. A wired hem forms a flexible trailing flap.",
    14: "Rigid vertical posts hold the two wings apart. Hinges at their ends let the wings twist without tearing the box truss apart, while crossed wires keep the airframe stiff against loads.",
    15: "The pilot lies in a sliding hip cradle. Moving it sideways pulls a cable that runs around pulleys to the far corners of the wings. The body itself becomes the roll-control input.",
    16: "A second crosswise cable links the wing corners. Together, the two cable runs convert one sideways movement of the cradle into opposite twists at the two wing margins.",
    17: "Shift the cradle right and one cable tightens while the other pays out. The pulleys make one side of the biplane twist one way and the other side twist the opposite way. Reverse the hip movement and the wing twists reverse too.",
    18: "This is wing warping. The wings are not bent at one hinge; each wing gradually twists from its middle toward its tips. The patent protects the broader idea of moving the two side margins to different aerodynamic angles, not only this exact cable layout.",
    19: "If the left side starts falling, the pilot twists that side to a higher angle of attack. It then makes more lift and rises back to level. The opposite twist fixes a right-side drop. That is active roll control, the central result of the patent.",
    20: "Warping a wing changes drag as well as lift, which tries to swing the nose the wrong way. The same cradle movement turns the rear rudder, adding drag to the faster side and keeping the aircraft pointed into the turn. The hinged supports also let the rudder kick upward if it hits the ground.",
    21: "The forward skids stop a landing machine from pitching onto its nose. They also brace the upper wing against inertia on touchdown and carry the forward pitch-control surface.",
    22: "The front elevator is a flexible canard, not a flat flap. Its middle pivots near the aerodynamic balance point while springs resist the leading edge. Moving its rear edge bends it into a curved surface, giving stronger pitch control for climb, descent, and recovery.",
    23: "The Wrights deliberately put the pitch surface in front. When the aircraft slows toward a stall, this forward surface starts lifting and helps prevent the nose from suddenly pitching down. They distinguish this behavior from earlier front surfaces paired with conventional tailplanes.",
    24: "Here they define their legal vocabulary. “Aeroplane” means a supporting wing surface, not necessarily the entire aircraft or a powered machine.",
    25: "They are not claiming only the exact biplane in the drawing. The legal principle is different wing-margin angles for control; a later design can move only the tips and still use that principle.",
    26: "The descriptive part ends here. The next eighteen numbered statements are the enforceable legal claims.",
    45: "The inventors sign the completed specification, adopting the written description and claims as their own statement to the Patent Office.",
    46: "The listed witnesses attest the signing of the instrument. Their names are part of the historical patent record, not another technical claim.",
  },
};

export function archivalParallelReadingFor(patentId: string): Readonly<Record<number, string>> {
  const reading = ARCHIVAL_PARALLEL_READINGS[patentId];
  if (!reading) {
    throw new Error(`No hand-authored archival parallel reading is published for ${patentId}.`);
  }
  return reading;
}
