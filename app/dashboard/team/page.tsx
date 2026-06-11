"use client";

import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { useModal } from "@/lib/hooks";
import { Modal } from "@/components/shared/Modal";
import { useState } from "react";

export default function TeamPage() {
  const [members, setMembers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", joined: "2024-01-15" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Editor", joined: "2024-02-01" },
    { id: 3, name: "Bob Wilson", email: "bob@example.com", role: "Viewer", joined: "2024-02-15" },
  ]);
  const { isOpen, open, close } = useModal();
  const [inviteEmail, setInviteEmail] = useState("");

  const handleInvite = async () => {
    if (!inviteEmail) return;
    
    const res = await fetch("/api/collaboration", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "invite", email: inviteEmail }),
    });
    
    if (res.ok) {
      setInviteEmail("");
      close();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-black dark:text-white mb-2">Team</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage team members and permissions</p>
        </div>
        <Button onClick={open} variant="primary">
          + Invite Member
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-900">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Members</p>
          <p className="text-4xl font-bold text-black dark:text-white mt-2">{members.length}</p>
        </div>
        <div className="p-6 border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-900">
          <p className="text-sm text-gray-600 dark:text-gray-400">Admins</p>
          <p className="text-4xl font-bold text-black dark:text-white mt-2">1</p>
        </div>
        <div className="p-6 border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-900">
          <p className="text-sm text-gray-600 dark:text-gray-400">Pending Invites</p>
          <p className="text-4xl font-bold text-black dark:text-white mt-2">0</p>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-black dark:text-white mb-4">Team Members</h2>
        <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-black dark:text-white">Name</th>
                <th className="px-6 py-3 text-left font-semibold text-black dark:text-white">Email</th>
                <th className="px-6 py-3 text-left font-semibold text-black dark:text-white">Role</th>
                <th className="px-6 py-3 text-left font-semibold text-black dark:text-white">Joined</th>
                <th className="px-6 py-3 text-left font-semibold text-black dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900">
                  <td className="px-6 py-3 text-black dark:text-white">{member.name}</td>
                  <td className="px-6 py-3 text-gray-700 dark:text-gray-300">{member.email}</td>
                  <td className="px-6 py-3">
                    <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-black dark:text-white rounded">
                      {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-600 dark:text-gray-400">{member.joined}</td>
                  <td className="px-6 py-3 space-x-2">
                    <button className="text-xs px-2 py-1 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900">
                      Edit
                    </button>
                    <button className="text-xs px-2 py-1 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 text-red-600 dark:text-red-400">
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={close} title="Invite Team Member">
        <div className="space-y-4">
          <Input
            type="email"
            placeholder="Enter email address"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-black dark:text-white">Role</label>
            <select className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-900 text-black dark:text-white">
              <option>Editor</option>
              <option>Viewer</option>
              <option>Admin</option>
            </select>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleInvite} variant="primary" className="flex-1">
              Send Invite
            </Button>
            <Button onClick={close} variant="ghost" className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
