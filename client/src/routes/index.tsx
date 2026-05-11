import { createFileRoute } from "@tanstack/react-router";

import { Features } from "@/components/landing/features";
import { Footer } from "@/components/landing/footer";
import { GetStarted } from "@/components/landing/get-started";
import { Hero } from "@/components/landing/hero";
import { LiveDemo } from "@/components/landing/live-demo";
import { StackGrid } from "@/components/landing/stack-grid";
import { Structure } from "@/components/landing/structure";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen">
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
