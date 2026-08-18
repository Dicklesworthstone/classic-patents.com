import type {
  CuratedSpecificationBlock,
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
  PatentClaim,
} from "@/types/patent";

const literal = (text: string): CuratedSpecificationInlines => [{ kind: "text", text }];
const text = (value: string): CuratedSpecificationInline => ({ kind: "text", text: value });
const paragraph = (inlines: CuratedSpecificationInlines): CuratedSpecificationBlock => ({
  kind: "paragraph",
  inlines,
});

const term = (text: string, definition: string): CuratedSpecificationInline => ({
  kind: "term",
  text,
  definition,
});

const linotypeFigDims: Record<number, { width: number; height: number }> = {
  1: { width: 1150, height: 2100 },
  2: { width: 1150, height: 2100 },
  3: { width: 1750, height: 1450 },
  4: { width: 470, height: 2200 },
};

const figure = (num: number, label: string): CuratedSpecificationInline => ({
  kind: "reference",
  text: label,
  href: `#mergenthaler-fig-${num}`,
  referenceType: "figure",
  label: `Preview ${label} of US 313,224`,
  figurePreviews: [
    {
      src: `/patents/figures/us-313224-mergenthaler-linotype/fig-${num}-source-crop-v1.png`,
      alt: `US 313,224 ${label}`,
      width: linotypeFigDims[num]?.width ?? 1150,
      height: linotypeFigDims[num]?.height ?? 2100,
    },
  ],
});

