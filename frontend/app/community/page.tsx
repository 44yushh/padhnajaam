'use client';

import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { ThumbsUp, MessageSquare } from 'lucide-react';
import { communityPosts } from '@/lib/data';

export default function CommunityPage() {
  return (
    <>
      <Navbar />

      <main className="flex-1 min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-muted to-background py-12 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
              Student Community
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect with fellow students, share resources, ask questions, and discuss academic topics.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            {/* Compose Box */}
            <div className="border border-border rounded-lg p-6 bg-card">
              <p className="text-muted-foreground mb-4">What&apos;s on your mind?</p>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Start a discussion, ask a question, or share a resource..."
                  className="flex-1 px-4 py-3 border border-border rounded-lg bg-muted text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50"
                />
                <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                  Post
                </Button>
              </div>
            </div>

            {/* Posts */}
            <div className="space-y-4">
              {communityPosts.map((post) => (
                <div key={post.id} className="border border-border rounded-lg p-6 hover:shadow-md transition-shadow bg-card">
                  <div className="flex gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-semibold text-sm flex-shrink-0">
                      {post.author.charAt(0)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="font-semibold text-foreground">{post.author}</h3>
                          <p className="text-xs text-muted-foreground">
                            {new Date(post.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded ${
                            post.type === 'question'
                              ? 'bg-yellow-100 text-yellow-700'
                              : post.type === 'discussion'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                        </span>
                      </div>

                      <h4 className="font-semibold text-foreground mb-2">{post.title}</h4>
                      <p className="text-sm text-muted-foreground mb-4">{post.content}</p>

                      {/* Actions */}
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-secondary transition-colors">
                          <ThumbsUp className="w-4 h-4" />
                          <span>{post.upvotes}</span>
                        </button>
                        <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-secondary transition-colors">
                          <MessageSquare className="w-4 h-4" />
                          <span>{post.replies}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
