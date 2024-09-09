import Head from 'next/head';
import { fetchPosts } from '../../lib/api';
import { useRouter } from 'next/router';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Import the default styling for Skeleton

const Post = ({ post }) => {
  const router = useRouter();
  const [showBackButton, setShowBackButton] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [loading, setLoading] = useState(true); // Track loading state
  const [skeletonVisible, setSkeletonVisible] = useState(true); // Control skeleton visibility

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop = window.pageYOffset;
      setShowBackButton(currentScrollTop < lastScrollTop || currentScrollTop < 100); // Show if scrolled up or at the top
      setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop); // For Mobile or negative scrolling
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollTop]);

  useEffect(() => {
    // Simulate loading state with a minimum display time for the skeleton
    if (post) {
      setTimeout(() => {
        setSkeletonVisible(false);
        setLoading(false);
      }, 1000); // Show skeleton for at least 1 second
    }
  }, [post]);

  // Format the publication date
  const date = post ? new Date(post.date) : new Date();
  const relativeDate = post ? formatDistanceToNow(date, { addSuffix: true }) : '';

  if (loading && skeletonVisible) {
    return (
      <div className="bg-[#f8f9fa] min-h-screen py-8">
        <div className="container mx-auto px-0">
          <article className="bg-white rounded-lg shadow-lg overflow-hidden">
            <Skeleton height={256} />
            <div className="p-6">
              <header className="mb-4">
                <Skeleton width={300} height={36} />
                <Skeleton width={150} height={20} className="mt-2" />
              </header>
              <section className="prose lg:prose-xl text-gray-700">
                <Skeleton count={15} />
              </section>
            </div>
          </article>
          {showBackButton && (
            <button 
              onClick={() => router.back()} 
              className="fixed top-4 left-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white p-3 rounded-full shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <AiOutlineArrowLeft size={24} />
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!post) return <p className="text-center text-red-500">Post not found</p>;

  return (
    <>
      <Head>
        <title>{post.title}</title>
        <meta name="description" content={post.excerpt || 'Blog post'} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || 'Blog post'} />
        <meta property="og:image" content={post.image} />
        <meta property="og:url" content={`https://yourwebsite.com/posts/${post.slug}`} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@yourtwitterhandle" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt || 'Blog post'} />
        <meta name="twitter:image" content={post.image} />
      </Head>
      <div className="bg-[#f8f9fa] min-h-screen">
        <div className="container mx-auto px-0">
          <article className="bg-white rounded-lg shadow-lg overflow-hidden">
            {post.image && (
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-64 object-cover"
              />
            )}
            <div className="p-6">
              <header className="mb-4">
                <h1 className="text-4xl font-bold text-gray-900">{post.title}</h1>
                <p className="text-gray-600 text-sm mt-2">{relativeDate} • {post.read_time} min read</p>
              </header>
              <section
                className="prose lg:prose-xl text-gray-700"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </article>
          {showBackButton && (
            <button 
              onClick={() => router.back()} 
              className="fixed top-4 left-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white p-3 rounded-full shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <AiOutlineArrowLeft size={24} />
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps({ params }) {
  try {
    const post = await fetchPosts(params.slug);
    return { props: { post } };
  } catch (error) {
    console.error('Error fetching post:', error);
    return { props: { post: null } };
  }
}

export default Post;
