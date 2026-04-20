import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  Mail,
  ShieldCheck,
  Sparkles,
  Gamepad2,
  TriangleAlert,
  User,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

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

export default function VerifyEmailPage() {
  const { refreshUser } = useAuth();

  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [feedback, setFeedback] = useState({
    type: "",
    message: "",
  });

  useEffect(() => {
    refreshUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;

    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldown]);

  const handleResendEmail = async () => {
    if (isResending || cooldown > 0) return;

    try {
      setIsResending(true);
      setFeedback({ type: "", message: "" });

      const response = await api.post("/api/email/verification-notification");

      setFeedback({
        type: "success",
        message:
          response.data?.message ||
          "Email de vérification renvoyé avec succès.",
      });

      setCooldown(30);
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error.response?.data?.message ||
          "Impossible de renvoyer l’email pour le moment.",
      });
    } finally {
      setIsResending(false);
    }
  };

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
                <p className="text-sm font-semibold tracking-wide">SquadBase</p>
                <p className="text-xs text-white/50">
                  Le réseau social des gamers
                </p>
              </div>
            </div>

            <div className="mt-12 max-w-2xl">
              <p className="mb-4 inline-flex rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-amber-300">
                Vérification recommandée
              </p>

              <h1 className="text-5xl font-black leading-tight tracking-tight xl:text-6xl">
                Confirme ton
                <span className="bg-gradient-to-r from-white via-cyan-300 to-violet-400 bg-clip-text text-transparent">
                  {" "}
                  adresse email
                </span>
                .
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-white/65">
                Ton compte est bien créé et tu es connecté. Pour débloquer
                toutes les fonctionnalités sociales de SquadBase, pense à
                confirmer ton adresse email via le message que nous venons de
                t’envoyer.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <FeaturePill icon={Mail}>Email envoyé</FeaturePill>
              <FeaturePill icon={ShieldCheck}>Compte sécurisé</FeaturePill>
              <FeaturePill icon={Sparkles}>Accès progressif</FeaturePill>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <GlassCard
              title="Compte déjà actif"
              text="Tu peux déjà parcourir la plateforme, découvrir l’interface et personnaliser ton expérience."
            />
            <GlassCard
              title="Fonctionnalités limitées"
              text="Certaines interactions sociales restent bloquées tant que ton email n’a pas été confirmé."
            />
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-5 backdrop-blur-md xl:col-span-2">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/40">
                    Statut
                  </p>
                  <p className="mt-2 text-xl font-bold">En attente</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/40">
                    Email
                  </p>
                  <p className="mt-2 text-xl font-bold">À confirmer</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/40">
                    Accès
                  </p>
                  <p className="mt-2 text-xl font-bold">Limité</p>
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
                <span className="text-sm font-semibold">SquadBase</span>
              </div>

              <h1 className="mt-6 text-4xl font-black tracking-tight">
                Vérifie ton email
              </h1>
              <p className="mt-2 text-sm leading-6 text-white/60">
                Ton compte est créé, mais certaines fonctionnalités restent
                limitées tant que ton email n’est pas confirmé.
              </p>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-400 to-cyan-400 text-white shadow-lg shadow-amber-500/20">
                <Mail size={36} />
              </div>

              <div className="text-center">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-300">
                  Presque terminé
                </p>

                <h2 className="mt-3 text-3xl font-bold tracking-tight">
                  Confirme ton adresse email
                </h2>

                <p className="mt-3 text-sm leading-7 text-white/60">
                  Nous t’avons envoyé un email de vérification. Clique sur le
                  lien reçu pour activer complètement ton compte et débloquer
                  toutes les fonctionnalités sociales de la plateforme.
                </p>
              </div>

              <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-200">
                <div className="flex items-start gap-3">
                  <TriangleAlert size={18} className="mt-0.5 shrink-0" />
                  <p>
                    Tant que ton email n’est pas vérifié, certaines actions
                    comme publier, commenter, aimer du contenu, envoyer des
                    messages ou rejoindre certaines fonctionnalités sociales
                    peuvent être limitées.
                  </p>
                </div>
              </div>

              {feedback.message && (
                <div
                  className={`mt-4 rounded-2xl px-4 py-3 text-sm ${
                    feedback.type === "success"
                      ? "border border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                      : "border border-red-400/20 bg-red-400/10 text-red-200"
                  }`}
                >
                  {feedback.message}
                </div>
              )}

              <div className="mt-8 space-y-3">
                <button
                  type="button"
                  onClick={handleResendEmail}
                  disabled={isResending || cooldown > 0}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/85 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <RefreshCw
                    size={16}
                    className={isResending ? "animate-spin" : ""}
                  />
                  {isResending
                    ? "Renvoi en cours..."
                    : cooldown > 0
                    ? `Renvoyer l’email (${cooldown}s)`
                    : "Renvoyer l’email de confirmation"}
                </button>

                <Link
                  to="/feed"
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[var(--primary)] to-cyan-400 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.01]"
                >
                  Aller au feed
                </Link>

                <Link
                  to="/profile"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/85 transition hover:bg-white/10"
                >
                  <User size={16} />
                  Aller sur mon profil
                </Link>
              </div>

              <p className="mt-6 text-center text-xs leading-6 text-white/40">
                Tu pourras vérifier ton email maintenant ou plus tard, mais la
                confirmation est nécessaire pour profiter pleinement de
                l’expérience SquadBase.
              </p>
            </div>

            <p className="mt-6 text-center text-xs text-white/35">
              SquadBase — crée ton profil, trouve ta communauté, partage ton
              univers gaming.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}