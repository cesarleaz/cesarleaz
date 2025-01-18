import { resolve } from 'path'
import { NUMBER_OF_PHOTOS, INSTAGRAM_PLACEHOLDER } from './constants.js'
import fs from 'fs/promises'

const { INSTAGRAM_API_KEY } = process.env
const INSTAGRAM_USERNAME = 'cesarsoftware.dev'

const getLatestPhotoFromInstagram = async () => {
  const response = await fetch(
    `https://instagram230.p.rapidapi.com/user/posts?username=${INSTAGRAM_USERNAME}`,
    {
      headers: {
        'x-rapidapi-host': 'instagram230.p.rapidapi.com',
        'x-rapidapi-key': INSTAGRAM_API_KEY
      },
    }
  )

  if (!response.ok) throw new Error(response)

  const result = await response.json()

  return result.items.map(item => {
    const image = item.image_versions2.candidates[0]
    return { src: image.url, shortcode: item.code }
  })
}

const createInstagramHtmlComponent = ({ src, shortcode }) => `
<a href='https://instagram.com/p/${shortcode}' target='_blank'>
  <img width='20%' src='${src}' alt='Instagram photo' />
</a>`

;(async () => {
    const [template, photos] = await Promise.all([
      fs.readFile('./src/README.md.tpl', { encoding: 'utf-8' }),
      getLatestPhotoFromInstagram(),
    ])

    // create latest photos from instagram
    const latestInstagramPhotos = photos
      .slice(0, NUMBER_OF_PHOTOS)
      .map(createInstagramHtmlComponent)
      .join('')

    // replace all placeholders with info
    const newMarkdown = template.replace(
      INSTAGRAM_PLACEHOLDER,
      latestInstagramPhotos
    )

    await fs.writeFile(resolve('README.md'), newMarkdown)
})()
