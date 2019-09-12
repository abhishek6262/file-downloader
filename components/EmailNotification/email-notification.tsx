import React from 'react'
import ISourceFile from '../../server/Source/interface/ISourceFile'
import EmailUpdateForm from './email-update-form'
import EmailUpdateSuccess from './email-update-success'

interface Props {
  sourceFile: ISourceFile
}

interface States {
  emailExists: boolean
}

class EmailNotification extends React.Component<Props, States> {
  constructor(props: Props) {
    super(props)

    this.state = {
      emailExists: props.sourceFile.email !== undefined && props.sourceFile.email.length > 0
    }

    this.handleEmailUpdateSuccess = this.handleEmailUpdateSuccess.bind(this)
  }

  private handleEmailUpdateSuccess() {
    this.setState({ emailExists: true })
  }

  render() {
    return this.state.emailExists
      ? <EmailUpdateSuccess />
      : <EmailUpdateForm
          handleEmailUpdateSuccess={this.handleEmailUpdateSuccess}
          sourceFile={this.props.sourceFile}
        />
  }
}

export default EmailNotification
