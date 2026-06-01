export default function Spinner({ size = 24 }: { size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="border-2 border-zinc-200 border-t-black rounded-full animate-spin"
    />
  )
}
