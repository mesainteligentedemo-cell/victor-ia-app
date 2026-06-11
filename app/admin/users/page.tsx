"use client";

export default function AdminUsers() {
  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", status: "Active", credits: 500 },
    { id: 2, name: "Jane Smith", email: "jane@example.com", status: "Active", credits: 250 },
    { id: 3, name: "Bob Wilson", email: "bob@example.com", status: "Inactive", credits: 0 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-black dark:text-white">Users Management</h1>

      <div className="overflow-x-auto border border-gray-200 dark:border-gray-800 rounded">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-black dark:text-white">Name</th>
              <th className="px-6 py-3 text-left font-semibold text-black dark:text-white">Email</th>
              <th className="px-6 py-3 text-left font-semibold text-black dark:text-white">Status</th>
              <th className="px-6 py-3 text-left font-semibold text-black dark:text-white">Credits</th>
              <th className="px-6 py-3 text-left font-semibold text-black dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900">
                <td className="px-6 py-3 text-black dark:text-white">{user.name}</td>
                <td className="px-6 py-3 text-gray-700 dark:text-gray-300">{user.email}</td>
                <td className="px-6 py-3">
                  <span className={`text-xs px-2 py-1 rounded ${user.status === "Active" ? "bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100" : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-3 font-semibold text-black dark:text-white">{user.credits}</td>
                <td className="px-6 py-3 space-x-2">
                  <button className="text-xs px-2 py-1 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900">Edit</button>
                  <button className="text-xs px-2 py-1 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
