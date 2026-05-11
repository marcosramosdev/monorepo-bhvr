import { createFileRoute, Link } from "@tanstack/react-router";
import { ListTodo } from "lucide-react";

import { Features } from "@/components/landing/features";
import { Footer } from "@/components/landing/footer";
import { GetStarted } from "@/components/landing/get-started";
import { Hero } from "@/components/landing/hero";
import { LiveDemo } from "@/components/landing/live-demo";
import { StackGrid } from "@/components/landing/stack-grid";
import { Structure } from "@/components/landing/structure";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen">
      <div className="fixed right-4 top-4 z-50">
        <Button asChild size="sm" variant="secondary" className="shadow-sm">
          <Link to="/todos">
            <ListTodo className="size-4" />
            Todo app
          </Link>
        </Button>
      </div>
      <Hero />
      <StackGrid />
      <Features />
      <Structure />
      <LiveDemo />
      <GetStarted />
      <Footer />
    </main>
  );
}

export default Index;
