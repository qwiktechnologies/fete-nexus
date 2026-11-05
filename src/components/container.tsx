export function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`w-full px-5 sm:px-8 lg:px-12 ${className}`}>{children}</div>;
}
