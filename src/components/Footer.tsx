export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 text-sm text-zinc-500">
        <p>&copy; {new Date().getFullYear()} CherryPick. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="transition-colors hover:text-zinc-900">
            Privacy
          </a>
          <a href="#" className="transition-colors hover:text-zinc-900">
            Terms
          </a>
          <a href="#" className="transition-colors hover:text-zinc-900">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
