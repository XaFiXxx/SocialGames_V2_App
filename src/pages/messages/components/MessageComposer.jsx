import { Image as ImageIcon, Send, X } from "lucide-react";

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

        // reset textarea height après envoi
        const textarea = e.target.querySelector("textarea");
        if (textarea) {
          textarea.style.height = "auto";
        }
      }}
      className="shrink-0 border-t border-[var(--border-color)] bg-[var(--bg-card)] p-4"
    >
      {image && (
        <div className="mb-3 flex items-center justify-between rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)] px-4 py-3 text-sm text-[var(--text-main)]">
          <span className="truncate pr-3">
            Image sélectionnée : {image.name}
          </span>

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
        <label className="inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-main)] transition hover:opacity-90">
          <ImageIcon size={18} />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onImageChange}
          />
        </label>

        <textarea
          rows={1}
          value={content}
          onChange={(e) => {
            setContent(e.target.value);

            // auto resize
            e.target.style.height = "auto";
            e.target.style.height = e.target.scrollHeight + "px";
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
          className="max-h-32 min-h-12 flex-1 resize-none overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)] px-4 py-3 text-sm text-[var(--text-main)] outline-none transition placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)]"
        />

        <button
          type="submit"
          disabled={isSending || (!content.trim() && !image)}
          className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary)] text-white transition hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send size={18} />
        </button>
      </div>
    </form>
  );
}