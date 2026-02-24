import "./style.css";
import QRCode from "qrcode";

const input = document.querySelector("#qr-input");
const generateButton = document.querySelector("#generate-btn");
const downloadSvgButton = document.querySelector("#download-svg-btn");
const downloadPngButton = document.querySelector("#download-png-btn");
const preview = document.querySelector("#qr-preview");

let latestSvg = "";
let latestPngDataUrl = "";

function setDownloadState(enabled) {
  downloadSvgButton.disabled = !enabled;
  downloadPngButton.disabled = !enabled;
}

function downloadFile(url, filename) {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

async function generateQr() {
  const value = input.value.trim();

  if (!value) {
    preview.innerHTML =
      '<p class="hint">Enter text or a URL to generate a QR code.</p>';
    latestSvg = "";
    latestPngDataUrl = "";
    setDownloadState(false);
    return;
  }

  try {
    const options = {
      errorCorrectionLevel: "M",
      margin: 1,
      width: 320,
    };

    latestSvg = await QRCode.toString(value, { ...options, type: "svg" });
    latestPngDataUrl = await QRCode.toDataURL(value, {
      ...options,
      type: "image/png",
    });

    preview.innerHTML = latestSvg;
    setDownloadState(true);
  } catch (error) {
    preview.innerHTML = `<p class="error">Could not generate QR code: ${error.message}</p>`;
    latestSvg = "";
    latestPngDataUrl = "";
    setDownloadState(false);
  }
}

generateButton.addEventListener("click", generateQr);

downloadSvgButton.addEventListener("click", () => {
  if (!latestSvg) return;
  const blob = new Blob([latestSvg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  downloadFile(url, "qr-code.svg");
  URL.revokeObjectURL(url);
});

downloadPngButton.addEventListener("click", () => {
  if (!latestPngDataUrl) return;
  downloadFile(latestPngDataUrl, "qr-code.png");
});

input.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    generateQr();
  }
});

preview.innerHTML =
  '<p class="hint">Enter text or a URL to generate a QR code.</p>';
