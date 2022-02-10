import { Words } from '@atoms/components'
import { IReactComponentProps } from '@atoms/metadata'
import React from 'react'

export interface IProfileSummaryProps extends IReactComponentProps {
  user: {
    _id: string
  }
  stats: {
    percentageComplete: number
  }
}

export function ProfileSummary ({ user, stats }: IProfileSummaryProps) {
  return (
    <div className='user-profile compact'>
      <div className='up-controls'>
        <div className='row'>
          <div className='col-sm-6'>
            <div className='value-pair'>
              <div className='label'><Words>agents:PERSONAL_SETTINGS.PROFILE.YOUR_USER_ID</Words></div>
              <div className='value'>{user._id}</div>
            </div>
          </div>
        </div>
      </div>
      <div className='up-contents'>
        <div className='m-b'>
          <div className='m-t-20'>
            <div className='os-progress-bar primary'>
              <div className='bar-labels'>
                <div className='bar-label-left'>
                  <Words>agents:PERSONAL_SETTINGS.PROFILE.PROFILE_COMPLETION</Words>
                </div>
                <div className='bar-label-right'>
                  <span className='info'>{stats.percentageComplete}/100</span>
                </div>
              </div>
              <div className='bar-level-1' style={{ width: '100%' }}>
                <div className='bar-level-3' style={{ width: `${stats.percentageComplete}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}