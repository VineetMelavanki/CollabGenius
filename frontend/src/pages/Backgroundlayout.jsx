export default function BackgroundLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-6">
      {children}
    </div>
  );
}
