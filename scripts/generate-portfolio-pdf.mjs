/**
 * Generates portfolio PDF files from print-ready HTML using Playwright.
 * Run: npm install && npx playwright install chromium && npm run generate-pdf
 */
import { chromium } from "playwright";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "assets", "portfolio");

/** @param {string} htmlRel - Path relative to repo root */
async function pdfFromHtml(htmlRel, pdfName) {
  const htmlAbs = path.join(root, htmlRel);
  const pdfAbs = path.join(outDir, pdfName);
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`file:///${htmlAbs.replace(/\\/g, "/")}`, {
    waitUntil: "networkidle",
  });
  await page.pdf({
    path: pdfAbs,
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
  });
  await browser.close();
  console.log(`Wrote ${pdfAbs}`);
}

fs.mkdirSync(outDir, { recursive: true });

await pdfFromHtml("docs/portfolio-one-page.html", "leo-suite-one-page.pdf");
await pdfFromHtml("docs/portfolio-full.html", "leo-suite-full-portfolio.pdf");

console.log("Portfolio PDFs generated.");
