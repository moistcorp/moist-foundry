import Link from 'next/link'

const posts = [
  {
    slug: 'why-low-moq-matters',
    title: 'Why low MOQ is a game changer for small brands',
    excerpt: 'Most manufacturers require 500+ pieces minimum. Here is why we built Moist Foundry around 50 — and what it means for brands just getting started.',
    date: 'June 12, 2025',
    category: 'Industry',
    readTime: '4 min read',
  },
  {
    slug: 'screen-print-vs-dtg',
    title: 'Screen print vs DTG — which is right for your order?',
    excerpt: 'Two of the most common print techniques, but they serve very different needs. We break down when to use each one based on artwork, quantity, and budget.',
    date: 'May 28, 2025',
    category: 'Production',
    readTime: '5 min read',
  },
  {
    slug: 'how-to-brief-a-manufacturer',
    title: 'How to brief a manufacturer — what to send and what to expect',
    excerpt: 'A good brief saves weeks of back and forth. Here is exactly what information you need to provide to get an accurate quote and smooth production run.',
    date: 'May 14, 2025',
    category: 'Guide',
    readTime: '6 min read',
  },
  {
    slug: 'fabric-weight-guide',
    title: 'Fabric weight explained — GSM and what it means for your merch',
    excerpt: 'GSM stands for grams per square metre. It is the single most important spec when choosing a blank. Here is how to pick the right weight for your product.',
    date: 'April 30, 2025',
    category: 'Guide',
    readTime: '4 min read',
  },
  {
    slug: 'cafe-merch-guide',
    title: 'The cafe merch playbook — what sells and what sits on the shelf',
    excerpt: 'After working with dozens of cafe brands, we have a clear picture of what custom merch actually moves. Totes, yes. Lanyards, no. Here is the full breakdown.',
    date: 'April 15, 2025',
    category: 'Industry',
    readTime: '5 min read',
  },
  {
    slug: 'pantone-to-fabric',
    title: 'From Pantone to fabric — how color matching actually works',
    excerpt: 'Your brand color looks perfect on screen. Getting it right on fabric is a different challenge. Here is how we handle color accuracy at Moist Foundry.',
    date: 'April 2, 2025',
    category: 'Production',
    readTime: '3 min read',
  },
]

const categoryColors: Record<string, string> = {
  'Industry': 'bg-[#4A6670]/10 text-[#4A6670]',
  'Production': 'bg-[#C1623D]/10 text-[#C1623D]',
  'Guide': 'bg-[#2B2B2B]/10 text-[#2B2B2B]',
}

export default function Journal() {
  return (
    <>
      {/* Header */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16">
        <p className="text-sm text-[#C1623D] font-medium mb-4 tracking-wide uppercase">Journal</p>
        <h1 className="text-5xl font-bold text-[#2B2B2B] max-w-xl leading-tight mb-6">
          Notes on making things
        </h1>
        <p className="text-[#2B2B2B]/60 max-w-lg text-lg">
          Guides, production insights, and industry notes from the Moist Foundry team.
        </p>
      </section>

      {/* Featured post */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="bg-[#2B2B2B] rounded-sm p-10 md:p-14 flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1">
            <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-medium mb-4 bg-[#C1623D]/20 text-[#C1623D]`}>
              {posts[0].category}
            </span>
            <h2 className="text-3xl font-bold text-[#F5F1EA] mb-4 leading-tight">
              {posts[0].title}
            </h2>
            <p className="text-[#F5F1EA]/60 leading-relaxed mb-6 max-w-lg">
              {posts[0].excerpt}
            </p>
            <div className="flex items-center gap-4 text-xs text-[#F5F1EA]/40">
              <span>{posts[0].date}</span>
              <span>{posts[0].readTime}</span>
            </div>
          </div>
          <Link
            href={`/journal/${posts[0].slug}`}
            className="shrink-0 bg-[#C1623D] text-white px-6 py-3 rounded-sm text-sm font-medium hover:opacity-90 transition self-end md:self-center"
          >
            Read article
          </Link>
        </div>
      </section>

      {/* Post grid */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.slice(1).map(post => (
            <Link
              key={post.slug}
              href={`/journal/${post.slug}`}
              className="group border border-[#2B2B2B]/10 rounded-sm p-6 flex flex-col gap-4 hover:border-[#C1623D]/30 transition-colors bg-white"
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${categoryColors[post.category]}`}>
                  {post.category}
                </span>
                <span className="text-xs text-[#2B2B2B]/40">{post.readTime}</span>
              </div>
              <h3 className="text-base font-semibold text-[#2B2B2B] leading-snug group-hover:text-[#C1623D] transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-[#2B2B2B]/60 leading-relaxed flex-1">
                {post.excerpt}
              </p>
              <p className="text-xs text-[#2B2B2B]/40">{post.date}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#2B2B2B]/10 py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-1">Ready to place an order?</h2>
            <p className="text-[#2B2B2B]/60 text-sm">50 pieces minimum. Quote within 24 hours.</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/configure"
              className="bg-[#2B2B2B] text-[#F5F1EA] px-6 py-3 rounded-sm text-sm font-medium hover:bg-[#C1623D] transition-colors"
            >
              Start designing
            </Link>
            <Link
              href="/contact"
              className="border border-[#2B2B2B] text-[#2B2B2B] px-6 py-3 rounded-sm text-sm font-medium hover:bg-[#2B2B2B] hover:text-[#F5F1EA] transition-colors"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}