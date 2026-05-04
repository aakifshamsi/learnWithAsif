interface Props {
  elementId: string;
  filename: string;
}

export function DownloadButton({ elementId, filename }: Props) {
  async function handleDownload() {
    const Plotly = (window as unknown as { Plotly?: { downloadImage: (el: Element, opts: object) => void } }).Plotly;
    if (!Plotly) return;
    const el = document.getElementById(elementId);
    if (!el) return;
    Plotly.downloadImage(el, { format: 'png', width: 1200, height: 600, filename });
  }

  return (
    <button
      onClick={handleDownload}
      className="text-xs text-blue-600 underline hover:text-blue-800 transition-colors"
      aria-label={`Download chart as PNG`}
    >
      Download PNG
    </button>
  );
}
