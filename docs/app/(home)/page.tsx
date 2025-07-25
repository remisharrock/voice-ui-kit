import { Sandbox } from "@/components/Sandbox";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col justify-center text-center">
      <h1 className="mb-4 text-2xl font-bold">Hello World 2</h1>
      <Sandbox componentName="Button" props={{ variant: "default" }}>
        Click me!
      </Sandbox>
      <Sandbox componentName="Button" props={{ variant: "secondary" }}>
        Click me!
      </Sandbox>
      <Sandbox componentName="Button" props={{ variant: "destructive" }}>
        Click me!
      </Sandbox>
    </main>
  );
}
