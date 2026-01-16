export const storageConfig = {
  endpoints: {
    upload: '/storage/upload',
    retrieve: '/storage/retrieve/:fileKey',
    exists: '/storage/exists/:fileKey',
    commit: '/storage/commit',
    decline: '/storage/decline',
  },
  folders: {
    temp: 'temp/',
    permanent: 'uploads/',
  },
} as const;
