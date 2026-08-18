import * as fs from "node:fs";
import * as path from "node:path";

const newPatentsToFetch = [
  {
    id: "us-6469-lincoln-buoy",
    number: "US6469",
    altUrl: "https://patentimages.storage.googleapis.com/pdfs/US6469.pdf",
  },
  {
    id: "us-4750-howe-sewing-machine",
    number: "US4750",
    altUrl: "https://patentimages.storage.googleapis.com/b5/aa/70/4e84b80bbf23fa/US4750.pdf",
  },
  {
    id: "us-533367-tesla-coil",
    number: "US533367",
    altUrl: "https://patentimages.storage.googleapis.com/56/a8/51/8725ae15893d56/US533367.pdf",
  },
  {
    id: "us-1155986-goddard-rocket",
    number: "US1155986",
    altUrl: "https://patentimages.storage.googleapis.com/ef/da/be/e02fcff4b986c7/US1155986.pdf",
  },
  {
    id: "us-2569347-bardeen-transistor",
    number: "US2569347",
    altUrl: "https://patentimages.storage.googleapis.com/39/e8/3c/6920ad5212563f/US2569347.pdf",
  },
  {
    id: "us-3923554-boyle-smith-ccd",
    number: "US3923554",
    altUrl: "https://patentimages.storage.googleapis.com/02/76/75/cd2ca75be415f3/US3923554.pdf",
  },
];

async function fetchNewPdfs() {
  const publicPdfDir = path.join(process.cwd(), "public", "patents", "pdfs");
  if (!fs.existsSync(publicPdfDir)) {
    fs.mkdirSync(publicPdfDir, { recursive: true });
  }

  for (const item of newPatentsToFetch) {
    const targetFile = path.join(publicPdfDir, `${item.id}.pdf`);
    if (fs.existsSync(targetFile)) {
      console.log(`[EXISTS] ${targetFile} (${fs.statSync(targetFile).size} bytes)`);
      continue;
    }

    console.log(`Fetching ${item.number} from Google Patents...`);
    // Try Google Patents search/fetch
    const searchUrl = `https://patents.google.com/patent/${item.number}A/en`;
    try {
      const res = await fetch(searchUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        },
      });
      const text = await res.text();
      const match =
        text.match(/href="([^"]+\.pdf)"/i) ||
        text.match(/(https:\/\/patentimages\.storage\.googleapis\.com\/[^"]+\.pdf)/i);
      let pdfUrl = match ? match[1] : item.altUrl;
      if (!pdfUrl.startsWith("http")) {
        pdfUrl = item.altUrl;
      }

      console.log(`  Downloading PDF from: ${pdfUrl}`);
      let pdfRes = await fetch(pdfUrl);
      if (!pdfRes.ok && item.altUrl && pdfUrl !== item.altUrl) {
        console.log(`  Trying fallback: ${item.altUrl}`);
        pdfRes = await fetch(item.altUrl);
      }

      if (pdfRes.ok) {
        const buf = await pdfRes.arrayBuffer();
        fs.writeFileSync(targetFile, Buffer.from(buf));
        console.log(`  ✓ Saved ${buf.byteLength} bytes to ${targetFile}`);
      } else {
        console.warn(`  ⚠ HTTP ${pdfRes.status} for ${item.number}`);
      }
    } catch (e: any) {
      console.error(`  Failed for ${item.number}:`, e.message);
    }
  }
}

fetchNewPdfs().catch(console.error);
