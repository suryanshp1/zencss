// Copy into a Vite React project and register @suryanshp1/zencss/vite in vite.config.ts.
import "virtual:zen.css";
export default function App() {
  return (
    <main className="bg-surface text-primary min-h-screen p-8">
      <section className="recipe-card measure-prose mx-auto">
        <span className="recipe-badge">A thoughtful beginning</span>
        <h1 className="font-display text-4xl">Hello, clarity.</h1>
        <p className="text-muted">Make room for your next idea.</p>
        <button className="recipe-button mt-6 hover:opacity-80">
          Get started
        </button>
      </section>
    </main>
  );
}
