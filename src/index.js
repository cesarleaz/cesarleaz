const { resolve } = require('path')
const { NUMBER_OF_PHOTOS, INSTAGRAM_PLACEHOLDER } = require('./constants.js')
const fs = require('fs').promises

const { INSTAGRAM_API_KEY } = process.env
const INSTAGRAM_USER_ID = '5366714243'

const getLatestPhotoFromInstagram = async () => {
  const response = await fetch(
    `https://instagram130.p.rapidapi.com/account-medias?userid=${INSTAGRAM_USER_ID}&first=${NUMBER_OF_PHOTOS}`,
    {
      headers: {
        'x-rapidapi-host': 'instagram130.p.rapidapi.com',
        'x-rapidapi-key': INSTAGRAM_API_KEY,
      },
    }
  ).catch(error => console.error('failed fetch', error))

  const json = await response.json()

  return json?.edges
}

const createInstagramHtmlComponent = ({
  node: { display_url: url, shortcode },
}) => `
<a href='https://instagram.com/p/${shortcode}' target='_blank'>
  <img width='20%' src='${url}' alt='Instagram photo' />
</a>`

;(async () => {
  const [template, photos] = await Promise.all([
    fs.readFile('./src/README.md.tpl', { encoding: 'utf-8' }),
    getLatestPhotoFromInstagram(),
  ])

  // create latest photos from instagram
  const latestInstagramPhotos = photos
    .map(createInstagramHtmlComponent)
    .join('')

  // replace all placeholders with info
  const newMarkdown = template.replace(
    INSTAGRAM_PLACEHOLDER,
    latestInstagramPhotos
  )

  await fs.writeFile(resolve('README.md'), newMarkdown)
})()
