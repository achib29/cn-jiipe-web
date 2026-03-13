// app/articles/[slug]/layout.tsx
// Standalone layout — overrides root layout, NO Navbar or Footer
import type { Metadata } from 'next';
import '../../../app/globals.css';

export const metadata: Metadata = {
  title: 'JIIPE Industrial Article',
};

export default function ArticleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      {children}
    </div>
  );
}
