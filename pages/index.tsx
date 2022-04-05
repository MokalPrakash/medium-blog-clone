import Head from 'next/head'
import { sanityClient,urlFor } from "../sanity"
import Header from '../components/header'
import { Post } from '../typing'
import Link from 'next/link'

interface Props {
  posts: [Post]
}

const Home = ({ posts }:Props) => {
  console.log({posts})
  return (
    <div className='max-w-7xl mx-auto'>
      <Head>
        <title>Medium Clone</title>
        <link rel="icon" href="/images/medium-1.svg" />
      </Head>
      <Header/>


    <div className='flex items-center justify-between border-y border-black bg-yellow-400 py-10 lg:py-5'>
      <div className='space-y-5 px-10'>
        <h1 className='max-w-xl text-6xl font-mono'>
          <span className='underline decoration-black decoration-4'>Medium</span>{" "}
          is a place to write,read and connect.
        </h1>
        <h2>
          It's easy and free to post your thinking on any topic and connect
          with millions of readers.
        </h2>
      </div>
      
        <img src="/images/medium-1.svg" alt="M" className='hidden md:inline-flex h-32 lg:w-full px-10 hover:animate-spin ease-out cursor-pointer'/>
    </div> 

    {/* {posts} */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-2  md:gap-6 md:p-6'>
      {posts.map((post) => (
        <Link key={post._id} href={`/post/${post.slug.current}`}>
          <div className='group cursor-pointer border overflow-hidden rounded-lg shadow-lg'>
            <img className="w-full h-60 object-cover transition-transform duration-200 ease-in-out group-hover:scale-105" src={urlFor(post.mainImage).url()!} alt="" />
            <div className='flex justify-between bg-white p-5'>
              <div>
                <p className='text-lg font-bold'>{post.title}</p>
                <p>{post.description} by {post.author.name}</p>
              </div>
              <img
                className='h-12 w-12 rounded-full'
                src={urlFor(post.author.image).url()!}
                alt=''
              />
            </div>
          </div>
        </Link>
      ))}
      </div>
    </div>

 
  )
}

export async function getServerSideProps() {
  const query = `*[_type == 'post'] {
    _id,
    title,
    author -> {
      name,
      image
    },
    description,
    mainImage,
    slug
  }`

  const posts = await sanityClient.fetch(query)

  return {
    props: {
      posts
    }
  }
}

export default Home
