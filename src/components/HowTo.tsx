import { ClipboardList, CheckSquare, Store, Lightbulb } from "lucide-react";

interface HowToCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const HowToCard = ({ title, description, icon }: HowToCardProps) => {
  return (
    <div className="p-6 bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-center w-12 h-12 mb-4 text-primary">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default function HowTo() {
  const steps = [
    {
      title: "Create Your Plan",
      description:
        "Share your preferences, background, budget, and wedding date to get started",
      icon: <ClipboardList size={24} />,
    },
    {
      title: "AI Analysis",
      description:
        "Our AI generates a personalized plan tailored to your unique needs",
      icon: <Lightbulb size={24} />,
    },
    {
      title: "Manage Tasks",
      description:
        "Stay on track with a comprehensive to-do list organized by categories",
      icon: <CheckSquare size={24} />,
    },
    {
      title: "Connect with Vendors",
      description: "Discover and book the perfect vendors for your special day",
      icon: <Store size={24} />,
    },
  ];

  return (
    <section className="py-16 px-6 md:px-12 bg-background">
      <div className=" mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How WeddingAI Works</h2>
          <p className="text-xl text-gray-600">
            Our AI-powered platform makes wedding planning simple, organized,
            and stress-free
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <HowToCard key={index} {...step} />
          ))}
        </div>
      </div>
    </section>
  );
}
