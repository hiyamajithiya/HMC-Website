'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, BookOpen, ImageIcon } from "lucide-react"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  category: string
  coverImage: string | null
  publishedAt: Date | null
  viewCount: number
}

interface BlogCategoryFilterProps {
  posts: BlogPost[]
}

const categoryLabels: Record<string, string> = {
  TAX_UPDATES: "Tax Updates",
  GST_UPDATES: "GST Updates",
  AUTOMATION_TIPS: "Automation Tips",
  COMPLIANCE: "Compliance",
  FFMC_RBI: "FFMC/RBI",
  GENERAL: "General",
}

const categoryValues: Record<string, string> = {
  "All": "All",
  "Tax Updates": "TAX_UPDATES",
  "GST Updates": "GST_UPDATES",
  "Automation Tips": "AUTOMATION_TIPS",
  "Compliance": "COMPLIANCE",
  "FFMC/RBI": "FFMC_RBI",
  "General": "GENERAL",
}

const categories = ["All", "Tax Updates", "GST Updates", "Automation Tips", "Compliance", "FFMC/RBI", "General"]

function estimateReadTime(excerpt: string): string {
  const wordsPerMinute = 200
  const wordCount = excerpt.split(/\s+/).length * 3
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  return `${Math.max(2, minutes)} min read`
}

export function BlogCategoryFilter({ posts }: BlogCategoryFilterProps) {
  const [activeCategory, setActiveCategory] = useState("All")

  const filteredPosts = activeCategory === "All"
    ? posts
    : posts.filter(post => post.category === categoryValues[activeCategory])

  return (
    <>
      {/* Categories */}
      <section className="section-padding bg-bg-secondary">
        <div className="container-custom">
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                className={`cursor-pointer px-4 py-2 transition-all ${
                  activeCategory === category
                    ? "bg-primary hover:bg-primary-light text-white"
                    : "hover:bg-primary/10 hover:border-primary"
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>

          {/* Show active filter count */}
          <div className="text-center text-sm text-text-muted">
            Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}
            {activeCategory !== "All" && ` in "${activeCategory}"`}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="section-padding">
        <div className="container-custom">
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {filteredPosts.map((post) => (
                <Link key={post.id} href={`/resources/blog/${post.slug}`}>
                  <Card className="card-hover flex flex-col h-full overflow-hidden">
                    {/* Cover Image */}
                    {post.coverImage ? (
                      <div className="relative w-full h-48 overflow-hidden">
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute top-3 left-3">
                          <Badge variant="secondary" className="text-xs bg-white/90 text-primary">
                            {categoryLabels[post.category] || post.category}
                          </Badge>
                        </div>
                      </div>
                    ) : (
                      <div className="relative w-full h-48 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-primary/30" />
                        <div className="absolute top-3 left-3">
                          <Badge variant="secondary" className="text-xs">
                            {categoryLabels[post.category] || post.category}
                          </Badge>
                        </div>
                      </div>
                    )}
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center text-xs text-text-muted">
                          <Calendar className="h-3 w-3 mr-1" />
                          {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }) : 'Recently'}
                        </div>
                        <div className="flex items-center text-xs text-text-muted">
                          <Clock className="h-3 w-3 mr-1" />
                          {estimateReadTime(post.excerpt)}
                        </div>
                      </div>
                      <CardTitle className="text-lg font-heading line-clamp-2">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col pt-0">
                      <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="mt-auto">
                        <div className="text-primary font-medium text-sm">
                          Read Article →
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="h-16 w-16 text-primary/30 mx-auto mb-4" />
              <h2 className="text-xl font-heading font-bold text-text-secondary mb-2">
                No Articles in {activeCategory}
              </h2>
              <p className="text-text-muted mb-4">
                There are no articles in this category yet.
              </p>
              <button
                onClick={() => setActiveCategory("All")}
                className="text-primary hover:underline font-medium"
              >
                View all articles
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
