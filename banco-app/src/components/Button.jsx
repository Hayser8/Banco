export default function Button({ text, onClick, variant = "primary" }) {
    const baseStyles = "px-4 py-2 rounded-md transition-all";
    const styles =
      variant === "primary" ? "bg-primary text-white hover:bg-blue-600" : "bg-gray-700 text-white hover:bg-gray-600";
  
    return (
      <button onClick={onClick} className={`${baseStyles} ${styles}`}>
        {text}
      </button>
    );
  }
  