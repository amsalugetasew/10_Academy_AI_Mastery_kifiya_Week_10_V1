export default function Navbar({ setSection }) {
  return (
    <nav className="flex gap-4 mb-6">
      {["home", "projects", "skills", "contact"].map((item) => (
        <button
          key={item}
          className="px-4 py-2 border rounded-md hover:bg-gray-200"
          onClick={() => setSection(item)}
        >
          {item.charAt(0).toUpperCase() + item.slice(1)}
        </button>
      ))}
    </nav>
  );
}
