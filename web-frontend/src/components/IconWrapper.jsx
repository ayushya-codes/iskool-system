export default function IconWrapper({ children, size = 40, className = '' }) {
  return (
    <span
      className={`theme-icon-wrapper ${className}`}
      style={{ width: size, height: size }}
    >
      {children}
    </span>
  );
}