export const mergenthalerLinotypeClaims: PatentClaim[] = [
  {
    number: 1,
    isIndependent: true,
    originalText:
      "A continuous matrix-bar having a series of intaglio characters formed in its edge to be read transversely thereof, as contradistinguished from a series of matrices united by a flexible band or cord.",
    plainEnglish:
      "This claim covers one continuous bar bearing recessed letterforms across its edge, rather than separate matrices tied together by a flexible band or cord.",
    keyInnovations: ["continuous matrix-bar", "transverse intaglio characters"],
  },
  {
    number: 2,
    isIndependent: true,
    originalText:
      "The improved matrix-bar for use in a stereotyping-machine, consisting of a continuous bar having in its edge a series of transverse grooves or notches each with an intaglio character therein, substantially as described and shown.",
    plainEnglish:
      "This narrows the first idea to a continuous stereotyping bar whose transverse grooves or notches each carry a recessed character.",
    keyInnovations: ["stereotyping matrix-bar", "character-bearing grooves"],
  },
  {
    number: 3,
    isIndependent: true,
    originalText:
      "An improved matrix-bar for use in a stereotyping-machine, consisting of a continuous bar tapered on its side faces, and provided in its edge with intaglio characters arranged in the order of their width, and with intervening surfaces raised above the characters.",
    plainEnglish:
      "This claim adds side taper, width-ordered recessed characters, and raised intervening surfaces to the continuous matrix bar.",
    keyInnovations: ["tapered bar", "width-ordered characters", "raised spacing surfaces"],
  },
  {
    number: 4,
    isIndependent: true,
    originalText:
      "The improved matrix-bar for use in stereotyping consisting of a tapered bar having at its edge intaglio characters arranged in the order of their width, and blank spacing-surfaces of different widths also arranged in the order of their width at suitable points between the characters.",
    plainEnglish:
      "This specifies a tapered bar that carries both characters and blank spacing surfaces, each arranged by width so a selected bar can supply either a letter or a space.",
    keyInnovations: ["variable-width spaces", "tapered matrix-bar"],
  },
  {
    number: 5,
    isIndependent: true,
    originalText:
      "A matrix bar or strip provided at its edge with a line or series of intaglio characters, and with a series of spacing-surfaces of different widths distributed between the characters, substantially as described and shown, whereby all the bars may be moved in the same direction and each bar caused to present the same character or a space at the aligning-point, as demanded.",
    plainEnglish:
      "This covers the matrix-strip arrangement in which each bar has letters and differently sized blank areas, so common motion can bring a chosen letter or space from every bar to one alignment point.",
    keyInnovations: ["distributed spacing surfaces", "common alignment point"],
  },
  {
    number: 6,
    isIndependent: true,
    originalText:
      "The matrix-bar containing the intaglio characters, and the notches to receive an aligning device.",
    plainEnglish:
      "This claim isolates the character-bearing bar and its notches for an aligning device.",
    keyInnovations: ["alignment notches", "intaglio matrix-bar"],
  },
  {
    number: 7,
    isIndependent: true,
    originalText:
      "The matrix-bar containing the intaglio characters and the transverse perforations, substantially as shown.",
    plainEnglish: "This covers a matrix bar with both recessed characters and transverse holes.",
    keyInnovations: ["transverse perforations", "intaglio characters"],
  },
  {
    number: 8,
    isIndependent: true,
    originalText:
      "The combination, substantially as described and shown, of a series of bars each tapered endwise and in the opposite direction from the bar or bars next adjacent thereto, and each provided at the edge with a series of characters whereby single characters on the several bars may be brought to a common line without being thrown from a vertical position.",
    plainEnglish:
      "This covers alternately tapered neighboring bars that can be stopped at different heights while still bringing selected characters into one line.",
    keyInnovations: ["alternating taper", "vertical bar positioning", "common character line"],
  },
  {
    number: 9,
    isIndependent: true,
    originalText:
      "In a machine for producing type-bars and the like, the series of parallel bars or carriers, each provided with a line of intaglio characters, and intervening spacing-surfaces arranged in the order of their width, said bars being combined and adapted for independent motion in a longitudinal direction, substantially as described.",
    plainEnglish:
      "This applies the bars to a type-bar machine: parallel, independently movable carriers each contain a width-ordered line of recessed characters and spacing surfaces.",
    keyInnovations: ["parallel carriers", "independent longitudinal motion"],
  },
  {
    number: 10,
    isIndependent: true,
    originalText:
      "In a machine for producing printing-bars, the combination of a plurality of independently-movable bars, arranged side by side, tapered alternately in opposite directions, and provided at one edge with intaglio characters and spacing-surfaces, substantially as described.",
    plainEnglish:
      "This combines side-by-side, independently movable bars with alternating taper and character-and-space edges for making printing bars.",
    keyInnovations: ["side-by-side bars", "alternating taper", "printing-bar machine"],
  },
  {
    number: 11,
    isIndependent: true,
    originalText:
      "The series of longitudinally-moving bars tapered alternately upward and downward, and provided with intaglio characters and spacing-surfaces, in combination with a series of finger-keys to designate the characters, devices, substantially as described, for arresting the individual bars at different points, and the connecting mechanism, substantially as described, between the keys and stop devices, whereby the designated characters and spaces may be assembled in a common line to form a matrix.",
    plainEnglish:
      "This is a keyboard-controlled temporary matrix: keys set stopping devices that halt each alternately tapered bar at the position for its selected character or space.",
    keyInnovations: ["finger-keys", "individual stops", "temporary matrix"],
  },
  {
    number: 12,
    isIndependent: true,
    originalText:
      "A temporary or convertible matrix for type bars or lines, consisting of a series of parallel independently-movable bars provided at their edges with intaglio characters and intervening blank surfaces rising above the characters.",
    plainEnglish:
      "This claims the temporary matrix itself: parallel movable bars with recessed characters and raised blank portions between them.",
    keyInnovations: ["convertible matrix", "raised blank surfaces"],
  },
  {
    number: 13,
    isIndependent: true,
    originalText:
      "The matrix-bars B, tapered in one direction and connected to heads D, and the intermediate matrix-bars tapered in the reverse direction and connected with slides E by intermediate devices, substantially as described, causing them to move in the opposite direction from said slides, in combination with stop-pins engaging, respectively, the heads of bars B and the slides of bars B′.",
    plainEnglish:
      "This claim defines the two alternating bar groups, their heads and slides, and the respective stop pins that arrest them.",
    keyInnovations: ["two bar groups", "opposite slide motion", "stop pins"],
  },
  {
    number: 14,
    isIndependent: true,
    originalText:
      "In combination with the series of matrix-bars alternately tapered upward and downward, and each having characters arranged therein in the order of their width, the heads attached to all the bars, the reversely-moving slides connected to the alternate bars, the stop-pins arranged in rows extending at right angles to the length of the bars, and the laterally-movable frame provided with adjusting-pins and arranged to act upon the corresponding stop-pins of all the bars.",
    plainEnglish:
      "This adds the rowed stop pins and sideways-moving adjusting-pin frame that programs the stops for all alternating bars.",
    keyInnovations: ["adjusting-pin frame", "rowed stop pins"],
  },
  {
    number: 15,
    isIndependent: true,
    originalText:
      "The combination, substantially as described, of the sliding heads D, having the tapered matrix-bars attached, the grooved guide-plates for said heads, the slides F, the cords or chains E, passing over pulleys from slides F to the alternate matrix-bars, and the two series of stop-pins extending rearward different distances to engage the heads and slides, respectively, as shown.",
    plainEnglish:
      "This protects the physical guidance and chain linkage that makes the two alternating bar groups move oppositely and meet their respective stops.",
    keyInnovations: ["grooved guide plates", "chain linkage", "two stop-pin series"],
  },
  {
    number: 16,
    isIndependent: true,
    originalText:
      "In combination with the matrix-bars and stop-pins, the adjusting-pins slotted at one end, and the crank-shafts extended through said slots, as shown.",
    plainEnglish:
      "This covers slotted adjusting pins driven by crank shafts that pass through the slots.",
    keyInnovations: ["slotted adjusting pins", "crank-shaft drive"],
  },
  {
    number: 17,
    isIndependent: true,
    originalText:
      "The vertically-grooved guide-plates i i, the latter provided with shoulders or notches, in combination with the sliding heads D, having the matrix-bars attached, the dogs Q, pivoted to said heads and provided with the two shoulders at the lower end, the springs to actuate said dogs, the lifting-head P, and the stop-pins.",
    plainEnglish:
      "This specifies the grooved guide plates, pivoted dogs, lift head, springs, and stop pins that let the matrix-bar heads move and then be held.",
    keyInnovations: ["guide plates", "pivoted dogs", "lifting head"],
  },
  {
    number: 18,
    isIndependent: true,
    originalText:
      "In combination with the stop-pins G G′, their sustaining-frame H, the retracting-plate I, the supporting-studs n, on which said frame and plate move forward and backward, and the vertically-movable frame o, seated in grooves in the frame H, and provided with the sinuous slots connected with the retracting-plate and the studs n, as described and shown, whereby the longitudinal motion of the frame o is caused to effect the joint and independent motion of the pin-frame and retracting-plate, and thereby the various adjustments of the stop-pins.",
    plainEnglish:
      "This claim covers the linked moving frames and shaped slots that coordinate adjustment and withdrawal of the stop pins.",
    keyInnovations: ["retracting plate", "sinuous slots", "coordinated stop pins"],
  },
  {
    number: 19,
    isIndependent: true,
    originalText:
      "In combination with the gravitating matrix-bars and their sustaining heads, the transverse sustaining-bar, the stop-pins, the laterally-movable frame K, the adjusting-pins therein, and the connection, substantially as described, between said frame and the bar, whereby support is afforded for those bars not called into action.",
    plainEnglish:
      "This keeps inactive, gravity-descending bars supported while only the selected bars are allowed to act.",
    keyInnovations: ["inactive-bar support", "lateral adjusting frame"],
  },
  {
    number: 20,
    isIndependent: true,
    originalText:
      "The combination, substantially as described and shown, of the matrix-bars, finger-keys to designate the characters, the intermediate stop mechanism, substantially as described, whereby the keys are enabled to arrest the advance of the respective bars, and the bar or support to prevent the advance of those bars which are not called into action.",
    plainEnglish:
      "This combines key-selected bar stops with support that prevents unwanted bars from advancing.",
    keyInnovations: ["key-selected bars", "intermediate stop mechanism", "inactive-bar support"],
  },
  {
    number: 21,
    isIndependent: true,
    originalText:
      "The series of matrix-bars, combined, substantially as described and shown, with the finger-keys, the laterally-movable frame provided with adjusting-pins, the stop-pins, the lifting-head P, the dogs Q, and the sustaining-bar, whereby designated characters of the respective bars may be brought to a common line and those bars not called into use retained in their normal position.",
    plainEnglish:
      "This is the combined selection mechanism that places selected characters in one line while retaining unselected bars normally.",
    keyInnovations: ["common line", "lifting head", "retaining dogs"],
  },
  {
    number: 22,
    isIndependent: true,
    originalText:
      "The tapered independently-movable matrix-bars, each provided with intaglio characters and two or more spacing-surfaces differing in width, in combination with finger-keys designating the respective characters and spaces, and intermediate stop devices, substantially as described and shown, acting directly to arrest the respective bars with their predetermined characters and spaces in a common line.",
    plainEnglish:
      "This applies the key-selected direct stop system to bars that contain characters and two or more widths of blank space.",
    keyInnovations: ["multiple space widths", "direct bar arrest"],
  },
  {
    number: 23,
    isIndependent: true,
    originalText:
      "The adjusting-pins, slotted as shown, in combination with the crank-shafts passing through the slots, the springs applied to rock said shafts, the finger-keys, and the rods extending from the keys to the shafts, whereby the springs are caused to retract the adjusting-pins and lift the keys.",
    plainEnglish:
      "This claim covers the spring-return linkage that both withdraws the adjusting pins and resets the finger keys.",
    keyInnovations: ["spring return", "key reset", "slotted pins"],
  },
  {
    number: 24,
    isIndependent: true,
    originalText:
      "The matrix-bars, the finger-keys to designate the characters, mechanism, substantially as described, connected to and operated by said keys, whereby the aggregate width of the designated characters is automatically shown.",
    plainEnglish:
      "This covers displaying the total width of the characters selected through the keyboard.",
    keyInnovations: ["aggregate-width indicator", "key-operated mechanism"],
  },
  {
    number: 25,
    isIndependent: true,
    originalText:
      "In combination with the slides a² and d², the dogs f² and f′, the indicator-rod and its returning-spring, provided with a projection u², the detent r², and the spring-actuated arm, whereby the indicator is automatically operated and restored to the starting-point.",
    plainEnglish:
      "This covers the linkage that advances a line-width indicator and automatically returns it to the starting point.",
    keyInnovations: ["automatic indicator", "returning spring", "detent linkage"],
  },
  {
    number: 26,
    isIndependent: true,
    originalText:
      "The alarm-bell and its spring-actuated striker having the arms to release the dogs, in combination with the slide q², dogs f² and f′, indicator-rod q², with the stud u², and detent r², whereby the alarm is operated to indicate the completion of the line, and the indicator automatically restored to the starting-point.",
    plainEnglish:
      "This claims the bell and resetting linkage that warns when a line is complete and returns the indicator.",
    keyInnovations: ["completion alarm", "automatic reset"],
  },
  {
    number: 27,
    isIndependent: true,
    originalText:
      "The bell and spring-actuated striker bearing two trip-arms, in combination with the indicator-rod bearing studs u² t², its restoring-spring, the detent r², bearing the shoulder s², the dogs f² f′, plate d², and slides a², connected to the respective finger-keys.",
    plainEnglish:
      "This further specifies the bell trip arms, indicator rod, detent, dogs, and key-connected slides.",
    keyInnovations: ["bell trip arms", "indicator rod", "key-connected slides"],
  },
  {
    number: 28,
    isIndependent: true,
    originalText:
      "In combination with the bell and spring-actuated striker, the detent having both the extremity and the shoulder to engage the striker, and the indicator-rod provided with the two studs t² and u², whereby the alarm is caused to sound twice, as and for the purpose described.",
    plainEnglish:
      "This isolates the two-strike warning arrangement using the detent and two indicator-rod studs.",
    keyInnovations: ["two-stroke alarm", "detent shoulder"],
  },
  {
    number: 29,
    isIndependent: true,
    originalText:
      "In combination with the stop-pins arranged in horizontal rows, as described and shown, the laterally-movable frame K, having adjusting-pins J mounted therein, the two weights tending to move the frame K in opposite directions, and mechanism, substantially as described, for throwing said weights into action alternately at will, whereby the series of adjusting-pins may be carried backward to effect the justification or correction of the spacing.",
    plainEnglish:
      "This claims the weighted frame motion used to move adjusting pins backward for spacing correction or justification.",
    keyInnovations: ["opposed weights", "spacing correction", "adjusting-pin frame"],
  },
  {
    number: 30,
    isIndependent: true,
    originalText:
      "The independent tapered matrix-bars, each provided with a plurality of spacing-surfaces, the row of stop-pins for each bar, the series of adjusting-pins mounted in the laterally-movable frame, the finger-keys and connections whereby they are enabled to project the adjusting-pins, the bar V, provided with the slides to arrest the backward movement of the adjusting-pin frame, the space-indicating bar and its connections to project the slides, and the devices, substantially as described, to restore said slides connected with all the spacing-keys, whereby the operator is enabled to first adjust the stop-pins for all the characters in a line and subsequently adjust the intermediate stop-pins for the spaces.",
    plainEnglish:
      "This claims the full two-stage arrangement: set character stops first, then use the width indicator and space keys to set intermediate spacing stops.",
    keyInnovations: ["two-stage setting", "space indicator", "spacing keys"],
  },
  {
    number: 31,
    isIndependent: true,
    originalText:
      "In combination with the matrix-bars and stop-pins, the laterally-movable adjusting-pin frame K, the rack-bar V, the slides t′ therein, the shaft provided with the pinion and the two escape-wheels k′ r′, the detent e′, the lever u′, to project the slides rearward, the arm l′, to restore the slides and engage the detent-wheel r′, and devices, substantially as described, connecting the lever u′ with the spacing-bar U, and the arm l′ with the space-keys, as described, whereby the operator is enabled at will to set the machine for the use of spaces of any desired width.",
    plainEnglish:
      "This claim details the rack, pinion, escapements, levers, and space keys that let the operator choose a desired space width.",
    keyInnovations: ["spacing-bar", "escapement wheels", "selectable space width"],
  },
  {
    number: 32,
    isIndependent: true,
    originalText:
      "In combination with the matrix-bars provided with spacing-surfaces, the finger-keys and intermediate mechanism whereby the keys are enabled to arrest the bars with the designated characters or spaces at the aligning-point, the counting or indicating mechanism, substantially as described, to show the aggregate width of the selected characters and spaces, a connection between said mechanism, substantially as described, and those finger-keys which represent characters, and a separate connection, substantially as described, between said indicating mechanism and the independent space-bar U, as described, whereby the aggregate width of the selected characters and intermediate spaces of minimum width may be indicated and the devices adjusted to bring the characters in position previous to adjusting the devices for bringing the spaces in position, so that the operator may effect the spacing or justification of each line after the designation of the characters therein.",
    plainEnglish:
      "This protects the complete workflow of measuring selected character width first, then using the separate space mechanism to justify the line.",
    keyInnovations: [
      "separate space-bar",
      "line-width measurement",
      "post-selection justification",
    ],
  },
  {
    number: 33,
    isIndependent: true,
    originalText:
      "In combination with the perforated matrix-bars, the aligning-rod arranged to be projected through the series of bars.",
    plainEnglish:
      "This claims the aligning rod projected through the perforated series of matrix bars.",
    keyInnovations: ["perforated bars", "aligning rod"],
  },
  {
    number: 34,
    isIndependent: true,
    originalText:
      "In combination with the series of perforated matrix-bars, the aligning-rod, and automatic mechanism, substantially such as described and shown, for advancing and retracting the same.",
    plainEnglish: "This adds automatic advance and retraction of the aligning rod.",
    keyInnovations: ["automatic alignment", "reciprocating rod"],
  },
  {
    number: 35,
    isIndependent: true,
    originalText:
      "The perforated matrix-bars, in combination with the laterally-acting clamp and the aligning-rod attached to one of said clamps, as described.",
    plainEnglish:
      "This combines perforated bars with a lateral clamp that carries the aligning rod.",
    keyInnovations: ["lateral clamp", "clamp-mounted aligning rod"],
  },
  {
    number: 36,
    isIndependent: true,
    originalText:
      "In combination with the perforated matrix-bars, the aligning-rod, and the clamps having the rod attached, the stripper-plate y³, as described and shown, to prevent the bars from moving laterally and biting upon the rod.",
    plainEnglish:
      "This adds a stripper plate to prevent sideways bar movement from binding on the aligning rod.",
    keyInnovations: ["stripper plate", "anti-binding alignment"],
  },
  {
    number: 37,
    isIndependent: true,
    originalText:
      "In combination with the matrix-bars, the aligning-rod, the clamp, and the stripper, the stripper-retracting rod connected with the clamp and having a limited independent motion, as described.",
    plainEnglish:
      "This claims the stripper return rod that follows the clamp while retaining limited independent motion.",
    keyInnovations: ["stripper-retracting rod", "limited independent motion"],
  },
  {
    number: 38,
    isIndependent: true,
    originalText:
      "In combination with the notched matrix-bars, the aligning-blade arranged to enter the notches, as described.",
    plainEnglish: "This claims the alignment blade that enters the bars' notches.",
    keyInnovations: ["notched bars", "aligning blade"],
  },
  {
    number: 39,
    isIndependent: true,
    originalText:
      "In combination with the perforated and notched matrix-bars, the aligning-rod, the aligning-blade, and automatic mechanism, substantially as described, for advancing the rod and the bar in the order named.",
    plainEnglish:
      "This combines perforated and notched bars with automatic sequencing of the aligning rod and blade.",
    keyInnovations: ["sequenced alignment", "aligning rod", "aligning blade"],
  },
  {
    number: 40,
    isIndependent: true,
    originalText:
      "In combination with the matrix-bars and finger-keys, and intermediate mechanism, substantially as described, for bringing into action a larger or smaller number of bars, the slide to sustain those bars which are not called into action, and lateral clamping devices acting only on those bars which are in action.",
    plainEnglish:
      "This claim lets the machine select more or fewer bars while supporting inactive bars and clamping only active ones.",
    keyInnovations: ["selective bar count", "inactive-bar support", "selective clamping"],
  },
  {
    number: 41,
    isIndependent: true,
    originalText:
      "The series of independent movable matrix-bars, the head P, to lift said bars to a common height and lower them in unison, the finger-keys to designate the characters, intermediate mechanism, substantially such as described and shown, adjusted by the keys to arrest the descent of the individual bars, and a lateral clamp acting below the points to which the lower ends of the bars are raised by the lifting-head, whereby the clamp is enabled to act upon those bars which are called into action and permitted to pass beneath those bars which are not called into action without acting thereon.",
    plainEnglish:
      "This claims the lift-then-select sequence and a clamp positioned so it catches only the active bars while passing beneath inactive ones.",
    keyInnovations: ["common-height lift", "selective clamp", "individual descent stops"],
  },
  {
    number: 42,
    isIndependent: true,
    originalText:
      "The laterally-acting clamps, in combination with the independently-movable matrix-bars, and mechanism, substantially as described, for lifting the bars above the level of the clamps, whereby the clamps are permitted to pass beneath the bars which remain elevated to act upon those which have been called into use.",
    plainEnglish:
      "This protects the clamps' ability to pass under raised inactive bars and engage only selected bars.",
    keyInnovations: ["laterally acting clamps", "raised inactive bars"],
  },
  {
    number: 43,
    isIndependent: true,
    originalText:
      "In a machine for producing printing-bars, the combination, substantially as described and shown, of a changeable matrix composed of independent movable lines or series of intaglio characters and a casting mechanism to co-operate with the selected and aligned characters, whereby the matrix may be caused to present any desired characters in line and a cast be then taken of all the aligned characters at a single operation.",
    plainEnglish:
      "This is the high-level combination of a changeable matrix with casting: select a line of characters, align it, and cast all of them in one operation.",
    keyInnovations: ["changeable matrix", "single-operation line casting"],
  },
  {
    number: 44,
    isIndependent: true,
    originalText:
      "In a machine for producing printing-bars, the combination, substantially as hereinbefore described and shown, of the series of independently-movable matrix-bars, the series of finger-keys to designate the characters, the stop mechanism, substantially as described, actuated by the keys to arrest the individual bars with their designated characters in a common line, the mold extending transversely across the series of bars, and the mechanism for supplying the mold with molten metal.",
    plainEnglish:
      "This combines keyboard-selected bars, stops, a transverse mold, and molten-metal supply into the printing-bar machine.",
    keyInnovations: ["keyboard-selected matrix", "transverse mold", "molten-metal supply"],
  },
  {
    number: 45,
    isIndependent: true,
    originalText:
      "The mold, in combination with the series of matrix-bars to close the same on one side and the melting-pot having a delivery-mouth to close the same on the opposite side.",
    plainEnglish:
      "This defines the mold closed by matrix bars on one side and by the melting pot's delivery mouth on the other.",
    keyInnovations: ["two-sided mold closure", "melting-pot delivery mouth"],
  },
  {
    number: 46,
    isIndependent: true,
    originalText:
      "In a machine for producing printing-bars, the combination, substantially as hereinbefore described and shown, of the independently-movable matrix-bars, the finger-keys to designate the characters, the intermediate stop mechanism, substantially as described, connected with the keys to arrest the motion of the individual bars, the clamps to hold the adjusted bars, the mold extending across the bars, and the melting-pot and force-pump, said members organized for joint operation, as described.",
    plainEnglish:
      "This specifies the joint operation of selected bars, stops, clamps, mold, melting pot, and force pump.",
    keyInnovations: ["joint casting operation", "force pump", "matrix clamps"],
  },
  {
    number: 47,
    isIndependent: true,
    originalText:
      "In a machine for producing stereotype-bars, the combination, substantially as hereinbefore described, of the changeable or convertible matrix, the mold co-operating therewith, and appliances, substantially such as shown, for melting metal and forcing the same into the mold.",
    plainEnglish:
      "This covers the convertible matrix, cooperating mold, and apparatus for melting and forcing metal into it.",
    keyInnovations: ["convertible matrix", "metal forcing apparatus"],
  },
  {
    number: 48,
    isIndependent: true,
    originalText:
      "The matrix-bars, in combination with the clamping-bar across their rear edges, the sectional mold across their front edges, the lateral clamps, and the melting-pot closing the mold on one side and arranged to deliver molten metal therein.",
    plainEnglish:
      "This claim specifies the rear clamping bar, front sectional mold, lateral clamps, and melting pot surrounding the matrix-bar assembly.",
    keyInnovations: ["sectional mold", "rear clamping bar", "lateral clamps"],
  },
  {
    number: 49,
    isIndependent: true,
    originalText:
      "In combination with the movable melting-pot and movable clamping-bar A′, the intermediate matrix-bars, and mechanism, substantially such as shown, to close said members against the bars.",
    plainEnglish:
      "This covers movable pot and clamping-bar members and the mechanism that presses them against the matrix bars.",
    keyInnovations: ["movable melting pot", "movable clamping bar"],
  },
  {
    number: 50,
    isIndependent: true,
    originalText:
      "The matrix-bars, the sliding clamping-bar, the movable melting-pot, combined with the levers and links connecting the clamp and pot, as shown.",
    plainEnglish:
      "This defines the lever-and-link connection between the moving clamp and melting pot.",
    keyInnovations: ["sliding clamping bar", "linked melting pot"],
  },
  {
    number: 51,
    isIndependent: true,
    originalText:
      "In combination with the matrix-bars, the clamping-bar A′, the aligning-bar mounted therein, and the actuating devices, substantially as described, whereby the aligning-bar is advanced previous to the advance of the clamp.",
    plainEnglish:
      "This claims the timing that advances the alignment bar before the main clamp advances.",
    keyInnovations: ["alignment-before-clamping", "aligning bar"],
  },
  {
    number: 52,
    isIndependent: true,
    originalText:
      "The separable sliding mold, as described, having one of its parts provided with the longitudinal rib to prevent lateral displacement of the casting and with the stud to carry the casting endwise as the mold is opened.",
    plainEnglish:
      "This covers a separable sliding mold with a rib that keeps a casting straight and a stud that carries it out as the mold opens.",
    keyInnovations: ["sliding mold", "anti-lateral rib", "casting-carrying stud"],
  },
  {
    number: 53,
    isIndependent: true,
    originalText:
      "In combination with the mold having the sliding top, the ejector e⁴, to detach the casting therefrom.",
    plainEnglish:
      "This claims the ejector that detaches the casting from a mold with a sliding top.",
    keyInnovations: ["sliding mold top", "casting ejector"],
  },
  {
    number: 54,
    isIndependent: true,
    originalText:
      "In combination with the two-part separable mold, as described, the vibrating ejector e⁴, to detach the cast from the open mold, and the reciprocating rod to deliver the detached cast in an endwise direction.",
    plainEnglish:
      "This adds a vibrating ejector and a reciprocating rod to remove the cast endwise from the opened two-part mold.",
    keyInnovations: ["vibrating ejector", "endwise delivery"],
  },
  {
    number: 55,
    isIndependent: true,
    originalText:
      "In combination with the matrix-bars, the shouldered mold-sections, and the clamps o³ p³, connected to said sections, whereby the width of the assembled matrix-bars is caused to determine the length of the mold.",
    plainEnglish:
      "This makes the width of the assembled matrix control the effective length of the shouldered mold sections.",
    keyInnovations: ["shouldered mold sections", "matrix-determined mold length"],
  },
  {
    number: 56,
    isIndependent: true,
    originalText:
      "In a machine for the production of printing-bars, the combination, with automatic driving mechanism, substantially as described, of the independently-movable matrix-bars, the finger-keys to designate the characters, the stop-pins to arrest the respective bars, devices, substantially such as shown, connected with the keys to set the stop-pins, the mold, the melting-pot, and force-pump, and the movable frame whereby the stop-pins, previously adjusted by the key connections, are first moved into position to arrest the bars, and subsequently restored to their original positions, whereby the casting of one bar and the designation of the characters for another one are permitted to take place at the same time.",
    plainEnglish:
      "This is a cycle-overlap claim: while one selected line is being cast, the machine can begin selecting characters for the next line.",
    keyInnovations: ["overlapped cycles", "automatic drive", "resettable stop pins"],
  },
  {
    number: 57,
    isIndependent: true,
    originalText:
      "In combination with the matrix-bars and the clamping-bar A′, movable to and from the same, the lateral clamps mounted on slides on the bar A′, as shown.",
    plainEnglish: "This claims lateral clamps carried on the moving clamping bar.",
    keyInnovations: ["clamping-bar slides", "lateral clamps"],
  },
  {
    number: 58,
    isIndependent: true,
    originalText:
      "In combination with the melting-pot, the movable mold-section provided with a wiper to traverse the mouth or delivery-port of the pot.",
    plainEnglish:
      "This protects the wiper that crosses the melting pot's delivery mouth as the mold section moves.",
    keyInnovations: ["delivery-port wiper", "movable mold section"],
  },
  {
    number: 59,
    isIndependent: true,
    originalText:
      "In combination with the movable mold-section adapted, as described, to carry the cast, the fixed knife to dress the edge of the cast, whereby the casts are rendered uniform in height and straight on the base.",
    plainEnglish:
      "This claims the fixed knife that trims each cast as its movable mold section carries it out.",
    keyInnovations: ["fixed trimming knife", "uniform cast base"],
  },
  {
    number: 60,
    isIndependent: true,
    originalText:
      "In combination with the matrix-bars, the pivoted melting-pot provided with the face to close the mold, and with the delivery-orifice in said face, and mechanism, substantially as described, to effect the rocking motion, whereby it is caused to serve the additional purpose of a clamp to hold the bars in position.",
    plainEnglish:
      "This covers a pivoted melting pot whose face both delivers metal and acts as a clamp closing the mold.",
    keyInnovations: ["pivoted melting pot", "delivery face", "pot-as-clamp"],
  },
  {
    number: 61,
    isIndependent: true,
    originalText:
      "In combination with the laterally-movable pin-frame K, the indicating mechanism, and the stop-pin frame movable forward and backward, the hand-lever M, and connections therewith, substantially as described, whereby the various parts may be instantly restored to their initial positions to permit the commencement of a new line in the event of an error having been committed.",
    plainEnglish:
      "This provides a hand lever that resets the pin frame, indicator, and stop-pin frame after an error so a new line can begin.",
    keyInnovations: ["error reset", "hand lever", "pin-frame reset"],
  },
  {
    number: 62,
    isIndependent: true,
    originalText:
      "In combination with the indicator-rod q² and dogs f′ f², the striker provided with arms to trip the dogs, the detent r², and the slide q², having inclined surfaces to trip the detent and striker and subsequently reset the striker.",
    plainEnglish:
      "This covers the indicator-and-alarm linkage that trips and then resets the striker.",
    keyInnovations: ["indicator rod", "alarm striker", "resetting slide"],
  },
  {
    number: 63,
    isIndependent: true,
    originalText:
      "In combination with a mold open on two sides, a series of movable matrices grouped in line against one side of the mold, a pot or reservoir acting against the opposite side of the mold, and a pump to deliver the molten or plastic material into the mold, as described and shown.",
    plainEnglish:
      "This broad claim covers a two-sided mold closed by a line of movable matrices on one side and a material reservoir on the other, with a pump filling it.",
    keyInnovations: ["two-sided mold", "matrix line", "pumped material reservoir"],
  },
  {
    number: 64,
    isIndependent: true,
    originalText:
      "In combination with the matrix-bars, mold, and melting-pot, the finger-keys to designate the characters, the stop mechanism, substantially as described, between the keys and bars to arrest the motion of the latter, the dogs to sustain the adjusted bars independently of the stop mechanism, and the automatic mechanism, substantially as described, for moving the adjusted stops into the path of the bars, and subsequently restoring them to their normal position, whereby the two operations of forming one bar and designating the characters for another may be carried on simultaneously.",
    plainEnglish:
      "This is another overlap claim for selecting the next line while casting the current one, using dogs that hold selected bars independently of the resetting stops.",
    keyInnovations: [
      "simultaneous line formation",
      "sustaining dogs",
      "automatic stop restoration",
    ],
  },
  {
    number: 65,
    isIndependent: true,
    originalText:
      "The matrix-bar having therein transverse grooves with intaglio characters in the bottom, said grooves being of uniform width at the edge of the bar, but of different widths at the bottom corresponding to the heights of the respective characters.",
    plainEnglish:
      "This claims grooves that enter from the bar edge at a common width but widen differently at the character bottom according to character height.",
    keyInnovations: ["variable-bottom grooves", "intaglio character depth"],
  },
  {
    number: 66,
    isIndependent: true,
    originalText:
      "In combination with the adjusting-pins J, terminating in different vertical planes, the crank-shafts L, arranged in two vertical rows, as described.",
    plainEnglish:
      "This covers differently projecting adjusting pins and their crank shafts arranged in two vertical rows.",
    keyInnovations: ["differential pin planes", "two-row crank shafts"],
  },
  {
    number: 67,
    isIndependent: true,
    originalText:
      "The series of bars provided with spacing-surfaces of different widths, in combination with stops, substantially as described, adapted to arrest the bars with any one of the spaces at the aligning-point, whereby the particular space to appear in the line may be positively determined.",
    plainEnglish:
      "This claims selecting a precisely chosen spacing width by stopping a matrix bar at the corresponding blank surface.",
    keyInnovations: ["selected space width", "spacing-surface stops"],
  },
  {
    number: 68,
    isIndependent: true,
    originalText:
      "A series of independently-reciprocating bars each provided with a series of characters and a series of spacing-surfaces, in combination with a series of stop-pins for each bar, one for each character, and one for each space, substantially as described and shown, whereby each bar may be positively stopped to present a character or a space at a point of alignment to the series.",
    plainEnglish:
      "This claims individually reciprocating bars with a dedicated stop pin for every character and every space position.",
    keyInnovations: ["independent reciprocation", "one stop per character or space"],
  },
  {
    number: 69,
    isIndependent: true,
    originalText:
      "The combination of the series of parallel matrix-bars, and the mold having its parts mounted, substantially as described, to move transversely of the bars, whereby the removal of the casting is facilitated.",
    plainEnglish:
      "This covers mold parts that move sideways across the parallel matrix bars to make cast removal easier.",
    keyInnovations: ["transversely moving mold", "cast removal"],
  },
  {
    number: 70,
    isIndependent: true,
    originalText:
      "In combination with the elongated mold, the series of independent matrix-bars lying transversely across the face of the mold, and a clamp or pressure device, substantially as described, to urge the bars edgewise toward the mold, whereby they may be released for adjustment and then clamped tightly to the mold.",
    plainEnglish:
      "This covers transverse independent matrix bars and a clamp that first releases them for adjustment and then presses their edges tightly against an elongated mold.",
    keyInnovations: ["elongated mold", "transverse matrix bars", "adjust-and-clamp cycle"],
  },
];

