import fs from "fs";
import path from "path";

const telemetryContent = fs.readFileSync("src/physics/telemetryData.ts", "utf8");
const files = fs
  .readdirSync("src/components/patents/visuals/three")
  .filter((f) => f.endsWith("3D.tsx"));

files.forEach((f) => {
  const content = fs.readFileSync(path.join("src/components/patents/visuals/three", f), "utf8");
  const match = content.match(/usePatentPhysics\("([^"]+)"\)/);
  if (match) {
    const patentId = match[1];
    if (!telemetryContent.includes(`"${patentId}": {`)) {
      console.log(`Missing in telemetryData: ${patentId} from ${f}`);
    }
  }
});
