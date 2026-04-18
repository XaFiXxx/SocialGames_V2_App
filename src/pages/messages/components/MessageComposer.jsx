import { Image as ImageIcon, Send, Sparkles, X } from "lucide-react";

export default function MessageComposer({
  content,
  setContent,
  image,
  fileInputRef,
  isSending,
  onRemoveImage,
  onSubmit,
  onImageChange,
}) {
  return (
    <form
      onSubmit={(e) => {
        onSubmit(e);

        const textarea = e.target.querySelector("textarea");
        if (textarea) {
          textarea.style.height = "auto";
        }
      }}
      className="shrink-0 border-t border-[var(--border-color)] bg-[var(--bg-card)]/95 px-4 py-4 backdrop-blur"
    >
      {image && (
        <div className="mb-3 flex items-center justify-between rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)] px-4 py-3 text-sm text-[var(--text-main)] shadow-sm">
          <div className="flex min-w-0 items-center gap-2">
            <Sparkles size={15} className="text-[var(--primary)]" />
            <span className="truncate">
              Image sélectionnée : {image.name}
            </span>
          </div>

          <button
            type="button"
            onClick={onRemoveImage}
            className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-[var(--text-secondary)] transition hover:bg-[var(--bg-card)]"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="flex items-end gap-3">
        <label className="inline-flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-main)] shadow-sm transition hover:border-[var(--primary)]/30 hover:bg-[var(--bg-card)]">
          <ImageIcon size={18} />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onImageChange}
          />
        </label>

        <div className="flex-1 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-main)] shadow-sm transition focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[var(--primary)]/10">
          <textarea
            rows={1}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();

                if (!isSending && (content.trim() || image)) {
                  onSubmit(e);
                }
              }
            }}
            placeholder="Écris ton message..."
            className="max-h-32 min-h-12 w-full resize-none overflow-hidden bg-transparent px-4 py-3 text-sm text-[var(--text-main)] outline-none placeholder:text-[var(--text-secondary)]"
          />
        </div>

        <button
          type="submit"
          disabled={isSending || (!content.trim() && !image)}
          className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary)] text-white shadow-sm transition hover:scale-[1.02] hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
        >
          <Send size={18} />
        </button>
      </div>
    </form>
  );
}