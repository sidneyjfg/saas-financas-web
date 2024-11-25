import React, { useState } from "react";

export const TeamManagement = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [newMember, setNewMember] = useState({ name: "", email: "" });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setNewMember({ ...newMember, [id]: value });
  };

  const addMember = () => {
    if (newMember.name && newMember.email) {
      setTeamMembers([...teamMembers, newMember]);
      setNewMember({ name: "", email: "" });
    }
  };

  const removeMember = (index) => {
    const updatedMembers = teamMembers.filter((_, i) => i !== index);
    setTeamMembers(updatedMembers);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-500 via-indigo-500 to-blue-500 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-teal-600 mb-6 text-center">
          Team Management
        </h1>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Add New Team Member
          </h2>
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
            <input
              type="text"
              id="name"
              value={newMember.name}
              onChange={handleInputChange}
              placeholder="Member Name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="email"
              id="email"
              value={newMember.email}
              onChange={handleInputChange}
              placeholder="Member Email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              onClick={addMember}
              className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition duration-300"
            >
              Add Member
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Current Team Members
          </h2>
          {teamMembers.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {teamMembers.map((member, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center py-4"
                >
                  <div>
                    <p className="font-semibold text-gray-800">{member.name}</p>
                    <p className="text-gray-600">{member.email}</p>
                  </div>
                  <button
                    onClick={() => removeMember(index)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No team members added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};