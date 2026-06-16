import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import https from 'https'

const prisma = new PrismaClient()

const imagesDir = path.join(process.cwd(), 'public', 'images', 'products')

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true })
}

function downloadImage(url: string, filename: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const filePath = path.join(imagesDir, filename)
    if (fs.existsSync(filePath)) {
      console.log(`✅ Уже скачано: ${filename}`)
      resolve()
      return
    }

    const file = fs.createWriteStream(filePath)
    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Status ${response.statusCode} for ${url}`))
          return
        }
        response.pipe(file)
        file.on('finish', () => {
          file.close()
          console.log(`✅ Скачано: ${filename}`)
          resolve()
        })
      })
      .on('error', (err) => {
        fs.unlink(filePath, () => {})
        reject(err)
      })
  })
}

async function main() {
  const images = await prisma.productImage.findMany({
    include: { product: { select: { slug: true } } },
  })

  console.log(`Найдено ${images.length} изображений для скачивания...`)

  let success = 0
  let failed = 0

  for (const image of images) {
    const ext = path.extname(new URL(image.url).pathname) || '.jpg'
    const filename = `${image.product.slug}-${image.sortOrder}${ext}`
    try {
      await downloadImage(image.url, filename)
      success++
    } catch (err) {
      console.error(`❌ Ошибка скачивания ${image.url}:`, err)
      failed++
    }
  }

  console.log(`\nГотово! Успешно: ${success}, Ошибок: ${failed}`)
  console.log(`Изображения сохранены в: ${imagesDir}`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
