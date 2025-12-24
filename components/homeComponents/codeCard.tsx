const CodeCard = () => {
  return (
    <div className="rounded-2xl border border-foreground/20 bg-background p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-semibold text-foreground/90">PR Review (example)</div>
        <span className="text-xs text-foreground/50">PRizmai-bot</span>
      </div>

      <div className="space-y-3 text-sm">
        <div className="rounded-xl bg-foreground/5 p-3">
          <div className="mb-1 text-xs font-semibold text-foreground/60">Summary</div>
          <p className="text-foreground/80">
            Adds caching to reduce repeated API calls; touches auth middleware and product fetch logic.
          </p>
        </div>

        <div className="rounded-xl bg-foreground/5 p-3">
          <div className="mb-1 text-xs font-semibold text-foreground/60">High-signal notes</div>
          <ul className="list-disc space-y-1 pl-5 text-foreground/80">
            <li>Potential stale cache when token refresh happens.</li>
            <li>Missing null guard when product list is empty.</li>
            <li>Add test for cache invalidation on logout.</li>
          </ul>
        </div>

        <div className="rounded-xl bg-foreground/5 p-3">
          <div className="mb-1 text-xs font-semibold text-foreground/60">Suggested change</div>
          <p className="font-mono text-xs text-foreground/80">
            if (!items?.length) return [];
          </p>
        </div>
      </div>
    </div>
  );
}

export default CodeCard