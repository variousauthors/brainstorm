import React, { useState } from 'react'

import { MultiSelectTypeAndProgram } from '@brainstorm'

export default {
  title: 'MultiSelectTypeAndProgram',
  argTypes: {
  },
}

function Template () {
  const [selectedProgramContentIds, setSelectedProgramContentIds] = useState<number[]>([])
  const [selectedTypeContentIds, setSelectedTypeContentIds] = useState<number[]>([])

  return (
    <MultiSelectTypeAndProgram
      selectedProgramContentIds={selectedProgramContentIds}
      selectedTypeContentIds={selectedTypeContentIds}
      // eslint-disable-next-line no-null/no-null
      onChange={(selection) => {
        setSelectedTypeContentIds(
          selection
            .filter((taxonomy) => taxonomy.taxonomyId === 1)
            .flatMap((taxonomy) => taxonomy.selectedContentIds),
        )

        setSelectedProgramContentIds(
          selection
            .filter((taxonomy) => taxonomy.taxonomyId === 2)
            .flatMap((taxonomy) => taxonomy.selectedContentIds),
        )
      }}
    />
  )
}

export const Primary = Template.bind({})