export const mergenthalerLinotypeArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "d85530ab4302e8be7e4c0ac280d438756f1dd21dabc844f2c5b2e76861d7444a",
  preparedBy: "Classic Patents editorial agent (SteelNeedle)",
  preparedAt: "2026-08-18",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE",
        "OTTMAR MERGENTHALER, OF BALTIMORE, MARYLAND",
        "MACHINE FOR PRODUCING PRINTING-BARS",
        "Specification forming part of Letters Patent No. 313,224, dated March 3, 1885",
        "Application filed February 12, 1884. Serial No. 120,497. (No model.)",
        "70 Claims. (Cl. 199—1)",
      ],
    },
    { kind: "heading", level: 2, text: "Field of the Invention" },
    paragraph(
      literal(
        "Be it known that I, OTTMAR MERGENTHALER, of Baltimore, Maryland, have invented certain new and useful Improvements in Machines for Producing Printing-Bars, of which the following is a specification.",
      ),
    ),
    paragraph(
      literal(
        "This invention relates to an automatic stereotyping apparatus and machine for casting solid printing slugs or type-bars directly from a justified line of matrices composed by an operator at a keyboard, eliminating manual hand-typesetting.",
      ),
    ),
    { kind: "heading", level: 2, text: "The Matrix-Bar System and Keyboard Assembly" },
    paragraph([
      text("The machine employs a plurality of vertically movable "),
      term(
        "matrix-bars",
        "Continuous metal bars each bearing a vertical column of intaglio (recessed) letter and symbol dies on their edge, arranged in order of character width.",
      ),
      text(
        " arranged side-by-side. As the operator depresses character keys on the keyboard, corresponding stop-pins are projected into the path of the falling matrix-bars, arresting each bar at the precise height required to bring the selected character die to the horizontal line of alignment.",
      ),
    ]),
    paragraph([
      figure(1, "Fig. 1"),
      text(" shows a general perspective view of the machine, while "),
      figure(2, "Fig. 2"),
      text(
        " illustrates the vertical sectional elevation of the matrix-bar magazine, keyboard escapement mechanism, and stop-pin frame.",
      ),
    ]),
    { kind: "heading", level: 2, text: "Line Justification and Wedge Spacebands" },
    paragraph([
      text("Line justification is achieved by interposing expandable "),
      term(
        "spacebands",
        "Sliding wedge pairs inserted between word matrices that expand uniformly when driven upward, spreading words evenly across the exact column width.",
      ),
      text(
        " between the word groups. When a line of matrices is assembled, a justification bar pushes the wedges upward until the entire line expands tightly between the side-vises, producing perfectly flush left and right margins.",
      ),
    ]),
    paragraph([
      figure(3, "Fig. 3"),
      text(" details the justification wedge mechanism and matrix-clamping vice, and "),
      figure(4, "Fig. 4"),
      text(" shows the individual matrix-bar and spaceband cross-sections."),
    ]),
    { kind: "heading", level: 2, text: "Casting and Metal Pump Mechanism" },
    paragraph([
      text(
        "Once justified and aligned, the face of the matrix line is clamped tightly against an open slotted ",
      ),
      term(
        "mold",
        "A steel slot corresponding to the exact thickness and column width of the desired line-of-type (slug).",
      ),
      text(
        ". A heated melting pot containing molten type-metal (lead, tin, and antimony alloy) is moved forward against the rear of the mold, and a plunger pump injects molten metal under pressure against the recessed matrix dies, instantaneously casting a solid, ready-to-print line of type.",
      ),
    ]),
    paragraph(
      literal(
        "The mold wheel rotates, trimming knives shave the slug to precise type-height, and an ejector blade pushes the finished line-of-type into a galley tray while the matrix-bars are automatically released and returned to their home positions to compose the next line.",
      ),
    ),
    { kind: "heading", level: 2, text: "Claims" },
    paragraph(literal("Having thus described my invention, what I claim is:")),
    ...mergenthalerLinotypeClaims.map((claim) => ({
      kind: "claim" as const,
      number: claim.number,
      inlines: literal(claim.originalText),
    })),
  ],
};

