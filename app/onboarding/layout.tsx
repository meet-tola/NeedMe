export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <div className="pattern-dots pattern-gray-100 pattern-bg-white dark:pattern-gray-900 dark:pattern-bg-black pattern-size-4 pattern-opacity-100">
        {children}
      </div>
    </section>
  );
}
