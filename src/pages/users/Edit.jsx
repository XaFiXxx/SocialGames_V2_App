import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
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
    `w-full rounded-2xl border bg-[var(--bg-main)] px-4 py-3 text-sm text-[var(--text-main)] outline-none transition ${
      errors[fieldName]
        ? "border-red-500 focus:border-red-500"
        : "border-[var(--border-color)] focus:border-[var(--primary)]"
    }`;

  const labelRequired = "after:ml-1 after:text-red-400 after:content-['*']";

  return (
    <section className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-8 shadow-sm">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-main)]">
            Modifier le profil
          </h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Mets à jour tes informations personnelles sur SquadBase.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              className={inputClass("email")}
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-400">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="birthday"
              className={`mb-2 block text-sm font-medium text-[var(--text-main)] ${labelRequired}`}
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

          <div>
            <label
              htmlFor="location"
              className="mb-2 block text-sm font-medium text-[var(--text-main)]"
            >
              Localisation
            </label>
            <input
              id="location"
              name="location"
              type="text"
              value={form.location}
              onChange={handleChange}
              className={inputClass("location")}
              placeholder="Ex: Bruxelles, Belgique"
            />
            {errors.location && (
              <p className="mt-2 text-sm text-red-400">{errors.location}</p>
            )}
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
              rows={5}
              value={form.biography}
              onChange={handleChange}
              className={inputClass("biography")}
              placeholder="Parle un peu de toi, de tes jeux préférés, de ton style de jeu..."
            />
            <div className="mt-2 flex items-center justify-between">
              {errors.biography ? (
                <p className="text-sm text-red-400">{errors.biography}</p>
              ) : (
                <span />
              )}
              <p className="text-xs text-[var(--text-secondary)]">
                {form.biography.length}/500
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-[var(--bg-main)] p-4">
            <label className="flex items-start gap-3 text-sm text-[var(--text-main)]">
              <input
                type="checkbox"
                name="newsletter"
                checked={form.newsletter}
                onChange={handleChange}
                className="mt-1 h-4 w-4 rounded border-[var(--border-color)] bg-[var(--bg-main)]"
              />
              <span>
                Je souhaite recevoir la newsletter et les actualités de
                SquadBase.
              </span>
            </label>
          </div>

          {serverError && (
            <p className="text-sm text-red-400">{serverError}</p>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="inline-flex items-center justify-center rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)] px-5 py-3 text-sm font-medium text-[var(--text-main)] transition hover:opacity-90"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-2xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}