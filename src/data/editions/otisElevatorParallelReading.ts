import type { ArchivalParallelReading } from "./parallelReadings";

/** Patent-local, manually authored companions keyed to otisElevatorArchivalEdition block positions. */
export const otisElevatorParallelReadings: Readonly<Record<number, ArchivalParallelReading>> = {
  1: ["This title block identifies the patent office, E. G. Otis of Yonkers, the invention title, patent number, and the January 15, 1861 grant date. The PDF does not print a filing date."],
  2: ["This conventional address opens the specification to any reader with an interest in the grant."],
  3: ["Otis identifies himself, his location, and the subject as an improved hoisting apparatus. He makes the drawings part of the description, so the lettered parts and the prose must be read together."],
  4: ["The three figures divide the invention into a vertical sectional view, a front view, and a detached stop-mechanism view. Each source reference is linked to its own crop rather than guessed from text."],
  5: ["The same letters identify the same parts across the three drawings. For example, C is the rack and D is the platform wherever those letters occur."],
  6: ["The invention has two linked functions: stop the load where wanted with a brake, and sustain the platform if the lifting rope fails. The brake acts at the same time as the stopping action rather than after an operator reacts."],
  7: ["Otis now changes from the legal introduction to a part-by-part mechanical description."],
  8: ["Base A supports uprights B B. Each upright carries an inward rack C whose upward-pointing hook teeth receive the safety pawls. Figure 2 is the source view for that geometry."],
  9: ["Platform D travels between the uprights on grooved inner uprights a a. The paired levers E pivot at b and meet at eye c on bar F. Spring e biases the lower pawls f toward the rack teeth; rope tension later counters that bias through bar F."],
  10: ["Figure 2 shows the pawls pivoted on levers E and spring-loaded by g. Mortises h guide their motion in uprights a a, so engagement is controlled rather than a loose collision with the racks."],
  11: ["Rope G lifts the platform through pulleys i i and drum H. Gear train j k connects H to shaft I. The shaft carries idle pulleys J and K and working pulley L; belts O and P select the transmitted motion."],
  12: ["Counterweight R hangs from rope Q, which winds on the opposite sense on drum H. It balances platform D while keeping the safety linkage separate from a direct platform counterweight connection."],
  13: ["Slide S is a belt-shipper: it moves belts between driving and idle pulleys. Hand rope T turns drum r, then pinion p and rack o move S. This is the control path for selecting lift, descent, or stopped condition."],
  14: ["Rope U ends in a fork V connected to both sides of T. Its relation to the pulleys makes it a stop input. Arm W, bar X, projection x, bar Y, and shoe Z translate the slide position into pressure on working pulley L, making a mechanical brake."],
  15: ["With cross-belt P on working pulley L, drum H winds G and raises D. Moving the hand rope shifts the belts and therefore changes rotation to lower the platform. The text states the causal chain rather than treating the belts as decorative detail."],
  16: ["Pulling U down aligns the two u branches of V. Slide S then moves both belts to idle pulleys and presses shoe Z onto L, stopping power transmission. Once aligned, V no longer pulls T: that geometry prevents the running control from defeating the applied brake."],
  17: ["For ascent, T places O on working pulley L and lifts Z. For descent, T shifts cross-belt P onto L. The same manual input therefore controls direction and the brake position."],
  18: ["If G breaks, springs e and g drive f f into hook racks C C. Load on D then tends to draw uprights B B inward, not spread them apart, so the hooks lock and casual release is prevented. Counterweight R stays on drum H so it does not interfere with this safety action."],
  20: ["This is the formal transition from the descriptive specification to the legal claims."],
  25: ["E. G. Otis signs the completed specification and claims."],
  26: ["M. M. Livingston and G. H. Reed are witnesses to the executed patent instrument."],
};
