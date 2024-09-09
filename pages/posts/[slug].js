// pages/posts/[slug].js
import Head from 'next/head';
import { fetchPosts } from '../../lib/api';

const Post = ({ post }) => {
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
        {/* Twitter card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@yourtwitterhandle" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt || 'Blog post'} />
        <meta name="twitter:image" content={post.image} />
      </Head>
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-auto mb-6 rounded-lg shadow-lg"
          />
        )}
        <div
          className="prose lg:prose-xl"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </>
  );
};

export async function getServerSideProps({ params }) {
  const post = await fetchPosts(params.slug);
  return { props: { post } };
}

export default Post;
