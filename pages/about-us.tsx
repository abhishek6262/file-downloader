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
        <div className="bg-white mb-8">
          <div className="container mx-auto">
            <Navbar />
          </div>
        </div>

        <div className="container mx-auto">
          <div className="min-h-screen">
            <div className="bg-white w-full md:w-10/12 mx-auto p-5">
              <h1 className="text-2xl font-semibold mb-3">About us</h1>

              <p className="text-gray-700">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eaque magni doloribus natus inventore minus fugit asperiores eligendi illo aperiam! Hic architecto quia optio ullam labore beatae enim qui nulla harum.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AboutUs
