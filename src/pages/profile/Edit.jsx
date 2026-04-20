import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  User,
  Mail,
  CalendarDays,
  MapPin,
  FileText,
  Bell,
  Save,
  ChevronLeft,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();

  const [form, setForm] = useState({
    username: "",
    name: "",
    surname: "",
    email: "",
    birthday: "",
    biography: "",
    location: "",
    newsletter: false,
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;

    setForm({
      username: user.username || "",
      name: user.name || "",
      surname: user.surname || "",
      email: user.email || "",
      birthday: user.birthday ? user.birthday.split("T")[0] : "",
      biography: user.biography || "",
      location: user.location || "",
      newsletter: Boolean(user.newsletter),
    });
  }, [user]);

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

    if (form.biography.length > 500) {
      newErrors.biography = "La biographie ne peut pas dépasser 500 caractères.";
    }

    if (form.location.length > 100) {
      newErrors.location = "La localisation ne peut pas dépasser 100 caractères.";
    }

    return newErrors;
  };

  const normalizeLaravelErrors = (laravelErrors = {}) => {
    const formatted = {};

    Object.entries(laravelErrors).forEach(([key, value]) => {
      formatted[key] = Array.isArray(value) ? value[0] : value;
    });

    return formatted;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);
    setServerError("");

    if (Object.keys(validationErrors).length > 0) return;

    try {
      setIsSubmitting(true);

      const payload = {
        username: form.username.trim(),
        name: form.name.trim(),
        surname: form.surname.trim(),
        email: form.email.trim(),
        birthday: form.birthday,
        biography: form.biography.trim() || null,
        location: form.location.trim() || null,
        newsletter: form.newsletter,
      };

      await api.put("/api/user/profile", payload);

      await refreshUser();

      navigate("/profile", { replace: true });
    } catch (error) {
      console.error("Erreur update profile :", error);

      if (error.response?.status === 422) {
        const formattedErrors = normalizeLaravelErrors(
          error.response.data.errors || {}
        );

        setErrors(formattedErrors);
        setServerError(
          error.response.data.message || "Certaines données sont invalides."
        );
      } else if (error.response?.status === 401) {
        setServerError("Tu dois être connecté pour modifier ton profil.");
      } else {
        setServerError("Une erreur est survenue pendant la mise à jour.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (fieldName) =>
    `w-full rounded-2xl border px-4 py-3 text-sm text-[var(--text-main)] outline-none transition bg-white/5 backdrop-blur-sm placeholder:text-[var(--text-secondary)] ${
      errors[fieldName]
        ? "border-red-500 focus:border-red-500"
        : "border-white/10 focus:border-cyan-400"
    }`;

  const labelRequired = "after:ml-1 after:text-red-400 after:content-['*']";

  return (
    <section className="relative overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      <div className="absolute left-[8%] top-[4%] h-52 w-52 rounded-full bg-fuchsia-500/10 blur-3xl" />
      <div className="absolute bottom-[8%] right-[6%] h-60 w-60 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(124,58,237,0.14),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(6,182,212,0.10),_transparent_26%),radial-gradient(circle_at_bottom,_rgba(99,102,241,0.08),_transparent_35%)]" />

      <div className="relative mx-auto max-w-5xl space-y-6">
        <div className="overflow-hidden rounded-[36px] border border-white/10 bg-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl">
          <div className="h-32 bg-gradient-to-r from-[var(--primary)] via-indigo-500 to-cyan-400 sm:h-40" />

          <div className="px-6 pb-6 pt-6 sm:px-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-cyan-300">
                  <User size={14} />
                  Édition du profil
                </div>

                <h1 className="mt-4 text-3xl font-black tracking-tight text-[var(--text-main)] sm:text-4xl">
                  Modifier le profil
                </h1>

                <p className="mt-2 max-w-2xl text-sm text-[var(--text-secondary)]">
                  Mets à jour tes informations personnelles, ton identité sur la
                  plateforme et les détails visibles sur ton profil SquadBase.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-[var(--text-main)] backdrop-blur-sm transition hover:bg-white/10"
              >
                <ChevronLeft size={16} />
                Retour au profil
              </button>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:p-8"
        >
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-6">
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-[var(--text-secondary)]">
                    <User size={18} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-[var(--text-main)]">
                      Identité
                    </h2>
                    <p className="text-sm text-[var(--text-secondary)]">
                      Les informations principales de ton compte.
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
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
                      className={inputClass("username")}
                      placeholder="Ton pseudo public"
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
                        className={inputClass("name")}
                        placeholder="Ton prénom"
                      />
                      {errors.name && (
                        <p className="mt-2 text-sm text-red-400">
                          {errors.name}
                        </p>
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
                        className={inputClass("surname")}
                        placeholder="Ton nom"
                      />
                      {errors.surname && (
                        <p className="mt-2 text-sm text-red-400">
                          {errors.surname}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-[var(--text-secondary)]">
                    <Mail size={18} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-[var(--text-main)]">
                      Coordonnées
                    </h2>
                    <p className="text-sm text-[var(--text-secondary)]">
                      Email, date de naissance et localisation.
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
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
                      className={inputClass("email")}
                      placeholder="exemple@email.com"
                    />
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="birthday"
                        className={`mb-2 block text-sm font-medium text-[var(--text-main)] ${labelRequired}`}
                      >
                        Date de naissance
                      </label>
                      <div className="relative">
                        <CalendarDays
                          size={16}
                          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
                        />
                        <input
                          id="birthday"
                          name="birthday"
                          type="date"
                          value={form.birthday}
                          onChange={handleChange}
                          className={`${inputClass("birthday")} pl-11`}
                        />
                      </div>
                      {errors.birthday && (
                        <p className="mt-2 text-sm text-red-400">
                          {errors.birthday}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="location"
                        className="mb-2 block text-sm font-medium text-[var(--text-main)]"
                      >
                        Localisation
                      </label>
                      <div className="relative">
                        <MapPin
                          size={16}
                          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
                        />
                        <input
                          id="location"
                          name="location"
                          type="text"
                          value={form.location}
                          onChange={handleChange}
                          className={`${inputClass("location")} pl-11`}
                          placeholder="Ex: Bruxelles, Belgique"
                        />
                      </div>
                      {errors.location && (
                        <p className="mt-2 text-sm text-red-400">
                          {errors.location}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-[var(--text-secondary)]">
                    <FileText size={18} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-[var(--text-main)]">
                      Présentation
                    </h2>
                    <p className="text-sm text-[var(--text-secondary)]">
                      Décris ton univers gaming et ton profil.
                    </p>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="biography"
                    className="mb-2 block text-sm font-medium text-[var(--text-main)]"
                  >
                    Biographie
                  </label>
                  <textarea
                    id="biography"
                    name="biography"
                    rows={6}
                    value={form.biography}
                    onChange={handleChange}
                    className={inputClass("biography")}
                    placeholder="Parle un peu de toi, de tes jeux préférés, de ton style de jeu..."
                  />
                  <div className="mt-2 flex items-center justify-between">
                    {errors.biography ? (
                      <p className="text-sm text-red-400">
                        {errors.biography}
                      </p>
                    ) : (
                      <span />
                    )}
                    <p className="text-xs text-[var(--text-secondary)]">
                      {form.biography.length}/500
                    </p>
                  </div>
                </div>
              </div>

              {serverError && (
                <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {serverError}
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => navigate("/profile")}
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-[var(--text-main)] backdrop-blur-sm transition hover:bg-white/10"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-cyan-400 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Save size={16} />
                  {isSubmitting
                    ? "Enregistrement..."
                    : "Enregistrer les modifications"}
                </button>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-[var(--text-secondary)]">
                    <Bell size={18} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-[var(--text-main)]">
                      Préférences
                    </h2>
                    <p className="text-sm text-[var(--text-secondary)]">
                      Gère tes communications et infos annexes.
                    </p>
                  </div>
                </div>

                <label className="flex cursor-pointer items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10">
                  <input
                    type="checkbox"
                    name="newsletter"
                    checked={form.newsletter}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4 rounded border-white/10 bg-white/5"
                  />
                  <div>
                    <p className="text-sm font-medium text-[var(--text-main)]">
                      Newsletter SquadBase
                    </p>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">
                      Reçois les nouveautés, actus et mises à jour de la
                      plateforme.
                    </p>
                  </div>
                </label>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl">
                <h2 className="text-lg font-semibold text-[var(--text-main)]">
                  Aperçu rapide
                </h2>

                <div className="mt-5 space-y-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)]">
                      Pseudo
                    </p>
                    <p className="mt-2 text-sm font-medium text-[var(--text-main)]">
                      @{form.username || "username"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)]">
                      Nom affiché
                    </p>
                    <p className="mt-2 text-sm font-medium text-[var(--text-main)]">
                      {[form.name, form.surname].filter(Boolean).join(" ") ||
                        "Non renseigné"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)]">
                      Localisation
                    </p>
                    <p className="mt-2 text-sm font-medium text-[var(--text-main)]">
                      {form.location || "Non renseignée"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)]">
                      Newsletter
                    </p>
                    <p className="mt-2 text-sm font-medium text-[var(--text-main)]">
                      {form.newsletter ? "Activée" : "Désactivée"}
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </form>
      </div>
    </section>
  );
}