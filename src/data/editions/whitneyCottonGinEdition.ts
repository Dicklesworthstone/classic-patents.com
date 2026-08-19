import type {
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";

/**
 * This is a direct, manually checked transcription draft of the pinned twelve
 * page packet. It deliberately has no OCR import or text parsing step.
 *
 * Publication is intentionally withheld: the packet combines a surviving
 * drawing copy with later reconstructed sheets whose figure labels cannot yet
 * be verified one-to-one against every figure citation in the description.
 * Keep this draft, its ledger, and its existing crops for recovery research;
 * do not rebind it until every citation has an evidence-backed source crop.
 */
const text = (value: string): CuratedSpecificationInlines => [{ kind: "text", text: value }];

const dims: Record<string, [number, number]> = {
  "1": [1078, 1600],
  "2": [1078, 887],
  "3": [654, 759],
  "4": [661, 760],
  "5": [653, 779],
  "6": [581, 741],
  "7": [599, 815],
  "8": [1078, 783],
  "9": [713, 1300],
  "10": [520, 900],
  "11": [471, 1061],
  "12": [850, 760],
  "13": [1013, 737],
  "14": [1000, 778],
};

const preview = (number: number | string, label: string): CuratedSpecificationInline => {
  const [w, h] = dims[number.toString()] || [1078, 1600];
  const assetSuffix = number.toString() === "10" ? "-preview-v2" : "-preview";
  return {
    kind: "reference",
    text: label,
    href: `#figure-${number}`,
    referenceType: "figure",
    label: `Open the source-derived Whitney cotton-gin drawing crop ${number}`,
    figurePreviews: [
      {
        src: `/patents/figures/us-x72-whitney-cotton-gin-fig-${number}${assetSuffix}.png`,
        alt: `Source-derived crop ${number} from the Whitney cotton-gin facsimile drawing sheets.${number.toString() === "10" ? " This crop is framed to retain the printed Figure 10 label and curved breastwork drawing." : ""}`,
        width: w,
        height: h,
      },
    ],
  };
};

const fig = (
  before: string,
  number: number,
  label: string,
  after = "",
): CuratedSpecificationInlines => [
  { kind: "text", text: before },
  preview(number, label),
  ...(after ? [{ kind: "text" as const, text: after }] : []),
];

export const whitneyCottonGinArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "9b0873182dbd2852a89bbf5bc7101e2c3b7a2d0cc76cee0df5c7acbfc86844ee",
  preparedBy: "Classic Patents editorial agent (HazyTern)",
  preparedAt: "2026-08-17",
  completeFacsimileReviewed: true,
  claimStatus: {
    kind: "no-formal-claims-in-facsimile",
    evidence:
      "All twelve sheets were reviewed. Sheets 4–11 contain the descriptive schedule, its execution, and witnesses; sheet 12 contains the notarized affidavit. None presents a separately numbered or otherwise formal claim section. The earlier fabricated numbered claims are therefore intentionally absent.",
  },
  blocks: [
    {
      kind: "masthead",
      lines: [
        "72 X. E. WHITNEY. COTTON GIN.",
        "Patented March 14, 1794.",
        "A Description of a New Invented Cotton Gin: or Machine for cleansing and separating Cotton from its seeds.",
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "DRAWING SHEETS (FACSIMILE PAGES 1–3)",
      title: "Cotton Gin",
      description: [
        {
          kind: "text",
          text: "The record preserves an original drawing sheet and two restored sheets. ",
        },
        preview(1, "Figure 1"),
        {
          kind: "text",
          text: " is the sectional machine view; the remaining source-derived crops preserve the cylinder, brush, drive, breastwork, and hopper details as drawn.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: text(
        "State Department, November 26, 1803. I certify that the foregoing is a true copy of the description of the cotton gin referred to in the letters patent granted to Eli Whitney, dated the fourteenth day of March, one thousand seven hundred and ninety-four. James Madison.",
      ),
    },
    { kind: "heading", level: 2, text: "Description of a New Invented Cotton Gin" },
    {
      kind: "paragraph",
      inlines: text(
        "This Machine may be described under five divisions, corresponding to its five principal parts: Viz: 1. The Frame, 2. The Cylinder; 3. The Breastwork; 4. The clearer, and 5. The Hopper.",
      ),
    },
    { kind: "heading", level: 3, text: "I. The Frame" },
    {
      kind: "paragraph",
      inlines: text(
        "The frame, by which the whole work is supported and kept together, ought to be made of well seasoned timber, so that it may be firm and steady, and never become loose in the joints. Scantling four inches by three, will perhaps be stuff, of as suitable size as any. The frame should be of a square or parallelogramic form, the width must answer to the length of the Cylinder and the height and length may be proportioned as circumstances shall render convenient.",
      ),
    },
    {
      kind: "paragraph",
      inlines: fig(
        "In the drawing annexed, ",
        1,
        "Fig. 1",
        ", is a section of the Machine. A represents the cylinder, B The Breastwork, C, The clearer and D: The Hopper.",
      ),
    },
    { kind: "heading", level: 3, text: "II. The Cylinder" },
    {
      kind: "paragraph",
      inlines: fig(
        "The Cylinder is of wood: its form is perfectly described by its name, and its dimensions may be from six to nine inches diameter, and from two to five feet in length. This cylinder is placed horizontally across the frame, in such manner as to give room for the clearer on one side of it, and the Hopper on the other, as in ",
        1,
        "fig. 1",
        ". Its height, if the machine is worked by Hand should be about three feet four inches: otherwise it may be regulated by convenience. In the cylinder is fixed an Iron axis so large as to turn in the lathe without quivering. The axis may pass quite thro’ the cylinder or consist only of gudgeons, driven with cement into each end.",
      ),
    },
    {
      kind: "paragraph",
      inlines: [
        ...fig(
          "There must be a shoulder at, b. ",
          2,
          "Fig. 2",
          ". on each side the bearing or box to prevent any horizontal variation in the Cylinder. The bearings of the axis, or those parts which rest on the boxes must be rounded in a lathe, so that the centre of the axis may coincide with the center of the cylinder. One end of the axis should extend so far without the frame as to admit the winch, by which it is turned, to be connected with it at C. and so far at the other end as to receive the whirl designed for putting the clearer in motion. The brass boxes, in which the axis of the cylinder runs, consist each of two parts; c, and, d. ",
        ),
        preview(7, "Fig. 7"),
        {
          kind: "text",
          text: ". The lower part d, is sunk into the wood of the frame to keep it firm and motionless; and the upper part, c, is kept in its place by 2 small Iron bolts, H, H, headed on the lower end at, H. These bolts are inserted into the under side of the rail or scantling of the frame and continued up through both parts of the box. A portion of the bolts, as H, a, should be square, to prevent them from turning. The upper part of the box, c, is screwed down close, with a nut on the end of each bolt. At, e, is a perforation for conveying oil to the axis.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        ...fig(
          "After the cylinder, with its axis is fitted and rounded with exactness, the circular part of its surface is filled with teeth set in annular rows. The spaces d, e, f, g, h, ",
          2,
          "Fig. 2",
          " between the rows of teeth must be so large as to admit a cotton seed to turn round freely in them every way: and ought not to be less than seven sixteenths of an inch. The spaces k, l, m, n, &c, ",
        ),
        preview(1, "Fig. 1"),
        {
          kind: "text",
          text: ", between the teeth, in the same row, must be so small as not to admit a seed or a half seed. They ought not to exceed one twelfth of an inch, and I think about one sixteenth of an inch the best.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: fig(
        "The teeth are made and set in the following manner: Take common Iron wire about No. 12. 13 or 14: draw it about three sizes less, without nealing, in order to stiffen it. Cut it into pieces four or five feet in length and streighten them. Then with a machine, somewhat like that used for cutting Nails, cut the wire into pieces about an inch long. In the jaws of this machine at, o, ",
        10,
        "Fig. 10",
        ". are fixed the two pieces of steel, d, d, which are pressed together; as may be observed from the figure, by the operation of a compound lever. These pieces of steel are so set in, that upon being pressed together, their approaching surfaces, meet only on the side next to, d, d, leaving between them a wedge like opening, which enlarges as the distance from the place of contact increases. On the side, d, d, about an inch distant from the place of contact, is fixed a guage. The wire is inserted on the side opposite, d, d, and thrust thro’ to the guage. Then on forcing down the lever the wire is separated, leaving that end of the wire next the side, d, d, cut smoothly and transversely off, and the end of the other part flatted like a wedge.",
      ),
    },
    {
      kind: "paragraph",
      inlines: text(
        "The flatted end is then thrust forward to the guage and the same operation is repeated. In this manner the teeth are cut of equal length, with one end flatted and the other cut directly off. Flatting one end of the wire is beneficial in two ways: 1, The flatted ends of the teeth are driven into the wood with more ease and exactness: and 2, it prevents them from turning after they are set. To prevent the wires from bending while driving, they are holden with pliers the jaws of which ought to be about half an inch in width, with a corresponding transverse groove in each jaw. Thus holden, the teeth are, with a light hammer, driven, one by one, into the cylinder, perpendicular to its axis. Then with a tool, like a chissel or common screw Driver each tooth is inclined directly towards the tangent to that point of the circle, into which it is set, till the inclination is such that the tooth and tangent form an angle of about 55 or 60 Degrees. If this inclination be greater, the teeth will not take sufficient hold of the Cotton, if it be less there will be more difficulty in disengaging the Cotton from the teeth, after it is separated from the seeds.",
      ),
    },
    {
      kind: "paragraph",
      inlines: [
        ...fig(
          "When the teeth are all set they should be cut of an equal length. In order for this take a crooked gage ",
          8,
          "Fig. 8",
          " having two prongs q. r.; the curvature of which corresponds with that of the cylinder. This gage is merely a crooked fork, the thickness of whose prongs or tines, as represented between s. and t. ",
        ),
        preview(9, "Fig. 9"),
        {
          kind: "text",
          text: " equalizes the length of the teeth, and is applied to the cylinder, with one tine on each side of an annular row. With a pair of cutting pliers, cut the teeth 1.2.3. &c off even with the gage, then slide it along to 6.7.8. &c. and so proceed till you have trimmed all the teeth to an equal length. This done put the cylinder into a lathe and with a file bring the teeth to a kind of angular point, resembling a wire flatted and cut obliquely. After the teeth are brought to a proper shape, smooth them with a polishing file and the cylinder will be finished.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: text(
        "Remark. Though the dimensions of the cylinder may be varied, at pleasure, yet it is thought that those described are the best, being more easily made and kept in repair, than those of a larger size. The timber should be quarter stuff, i.e. a quarter of the Trunk of the Tree, otherwise it will crack in seasoning. It must also be of wood of an equal density such as beech, maple, black birch &c. In oak and many other kinds of wood, there are spaces between the grains which are not so hard as the grains themselves: and the teeth driven into those spaces would not stand sufficiently firm, while the grains are so hard as to prevent the teeth from being driven without bending.",
      ),
    },
    { kind: "heading", level: 3, text: "III. The Breastwork" },
    {
      kind: "paragraph",
      inlines: [
        ...fig("The breastwork ", 13, "Fig. 11", ", and B. "),
        preview(1, "Fig. 1"),
        { kind: "text", text: ". and " },
        preview(2, "Fig. 2"),
        {
          kind: "text",
          text: ", is fixed above the cylinder, parallel and contiguous to the same. It has transverse grooves or openings 1.2.3.4 &c through which the rows of teeth pass as the cylinder revolves: and its use is to obstruct the seeds while the Cotton is carried forward through the grooves by the teeth. That side of the breastwork next the cylinder should be made of brass or Iron, that it may be the more durable. Its face or surface a.x. ",
        },
        preview(1, "Fig. 1"),
        {
          kind: "text",
          text: ". ought to make an angle with the tangent x.z. less than 50 Degrees.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "A tooth in passing from k up to the breastwork B. fastens itself upon a certain quantity of Cotton, which is still connected with its seeds. The seeds being too large to pass through the breastwork are there stopped, while the cotton is forced thro’ the groove and disengaged from the seeds. Now if the point of the tooth enters the groove before the root or that part next the cylinder, it carries through all which it has collected in coming from k; but if the root of the tooth enter the groove before the point, part of the Cotton fastened on it, will slide off: and this latter case is preferable as it helps to give the Cotton a rotary motion in the hopper. The thickness of the breastwork, or the distance from a. to i. ",
        },
        preview(1, "Fig. 1"),
        {
          kind: "text",
          text: ". should be about 2 ½ or 3 inches, in proportion to the length of the cotton. It should be such that the cotton which is carried through by the teeth may be disconnected from that which is left in the hopper before it leaves the grooves; otherwise that which is carried partly through the breastwork will by the motion of that with which it is connected in the hopper become so collected and knotted at i, as to obstruct and bend the teeth.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: fig(
        "The under part of the breastwork next the cylinder is only, what has before been observed, to be made of iron or brass. It may be cast either in a solid piece and the openings for the passage of the teeth cut with a saw and files, or in as many parts as there are spaces between the several rows of teeth in the cylinder and in form of ",
        14,
        "Fig. 12",
        ", and the pieces set by means of a shank or tenon, in a groove running lengthwise along the wooden part of the breastwork. The breastwork described, if properly constructed, will it is thought answer every valuable purpose. But I shall mention one of a different construction which I have used with success, and is made in the following manner.",
      ),
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "Form a breastwork of the same shape and dimensions as the one before described, entirely of wood. Place a bar of wood one inch below the cylinder and parallel to it. Then with straps or ribs of iron, brass or tin plate, connect the breastwork of wood with the bar below. The ribs or straps must be so applied as to let it close to the surface of the cylinder between the wooden breastwork and the bar, and of a width that will permit them to work freely between the annular rows of teeth. That end of each strap which is fastened to the breastwork should divide widthwise into two parts, one of which should press close against the lower surface of the breastwork board, the other turn upwards from it. See ",
        },
        preview(14, "Fig. 14"),
        { kind: "text", text: "." },
      ],
    },
    { kind: "heading", level: 3, text: "IV. The Clearer" },
    {
      kind: "paragraph",
      inlines: fig(
        "The clearer C, ",
        1,
        "Fig. 1",
        ", is constructed in the following manner. Take an iron axis perfectly similar to that described as extending through the cylinder, except that it need not be so long, nor fitted for the application of a winch. Fasten together crosswise at right angles two pieces of timber of suitable size and of a length about equal to the diameter of the cylinder, so as to make the four arms equal in length, and in the axis of the said two crosses or frames of this kind. Set their distances from each other about one third of the length of the cylinder and fix the same fast on the axis. The arms of the two crosses are then connected by four pieces, of the same length of the cylinder: equidistant from the axis, and parallel to the same, and to each other. In each of the parallel pieces, on the outside or side opposite the axis, a channel is made lengthwise for the reception of a brush.",
      ),
    },
    {
      kind: "paragraph",
      inlines: fig(
        "The brush is made of Hogs bristles, set in a manner somewhat similar to that of setting the reeds in a Weavers Sleigh. Between two strips of wood about ⅛ of an inch in thickness and half an inch in breadth, is placed a small quantity of bristles; then a strong thread or twine is wound round the sticks, close to the bristles: then another quantity of bristles is inserted &c. till a brush is formed, equal in length to the cylinder. The bristles on the side a.a. ",
        11,
        "Fig. 6",
        " are smeared with pitch or rosin and seared down with a hot iron even with the wood, to prevent them from drawing out. On the other side they are cut with a chisel to the length of about an inch from the wood. A brush of this kind is fixed in each of the before mentioned channels.",
      ),
    },
    {
      kind: "paragraph",
      inlines: text(
        "The boxes as well as axis of the clearer, are like those of the cylinder. The clearer is placed horizontal with the cylinder, parallel to it and at such a distance, that while it revolves the ends of the bristles strike with a small degree of friction on the cylinders surface. Its use is to brush the cotton from the teeth after it is forced through the grooves and separated from its seeds. It turns in a direction contrary from that of the cylinder, and should so far outrun it, as completely to sweep its whole surface.",
      ),
    },
    {
      kind: "paragraph",
      inlines: fig(
        "A clearer with two brushes may be made by simply screwing upon the axis the board K. ",
        9,
        "Fig. 4",
        ", and another similar board on the opposite side, which leaves spaces for the insertion of the brushes s.s. The clearer may also be formed of a cylinder with grooves running lengthwise in it for the reception of the brushes; or in any other way, which may be found convenient.",
      ),
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "The number of brushes in the clearer is not material; but let it be observed that the distance from, e, to e, ",
        },
        preview(1, "Fig. 1"),
        {
          kind: "text",
          text: ". between the brushes, must be at least 4 or 5 inches; otherwise the cotton will wind up round the clearer. The surface of the clearer moving much faster than that of the cylinder, the brushes sweep off the Cotton from the teeth. The air put in motion by the clearer, and the centrifugal force of the cotton disengage it from the brushes. Note, It is best to set the brushes in the grooves in such a manner, that the bristles will make an angle of about 20 or 25° with the diameter of the clearer, in the direction e,o, ",
        },
        preview(1, "Fig. 1"),
        {
          kind: "text",
          text: ". By that means the Bristles fall more perpendicularly on the teeth, strike them more forcibly, and clear off the cotton more effectually.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: fig(
        "The clearer is put in motion by the cylinder, by means of a band and whirls. These whirls are plain wheels of solid wood about 2 ½ or 3 inches thick. Their periphery is a spherical surface swelling at the center, and sloping off at the edges. To give them the proper shape, take a perfect globe of the same Diameter as your intended whirl; inscribe upon it a circle dividing it into two equal parts: then cut the globe on each side, parallel to the plane of this circle, and at the distance from it, of half the thickness of your whirl. On these whirls runs a leather band, the breadth of which answers to the thickness of the whirls. The band may be broader or narrower and the whirls thicker or thinner in proportion as the resistance to be overcome is greater or less. The reason for giving the whirls this shape is to secure them the better from being unbanded. A band of this kind always inclines to the highest place on the whirl, and is much less liable to be cast off from the work, when it runs on a spherical surface, than when it runs in a groove in the periphery of the whirl. ",
        8,
        "Fig. 3",
      ),
    },
    {
      kind: "paragraph",
      inlines: text(
        "The axis of the whirl Q is fixed in a plate of Iron, which is moveable in a groove in the side of the frame, and the band is made tighter or looser by moving the plate. This arrangement of whirls produces the same movement as a cogwheel and pinion, with much less friction and expence, and without the ratling noise, which is always caused by the quick motion of Cog-wheels.",
      ),
    },
    { kind: "heading", level: 3, text: "V. The Hopper" },
    {
      kind: "paragraph",
      inlines: fig(
        "One side of the Hopper is formed by the breastwork, the two ends by the frame, and the other side is moveable so that as the quantity of Cotton put in at one time, decreases, it may slide up nearer the cylinder, and make the Hopper narrower. This is necessary in order to give the seeds a rotary motion in the hopper, by bringing them repeatedly up to the cylinder till they are entirely stripped of the cotton. D. ",
        1,
        "Fig. 1",
        " is a section of the moveable part of the hopper. The part from H. to I. should be concave on the side next the breastwork, or rather it should be a portion of a hollow cylinder. Between H. and y. is a crate of wire thro’ which the sands and the seeds as soon as they are thoroughly cleansed, fall into a receptacle below. The crate may be either fixed in the frame or connected with the moveable part of the hopper. The wires of which the crate is made should be large and placed perpendicular to the cylinder, that the cotton may turn the more easily in the hopper.",
      ),
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "A few additional remarks will sufficiently shew the construction, use and operation of this machine. The cotton is put into the hopper I.D.H.k.a.u.s. ",
        },
        preview(1, "Fig. 1"),
        {
          kind: "text",
          text: ". in as large a quantity as the cylinder will put in motion. Some of the seeds become stripped sooner than others. If it be black seed Cotton, the seeds being smooth, will most of them fall through the crate as soon as they are clean, but a considerable part of the green seeds which are thus denominated from being covered with a kind of green coat, resembling Velvet will continue in the hopper. It will not answer therefore to supply it gradually as the quantity in it diminishes, because the seeds will soon grow cumbrous and by their constant intervention prevent the teeth from attaching themselves to the Cotton so fast as they otherwise would: but one hopper full must be finished, the moveable part drawn back, the hopper cleared of seeds and then supplied with Cotton anew.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: text(
        "There is a partition y.w. under the cylinder, on the left hand of which or the side beneath the hopper, the seeds fall, and the clean cotton on the other side. There may be a receptacle for the clean cotton in the frame: but it is best to have an opening through the wall or partition into a contiguous room, then place the end of the machine against this opening and let the cotton fly into a close room; or it may fall through an opening in the floor into a room below. This machine may be turned by Horses or Water with the greatest ease. It requires no other attendance than putting the Cotton into the hopper with a basket or fork, narrowing the hopper when necessary and letting out the seeds after they are clean. One of its peculiar excellencies is, that it cleanses the kind called green seed Cotton, almost as fast as the black seed. If the machinery is moved by water it is thought it will diminish the usual labour of cleaning the green seed cotton at least forty nine fiftieths.",
      ),
    },
    {
      kind: "paragraph",
      inlines: text(
        "The foregoing is a Description of the machine for cleansing Cotton, alluded to in a Petition of the Subscriber, Dated Philadelphia June 20th. 1793, and lodged in the Office of the Secretary of State alledging that he the Subscriber is the Inventor of said Machine, and signifying his desire of obtaining an exclusive property in the same.",
      ),
    },
    { kind: "paragraph", inlines: [{ kind: "small-caps", text: "ELI WHITNEY" }] },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "small-caps",
          text: "Signed in presence of Chauncey Goodrich, Counsellor at law, Hartford. John Allen, Counsellor at law, Litchfield.",
        },
      ],
    },
    { kind: "heading", level: 2, text: "Notarial Affidavit (facsimile page 12)" },
    {
      kind: "paragraph",
      inlines: text(
        "State of Connecticut Ss. City of New Haven. I Elizur Goodrich Esqre. Alderman for said City, and Not. Public, by lawful authority admitted and sworn, residing in said City, and by law authorized to administer Oaths, Do hereby certify, declare and make known to whom it doth or may concern: That at said City on this Twenty Eighth day of October one thousand seven hundred and ninety three, Eli Whitney of the County of Worcester in the Commonwealth of Massachusetts, now resident in said City, personally appeared before me, the said Alderman and Notary, and made solemn Oath, that he does verily believe that he the said Whitney is the True inventor and Discoverer of the machine for Ginning Cotton, a Description whereof is hereto annexed by me the said Alderman and Notary by my Seal Notarial, and that he the said Whitney verily believes that a Machine of similar construction hath never before been known, or used.",
      ),
    },
    {
      kind: "paragraph",
      inlines: text(
        "In Testimony whereof I the said Alderman and Notary, have hereunto set my Hand and Seal at the City aforesaid on the Day above said. Elizur Goodrich Alderman & Not. Public.",
      ),
    },
  ],
};

export { whitneyCottonGinParallelReadings } from "./whitneyCottonGinParallelReading";
