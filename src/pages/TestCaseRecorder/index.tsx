import React, {memo, useEffect, useState} from 'react'
import type {ReactNode} from 'react'

interface IProps {
  children?: ReactNode
}

const TestCaseRecorder: React.FC<IProps> = () => {

  return (
    <div>
      <div>TestCaseRecorder</div>
    </div>
  )
}

export default TestCaseRecorder;
