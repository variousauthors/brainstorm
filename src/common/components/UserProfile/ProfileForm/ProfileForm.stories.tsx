import React, { useState } from 'react'

import { ProfileForm } from '@brainstorm'

export default {
  title: 'ProfileForm',
  argTypes: {
  },
}

function Template () {
  const [userProfile, setUserProfile] = useState({ firstName: 'Bob' })

  return (
    <ProfileForm userProfile={userProfile} onChange={setUserProfile} onSubmit={() => alert('Nooice!')} />
  )
}

export const Primary = Template.bind({})