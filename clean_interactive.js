const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "src/components/patents/visuals/three");
const files = fs.readdirSync(dir).filter((f) => f.endsWith("3D.tsx"));

let modifiedCount = 0;

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, "utf8");

  const marker = "{/* Interactive Controls & Scenario Bar */}";
  const markerIndex = content.indexOf(marker);

  if (markerIndex !== -1) {
    // Find the start of the line with the marker
    const lineStart = content.lastIndexOf("\n", markerIndex);

    // We want to replace everything from lineStart to the end with just the closing tags.
    // However, some files might have different structures, but generally it's:
    // </div>\n    </div>\n  );\n}
    // We can just append the closing sequence to the truncated content.

    content = content.substring(0, lineStart) + "\n    </div>\n  );\n}\n";

    fs.writeFileSync(filePath, content);
    console.log("Cleaned:", file);
    modifiedCount++;
  }
}
console.log("Total files cleaned:", modifiedCount);
