export default function Footer() {
  return (
    <footer className="border-t mt-20" style={{ borderColor: "var(--border)" }}>
      <div className="max-w-6xl mx-auto px-4 pt-10 pb-4 flex flex-col md:flex-row justify-between items-center gap-4 font-terminal text-lg text-[var(--text-dim)]">
        <p>© {new Date().getFullYear()} VoltLab Builds.</p>
        <div className="flex items-center gap-4">
          <span className="text-[var(--accent)]">DM us to order · Noida, IN</span>
          <a
            href="https://www.instagram.com/voltlab.builds/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="VoltLab Builds on Instagram"
            className="text-[var(--accent-2)] hover:opacity-80 hover:scale-110 transition-transform"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 pb-6 flex flex-wrap items-center justify-between gap-x-5 gap-y-2 font-data text-xs text-[var(--text-dim)]">
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <a href="/legal/terms-of-service" className="hover:text-[var(--accent)]">
            Terms of Service
          </a>
          <a href="/legal/privacy-policy" className="hover:text-[var(--accent)]">
            Privacy Policy
          </a>
        </div>
        <p>
          Made with ⚔️ by{" "}
          <a
            href="https://github.com/upadhyay516/Voltlab-Builds"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] hover:opacity-80"
          >
            Yash
          </a>
        </p>
      </div>
    </footer>
  );
}
