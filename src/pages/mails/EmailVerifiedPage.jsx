import { Link } from "react-router";
import { CheckCircle2, Gamepad2, ShieldCheck, Sparkles, Mail } from "lucide-react";

function FeaturePill({ icon: Icon, children }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/80 backdrop-blur-sm">
      <Icon size={14} />
      <span>{children}</span>
    </div>
  );
}

function GlassCard({ title, text }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm leading-6 text-white/65">{text}</p>
    </div>
  );
}

export default function EmailVerifiedPage() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#060816] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(124,58,237,0.22),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(6,182,212,0.16),_transparent_26%),radial-gradient(circle_at_bottom,_rgba(99,102,241,0.12),_transparent_35%)]" />

      <div className="absolute left-[10%] top-[18%] h-40 w-40 rounded-full bg-fuchsia-500/10 blur-3xl" />
      <div className="absolute bottom-[10%] right-[8%] h-52 w-52 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--primary)]/10 blur-3xl" />

      <div className="relative mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[1.15fr_0.85fr]">
        <div className="hidden px-10 py-12 lg:flex lg:flex-col lg:justify-between xl:px-14">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary)] to-cyan-400 text-white shadow-lg">
                <Gamepad2 size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold tracking-wide">SocialGames</p>
                <p className="text-xs text-white/50">
                  Le réseau social des gamers
                </p>
              </div>
            </div>

            <div className="mt-12 max-w-2xl">
              <p className="mb-4 inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-emerald-300">
                Vérification réussie
              </p>

              <h1 className="text-5xl font-black leading-tight tracking-tight xl:text-6xl">
                Ton compte est
                <span className="bg-gradient-to-r from-white via-cyan-300 to-violet-400 bg-clip-text text-transparent">
                  {" "}
                  prêt à jouer
                </span>
                .
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-white/65">
                Ton adresse email a bien été confirmée. Tu peux maintenant
                accéder à toutes les fonctionnalités sociales de la plateforme
                et profiter pleinement de ton univers gaming.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <FeaturePill icon={ShieldCheck}>Compte sécurisé</FeaturePill>
              <FeaturePill icon={Mail}>Email confirmé</FeaturePill>
              <FeaturePill icon={Sparkles}>Fonctionnalités débloquées</FeaturePill>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <GlassCard
              title="Interactions débloquées"
              text="Publie, commente, like du contenu et profite des échanges avec la communauté."
            />
            <GlassCard
              title="Profil validé"
              text="Ton compte est désormais confirmé et prêt à être utilisé normalement sur SocialGames."
            />
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-5 backdrop-blur-md xl:col-span-2">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/40">
                    Statut
                  </p>
                  <p className="mt-2 text-xl font-bold">Vérifié</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/40">
                    Accès
                  </p>
                  <p className="mt-2 text-xl font-bold">Complet</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/40">
                    Univers
                  </p>
                  <p className="mt-2 text-xl font-bold">Gaming</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-6 py-10 sm:px-8 lg:px-10">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary)] to-cyan-400 text-white">
                  <Gamepad2 size={18} />
                </div>
                <span className="text-sm font-semibold">SocialGames</span>
              </div>

              <h1 className="mt-6 text-4xl font-black tracking-tight">
                Email vérifié
              </h1>
              <p className="mt-2 text-sm leading-6 text-white/60">
                Ton compte est maintenant prêt à accéder à toutes les fonctionnalités.
              </p>
            </div>

            <div className="rounded-[32px] border border-emerald-400/20 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-400 to-cyan-400 text-white shadow-lg shadow-emerald-500/20">
                <CheckCircle2 size={38} />
              </div>

              <div className="text-center">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-300">
                  Confirmation réussie
                </p>

                <h2 className="mt-3 text-3xl font-bold tracking-tight">
                  Adresse email vérifiée
                </h2>

                <p className="mt-3 text-sm leading-7 text-white/60">
                  Ton adresse email a bien été confirmée. Tu peux maintenant
                  publier, commenter, aimer des posts, rejoindre des groupes et
                  utiliser pleinement SocialGames.
                </p>
              </div>

              <div className="mt-8 space-y-3">
                <Link
                  to="/feed"
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[var(--primary)] to-cyan-400 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.01]"
                >
                  Accéder au feed
                </Link>

                <Link
                  to="/profile"
                  className="inline-flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/85 transition hover:bg-white/10"
                >
                  Voir mon profil
                </Link>
              </div>

              <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
                Vérification terminée. Toutes les fonctionnalités liées à ton
                compte peuvent maintenant être activées côté plateforme.
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-white/35">
              SocialGames — connecte les joueurs, les jeux et les communautés.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}