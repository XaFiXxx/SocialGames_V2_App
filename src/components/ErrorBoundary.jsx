import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Erreur capturée par ErrorBoundary :", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <section className="flex min-h-screen items-center justify-center bg-[var(--bg-main)] px-4 py-10 text-[var(--text-main)]">
          <div className="w-full max-w-xl rounded-[32px] border border-white/10 bg-[var(--bg-card)] p-8 text-center shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-300">
              Oups
            </p>

            <h1 className="mt-3 text-3xl font-black">
              Une erreur est survenue
            </h1>

            <p className="mt-3 text-sm text-[var(--text-secondary)]">
              L’interface a rencontré un problème inattendu. Tu peux recharger
              la page pour réessayer.
            </p>

            {this.state.error?.message ? (
              <p className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-red-300">
                {this.state.error.message}
              </p>
            ) : null}

            <button
              type="button"
              onClick={this.handleReload}
              className="mt-6 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-[var(--primary)] to-cyan-400 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.01]"
            >
              Recharger la page
            </button>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}