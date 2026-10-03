import Image from "next/image";

export function Cover({
  src,
  alt,
  sizes,
  priority = false,
  className = "",
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const frame = `relative overflow-hidden bg-muted ${className}`;

  if (src.startsWith("http://") || src.startsWith("https://")) {
    return (
      <div className={frame}>
        {/* Admin URLs are arbitrary, so they cannot be allow-listed for next/image. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      </div>
    );
  }

  return (
    <div className={frame}>
      <Image
        src={src || "/templates/html-site.jpg"}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />
    </div>
  );
}
