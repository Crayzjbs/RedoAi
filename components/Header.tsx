import { Sparkles } from "lucide-react";

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              AI Logo Revision Tool
            </h1>
            <p className="text-sm text-gray-600">
              Minimalist design generation powered by CycleGAN & Pix2Pix
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
