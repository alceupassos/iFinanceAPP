
import { 
  PutObjectCommand, 
  GetObjectCommand, 
  DeleteObjectCommand 
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { createS3Client, getBucketConfig } from './aws-config'

const s3Client = createS3Client()
const { bucketName, folderPrefix } = getBucketConfig()

export async function uploadFile(buffer: Buffer, fileName: string): Promise<string> {
  try {
    if (!bucketName) {
      throw new Error('AWS_BUCKET_NAME não configurado. Verifique as variáveis de ambiente.')
    }

    const key = `${folderPrefix}uploads/${Date.now()}-${fileName}`
    
    console.log(`[S3] Uploading to bucket: ${bucketName}, key: ${key}`)
    
    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: buffer,
        ContentType: getContentType(fileName)
      })
    )
    
    console.log(`[S3] Upload successful: ${key}`)
    return key
  } catch (error) {
    console.error('[S3] Upload error:', error)
    
    if (error instanceof Error) {
      // Mensagens de erro mais amigáveis para problemas comuns do S3
      if (error.message.includes('Access Denied') || error.message.includes('AccessDenied')) {
        throw new Error('Erro de permissão no S3. Verifique as credenciais AWS.')
      } else if (error.message.includes('NoSuchBucket')) {
        throw new Error(`Bucket S3 não encontrado: ${bucketName}`)
      } else if (error.message.includes('InvalidAccessKeyId')) {
        throw new Error('Credenciais AWS inválidas.')
      } else if (error.message.includes('SignatureDoesNotMatch')) {
        throw new Error('Assinatura AWS incorreta. Verifique as credenciais.')
      }
    }
    
    throw error
  }
}

export async function downloadFile(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key
  })
  
  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 })
  return signedUrl
}

export async function deleteFile(key: string): Promise<void> {
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key
    })
  )
}

function getContentType(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase()
  const types: Record<string, string> = {
    pdf: 'application/pdf',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    xls: 'application/vnd.ms-excel',
    csv: 'text/csv',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    doc: 'application/msword'
  }
  return types[ext || ''] || 'application/octet-stream'
}
