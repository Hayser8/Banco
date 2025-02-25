"use client";

export default function UploadStatus({ status }) {
  return (
    <div className="bg-card p-4 rounded-lg shadow-md border border-borderColor mt-4 text-center">
      <p className="text-textSecondary">{status}</p>
    </div>
  );
}
