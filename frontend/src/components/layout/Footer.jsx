import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-gray-150 dark:border-gray-800 mt-24">
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="text-h3 font-semibold text-gray-900 dark:text-gray-50 mb-1">concise</div>
          <p className="text-body text-gray-500 dark:text-gray-400">Links, distilled.</p>
        </div>
        <div className="flex gap-8 text-body text-gray-500 dark:text-gray-400">
          <Link to="/login" className="hover:text-gray-800 dark:hover:text-gray-200">Sign in</Link>
          <Link to="/register" className="hover:text-gray-800 dark:hover:text-gray-200">Get started</Link>
          <a href="#faq" className="hover:text-gray-800 dark:hover:text-gray-200">FAQ</a>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 pb-8 text-caption text-gray-400">
        © {new Date().getFullYear()} Concise. Built as a system-design portfolio project.
      </div>
    </footer>
  );
}
