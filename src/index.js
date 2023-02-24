import { resolve } from 'path'
import { NUMBER_OF_PHOTOS, INSTAGRAM_PLACEHOLDER } from './constants'

const { INSTAGRAM_API_KEY } = process.env
const INSTAGRAM_USER_ID = '25025320'

const getLatestInstagramPost = async () => {
  const response = await fetch(
    `https://instagram28.p.rapidapi.com/medias?user_id=${INSTAGRAM_USER_ID}&batch_size=${NUMBER_OF_PHOTOS}`,
    {
      headers: {
        'X-RapidAPI-Host': 'instagram28.p.rapidapi.com',
        'X-RapidAPI-Key': INSTAGRAM_API_KEY,
      },
    }
  )
  const json = await response.json()

  console.log(json)

  return json.data.user?.edgeownertotimelinemedia?.edges
}

const createInstagramHtmlComponent = ({
  node: { display_url: url, shortcode },
}) => `
<a href='https://instagram.com/p/${shortcode}' target='_blank'>
  <img width='20%' src='${url}' alt='Instagram photo' />
</a>`

;(async () => {
  // await getLatestTwitchStream()

  const [template, photos] = await Promise.all([
    fs.readFile('./src/README.md.tpl', { encoding: 'utf-8' }),
    getLatestInstagramPost(),
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
