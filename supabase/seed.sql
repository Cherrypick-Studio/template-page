-- ============================================================
-- CherryPick Template Marketplace - Seed Data
-- Run AFTER migration.sql
-- ============================================================

-- ============================================================
-- CATEGORIES
-- ============================================================

insert into public.categories (name, slug, icon_url, is_coming_soon, sort_order) values
  ('UI Kit',    'ui-kit',    '/assets/ic-figma.svg',         false, 1),
  ('Framer',    'framer',    '/assets/ic-framer.svg',         false, 2),
  ('Code',      'code',      '/assets/ic-code.svg',           false, 3),
  ('Bundling',  'bundling',  '/assets/ic-library.svg',        false, 4),
  ('E-book',    'ebook',     '/assets/ic-ebook.svg',          false, 5),
  ('Webflow',   'webflow',   '/assets/ic-webflow-color.svg',  true,  6);

-- ============================================================
-- TEMPLATES
-- ============================================================

with cat as (
  select id, slug from public.categories
)
insert into public.templates (
  title, slug, description, price, category_id,
  is_featured, is_new, status, file_type, file_size, product_type, rating, sales_count
)
select
  title, slug, description, price,
  (select id from cat where slug = cat_slug),
  is_featured, is_new, status::public.template_status,
  file_type, file_size, product_type, rating, sales_count
from (values
  (
    'Zenith - Web3 Wallet Website',
    'zenith-web3-wallet',
    'Zenith is a modern, clean, and professional Web3 wallet website template designed for cryptocurrency and blockchain projects. It features a sleek user interface with intuitive navigation, responsive design, and pixel-perfect components. Perfect for launching your next DeFi, NFT, or blockchain-based product.',
    29.00, 'ui-kit', true, true, 'published', 'Figma (.fig)', '45 MB', 'Responsive', 4.9, 19
  ),
  (
    'Blockwave - DeFi Platform',
    'blockwave-defi-platform',
    'Blockwave is a comprehensive DeFi platform UI kit with dashboards, trading interfaces, and portfolio management screens. Includes 80+ components and 20+ page templates ready for your next blockchain project.',
    39.00, 'ui-kit', true, true, 'published', 'Figma (.fig)', '82 MB', 'Responsive', 4.8, 12
  ),
  (
    'Paynexa - Payment Dashboard',
    'paynexa-payment-dashboard',
    'Paynexa is a sleek payment and finance dashboard UI kit featuring transaction histories, analytics charts, card management, and user settings. Built for fintech startups and payment platforms.',
    24.00, 'ui-kit', false, true, 'published', 'Figma (.fig)', '38 MB', 'Responsive', 4.7, 8
  ),
  (
    'Timber - SaaS Landing Page',
    'timber-saas-landing',
    'Timber is a conversion-optimized SaaS landing page template with feature sections, pricing tables, testimonials, and CTAs. Designed for software products and digital services.',
    19.00, 'ui-kit', true, true, 'published', 'Figma (.fig)', '28 MB', 'Responsive', 4.9, 31
  ),
  (
    'Spoty - Music Streaming App',
    'spoty-music-streaming',
    'Spoty is a modern music streaming app UI kit with player controls, playlist management, artist profiles, and discovery feeds. Includes both mobile and desktop layouts.',
    34.00, 'ui-kit', false, true, 'published', 'Figma (.fig)', '56 MB', 'Mobile & Desktop', 4.6, 7
  ),
  (
    'Cherrypick Desk - Admin Dashboard',
    'cherrypick-desk-admin',
    'A comprehensive admin dashboard UI kit with data tables, charts, user management, and settings panels. Includes dark and light themes with full component coverage.',
    49.00, 'ui-kit', true, false, 'published', 'Figma (.fig)', '120 MB', 'Responsive', 5.0, 43
  ),
  (
    'Framer Starter Kit Pro',
    'framer-starter-kit-pro',
    'A powerful Framer template bundle with 10 fully interactive website sections, smooth animations, and CMS integration. Clone-ready and fully customizable without coding.',
    29.00, 'framer', false, true, 'published', 'Framer', '15 MB', 'Responsive', 4.8, 5
  ),
  (
    'React Component Library',
    'react-component-library',
    'A production-ready React component library with 60+ components built with TypeScript and Tailwind CSS. Includes buttons, forms, modals, tables, navigation, and much more.',
    59.00, 'code', true, true, 'published', 'React + TypeScript', '8 MB', 'Web App', 4.9, 15
  ),
  (
    'Design System Bundle',
    'design-system-bundle',
    'The ultimate design system bundle including Figma UI kit, Framer template, and React components - all in one package. Save 60% compared to buying separately.',
    89.00, 'bundling', true, true, 'published', 'Figma + Framer + React', '200 MB', 'Multi-platform', 5.0, 22
  ),
  (
    'UI Design Fundamentals E-book',
    'ui-design-fundamentals-ebook',
    'A comprehensive 180-page guide to UI design fundamentals covering color theory, typography, spacing, component design, and design systems. Perfect for designers and developers.',
    14.00, 'ebook', false, true, 'published', 'PDF', '18 MB', 'Digital Download', 4.7, 38
  ),
  (
    'Nexus - SaaS Dashboard (WIP)',
    'nexus-saas-dashboard',
    'Nexus is a next-generation SaaS dashboard being built with advanced analytics, AI integrations, and real-time collaboration features. Coming soon.',
    0.00, 'ui-kit', false, false, 'wip', 'Figma (.fig)', null, 'Responsive', 0, 0
  ),
  (
    'Aurora - NFT Marketplace (WIP)',
    'aurora-nft-marketplace',
    'Aurora is a stunning NFT marketplace template with gallery browsing, bidding interfaces, creator profiles, and wallet integration. Coming soon.',
    0.00, 'ui-kit', false, false, 'wip', 'Figma (.fig)', null, 'Responsive', 0, 0
  )
) as t(title, slug, description, price, cat_slug, is_featured, is_new, status, file_type, file_size, product_type, rating, sales_count);

