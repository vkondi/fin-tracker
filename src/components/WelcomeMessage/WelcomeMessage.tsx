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

const WelcomeMessage = () => {
  const { name } = useRootContext();
  const greeting = getTimeBasedGreeting();
  const greetingMessage = name
    ? `Hello ${name}, Good ${greeting}!`
    : `Good ${greeting}!`;

  return (
    <div className="p-2 text-xl font-bold text-center mb-4">
      {greetingMessage}
      <p className="text-sm text-gray-600 font-light">
        Welcome to your Finance Tracker
      </p>
    </div>
  );
};

export default WelcomeMessage;
