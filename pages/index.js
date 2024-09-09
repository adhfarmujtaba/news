// pages/index.js
import Link from 'next/link'; // Import Link from next/link
import { fetchPosts } from '../lib/api';

const Home = ({ posts }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">News Website</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <Link key={post.id} href={`/posts/${post.slug}`} className="block bg-white rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300">
            <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
            <div className="p-6">
              <h2 className="text-xl font-semibold text-blue-600">{post.title}</h2>
              <p className="text-gray-600 mt-2">{post.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export async function getServerSideProps() {
  const posts = await fetchPosts();
  return { props: { posts } };
}

export default Home;
