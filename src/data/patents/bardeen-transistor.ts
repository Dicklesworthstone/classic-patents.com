/**
 * Compatibility entry point for the catalogue's former Bardeen/Brattain module.
 *
 * @deprecated Import `bardeenTransistor2524035Patent` from the canonical module.
 *
 * The old module misidentified a different Bell Labs patent as the point-contact
 * transistor grant. Keep this filename for downstream imports, but expose only
 * the canonical, source-reviewed US 2,524,035 record.
 */
export { bardeenTransistor2524035Patent as bardeenTransistorPatent } from "./bardeen-transistor-2524035";
