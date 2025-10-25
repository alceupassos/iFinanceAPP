
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { uploadFile } from '@/lib/s3'
import { prisma } from '@/lib/db'

const pdf = require('pdf-parse')
const xlsx = require('xlsx')
const mammoth = require('mammoth')

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      console.error('[Upload] Tentativa de upload sem autenticação')
      return NextResponse.json({ error: 'Não autorizado. Faça login para fazer upload.' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      console.error('[Upload] Nenhum arquivo foi enviado')
      return NextResponse.json({ error: 'Nenhum arquivo fornecido' }, { status: 400 })
    }

    console.log(`[Upload] Processando arquivo: ${file.name} (${file.size} bytes, tipo: ${file.type})`)

    // Validar tamanho do arquivo (max 50MB)
    const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
    if (file.size > MAX_FILE_SIZE) {
      console.error(`[Upload] Arquivo muito grande: ${(file.size / 1024 / 1024).toFixed(2)}MB`)
      return NextResponse.json({ 
        error: `Arquivo muito grande. Tamanho máximo: 50MB` 
      }, { status: 400 })
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())
    console.log(`[Upload] Buffer criado: ${buffer.length} bytes`)
    
    // Upload to S3
    console.log(`[Upload] Iniciando upload para S3...`)
    const cloud_storage_path = await uploadFile(buffer, file.name)
    console.log(`[Upload] Upload para S3 concluído: ${cloud_storage_path}`)
    
    // Extract text content based on file type
    let extractedText = ''
    const fileName = file.name.toLowerCase()
    
    try {
      if (fileName.endsWith('.pdf')) {
        const pdfData = await pdf(buffer)
        extractedText = pdfData.text
      } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
        const workbook = xlsx.read(buffer, { type: 'buffer' })
        const sheetNames = workbook.SheetNames
        extractedText = sheetNames.map((sheetName: string) => {
          const sheet = workbook.Sheets[sheetName]
          return `## ${sheetName}\n\n${xlsx.utils.sheet_to_txt(sheet)}`
        }).join('\n\n')
      } else if (fileName.endsWith('.docx')) {
        const result = await mammoth.extractRawText({ buffer })
        extractedText = result.value
      } else if (fileName.endsWith('.csv')) {
        extractedText = buffer.toString('utf-8')
      } else {
        extractedText = buffer.toString('utf-8')
      }
    } catch (extractError) {
      console.error('Text extraction error:', extractError)
      extractedText = 'Erro ao extrair texto do arquivo. O arquivo foi armazenado mas o conteúdo não pôde ser processado.'
    }

    // Save file metadata to database
    const fileRecord = await prisma.file.create({
      data: {
        name: file.name,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        cloud_storage_path,
        extractedText: extractedText.slice(0, 50000), // Limit to 50k chars
        userId: session.user.id
      }
    })

    return NextResponse.json({
      success: true,
      fileId: fileRecord.id,
      fileName: file.name,
      cloud_storage_path,
      extractedText: extractedText.slice(0, 10000), // Return first 10k chars
      size: file.size
    })

  } catch (error) {
    console.error('Upload error:', error)
    
    // Retorna mensagem de erro mais detalhada
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao fazer upload'
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const files = await prisma.file.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50,
      select: {
        id: true,
        name: true,
        originalName: true,
        mimeType: true,
        size: true,
        createdAt: true
      }
    })

    return NextResponse.json({ files })

  } catch (error) {
    console.error('Get files error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve files' },
      { status: 500 }
    )
  }
}
