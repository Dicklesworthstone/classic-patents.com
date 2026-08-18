const BASE_URL = process.env.BASE_URL || "https://classic-patents.com";

async function checkUrl(path: string): Promise<boolean> {
  const url = `${BASE_URL}${path}`;
  try {
    const res = await fetch(url, { method: "GET" });
    if (res.status !== 200) {
      console.error(`❌ FAILED: ${url} returned HTTP ${res.status}`);
      return false;
    }
    const html = await res.text();
    const minLength = path === "/robots.txt" ? 20 : 1000;
    if (!html || html.length < minLength) {
      console.error(`❌ FAILED: ${url} returned suspiciously short content (${html.length} bytes)`);
      return false;
    }
    console.log(`✓ OK: ${path} (HTTP 200, ${(html.length / 1024).toFixed(1)} KB)`);
    return true;
  } catch (err: any) {
    console.error(`❌ NETWORK ERROR: ${url} - ${err.message}`);
    return false;
  }
}

async function runSmokeTests() {
  console.log(`=== Classic Patents Production Smoke Test Gate ===`);
  console.log(`Target: ${BASE_URL}\n`);

  let allPassed = true;

  // 1. Core Top-Level Routes
  const coreRoutes = ["/", "/about", "/timeline", "/robots.txt", "/sitemap.xml"];
  for (const route of coreRoutes) {
    const ok = await checkUrl(route);
    if (!ok) allPassed = false;
  }

  // 2. Curated Sample of Historic Patent Routes
  const samplePatentIds = [
    "us-821393-wright-flyer",
    "us-138-colt-revolver",
    "us-381968-tesla-motor",
    "us-223898-edison-lightbulb",
    "us-2708656-fermi-reactor",
    "us-2981877-noyce-ic",
    "us-3541541-engelbart-mouse",
    "us-36836-gatling-gun",
    "us-6162-corliss-steam-engine",
    "us-4750-howe-sewing-machine",
  ];

  for (const id of samplePatentIds) {
    const ok = await checkUrl(`/patents/${id}`);
    if (!ok) allPassed = false;
  }

  if (!allPassed) {
    console.error(`\n🚨 PRODUCTION SMOKE TEST FAILED! One or more routes did not return HTTP 200.`);
    process.exit(1);
  }

  console.log(`\n🎉 ALL PRODUCTION ROUTES VERIFIED HEALTHY (HTTP 200 OK across all tested routes)`);
}

runSmokeTests().catch((err) => {
  console.error("Fatal smoke test error:", err);
  process.exit(1);
});
