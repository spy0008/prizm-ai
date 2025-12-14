import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.png"
import CodeCard from "@/components/homeComponents/codeCard";
import { requireUnAuth } from "@/module/auth/utils/auth-utils";

const features = [
  {
    title: "PR summaries that save time",
    desc: "Instantly understand what changed, risk level, and review focus areas.",
  },
  {
    title: "Line-by-line review comments",
    desc: "Actionable suggestions for bugs, edge cases, and maintainability.",
  },
  {
    title: "Works where you already review",
    desc: "Feedback lands directly in pull requests, not in another dashboard.",
  },
  {
    title: "Team-friendly, low-noise",
    desc: "Prioritizes high-signal issues and avoids bikeshedding style nits.",
  },
  {
    title: "Security & quality checks",
    desc: "Flags risky patterns and suggests safer alternatives.",
  },
  {
    title: "Fast setup",
    desc: "Connect, open a PR, get review—fits your existing GitHub workflow.",
  },
];

const faqs = [
  {
    q: "Does Prizmai replace human code review?",
    a: "No. It reduces review load and catches issues early, while humans focus on architecture and product decisions.",
  },
  {
    q: "Where will the feedback appear?",
    a: "In your pull request as comments/suggestions so it stays in the normal review flow.",
  },
  {
    q: "How do we set it up?",
    a: "Typically as a GitHub-native integration (like an Action or App) that runs on PR events.",
  },
  {
    q: "Is it suitable for businesses?",
    a: "Yes—designed for teams who need faster review cycles and consistent quality across repos.",
  },
];

function Container({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-6xl px-6">{children}</div>;
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700">
      {children}
    </span>
  );
}


