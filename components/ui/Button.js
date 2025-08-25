export default function Button({ children, variant = "primary", className = "", ...props }) {
  const base =
    "px-4 py-2  transition  duration-200";

  const variants = {
    primary: "bg-primary text-neutral-50 border border-primary hover:bg-neutral-50 hover:text-primary rounded-sm",
    secondary: "bg-neutral-50 text-primary border border-primary hover:bg-primary hover:text-neutral-50 rounded-sm",
    accent: "bg-accent text-neutral-50 border border-accent hover:bg-neutral-50 hover:text-accent rounded-sm",
    accentOutlined: "bg-transparent text-accent border border-accent hover:bg-accent hover:text-neutral-50 rounded-sm",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}  transition `}
      {...props}
    >
      {children}
    </button>
  );
}
