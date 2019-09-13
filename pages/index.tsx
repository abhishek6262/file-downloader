import getConfig from 'next/config'
import React from 'react'
import Head from 'next/head'
import ISourceFile from '../server/Source/interface/ISourceFile'
import SOURCE_FILE_STUB from '../server/Source/Stub'
import FileMetaInfo from '../components/file-meta-info'
import Navbar from '../components/navbar'
import UnlockSourceLink from '../components/unlock-source-link'
import VerifySourceLink from '../components/verify-source-link'

interface Props { }

interface States {
  sourceFile: ISourceFile
}

class Home extends React.Component<Props, States> {
  constructor(props: Props) {
    super(props)

    this.state = {
      sourceFile: SOURCE_FILE_STUB
    }

    this.handleSourceFileUpdate = this.handleSourceFileUpdate.bind(this)
    this.handleSourceFileUnlockCancelled = this.handleSourceFileUnlockCancelled.bind(this)
    this.handleSourceFileUnlockSuccess = this.handleSourceFileUnlockSuccess.bind(this)
  }

  private handleSourceFileUpdate(sourceFile: ISourceFile) {
    this.setState({ sourceFile })
  }

  private handleSourceFileUnlockCancelled() {
    this.setState({ sourceFile: SOURCE_FILE_STUB })
  }

  private handleSourceFileUnlockSuccess(downloadLink: string) {
    const { sourceFile } = this.state

    sourceFile.downloadLink = downloadLink

    this.setState({ sourceFile })
  }

  render() {
    let content: JSX.Element

    if (this.state.sourceFile.status === 'pending') {
      content = <UnlockSourceLink
                  handleSourceFileUnlockSuccess={this.handleSourceFileUnlockSuccess}
                  sourceFile={this.state.sourceFile}
                />
    } else if (this.state.sourceFile.status === 'verified') {
      content = <FileMetaInfo
                  handleSourceFileUnlockCancelled={this.handleSourceFileUnlockCancelled}
                  handleSourceFileUnlockQueued={this.handleSourceFileUpdate}
                  sourceFile={this.state.sourceFile}
                />
    } else {
      content = <VerifySourceLink
                  handleSourceFileVerificationSuccess={this.handleSourceFileUpdate}
                />
    }

    const { publicRuntimeConfig: { APP_NAME } } = getConfig()

    return (
      <>
        <Head>
          <title>{ APP_NAME } - Generate Non-Capped, Non-Expiring and Resumable Links</title>
        </Head>

        <div id="main" className="site-content bg-fixed bg-gray-900">
          <div className="container mx-auto">
            <div className="relative min-h-screen z-10">
              <div>
                <Navbar scheme="transparent" />
              </div>

              <div className="mt-8 lg:mt-16 p-5">
                <div className="w-full md:w-2/3 mx-auto">
                  <h1 className="mb-4 text-3xl text-white">Generate <span className="font-bold italic text-orange-300">Non-Capped</span>,<br /><span className="font-bold italic text-orange-300">Non-Expiring</span>, <span className="font-bold italic text-orange-300">Resumable Links</span>.<br />For Your <span className="italic text-orange-300 font-bold">Downloads</span>.</h1>

                  {content}
                </div>
              </div>

              <div className="lg:absolute bottom-0 right-0 p-5 text-center">
                <p className="text-gray-200">Photo Credit <a className="font-semibold text-yellow-500" href="https://unsplash.com/@touann" target="_blank">Touann Gatouillat Vergos</a>.</p>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .site-content {
            background-image: url('https://images.unsplash.com/photo-1568383694497-a06983132aa9?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&dl=touann-gatouillat-vergos-kCo-zEqc9IY-unsplash.jpg');
            background-position: center center;
            background-size: cover;
            position: relative;
          }

          .site-content::after {
            background-color: rgba(0, 0 , 0, 0.6);
            content: '';
            display: block;
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            top: 0;
          }
        `}</style>
      </>
    )
  }
}

export default Home
