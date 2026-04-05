export function ExportCsvButton({ href }: { href: string }) {
  return (
    <a
      href={href}
      className="inline-flex min-h-11 items-center rounded-2xl border border-line bg-white px-4 py-2 text-sm font-bold text-ink"
    >
      Export CSV
    </a>
  );
}
