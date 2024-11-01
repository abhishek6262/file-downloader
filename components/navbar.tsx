import getConfig from 'next/config'
import Link from 'next/link'
import { FunctionComponent } from "react"

type scheme = 'light' | 'transparent'

interface Props {
  scheme?: scheme
}

const Navbar: FunctionComponent<Props> = ({ scheme = 'light' }) => {
  const { publicRuntimeConfig: { APP_NAME } } = getConfig()

  return (
    <>
      <nav className="flex items-center justify-between flex-wrap p-6">
        <div className="flex items-center flex-grow flex-shrink-0 text-white mr-6">
          <div>
            <Link href="/">
              <a>
                <svg className={ (scheme === "light" ? "fill-dark " : "fill-current ") + "inline-block align-bottom h-8 w-8 mr-2" } width="54" height="54" viewBox="0 0 54 54" xmlns="http://www.w3.org/2000/svg"><path d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z"/></svg>
                <span className={ (scheme === "light" ? "text-gray-800 " : "") + "font-semibold inline-block text-xl tracking-tight" }>{ APP_NAME }</span>
              </a>
            </Link>
          </div>
        </div>

        <div className="lg:flex lg:items-center lg:w-auto">
          <div>
            <Link href="/about-us">
              <a href="#" className={ (scheme === "transparent" ? "bg-white " : "") + "inline-block text-sm px-4 py-2 leading-none hover:bg-gray-200 text-gray-800 font-semibold rounded" }>About us</a>
            </Link>
          </div>
        </div>
      </nav>

      <style jsx>{`
        .fill-dark {
          fill: #2d3748;
        }
      `}</style>
    </>
  )
}

export default Navbar