-- ============================================================
-- TEMPLATE IMAGES
-- Using existing public assets as placeholders
-- ============================================================

insert into public.template_images (template_id, image_url, alt_text, sort_order, is_primary)
select
  t.id,
  img.image_url,
  img.alt_text,
  img.sort_order,
  img.is_primary
from public.templates t
cross join lateral (
  values
    ('/assets/ic-zenith.svg',    t.title || ' - Main Preview',        0, true),
    ('/assets/ic-blockwave.svg', t.title || ' - Features Overview',   1, false),
    ('/assets/ic-paynexa.svg',   t.title || ' - Mobile Preview',      2, false),
    ('/assets/ic-timber.svg',    t.title || ' - Components',          3, false)
) as img(image_url, alt_text, sort_order, is_primary)
where t.status != 'wip';

-- ============================================================
-- REVIEWS
-- ============================================================

insert into public.reviews (author_name, author_role, author_avatar, rating, content)
values
  (
    'Alex Johnson',
    'Frontend Developer',
    'https://i.pravatar.cc/150?img=1',
    5,
    'The quality of these templates is outstanding. The Figma files are incredibly well-organized with proper auto-layout and component variants. Saved me weeks of design work!'
  ),
  (
    'Sarah Chen',
    'Product Designer',
    'https://i.pravatar.cc/150?img=5',
    5,
    'I''ve purchased from many template marketplaces, but CherryPick is on a different level. The attention to detail and design consistency across all components is impressive.'
  ),
  (
    'Marcus Williams',
    'Full Stack Developer',
    'https://i.pravatar.cc/150?img=3',
    5,
    'The React component library is exactly what I needed. TypeScript types are thorough, documentation is clear, and the components are genuinely production-ready.'
  ),
  (
    'Priya Patel',
    'UX Designer',
    'https://i.pravatar.cc/150?img=9',
    4,
    'Beautiful templates with great flexibility. The design system is well thought out. Would love to see more mobile-first templates in future releases.'
  ),
  (
    'James Rivera',
    'Startup Founder',
    'https://i.pravatar.cc/150?img=7',
    5,
    'We used the Zenith template for our DeFi product launch and received tons of compliments on the design. Worth every penny and the updates are a great bonus.'
  ),
  (
    'Emma Thompson',
    'Freelance Designer',
    'https://i.pravatar.cc/150?img=10',
    5,
    'As a freelancer, CherryPick has become my secret weapon. The commercial license means I can use these for client projects and the quality always impresses them.'
  ),
  (
    'David Kim',
    'UI Developer',
    'https://i.pravatar.cc/150?img=12',
    4,
    'Excellent work on the Framer templates. The animations are smooth and the CMS integration works great. Setup was straightforward even for someone new to Framer.'
  ),
  (
    'Olivia Brown',
    'Design Lead',
    'https://i.pravatar.cc/150?img=16',
    5,
    'The design system bundle is exceptional value. Having consistent Figma, Framer and code components that all match is a game changer for our team''s workflow.'
  );

-- ============================================================
-- FAQS
-- ============================================================

insert into public.faqs (question, answer, sort_order) values
  (
    'What formats are the templates available in?',
    'Our templates are available in multiple formats including Figma UI Kits, Framer templates, and coded versions (HTML/CSS, React, Next.js, Tailwind CSS). Each template listing clearly specifies which formats are included.',
    1
  ),
  (
    'Can I use the templates for commercial projects?',
    'Yes! All our templates come with a commercial license that allows you to use them in personal and commercial projects. You can build client websites, SaaS products, mobile apps, and more.',
    2
  ),
  (
    'Do I get free updates after purchasing?',
    'Absolutely. Once you purchase a template, you receive all future updates for free. We regularly improve our templates with new components, bug fixes, and design enhancements.',
    3
  ),
  (
    'How do I customize the templates?',
    'Our templates are built with clean, well-organized structures. Figma files use proper auto-layout and component variants. Code templates use Tailwind CSS and can be easily customized to match your brand.',
    4
  ),
  (
    'Is there a refund policy?',
    'We offer a 14-day refund policy. If you are not satisfied with your purchase, contact our support team within 14 days and we will process your refund promptly.',
    5
  ),
  (
    'How do I download my purchased templates?',
    'After completing your purchase, you will receive an email with download links. You can also access all your purchases from your account dashboard at any time.',
    6
  );
