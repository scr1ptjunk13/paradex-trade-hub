export function Spinner({ size = 12 }: { size?: number }) {
  return (
    <div 
      className="inline-block border-2 border-[#333] border-t-[#6b7280] rounded-full animate-spin"
      style={{ width: size, height: size }}
    />
  );
}
