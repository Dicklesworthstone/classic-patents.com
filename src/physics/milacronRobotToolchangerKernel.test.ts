import { describe, expect, test } from "bun:test";
import {
  MILACRON_FRANKENSIM_CONTACT_OWNER,
  MILACRON_FRANKENSIM_JOINT_OWNER,
  MILACRON_ROBOT_TOOLCHANGER_DEFAULTS,
  readMilacronRobotToolchangerControls,
  stepMilacronRobotToolchanger,
} from "./milacronRobotToolchangerKernel";

describe("US 4,512,709 Milacron Robot Toolchanger source-bounded engagement topology", () => {
  test("starts in the source-described registered and Claim 4 captured teaching state", () => {
    const state = stepMilacronRobotToolchanger(MILACRON_ROBOT_TOOLCHANGER_DEFAULTS);
    expect(state.phase).toBe("captured-t-member");
    expect(state.registrationComplete).toBe(true);
    expect(state.retentionMemberAdmitted).toBe(true);
    expect(state.admissionPermitted).toBe(false);
    expect(state.toolRetained).toBe(true);
    expect(state.claimFourTMemberSelected).toBe(true);
    expect(state.claimFourRampCaptured).toBe(true);
    expect(state.quantitativeMechanicsRefused).toBe(true);
    expect(state.sequenceValid).toBe(true);
    expect(state.sourceBoundary.note).toContain(MILACRON_FRANKENSIM_JOINT_OWNER);
    expect(state.sourceBoundary.note).toContain(MILACRON_FRANKENSIM_CONTACT_OWNER);
  });

  test("requires a presented, positioned base before it can be retained", () => {
    const absent = stepMilacronRobotToolchanger({
      ...MILACRON_ROBOT_TOOLCHANGER_DEFAULTS,
      toolBasePresent: 0,
    });
    expect(absent.toolBasePresent).toBe(false);

    const unregistered = stepMilacronRobotToolchanger({
      ...MILACRON_ROBOT_TOOLCHANGER_DEFAULTS,
      registrationFraction: 0.5,
      lockingSlideFraction: 0,
    });
    expect(unregistered.registrationComplete).toBe(false);
    expect(unregistered.toolRetained).toBe(false);
  });

  test("holds the registered base seated when withdrawal is requested through a closed slide", () => {
    const blocked = stepMilacronRobotToolchanger({
      ...MILACRON_ROBOT_TOOLCHANGER_DEFAULTS,
      registrationFraction: 0.25,
      lockingSlideFraction: 0.7,
    });
    expect(blocked.requestedRegistrationFraction).toBe(0.25);
    expect(blocked.registrationFraction).toBe(1);
    expect(blocked.registrationComplete).toBe(true);
    expect(blocked.registrationMotionBlocked).toBe(true);
    expect(blocked.sequenceValid).toBe(false);
    expect(blocked.sequenceNote).toContain("blocked");
  });

  test("admits and releases only through an aligned slide aperture", () => {
    const open = stepMilacronRobotToolchanger({
      ...MILACRON_ROBOT_TOOLCHANGER_DEFAULTS,
      lockingSlideFraction: 0,
    });
    expect(open.apertureAligned).toBe(true);
    expect(open.admissionPermitted).toBe(true);
    expect(open.releasePermitted).toBe(true);
    expect(open.toolRetained).toBe(false);

    const withdrawn = stepMilacronRobotToolchanger({
      ...MILACRON_ROBOT_TOOLCHANGER_DEFAULTS,
      lockingSlideFraction: 0,
      registrationFraction: 0,
    });
    expect(withdrawn.registrationFraction).toBe(0);
    expect(withdrawn.releasePermitted).toBe(false);
    expect(withdrawn.sequenceValid).toBe(true);
  });

  test("keeps Claim 3 retention distinct from Claim 4's ramp-and-T refinement", () => {
    const generic = stepMilacronRobotToolchanger({
      ...MILACRON_ROBOT_TOOLCHANGER_DEFAULTS,
      claimFourTMember: 0,
    });
    expect(generic.toolRetained).toBe(true);
    expect(generic.claimFourTMemberSelected).toBe(false);
    expect(generic.claimFourRampCaptured).toBe(false);
    expect(generic.phase).toBe("locked");
  });

  test("bounds source-topology controls cleanly", () => {
    const controls = readMilacronRobotToolchangerControls({
      registrationFraction: 9,
      lockingSlideFraction: -3,
      claimFourTMember: Number.NaN,
    });
    expect(controls.registrationFraction).toBe(1);
    expect(controls.lockingSlideFraction).toBe(0);
    expect(controls.claimFourTMember).toBe(1);
  });
});
