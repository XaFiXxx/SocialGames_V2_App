import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";

export default function RegisterPage() {
  const navigate = useNavigate();
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

      navigate("/login", { replace: true });
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
    `w-full rounded-2xl border bg-[var(--bg-main)] px-4 py-3 text-sm text-[var(--text-main)] outline-none transition ${
      errors[fieldName]
        ? "border-red-500 focus:border-red-500"
        : "border-[var(--border-color)] focus:border-[var(--primary)]"
    }`;

  const labelRequired = "after:ml-1 after:text-red-400 after:content-['*']";

  return (
    <section className="bg-[var(--bg-main)] text-[var(--text-main)]">
      <div className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-7xl lg:grid-cols-2">
        <div className="hidden border-r border-[var(--border-color)] bg-[var(--bg-secondary)] lg:flex lg:flex-col lg:justify-between lg:p-12">
          <div>
            <span className="inline-flex rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)]">
              SquadBase
            </span>

            <h1 className="mt-6 max-w-md text-4xl font-bold tracking-tight">
              Crée ton espace joueur et rejoins la communauté.
            </h1>

            <p className="mt-4 max-w-lg text-sm leading-7 text-[var(--text-secondary)]">
              Construis ton profil, découvre des groupes, rejoins des teams et
              connecte-toi avec d&apos;autres joueurs.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-xl">
            <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-8 shadow-xl">
              <div className="mb-8">
                <h2 className="text-3xl font-semibold tracking-tight">
                  Créer un compte
                </h2>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">
                  Complète les informations ci-dessous pour rejoindre SquadBase.
                </p>
                <p className="mt-3 text-xs text-[var(--text-secondary)]">
                  Les champs marqués d&apos;un <span className="text-red-400">*</span> sont obligatoires.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="username"
                    className={`mb-2 block text-sm font-medium text-[var(--text-main)] ${labelRequired}`}
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
                    <p className="mt-2 text-sm text-red-400">{errors.username}</p>
                  )}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className={`mb-2 block text-sm font-medium text-[var(--text-main)] ${labelRequired}`}
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
                      className={`mb-2 block text-sm font-medium text-[var(--text-main)] ${labelRequired}`}
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
                      <p className="mt-2 text-sm text-red-400">{errors.surname}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className={`mb-2 block text-sm font-medium text-[var(--text-main)] ${labelRequired}`}
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
                    className="mb-2 block text-sm font-medium text-[var(--text-main)] after:ml-1 after:text-red-400 after:content-['*']"
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
                    <p className="mt-2 text-sm text-red-400">{errors.birthday}</p>
                  )}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="password"
                      className={`mb-2 block text-sm font-medium text-[var(--text-main)] ${labelRequired}`}
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
                      <p className="mt-2 text-sm text-red-400">{errors.password}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="password_confirmation"
                      className={`mb-2 block text-sm font-medium text-[var(--text-main)] ${labelRequired}`}
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

                <div className="space-y-3">
                  <label className="flex items-start gap-3 text-sm text-[var(--text-secondary)]">
                    <input
                      type="checkbox"
                      name="accept_terms"
                      checked={form.accept_terms}
                      onChange={handleChange}
                      className="mt-1 h-4 w-4 rounded border-[var(--border-color)] bg-[var(--bg-main)]"
                    />
                    <span>
                      J&apos;accepte les conditions d&apos;utilisation et la politique de confidentialité
                      <span className="ml-1 text-red-400">*</span>
                    </span>
                  </label>

                  {errors.accept_terms && (
                    <p className="text-sm text-red-400">{errors.accept_terms}</p>
                  )}

                  <label className="flex items-start gap-3 text-sm text-[var(--text-secondary)]">
                    <input
                      type="checkbox"
                      name="newsletter"
                      checked={form.newsletter}
                      onChange={handleChange}
                      className="mt-1 h-4 w-4 rounded border-[var(--border-color)] bg-[var(--bg-main)]"
                    />
                    <span>
                      Je souhaite recevoir la newsletter et les actualités de SquadBase.
                    </span>
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
                  {isSubmitting ? "Création du compte..." : "Créer mon compte"}
                </button>
              </form>

              <div className="mt-6 border-t border-[var(--border-color)] pt-6 text-center">
                <p className="text-sm text-[var(--text-secondary)]">
                  Déjà un compte ?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-[var(--primary)] transition hover:opacity-80"
                  >
                    Se connecter
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