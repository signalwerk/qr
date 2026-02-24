import "./style.css";
import QRCode from "qrcode";

const input = document.querySelector("#qr-input");
const downloadSvgButton = document.querySelector("#download-svg-btn");
const downloadPngButton = document.querySelector("#download-png-btn");
const preview = document.querySelector("#qr-preview");

let latestSvg = "";
let latestPngDataUrl = "";
let debounceTimer;
let requestVersion = 0;

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

function resetGeneratedData() {
  latestSvg = "";
  latestPngDataUrl = "";
  setDownloadState(false);
}

function showHint() {
  preview.innerHTML =
    '<p class="hint">Enter text or a URL to generate a QR code.</p>';
}

function showLoading() {
  preview.innerHTML =
    '<div class="loading"><span class="spinner" aria-hidden="true"></span><p class="hint">Generating QR code...</p></div>';
}

async function generateQr(value, version) {
  if (!value) {
    showHint();
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

    if (version !== requestVersion) return;

    preview.innerHTML = latestSvg;
    setDownloadState(true);
  } catch (error) {
    if (version !== requestVersion) return;
    preview.innerHTML = `<p class="error">Could not generate QR code: ${error.message}</p>`;
    resetGeneratedData();
  }
}

function scheduleGenerate() {
  const value = input.value.trim();
  requestVersion += 1;
  const version = requestVersion;
  clearTimeout(debounceTimer);
  resetGeneratedData();

  if (!value) {
    showHint();
    return;
  }

  showLoading();
  debounceTimer = setTimeout(() => {
    generateQr(value, version);
  }, 300);
}

function generateNow() {
  const value = input.value.trim();
  requestVersion += 1;
  const version = requestVersion;
  clearTimeout(debounceTimer);
  resetGeneratedData();

  if (!value) {
    showHint();
    return;
  }

  showLoading();
  generateQr(value, version);
}

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
    generateNow();
  }
});

input.addEventListener("input", scheduleGenerate);

showHint();
