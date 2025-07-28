import FileUploadGrid from "@/components/FileUploadGrid";
import RuleBuilder from "@/components/RuleBuilder";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black p-10">
      <h1 className="text-4xl font-bold mb-4 text-center text-indigo-600">🧪 Data Alchemist</h1>
      <p className="text-center text-gray-700 mb-8 max-w-2xl mx-auto">
        Upload data, define rules, and generate your allocation config.
      </p>

      <FileUploadGrid />
      <RuleBuilder />
    </main>
  );
}