export const mergenthalerLinotypeParallelReadings: Readonly<Record<number, readonly string[]>> = {
  2: [
    "The opening formal declaration identifies Ottmar Mergenthaler and the invention title for casting printing slugs directly from assembled matrices.",
  ],
  3: [
    "The specification defines the machine's purpose: replacing manual letter-by-letter hand typesetting with an automatic keyboard-operated linecaster.",
  ],
  5: [
    "Vertical matrix bars carry columns of recessed character dies. Depressing keys projects stop pins that catch each bar at the chosen character height.",
  ],
  6: [
    "Figure 1 provides a perspective view of the linotype machine; Figure 2 shows the vertical cross-section through the keyboard and pin frame.",
  ],
  8: [
    "Sliding wedge spacebands between word groups expand when pushed upward from below, justifying the assembled line tightly to the column margins.",
  ],
  9: [
    "Figure 3 illustrates the justification wedge mechanism and clamping vice; Figure 4 shows matrix-bar profiles and spaceband details.",
  ],
  11: [
    "Molten lead-alloy type metal is pumped under pressure against the justified matrix line inside a slotted mold, casting a solid type slug in one stroke.",
  ],
  12: [
    "The mold rotates to trim the slug to type-height and eject it into a tray, while matrix bars automatically reset for the next line of composition.",
  ],
  14: [
    "The formal claims define the 70 patentable mechanical combinations, matrix bar shapes, wedge spacebands, keyboard escapements, and casting systems.",
  ],
};
