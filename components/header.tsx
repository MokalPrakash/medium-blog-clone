import Link from 'next/link'

const Header = () => {
  return (
    <header className="mx-auto flex max-w-7xl justify-between p-5">
      <div className="flex items-center space-x-5">
        <Link href={'/'}>
          <img
            src="/images/medium-logo.svg"
            alt="medium-logo"
            className="w-44 cursor-pointer object-cover"
          />
        </Link>

        <div className="hidden items-center space-x-5 md:inline-flex">
          <h3 className="cursor-pointer">About</h3>
          <h3 className="cursor-pointer">Contact</h3>
          <h3 className="cursor-pointer rounded-full bg-green-600 px-4 py-1 text-white">
            Follow
          </h3>
        </div>
      </div>

      <div className="flex cursor-pointer items-center space-x-3 md:space-x-5 text-green-600">
        <h3 className="cursor-pointer">Sign In</h3>
        <h3 className="cursor-pointer rounded-full border border-green-600 md:px-4 py-1 px-1" >
          Get Started
        </h3>
      </div>
    </header>
  )
}

export default Header
