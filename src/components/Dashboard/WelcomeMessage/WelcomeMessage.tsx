import { useRootContext } from "@/context/RootContext";

function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();
  let timeOfDay: string;

  if (hour >= 5 && hour < 12) {
    timeOfDay = "Morning";
  } else if (hour >= 12 && hour < 17) {
    timeOfDay = "Afternoon";
  } else {
    timeOfDay = "Evening";
  }

  return timeOfDay;
}

function getUniqueGreeting(): string {
  const greetings = [
    "🚀 Ready to track your investments?",
    "💼 Time to manage your portfolio!",
    "📊 Let's analyze your finances!",
    "💰 Ready to grow your wealth?",
    "🎯 Focus on your financial goals!",
    "⚡ Power up your investment game!",
    "🌟 Your financial future awaits!",
    "🎪 Let's make finance fun!",
    "🔥 Hot deals, cool insights!",
    "🎨 Paint your financial masterpiece!"
  ];
  
  // Use current date to get a consistent but varied greeting
  const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  return greetings[dayOfYear % greetings.length];
}



const WelcomeMessage = () => {
  const { name, isMobile } = useRootContext();
  const greeting = getTimeBasedGreeting();
  const uniqueGreeting = getUniqueGreeting();
  
  const greetingMessage = name
    ? `Hello ${name}, Good ${greeting}!`
    : `Good ${greeting}!`;

  return (
    <div className={`relative overflow-hidden ${isMobile ? "mt-4" : "mt-8"} mb-6`}>
      {/* Main content */}
      <div className="relative bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm max-w-xl mx-auto">
        <div className="mb-3">
          <span className="text-3xl">👋</span>
        </div>
        <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">
          {greetingMessage}
        </h1>
        <p className="text-base text-gray-600 font-medium">
          {uniqueGreeting}
        </p>
      </div>
    </div>
  );
};

export default WelcomeMessage;
