import { motion } from "framer-motion";
import jsPDF from "jspdf";
import { useTripPlanner } from "../contexts/TripPlannerContext";

function AIResult() {
  const { loading, result } = useTripPlanner();

  function downloadPDF(result) {
    const doc = new jsPDF();
    const margin = 15;
    const maxLineWidth = 180;
    const lineHeight = 10;
    const pageHeight = doc.internal.pageSize.getHeight();

    const plainText = formatPlainTextResponse(result || "No data to print");

    // Break paragraphs into printable lines
    const lines = doc.splitTextToSize(plainText, maxLineWidth);
    let currentY = margin;

    lines.forEach((line) => {
      // Check if we need a new page
      if (currentY + lineHeight > pageHeight - margin) {
        doc.addPage();
        currentY = margin;
      }

      doc.text(line, margin, currentY);
      currentY += lineHeight;
    });

    doc.save("packing-list.pdf");
  }

  function formatPlainTextResponse(text: string): string {
    const withBoldRemoved = text.replace(/\*\*(.*?)\*\*/g, "$1");
    const lines = withBoldRemoved.split("\n");

    const plainOutput = [];

    for (let line of lines) {
      line = line.trim();
      if (!line) continue;

      if (/^\*\s+/.test(line)) {
        plainOutput.push("• " + line.replace(/^\*\s+/, ""));
      } else {
        plainOutput.push(line);
      }
    }

    return plainOutput.join("\n");
  }

  function formatAIResponse(text: string): string {
    const withBold = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    const lines = withBold.split("\n");

    let inList = false;
    const output = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (!line) {
        // Add single line break only if previous output isn't already a break or block end
        const last = output.at(-1) || "";

        continue;
      }

      // Bullet point
      if (/^\*\s+/.test(line)) {
        const content = line.replace(/^\*\s+/, "");
        if (!inList) {
          output.push("<ul>");
          inList = true;
        }
        output.push(`<li>• ${content}</li>`);
        continue;
      }

      // Close list if next line isn't a bullet
      if (inList) {
        output.push("</ul>");
        inList = false;
      }

      // Numbered list
      if (/^\d+\.\s+/.test(line)) {
        output.push(`<p class="mb-[1px]">${line}</p>`);
        continue;
      }

      // Plain paragraph (but inline-style)
      output.push(`<div>${line}</div>`);
    }

    if (inList) {
      output.push("</ul>");
    }

    return output.join("\n");
  }

  return (
    <section className="flex-1 md:overflow-y-auto overflow-visible p-6 dark:bg-gray-900">
      {/* Loading State */}
      {loading && (
        <p className="mt-6 text-center text-blue-500 dark:text-blue-300 font-medium animate-pulse">
          Generating your list...
        </p>
      )}

      {/* Empty State */}
      {!loading && !result && (
        <div className="h-full flex flex-col items-center justify-center border border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center text-gray-500 dark:text-gray-400 space-y-6 shadow-sm bg-white dark:bg-gray-900 transition-all">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-blue-500 dark:text-blue-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 17v-6h13v6M9 5h13v6H9M5 13H4a2 2 0 00-2 2v3h7v-3a2 2 0 00-2-2H5z"
            />
          </svg>

          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-white">
              Ready to plan your trip?
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Fill in your destination and travel dates. We’ll generate a smart
              packing list, highlight landmarks, and even show you the weather.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            <span className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs dark:bg-blue-800 dark:text-blue-200">
              🧳 Packing List
            </span>
            <span className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs dark:bg-green-800 dark:text-green-200">
              📍 Landmarks
            </span>
            <span className="inline-flex items-center px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-xs dark:bg-yellow-800 dark:text-yellow-200">
              🌦️ Weather Forecast
            </span>
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500 italic">
            Waiting for your input to start planning...
          </p>
        </div>
      )}

      {/* Result Display */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 space-y-5"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            🧳 Suggested Packing List
          </h2>

          <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-slate-200">
            <div
              className="prose"
              dangerouslySetInnerHTML={{
                __html: formatAIResponse(result),
              }}
            ></div>
          </pre>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => downloadPDF(result)}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 shadow-sm"
            >
              ⬇️ Download PDF
            </button>
          </div>
        </motion.div>
      )}
    </section>
  );
}

export default AIResult;
