/** Filled in Task 14. */
export default function PlainView({ onClose }) {
  return (
    <main className="mx-auto max-w-content px-5 py-12">
      <button type="button" onClick={onClose} className="tap font-mono text-xs underline">
        BACK TO THE MENU
      </button>
      <h1 className="mt-6 font-display text-4xl uppercase text-bone">Kishan Jaiswal</h1>
    </main>
  )
}
