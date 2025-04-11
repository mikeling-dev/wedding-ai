import FormCard from "@/components/create-wedding-plan/formCard";

export default function CreateWeddingPlan() {
  return (
    <div className="w-full flex flex-col items-center gap-4 p-6 md:p-12 text-center">
      <h1 className="w-fit text-2xl font-bold">Create your wedding plan</h1>
      <p>
        Tell us about your wedding and let our AI assistant help you plan your
        special day.
      </p>
      <FormCard />
    </div>
  );
}
