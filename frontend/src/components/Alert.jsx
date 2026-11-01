export default function Alert({ type = "error", children, ...props }) {
  if (!children) return null;
  return <div className={`alert alert-${type}`} role="alert" {...props}>{children}</div>;
}
