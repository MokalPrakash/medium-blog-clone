import { url } from 'inspector'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import Header from '../../components/header'
import { sanityClient, urlFor } from '../../sanity'
import PortableText from 'react-portable-text'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Post } from '../../typing'
import { useState } from 'react'

interface IFormInput {
  _id: string
  name: string
  email: string
  comment: string
}

interface Props {
  post: Post
}

const Post = ({ post }: Props) => {
  const [submitted, setSubmitted] = useState(false)
  console.log(post.comments)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>()

  const onSubmit: SubmitHandler<IFormInput> = async(data) => {
    console.log(data)
    console.log(errors)

    await fetch('/api/createComment',{
      method: "POST",
      body: JSON.stringify(data)
    })
      .then(() => {
        console.log(data)
        setSubmitted(true)
      })
      .catch((error) => {
        console.log(error)
        setSubmitted(false)
      })

  }

  return (
    <>
      <Head>
        <title>{post.title}</title>
        <link rel="icon" href="/images/medium-1.svg"></link>
      </Head>
      <div>
        <Header />
        <img
          className="h-80 w-full object-cover aspect-square"
          src={urlFor(post.mainImage).url()!}
          alt=""
        />
        <article className="mx-auto max-w-3xl p-5">
          <h1 className="mt-10 mb-3 text-3xl">{post.title}</h1>
          <h2 className="mb-2 text-xl font-light text-gray-500">
            {post.description}
          </h2>

          <div className="flex items-center space-x-2">
            <img
              className="h-10 w-10 rounded-full"
              src={urlFor(post.author.image).url()!}
              alt=""
            />
            <p className="text-sm font-extralight">
              Blog post by{` `}
              <span className="text-green-700">{post.author.name} - </span>
              Published at {new Date(post._createdAt).toLocaleString()}
            </p>
          </div>

          <div>
            <PortableText
              dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
              projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
              content={post.body}
              serializers={{
                h1: (props: any) => (
                  <h1 className="my-5 text-2xl font-bold" {...props}></h1>
                ),
                h2: (props: any) => (
                  <h1 className="my-5 text-xl font-bold" {...props}></h1>
                ),
                li: ({ children }: any) => (
                  <li className="ml-4 list-disc">{children}</li>
                ),
                link: ({ children, href }: any) => (
                  <a href={href} className="text-blue-500 hover:underline">
                    {children}
                  </a>
                ),
              }}
            />
          </div>
        </article>
        <hr className="my-5 mx-auto max-w-lg border border-yellow-500" />

        {submitted ? (
          <div className="my-10 mx-auto flex max-w-2xl flex-col bg-yellow-500 p-10 text-white">
            <h3>Thank You for submitting your comment.</h3>
            <p>Once it has been approved, it will appear below!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="mx-auto mb-10 flex max-w-2xl flex-col p-5">
            <h3 className="text-sm text-yellow-500">Enjoy this article ?</h3>
            <h4 className="text-3xl font-bold">Leave a comment below !</h4>
            <hr className="mt-2 py-3" />
            <input
              {...register('_id')}
              type="hidden"
              name="_id"
              value={post._id}
            />
            <label htmlFor="" className="mb-5 block">
              <span className="text-gray-700">Name</span>
              <input
                {...register('name')}
                className="form-input mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-yellow-500 focus:ring"
                type="text"
                placeholder="Enter Your Name."
              />
            </label>

            <label htmlFor="" className="mb-5 block">
              <span className="text-gray-700">Email</span>
              <input
                {...register('email')}
                className="form-input mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-yellow-500 focus:ring"
                type="email"
                placeholder="Enter Your Email."
              />
            </label>

            <label htmlFor="" className="mb-5 block">
              <span className="text-gray-700">Comment</span>
              <textarea
                {...register('comment')}
                className="form-textarea mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-yellow-500 focus:ring"
                placeholder="Enter Your Comment."
                rows={8}
              />
            </label>

            <div className="flex flex-col py-5">
              {errors.name && (
                <span className="text-red-500">
                  - The name Field is required
                </span>
              )}

              {errors.email && (
                <span className="text-red-500">
                  - The email Field is required
                </span>
              )}

              {errors.comment && (
                <span className="text-red-500">
                  - The comment Field is required
                </span>
              )}
            </div>

            <input
              type="submit"
              className="focus:shadow-outline hover: cursor-pointer rounded bg-yellow-500 hover:bg-yellow-400 px-4 py-2 font-bold text-white shadow"
            />
          </form>
        )}

         {/* Comments */}
         <div className='my-10 mx-auto max-w-2xl flex flex-col space-y-2 p-10 shadow shadow-yellow-500'>
            <h3 className='text-4xl'>Comments</h3>
            <hr className='pb-2'/>

            {post.comments?.map((comment) => (
              <div key={comment._id}>
                <p>
                  <span className='text-yellow-500 mr-3'>
                    {comment.name}:
                  </span>
                  {comment.comment}
                </p>
              </div>
            ))}
         </div>
      </div>
    </>
  )
}

export async function getStaticPaths() {
  const query = `*[_type == 'post'] {
        _id,
        slug {
            current,
        }
    }`

  const posts = await sanityClient.fetch(query)

  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }))

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  console.log(params?.slug)
  const query = `*[_type == 'post' && slug.current ==$slug][0] {
        _id,
        _createdAt,
        title,
        author -> {
            name,
            image,
        },
        "comments": *[
          _type == "comment" &&
          post._ref == ^._id &&
          approved == true
        ],
        description,
        mainImage,
        slug,
        body,
    }`

  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  })

  if (!post) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      post,
    },
    revalidate: 60,
  }
}

export default Post
