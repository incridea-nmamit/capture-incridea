import React from 'react'
import CenteredLoader from '~/components/LoadingAnimation/CameraLoading'
import GlobeLoader from '~/components/LoadingAnimation/GlobeLoader'

const Loading = () => {
  return (
    <div>
      <CenteredLoader/>
      {/* <GlobeLoader/> */}
    </div>
  )
}

export default Loading
