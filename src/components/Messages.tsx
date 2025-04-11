import React from 'react';

interface Message {
  id: string;
  message: string;
}

interface MessagesProps {
  messages: Message[];
  title?: string;
  emptyText?: string;
}

export default function Messages({
  messages,
  title = 'Your Secret Messages',
  emptyText = "You haven't written any secret messages yet.",
}: MessagesProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-5">
      <h1 className="text-xl font-bold mb-4 text-center">{title}</h1>

      {messages.length === 0 ? (
        <div className="text-center text-gray-600 bg-gray-100 p-4 rounded-md">
          {emptyText}
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="p-4 bg-blue-50 border border-blue-200 rounded-md shadow-sm"
            >
              <p className="text-gray-800 whitespace-pre-wrap">{msg.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
