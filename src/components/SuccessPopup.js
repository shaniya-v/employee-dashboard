import React from 'react';

export default function SuccessPopup({ email, onClose }) {
  const handleSend = async () => {
    try {
      const res = await fetch('https://shaniya.app.n8n.cloud/webhook/employee-added', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error('Webhook failed');
      alert(`✅ Email sent to ${email}`);
    } catch (err) {
      alert('❌ Failed to send email.');
    } finally {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white p-6 rounded-xl text-center">
        <h2 className="text-xl font-bold text-green-600">Employee Added!</h2>
        <p className="mb-4">Do you want to send a welcome email?</p>
        <button onClick={handleSend} className="bg-blue-600 text-white px-4 py-2 rounded">Send Email</button>
        <button onClick={onClose} className="ml-4 text-gray-500 underline">Close</button>
      </div>
    </div>
  );
}
