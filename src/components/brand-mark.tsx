import { assetPath } from "@/lib/asset";

export function BrandMark({
  className = "size-8",
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={assetPath("/brand/mark.svg")}
      alt=""
      width={64}
      height={64}
      className={`shrink-0 rounded-[0.65rem] ${className}`}
      decoding="async"
    />
  );
}
