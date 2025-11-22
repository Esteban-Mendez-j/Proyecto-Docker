
const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: (
      <>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </>
    ),
    href: "/admin/index",
  },
  {
    id: "vacantes",
    label: "Vacantes",
    icon: (
      <>
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
      </>
    ),
    href: "/admin/vacantes",
  },
  {
    id: "usuarios",
    label: "Usuarios",
    icon: (
      <>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </>
    ),
    href: "/admin/usuarios",
  },
];

export default function AdminSidebar({ activeItem }) {
  return (
    <aside className="w-full p-4 bg-white border border-gray-100 rounded-lg shadow-sm md:w-64 h-fit">
      <div className="mb-6">
        <h2 className="flex items-center text-lg font-bold text-blue-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
          >
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
          </svg>
          Panel Admin
        </h2>
      </div>

      <nav>
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <a
                href={item.href}
                className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                  activeItem === item.id
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-3"
                >
                  {item.icon}
                </svg>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="pt-6 mt-6 border-t border-gray-100">
        <a
          href="/admin/index"
          className="flex items-center px-4 py-2 text-gray-700 transition-colors rounded-md hover:bg-gray-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-3"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Volver al sitio
        </a>
      </div>
    </aside>
  );
}
