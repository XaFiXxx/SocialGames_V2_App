import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
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
    `w-full rounded-2xl border bg-[var(--bg-main)] px-4 py-3 text-sm text-[var(--text-main)] outline-none transition ${
      errors[fieldName]
        ? "border-red-500 focus:border-red-500"
        : "border-[var(--border-color)] focus:border-[var(--primary)]"
    }`;

  return (
    <section className="bg-[var(--bg-main)] text-[var(--text-main)]">
      <div className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-7xl lg:grid-cols-2">
        <div className="hidden border-r border-[var(--border-color)] bg-[var(--bg-secondary)] lg:flex lg:flex-col lg:justify-between lg:p-12">
          <div>
            <span className="inline-flex rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)]">
              SquadBase
            </span>

            <h1 className="mt-6 max-w-md text-4xl font-bold tracking-tight">
              Connecte-toi à ta base communautaire gaming.
            </h1>

            <p className="mt-4 max-w-lg text-sm leading-7 text-[var(--text-secondary)]">
              Retrouve ton profil, tes groupes, tes équipes et ton réseau de
              joueurs dans une plateforme pensée pour centraliser ton univers
              gaming.
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 shadow-sm">
              <p className="text-sm font-medium text-[var(--text-main)]">
                Pensé pour les joueurs
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                Une interface simple pour gérer tes groupes, découvrir des teams
                et interagir avec la communauté.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4">
                <p className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">
                  Groupes
                </p>
                <p className="mt-2 text-lg font-semibold">Communautés</p>
              </div>

              <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4">
                <p className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">
                  Teams
                </p>
                <p className="mt-2 text-lg font-semibold">Organisation</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <span className="inline-flex rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)]">
                SquadBase
              </span>
              <h1 className="mt-4 text-3xl font-bold tracking-tight">
                Connexion
              </h1>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Accède à ton espace joueur.
              </p>
            </div>

            <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-8 shadow-xl">
              <div className="mb-8">
                <h2 className="text-3xl font-semibold tracking-tight">
                  Heureux de te revoir
                </h2>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">
                  Entre tes identifiants pour continuer sur SquadBase.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-[var(--text-main)]"
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
                      className="block text-sm font-medium text-[var(--text-main)]"
                    >
                      Mot de passe
                    </label>

                    <Link
                      to="#"
                      className="text-sm text-[var(--primary)] transition hover:opacity-80"
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
                  <label className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                    <input
                      type="checkbox"
                      name="remember"
                      checked={form.remember}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-[var(--border-color)] bg-[var(--bg-main)]"
                    />
                    Se souvenir de moi
                  </label>
                </div>

                {serverError && (
                  <p className="text-sm text-red-400">{serverError}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Connexion en cours..." : "Se connecter"}
                </button>
              </form>

              <div className="mt-6 border-t border-[var(--border-color)] pt-6 text-center">
                <p className="text-sm text-[var(--text-secondary)]">
                  Pas encore de compte ?{" "}
                  <Link
                    to="/register"
                    className="font-medium text-[var(--primary)] transition hover:opacity-80"
                  >
                    Créer un compte
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}