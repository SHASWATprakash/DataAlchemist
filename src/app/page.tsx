import FileUploadGrid from "@/components/FileUploadGrid";
import RuleBuilder from "@/components/RuleBuilder";
import PrioritizationTuner from "@/components/PrioritizationTuner";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black p-10 space-y-10">
      <h1 className="text-4xl font-bold text-center text-indigo-600">🧪 Data Alchemist</h1>
      <p className="text-center text-gray-700 max-w-2xl mx-auto">
        Upload raw data, configure rules, tune priorities, and export a clean allocation config.
      </p>

      <FileUploadGrid />
      <RuleBuilder />
      <PrioritizationTuner />
    </main>
  );
}
