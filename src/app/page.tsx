import { Input } from "@/components/ui/input";
import TodoHome from "@/modules/home";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center py-10 max-w-3xl m-auto">
      <h1 className="text-6xl font-bold pb-4">Todos</h1>
      <TodoHome />
    </main>
  );
}
