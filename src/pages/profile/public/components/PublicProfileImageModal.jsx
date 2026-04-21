import { useEffect } from "react";
import { X } from "lucide-react";

export default function PublicProfileImageModal({
  modal,
  closeModal,
  avatarSrc,
  coverSrc,
  initials,
}) {
  useEffect(() => {
    if (!modal.isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [modal.isOpen, closeModal]);

  if (!modal.isOpen) return null;

  const handleBackdropMouseDown = (event) => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  };

  return (
    <div
      onMouseDown={handleBackdropMouseDown}
      className="fixed inset-0 z-[999] flex items-center justify-center bg-[#02040b]/95 backdrop-blur-md"
    >
      <button
        type="button"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          closeModal();
        }}
        className="absolute right-4 top-4 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white backdrop-blur transition hover:bg-white/10"
        aria-label="Fermer"
      >
        <X size={22} />
      </button>

      <div
        onMouseDown={(e) => e.stopPropagation()}
        className="relative flex items-center justify-center px-4 py-6 sm:px-8"
      >
        {modal.type === "avatar" ? (
          avatarSrc ? (
            <img
              src={avatarSrc}
              alt="Avatar preview"
              className="max-h-[82vh] max-w-[82vw] rounded-[32px] object-contain shadow-2xl"
            />
          ) : (
            <div className="flex h-72 w-72 items-center justify-center rounded-[32px] border border-white/10 bg-white/5 text-6xl font-black text-[var(--text-main)] shadow-2xl backdrop-blur-xl">
              {initials}
            </div>
          )
        ) : coverSrc ? (
          <img
            src={coverSrc}
            alt="Cover preview"
            className="max-h-[82vh] max-w-[96vw] rounded-[32px] object-contain shadow-2xl"
          />
        ) : (
          <div className="h-[40vh] w-[96vw] max-w-6xl rounded-[32px] bg-gradient-to-r from-[var(--primary)] via-indigo-500 to-cyan-400 shadow-2xl" />
        )}
      </div>
    </div>
  );
}