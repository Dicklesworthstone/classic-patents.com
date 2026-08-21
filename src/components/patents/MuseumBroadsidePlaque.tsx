import type { Patent } from "@/types/patent";
import { formatPatentDate } from "@/utils/patentDate";

export function MuseumBroadsidePlaque({ patent }: { patent: Patent }) {
  return (
    <div className="hidden print:block mb-6 pb-6 border-b-2 border-black font-serif">
      {/* Official Broadside Masthead */}
      <div className="text-center border-b border-black pb-3 mb-4">
        <div className="text-[10pt] tracking-[0.25em] uppercase font-bold text-gray-700">
          United States Patent &amp; Trademark Archive
        </div>
        <div className="text-2xl font-bold tracking-wide uppercase mt-1">
          Historical Specification &amp; Engineering Broadside
        </div>
        <div className="text-[9pt] italic text-gray-600 mt-0.5">
          Curated &amp; Restored by Classic Patents (classic-patents.com)
        </div>
      </div>

      {/* Patent Title and Numbers */}
      <div className="flex justify-between items-baseline border-b border-dashed border-gray-400 pb-2 mb-3 text-sm">
        <div>
          <span className="font-bold text-base block">{patent.title.toUpperCase()}</span>
          <span className="text-xs text-gray-700 italic">{patent.subtitle}</span>
        </div>
        <div className="text-right font-mono">
          <span className="font-bold text-lg block">{patent.patentNumber}</span>
          <span className="text-xs text-gray-600">Class: {patent.usptoClassification}</span>
        </div>
      </div>

      {/* Metadata Grid */}
      <div className="grid grid-cols-3 gap-2 text-[9pt] font-sans border-b border-gray-300 pb-3 mb-3">
        <div>
          <span className="font-bold block uppercase text-[8pt] text-gray-600">Inventor(s):</span>
          <span>{patent.inventors.join(", ")}</span>
        </div>
        <div>
          <span className="font-bold block uppercase text-[8pt] text-gray-600">
            Origin / Location:
          </span>
          <span>{patent.inventorLocation}</span>
        </div>
        <div>
          <span className="font-bold block uppercase text-[8pt] text-gray-600">Dates:</span>
          <span>
            Filed: {patent.filingDate ? formatPatentDate(patent.filingDate) : "not recorded"} · Granted:{" "}
            {formatPatentDate(patent.grantDate)}
          </span>
        </div>
      </div>
    </div>
  );
}
