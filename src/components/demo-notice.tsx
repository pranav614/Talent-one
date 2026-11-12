export function DemoNotice({ children }: { children: React.ReactNode }) {
  return (
    <p
      aria-live="polite"
      className="mt-4 rounded-lg border border-brand/20 bg-brand-soft px-4 py-3 text-sm text-brand-deep"
      role="status"
    >
      {children}
    </p>
  );
}
