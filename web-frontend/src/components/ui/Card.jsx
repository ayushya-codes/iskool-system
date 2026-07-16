export default function Card({ children, className = '', hover = false, onClick, style, ...rest }) {
  return (
    <div
      onClick={onClick}
      className={`rounded-xl theme-card ${hover ? 'theme-card-hover cursor-pointer' : ''} ${className}`}
      style={style}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`px-5 pt-5 pb-3 ${className}`}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = '' }) {
  return (
    <div className={`px-5 pb-5 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-base font-semibold theme-text ${className}`}>
      {children}
    </h3>
  );
}
