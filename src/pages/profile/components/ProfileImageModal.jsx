import { X, Upload } from "lucide-react";

export default function ProfileImageModal({
  modal,
  closeModal,
  avatarSrc,
  coverSrc,
  initials,
  handleImageUpload,
}) {
  if (!modal.isOpen) return null;

  return (
    <div
      onClick={closeModal}
      className="fixed inset-0 z-50 bg-[#02040b]/95 backdrop-blur-md"
    >
      <button
        type="button"
        onClick={closeModal}
        className="absolute right-4 top-4 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white backdrop-blur transition hover:bg-white/10"
        aria-label="Fermer"
      >
        <X size={22} />
      </button>

      <div className="flex h-full w-full items-center justify-center px-4 py-6 sm:px-8">
        <div className="relative flex h-full w-full items-center justify-center">
          {modal.type === "avatar" ? (
            avatarSrc ? (
              <img
                onClick={(e) => e.stopPropagation()}
                src={avatarSrc}
                alt="Avatar preview"
                className="max-h-[82vh] max-w-[82vw] rounded-[32px] object-contain shadow-2xl"
              />
            ) : (
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex h-72 w-72 items-center justify-center rounded-[32px] border border-white/10 bg-white/5 text-6xl font-black text-[var(--text-main)] shadow-2xl backdrop-blur-xl"
              >
                {initials}
              </div>
            )
          ) : coverSrc ? (
            <img
              onClick={(e) => e.stopPropagation()}
              src={coverSrc}
              alt="Cover preview"
              className="max-h-[82vh] max-w-[96vw] rounded-[32px] object-contain shadow-2xl"
            />
          ) : (
            <div
              onClick={(e) => e.stopPropagation()}
              className="h-[40vh] w-[96vw] max-w-6xl rounded-[32px] bg-gradient-to-r from-[var(--primary)] via-indigo-500 to-cyan-400 shadow-2xl"
            />
          )}

          <div className="pointer-events-auto absolute bottom-2 left-1/2 -translate-x-1/2 sm:bottom-4">
            <label
              onClick={(e) => e.stopPropagation()}
              className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-cyan-400 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.01]"
            >
              <Upload size={18} />
              Changer l'image
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}