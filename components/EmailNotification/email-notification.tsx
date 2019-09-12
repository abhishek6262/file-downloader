import React from 'react'
import ISourceFile from '../../server/Source/interface/ISourceFile'
import EmailUpdateForm from './email-update-form'
import EmailUpdateSuccess from './email-update-success'

interface Props {
  handleSourceFileUpdate: Function
  sourceFile: ISourceFile
}

class EmailNotification extends React.Component<Props> {
  render() {
    return this.props.sourceFile.email.length > 0
      ? <EmailUpdateSuccess />
      : <EmailUpdateForm
          handleEmailUpdateSuccess={this.props.handleSourceFileUpdate}
          sourceFile={this.props.sourceFile}
        />
  }
}

export default EmailNotification
