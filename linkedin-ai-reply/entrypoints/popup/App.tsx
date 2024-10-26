import "./App.css";

function App() {
  return (
    <div className="container mx-auto px-4 py-10">
      {/* Logo and Title Section */}
      <div className="flex flex-col items-center bg-gray-50 p-6 rounded-lg shadow-lg space-y-4">
        <img
          src="/wxt.svg"
          alt="Assistant Logo"
          className="h-12 w-12 rounded-full bg-gray-800 shadow-lg"
        />
        <h1 className="text-2xl font-extrabold text-gray-900">
          LinkedIn Reply Assistant
        </h1>
      </div>

      {/* Welcome Message Section */}
      <div className="text-center mt-8 max-w-lg mx-auto">
        <p className="text-lg font-semibold text-gray-700">
          Simplify Your LinkedIn Conversations
        </p>
        <p className="mt-2 text-sm text-gray-600 leading-loose">
          Our tool helps you create tailored responses for LinkedIn messages effortlessly.
          Enter a prompt, and let us assist you in composing a thoughtful reply.
        </p>
      </div>
    </div>
  );
}

export default App;
