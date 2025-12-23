"use client";

export default function Error({ error }: { error: Error }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-destructive mb-2">Something went wrong</h2>
        <p className="text-muted-foreground">{error.message}</p>
      </div>
    </div>
  );
}
