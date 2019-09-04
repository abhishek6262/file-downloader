import React from 'react'
import Head from 'next/head'
import ISourceFile from '../app/Source/interface/ISourceFile'
import SOURCE_FILE_STUB from '../app/Source/Stub'
import FileMetaInfo from '../components/file-meta-info'
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

    this.handleSourceFileUnlockCancelled = this.handleSourceFileUnlockCancelled.bind(this)
    this.handleSourceFileUnlockQueued = this.handleSourceFileUnlockQueued.bind(this)
    this.handleSourceFileUnlockSuccess = this.handleSourceFileUnlockSuccess.bind(this)
    this.handleSourceFileVerificationSuccess = this.handleSourceFileVerificationSuccess.bind(this)
  }

  private handleSourceFileUnlockCancelled() {
    this.setState({ sourceFile: SOURCE_FILE_STUB })
  }

  private handleSourceFileUnlockQueued(sourceFile: ISourceFile) {
    this.setState({ sourceFile })
  }

  private handleSourceFileUnlockSuccess(downloadLink: string) {
    const { sourceFile } = this.state

    sourceFile.downloadLink = downloadLink

    this.setState({ sourceFile })
  }

  private handleSourceFileVerificationSuccess(sourceFile: ISourceFile) {
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
        handleSourceFileUnlockQueued={this.handleSourceFileUnlockQueued}
        sourceFile={this.state.sourceFile}
      />
    } else {
      content = <VerifySourceLink
        handleSourceFileVerificationSuccess={this.handleSourceFileVerificationSuccess}
      />
    }

    return (
      <>
        <Head>
          <title>File Downloader - Generate Non-Capped, Non-Expiring and Resumable Links</title>
        </Head>

        <div id="main" className="site-content bg-fixed bg-gray-900">
          <div className="container mx-auto">
            <div className="flex items-center min-h-screen p-5">
              <div className="entry-content w-full md:w-2/3 mx-auto">
                <h1 className="mb-4 text-3xl text-white">Generate <span className="font-bold italic text-orange-300">Non-Capped</span>,<br /><span className="font-bold italic text-orange-300">Non-Expiring</span>, <span className="font-bold italic text-orange-300">Resumable Links</span>.<br />For Your <span className="italic text-orange-300 font-bold">Downloads</span>.</h1>

                {content}
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .site-content {
            background-image: url('https://images.unsplash.com/photo-1566716272480-fd1ecb90e5f7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1534&q=80');
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

          .entry-content {
            z-index: 1;
          }
        `}</style>
      </>
    )
  }
}

export default Home
