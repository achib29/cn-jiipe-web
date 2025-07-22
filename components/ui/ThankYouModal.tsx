import { CheckCircle } from "lucide-react";

interface ThankYouModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ThankYouModal({ open, onClose }: ThankYouModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl px-8 py-8 max-w-sm w-full text-center relative">
        {/* Check icon */}
        <CheckCircle className="mx-auto text-green-500 mb-4" size={56} strokeWidth={1.5} />
        {/* Title */}
        <h2 className="text-2xl font-semibold mb-2">Thank You!</h2>
        {/* Message */}
        <p className="text-gray-700 mb-6">
          Your inquiry has been received.<br />
          Our team will contact you as soon as possible.
        </p>
        {/* Close button */}
        <button
          onClick={onClose}
          className="px-5 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 font-semibold transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}