export default async function Home() {
  await requireUnAuth()
  return (
    <main className="min-h-screen bg-white text-zinc-900">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-200/70 bg-white/80 backdrop-blur">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <Link href="#" className="flex items-center gap-1">
              <Image width={26} height={26} src={logo} alt="logo" />
              <span className="text-lg font-bold tracking-tight"><span className="text-blue-500 font-extrabold text-xl">PR</span><span className="underline">izm</span></span>
            </Link>

            <nav className="hidden items-center gap-6 text-sm text-zinc-700 md:flex">
              <Link className="hover:text-zinc-900" href="#features">Features</Link>
              <Link className="hover:text-zinc-900" href="#how">How it works</Link>
              <Link className="hover:text-zinc-900" href="#faq">FAQ</Link>
            </nav>

            <div className="flex items-center gap-2">
              <Button className="cursor-pointer">
                <Link href={"/login"}>
                Get started
                </Link>
                </Button>
            </div>
          </div>
        </Container>
      </header>

      {/* Hero */}
      <section className="border-b border-zinc-200">
        <Container>
          <div className="grid items-center gap-10 py-14 md:grid-cols-2 md:py-20">
            {/* Left */}
            <div>
              <div className="mb-4 flex flex-wrap gap-2">
                <Pill>AI PR code reviewer</Pill>
                <Pill>GitHub-native workflow</Pill>
                <Pill>Built for teams</Pill>
              </div>

              <h1 className="text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">
                Ship faster with PR reviews that don&apos;t bottleneck your team.
              </h1>

              <p className="mt-4 text-base leading-relaxed text-zinc-700 md:text-lg">
                Prizmai summarizes changes, flags risky code, and leaves actionable review comments so developers stay in flow
                and businesses ship with confidence.
              </p>

              <div className="mt-6 flex flex-wrap gap-3" id="get-started">
                <Button className="cursor-pointer" >Get started</Button>
                <Button className="cursor-pointer" variant="secondary">
                  <Link href={"#features"}>
                  See features
                  </Link>
                </Button>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4 text-xs text-zinc-600">
                <div className="rounded-xl border border-zinc-200 bg-white p-3">
                  <div className="text-sm font-bold text-zinc-900">Minutes</div>
                  Review turnaround
                </div>
                <div className="rounded-xl border border-zinc-200 bg-white p-3">
                  <div className="text-sm font-bold text-zinc-900">Less noise</div>
                  Higher signal comments
                </div>
                <div className="rounded-xl border border-zinc-200 bg-white p-3">
                  <div className="text-sm font-bold text-zinc-900">No context switch</div>
                  PR-native feedback
                </div>
              </div>
            </div>

            {/* Right */}
            <div id="sample" className="md:pl-8">
              <CodeCard />
              <p className="mt-3 text-xs text-zinc-500">
                Demo content only. Replace with real screenshots once the bot is live.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Features */}
      <section id="features" className="border-b border-zinc-200">
        <Container>
          <div className="py-14 md:py-16">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                Reviews that are clear, specific, and merge-oriented.
              </h2>
              <p className="mt-3 text-zinc-700">
                Designed for developers and businesses that want predictable quality without slowing delivery.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl hover:shadow-2xl border border-zinc-200 bg-white p-5 shadow-sm"
                >
                  <div className="text-sm font-semibold">{f.title}</div>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-700">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section id="how" className="border-b border-zinc-200">
        <Container>
          <div className="py-14 md:py-16">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">How it works</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Connect your repo",
                  desc: "Install Prizmai for your org/repo and choose when it should review.",
                },
                {
                  step: "02",
                  title: "Open a PR",
                  desc: "Prizmai analyzes the diff and adds a summary + prioritized feedback.",
                },
                {
                  step: "03",
                  title: "Merge with confidence",
                  desc: "Apply suggestions, add tests, and keep humans focused on bigger decisions.",
                },
              ].map((s) => (
                <div
                  key={s.step}
                  className="rounded-2xl hover:shadow-2xl border border-zinc-200 bg-white p-5 shadow-sm"
                >
                  <div className="text-xs font-semibold text-zinc-500">{s.step}</div>
                  <div className="mt-2 text-sm font-semibold">{s.title}</div>
                  <p className="mt-2 text-sm text-zinc-700">{s.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 hover:shadow-2xl rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
              <div className="text-sm font-semibold">Tip</div>
              <p className="mt-2 text-sm text-zinc-700">
                If you plan to publish on GitHub Marketplace later, you&apos;ll likely need basics like a clear description and a
                privacy policy/support link good to plan early.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-b border-zinc-200">
        <Container>
          <div className="py-14 md:py-16">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">FAQ</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {faqs.map((f) => (
                <div
                  key={f.q}
                  className="rounded-2xl hover:shadow-2xl border border-zinc-200 bg-white p-5 shadow-sm"
                >
                  <div className="text-sm font-semibold">{f.q}</div>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-700">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Final CTA */}
      <section className="py-14 md:py-20">
        <Container>
          <div className="rounded-3xl hover:shadow-2xl border border-zinc-200 bg-zinc-50 p-8 md:p-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <h3 className="text-xl font-bold tracking-tight md:text-2xl">
                  Turn PR reviews into a speed advantage.
                </h3>
                <p className="mt-2 text-sm text-zinc-700">
                  Start with one repo. Expand when the team trusts the signal.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button className="cursor-pointer">Get started</Button>
              </div>
            </div>
          </div>

          <footer className="mt-10 flex flex-col gap-3 border-t border-zinc-200 pt-6 text-xs text-zinc-600 md:flex-row md:items-center md:justify-between">
            <div>© {new Date().getFullYear()} Prizmai. All rights reserved.</div>
            <div className="flex gap-4">
              <Link className="hover:text-zinc-900" href="/privacy">Privacy</Link>
              <Link className="hover:text-zinc-900" href="/terms">Terms</Link>
              <Link className="hover:text-zinc-900" href="/security">Security</Link>
            </div>
          </footer>
        </Container>
      </section>
    </main>
  );
}

