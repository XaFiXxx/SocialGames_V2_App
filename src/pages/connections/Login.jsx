import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  ShieldCheck,
  Gamepad2,
  Users,
  Sparkles,
  LockKeyhole,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const IS_MAINTENANCE = true;
const ACCESS_CODE = "squadtest2026@@";

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

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [accessCode, setAccessCode] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(
    sessionStorage.getItem("site_access_granted") === "true"
  );

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUnlock = (e) => {
    e.preventDefault();

    if (accessCode.trim() === ACCESS_CODE) {
      sessionStorage.setItem("site_access_granted", "true");
      setIsUnlocked(true);
      setAccessCode("");
      setServerError("");
      return;
    }

    setServerError("Code d’accès invalide.");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setServerError("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.email.trim()) {
      newErrors.email = "L'adresse email est requise.";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "L'adresse email n'est pas valide.";
    }

    if (!form.password.trim()) {
      newErrors.password = "Le mot de passe est requis.";
    } else if (form.password.length < 8) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 8 caractères.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);
    setServerError("");

    if (Object.keys(validationErrors).length > 0) return;

    try {
      setIsSubmitting(true);

      await login({
        email: form.email,
        password: form.password,
        remember: form.remember,
      });

      navigate("/feed", { replace: true });
    } catch (error) {
      console.error(error);

      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
        setServerError(
          error.response.data.message || "Identifiants invalides."
        );
      } else {
        setServerError("Une erreur est survenue pendant la connexion.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (fieldName) =>
    `w-full rounded-2xl border bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none backdrop-blur-sm transition ${
      errors[fieldName]
        ? "border-red-500/70 focus:border-red-500"
        : "border-white/10 focus:border-[var(--primary)]"
    }`;

  if (IS_MAINTENANCE && !isUnlocked) {
    return (
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#060816] px-6 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(90,86,255,0.22),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(0,212,255,0.18),_transparent_30%)]" />
        <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--primary)]/10 blur-3xl" />

        <div className="relative w-full max-w-md rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-[var(--primary)] to-cyan-400 text-white shadow-lg">
            <LockKeyhole size={28} />
          </div>

          <h1 className="text-center text-3xl font-bold tracking-tight">
            Accès privé SquadBase
          </h1>

          <p className="mt-4 text-center text-sm leading-6 text-white/65">
            Le site est encore en phase de construction. Entre le code d’accès
            temporaire pour continuer.
          </p>

          <form onSubmit={handleUnlock} className="mt-8 space-y-4">
            <input
              type="password"
              value={accessCode}
              onChange={(e) => {
                setAccessCode(e.target.value);
                setServerError("");
              }}
              placeholder="Code d’accès"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-[var(--primary)]"
            />

            {serverError && (
              <p className="text-center text-sm text-red-400">{serverError}</p>
            )}

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[var(--primary)] to-cyan-400 px-4 py-3 text-sm font-semibold text-white transition hover:scale-[1.01]"
            >
              Entrer dans SquadBase
            </button>
          </form>
        </div>
      </section>
    );
  }

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
              <p className="mb-4 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-cyan-300">
                Plateforme communautaire gaming
              </p>

              <h1 className="text-5xl font-black leading-tight tracking-tight xl:text-6xl">
                Rassemble ton
                <span className="bg-gradient-to-r from-white via-cyan-300 to-violet-400 bg-clip-text text-transparent">
                  {" "}
                  univers gaming
                </span>{" "}
                au même endroit.
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-white/65">
                Retrouve ton profil joueur, partage tes posts, affiche tes jeux,
                retrouve ta communauté et construis ton identité gaming sur une
                plateforme pensée pour les joueurs.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <FeaturePill icon={Users}>Communautés & groupes</FeaturePill>
              <FeaturePill icon={Sparkles}>Profil gaming stylé</FeaturePill>
              <FeaturePill icon={ShieldCheck}>Accès sécurisé</FeaturePill>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <GlassCard
              title="Pensé pour les joueurs"
              text="Un espace central pour afficher tes jeux, tes plateformes préférées et tes interactions avec la communauté."
            />
            <GlassCard
              title="Social + gaming"
              text="Posts, profils, groupes, teams et identité visuelle forte dans une interface moderne et immersive."
            />
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-5 backdrop-blur-md xl:col-span-2">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/40">
                    Profils
                  </p>
                  <p className="mt-2 text-xl font-bold">Joueurs</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/40">
                    Réseau
                  </p>
                  <p className="mt-2 text-xl font-bold">Communautés</p>
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
                <span className="text-sm font-semibold">SquadBase</span>
              </div>

              <h1 className="mt-6 text-4xl font-black tracking-tight">
                Connexion
              </h1>
              <p className="mt-2 text-sm leading-6 text-white/60">
                Reconnecte-toi à ton espace joueur et retrouve ton univers.
              </p>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
              <div className="mb-8">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300">
                  Bon retour
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight">
                  Heureux de te revoir
                </h2>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  Entre tes identifiants pour accéder à SquadBase.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-white/85"
                  >
                    Adresse email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="exemple@email.com"
                    className={inputClass("email")}
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-400">{errors.email}</p>
                  )}
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-white/85"
                    >
                      Mot de passe
                    </label>

                    <Link
                      to="#"
                      className="text-sm text-cyan-300 transition hover:text-cyan-200"
                    >
                      Mot de passe oublié ?
                    </Link>
                  </div>

                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={inputClass("password")}
                  />
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-3 text-sm text-white/60">
                    <input
                      type="checkbox"
                      name="remember"
                      checked={form.remember}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-white/20 bg-transparent"
                    />
                    Se souvenir de moi
                  </label>
                </div>

                {serverError && (
                  <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {serverError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[var(--primary)] to-cyan-400 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Connexion en cours..." : "Se connecter"}
                </button>
              </form>

              <div className="mt-6 border-t border-white/10 pt-6 text-center">
                <p className="text-sm text-white/60">
                  Pas encore de compte ?{" "}
                  <Link
                    to="/register"
                    className="font-semibold text-cyan-300 transition hover:text-cyan-200"
                  >
                    Créer un compte
                  </Link>
                </p>
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-white/35">
              SquadBase — connecte les joueurs, les jeux et les communautés.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}