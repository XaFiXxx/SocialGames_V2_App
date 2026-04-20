import { useState } from "react";
import { Link } from "react-router";
import {
  Gamepad2,
  Sparkles,
  ShieldCheck,
  Users,
  UserPlus,
  Trophy,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

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

export default function RegisterPage() {
  const { register } = useAuth();

  const [form, setForm] = useState({
    username: "",
    name: "",
    surname: "",
    email: "",
    birthday: "",
    password: "",
    password_confirmation: "",
    accept_terms: false,
    newsletter: false,
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    if (!form.username.trim()) {
      newErrors.username = "Le pseudo est requis.";
    } else if (form.username.trim().length < 3) {
      newErrors.username = "Le pseudo doit contenir au moins 3 caractères.";
    } else if (!/^[a-zA-Z0-9_-]+$/.test(form.username)) {
      newErrors.username =
        "Le pseudo ne peut contenir que des lettres, chiffres, tirets et underscores.";
    }

    if (!form.name.trim()) {
      newErrors.name = "Le prénom est requis.";
    }

    if (!form.surname.trim()) {
      newErrors.surname = "Le nom est requis.";
    }

    if (!form.email.trim()) {
      newErrors.email = "L'adresse email est requise.";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "L'adresse email n'est pas valide.";
    }

    if (!form.birthday) {
      newErrors.birthday = "La date de naissance est requise.";
    } else {
      const birthDate = new Date(form.birthday);
      const today = new Date();

      birthDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      if (birthDate >= today) {
        newErrors.birthday =
          "La date de naissance doit être antérieure à aujourd'hui.";
      }
    }

    if (!form.password.trim()) {
      newErrors.password = "Le mot de passe est requis.";
    } else if (form.password.length < 8) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 8 caractères.";
    }

    if (!form.password_confirmation.trim()) {
      newErrors.password_confirmation =
        "La confirmation du mot de passe est requise.";
    } else if (form.password !== form.password_confirmation) {
      newErrors.password_confirmation =
        "Les mots de passe ne correspondent pas.";
    }

    if (!form.accept_terms) {
      newErrors.accept_terms =
        "Tu dois accepter les conditions d'utilisation.";
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

    await register(form);

    window.location.href = "/verify-email";
  } catch (error) {
    console.error(error);

    if (error.response?.status === 422) {
      setErrors(error.response.data.errors || {});
      setServerError(
        error.response.data.message || "Certaines données sont invalides."
      );
    } else {
      setServerError("Une erreur est survenue pendant l'inscription.");
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

  const labelRequired = "after:ml-1 after:text-red-400 after:content-['*']";

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#060816] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(124,58,237,0.22),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(6,182,212,0.16),_transparent_26%),radial-gradient(circle_at_bottom,_rgba(99,102,241,0.12),_transparent_35%)]" />

      <div className="absolute left-[8%] top-[16%] h-40 w-40 rounded-full bg-fuchsia-500/10 blur-3xl" />
      <div className="absolute bottom-[8%] right-[10%] h-52 w-52 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute left-1/2 top-1/2 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--primary)]/10 blur-3xl" />

      <div className="relative mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[1.05fr_0.95fr]">
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
                Rejoins la communauté
              </p>

              <h1 className="text-5xl font-black leading-tight tracking-tight xl:text-6xl">
                Crée ton
                <span className="bg-gradient-to-r from-white via-cyan-300 to-violet-400 bg-clip-text text-transparent">
                  {" "}
                  identité gaming
                </span>
                .
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-white/65">
                Personnalise ton profil, affiche tes plateformes, partage tes
                jeux, découvre des joueurs comme toi et commence à construire ta
                place dans l’univers SquadBase.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <FeaturePill icon={Users}>Communauté de joueurs</FeaturePill>
              <FeaturePill icon={Sparkles}>Profil unique</FeaturePill>
              <FeaturePill icon={ShieldCheck}>Inscription sécurisée</FeaturePill>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <GlassCard
              title="Ton profil, ton univers"
              text="Renseigne ton identité gaming, tes préférences et commence à construire un profil qui te ressemble."
            />
            <GlassCard
              title="Découvre des joueurs"
              text="Rejoins des groupes, discute, partage tes posts et développe ton réseau autour des jeux que tu aimes."
            />
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-5 backdrop-blur-md xl:col-span-2">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/40">
                    Profil
                  </p>
                  <p className="mt-2 text-xl font-bold">Joueur</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/40">
                    Social
                  </p>
                  <p className="mt-2 text-xl font-bold">Réseau</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/40">
                    Gaming
                  </p>
                  <p className="mt-2 text-xl font-bold">Univers</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-6 py-10 sm:px-8 lg:px-10">
          <div className="w-full max-w-2xl">
            <div className="mb-8 lg:hidden">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary)] to-cyan-400 text-white">
                  <Gamepad2 size={18} />
                </div>
                <span className="text-sm font-semibold">SquadBase</span>
              </div>

              <h1 className="mt-6 text-4xl font-black tracking-tight">
                Créer un compte
              </h1>
              <p className="mt-2 text-sm leading-6 text-white/60">
                Rejoins la communauté et lance ton aventure sur SquadBase.
              </p>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
              <div className="mb-8">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-[var(--primary)] to-cyan-400 text-white shadow-lg">
                  <UserPlus size={24} />
                </div>

                <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300">
                  Nouvelle inscription
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight">
                  Crée ton compte SquadBase
                </h2>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  Complète les informations ci-dessous pour rejoindre la
                  plateforme.
                </p>
                <p className="mt-3 text-xs text-white/40">
                  Les champs marqués d’un{" "}
                  <span className="text-red-400">*</span> sont obligatoires.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="username"
                    className={`mb-2 block text-sm font-medium text-white/85 ${labelRequired}`}
                  >
                    Pseudo
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Ton pseudo"
                    className={inputClass("username")}
                  />
                  {errors.username && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.username}
                    </p>
                  )}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className={`mb-2 block text-sm font-medium text-white/85 ${labelRequired}`}
                    >
                      Prénom
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Ton prénom"
                      className={inputClass("name")}
                    />
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-400">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="surname"
                      className={`mb-2 block text-sm font-medium text-white/85 ${labelRequired}`}
                    >
                      Nom
                    </label>
                    <input
                      id="surname"
                      name="surname"
                      type="text"
                      value={form.surname}
                      onChange={handleChange}
                      placeholder="Ton nom"
                      className={inputClass("surname")}
                    />
                    {errors.surname && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.surname}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className={`mb-2 block text-sm font-medium text-white/85 ${labelRequired}`}
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
                  <label
                    htmlFor="birthday"
                    className={`mb-2 block text-sm font-medium text-white/85 ${labelRequired}`}
                  >
                    Date de naissance
                  </label>
                  <input
                    id="birthday"
                    name="birthday"
                    type="date"
                    value={form.birthday}
                    onChange={handleChange}
                    className={inputClass("birthday")}
                  />
                  {errors.birthday && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.birthday}
                    </p>
                  )}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="password"
                      className={`mb-2 block text-sm font-medium text-white/85 ${labelRequired}`}
                    >
                      Mot de passe
                    </label>
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

                  <div>
                    <label
                      htmlFor="password_confirmation"
                      className={`mb-2 block text-sm font-medium text-white/85 ${labelRequired}`}
                    >
                      Confirmation du mot de passe
                    </label>
                    <input
                      id="password_confirmation"
                      name="password_confirmation"
                      type="password"
                      value={form.password_confirmation}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={inputClass("password_confirmation")}
                    />
                    {errors.password_confirmation && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.password_confirmation}
                      </p>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium text-white/85">
                    <Trophy size={16} />
                    <span>Préférences & conditions</span>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-start gap-3 text-sm text-white/65">
                      <input
                        type="checkbox"
                        name="accept_terms"
                        checked={form.accept_terms}
                        onChange={handleChange}
                        className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent"
                      />
                      <span>
                        J’accepte les conditions d’utilisation et la politique
                        de confidentialité
                        <span className="ml-1 text-red-400">*</span>
                      </span>
                    </label>

                    {errors.accept_terms && (
                      <p className="text-sm text-red-400">
                        {errors.accept_terms}
                      </p>
                    )}

                    <label className="flex items-start gap-3 text-sm text-white/65">
                      <input
                        type="checkbox"
                        name="newsletter"
                        checked={form.newsletter}
                        onChange={handleChange}
                        className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent"
                      />
                      <span>
                        Je souhaite recevoir la newsletter et les actualités de
                        SquadBase.
                      </span>
                    </label>
                  </div>
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
                  {isSubmitting ? "Création du compte..." : "Créer mon compte"}
                </button>
              </form>

              <div className="mt-6 border-t border-white/10 pt-6 text-center">
                <p className="text-sm text-white/60">
                  Déjà un compte ?{" "}
                  <Link
                    to="/login"
                    className="font-semibold text-cyan-300 transition hover:text-cyan-200"
                  >
                    Se connecter
                  </Link>
                </p>
              </div>
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