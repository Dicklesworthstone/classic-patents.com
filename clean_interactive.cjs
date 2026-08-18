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
    const lineStart = content.lastIndexOf("\n", markerIndex);

    // Some files might have `</div>` differently.
    // Generally the container is `div className="relative w-full h-full min-h-[...`
    // The interactive controls bar is a sibling div inside that container.
    // Therefore removing the controls bar just means we close the container div.
    content = content.substring(0, lineStart) + "\n    </div>\n  );\n}\n";

    fs.writeFileSync(filePath, content);
    console.log("Cleaned:", file);
    modifiedCount++;
  }
}
console.log("Total files cleaned:", modifiedCount);
