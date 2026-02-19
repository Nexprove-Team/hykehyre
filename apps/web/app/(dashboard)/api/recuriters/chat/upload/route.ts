import { put } from '@vercel/blob'
import { getSession } from '@/lib/auth-session'

const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
]

const MAX_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(req: Request) {
  const session = await getSession()
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return Response.json({ error: 'No file provided' }, { status: 400 })
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return Response.json(
      { error: 'Invalid file type. Please upload a PDF, Word document, or text file.' },
      { status: 400 }
    )
  }

  if (file.size > MAX_SIZE) {
    return Response.json(
      { error: 'File too large. Maximum size is 10MB.' },
      { status: 400 }
    )
  }

  const timestamp = Date.now()
  const blob = await put(
    `job-descriptions/${session.user.id}/${timestamp}-${file.name}`,
    file,
    { access: 'public' }
  )

  return Response.json({
    url: blob.url,
    filename: file.name,
    mediaType: file.type,
  })
}
