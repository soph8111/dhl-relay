import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET,
  },
  deployment: {
    appId: 'z5tkm3p0aqrecb8c3t1swtfq',
    autoUpdates: true,
  },
})
