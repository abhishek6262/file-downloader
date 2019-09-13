import getConfig from 'next/config'
import Head from 'next/head'
import Navbar from '../components/navbar'
import { FunctionComponent } from "react"

const AboutUs: FunctionComponent = () => {
  const { publicRuntimeConfig: { APP_NAME } } = getConfig()

  return (
    <>
      <Head>
        <title>{APP_NAME} - About us</title>
      </Head>

      <div id="main" className="site-content bg-gray-200">
        <div className="min-h-screen">
          <div className="bg-white mb-8">
            <div className="container mx-auto">
              <Navbar />
            </div>
          </div>

          <div className="container mx-auto">
            <div className="bg-white w-full md:w-10/12 mx-auto p-5">
              <h1 className="text-2xl font-semibold mb-3">About us</h1>

              <p className="text-gray-700 font-semibold leading-relaxed mb-2">In the world where the internet is always up and running. The Download links should never be compromised too.</p>
              <p className="text-gray-700 leading-relaxed mb-2">We have developed this platform to ensure that your download links never go down so you can work without breaking a sweat. Using this platform you can be sure that the download link is Non-speed capped, Non-expiring, and Resumable so your download never fails. This application will generate a High-speed download link from the link of the source file you supply to it.</p>
              <p className="text-gray-700 leading-relaxed mb-2">Moreover, it will also go a step further and notify you on your email address once the process is completed so you don't have to wait and leave your computer open. You can always close the tab without the second thought and the application will take care of the rest.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AboutUs
