import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Calendar, Clock, Share2, BookOpen } from 'lucide-react';

interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image_url: string;
  slug: string;
  created_at: string;
  tags: string[];
}

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!slug) return;
      
      try {
        const { data } = await supabase
          .from('blogs_2025_12_11_13_27')
          .select('*')
          .eq('slug', slug)
          .eq('is_published', true)
          .single();

        setBlog(data);
      } catch (error) {
        console.error('Error fetching blog:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog?.title,
          text: blog?.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!blog) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/blogs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  // Calculate reading time (average 200 words per minute)
  const wordCount = blog.content.split(' ').length;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-accent-light/30 py-4">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-primary">Home</Link>
            <span className="text-muted-foreground">/</span>
            <Link to="/blogs" className="text-muted-foreground hover:text-primary">Blog</Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">{blog.title}</span>
          </nav>
        </div>
      </div>

      {/* Article Content */}
      <article className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Button variant="outline" size="sm" className="mb-8" asChild>
              <Link to="/blogs">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>

            {/* Article Header */}
            <header className="mb-12">
              <div className="flex flex-wrap gap-2 mb-4">
                {blog.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <h1 className="text-3xl lg:text-5xl font-bold mb-6 leading-tight">
                {blog.title}
              </h1>
              
              <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                {blog.excerpt}
              </p>
              
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(blog.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{readingTime} min read</span>
                  </div>
                </div>
                
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </header>

            {/* Featured Image */}
            <div className="mb-12">
              <img 
                src={blog.image_url} 
                alt={blog.title}
                className="w-full h-auto rounded-2xl shadow-medium"
              />
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              <div 
                className="text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: blog.content.replace(/\n/g, '<br />').replace(/## /g, '<h2 class="text-2xl font-bold mt-8 mb-4 text-foreground">').replace(/### /g, '<h3 class="text-xl font-semibold mt-6 mb-3 text-foreground">') 
                }}
              />
            </div>

            {/* Article Footer */}
            <footer className="mt-16 pt-8 border-t">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-muted-foreground">Tags:</span>
                  {blog.tags?.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Article
                </Button>
              </div>
            </footer>
          </div>
        </div>
      </article>

      {/* Related Articles CTA */}
      <section className="py-20 bg-accent-light/30">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold">
              Explore More Nutrition Insights
            </h2>
            <p className="text-xl text-muted-foreground">
              Discover more evidence-based nutrition tips, research findings, 
              and practical advice to optimize your health and performance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/blogs">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Read More Articles
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contact">
                  Get Personalized Advice
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BlogDetail;