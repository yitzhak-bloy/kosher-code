const axios = require("axios");

const videoTutorials = require("./data/videoTutorials");
const redditChannels = require("./data/redditChannels");
const podcasts = require("./data/podcasts");

let id_list = videoTutorials.map(tech =>
  tech.videoTutorials.map(video => video.url)
);

const ID_LIST = [].concat.apply([], id_list);

const CHUNK_SIZE = 50;

const CHUNKS_OF_FIFTY = ID_LIST.map((e, i) => {
  return i % CHUNK_SIZE === 0 ? ID_LIST.slice(i, i + CHUNK_SIZE) : null;
}).filter(e => e);

const formatted = CHUNKS_OF_FIFTY.map(chunk => chunk.join("%2C"));

module.exports = function(api) {
  api.loadSource(async actions => {
    const BASE_URL = `https://www.googleapis.com/youtube/v3/videos?part=snippet&key=${process.env.GRIDSOME_API_KEY}&type=video&id=`;

    const data = await axios
      .all(formatted.map(req => axios.get(`${BASE_URL}${req}`)))
      .then(res => res.map(r => r.data));

    const VideoCollection = actions.addCollection("Video");
    for (const d of data) {
      for (const item of d.items) {
        // API returns reversed
        const technologyName = videoTutorials.find(tech =>
          tech.videoTutorials.find(video => video.url === item.id)
        );
        VideoCollection.addNode({
          id: item.id,
          category: technologyName.name.toLowerCase(),
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails.medium.url,
          publishedAt: item.snippet.publishedAt,
          color: technologyName.color,
          ind: videoTutorials
            .map(tech =>
              tech.videoTutorials.findIndex(vid => vid.url === item.id)
            )
            .filter(i => i !== -1)
        });
      }
    }

    const RedditChannels = actions.addCollection("Reddit");
    redditChannels.forEach(channel => {
      RedditChannels.addNode({
        name: channel.name,
        color: channel.color
      });
    });

    const PodcastsCollection = actions.addCollection("Podcast");
    podcasts.forEach(podcast => {
      PodcastsCollection.addNode({
        name: podcast.name,
        description: podcast.description,
        link: podcast.link,
        color: podcast.color,
        image: podcast.image
      });
    });
  });

  api.createPages(async ({ graphql, createPage }) => {
    const { data } = await graphql(`
      {
        allVideo {
          edges {
            node {
              ind
              id
              title
              description
              category
              publishedAt
            }
          }
        }
      }
    `);

    data.allVideo.edges.forEach(({ node }) => {
      if (node.category === "elementor") {
        // console.log(node.id);
      }
      createPage({
        path: `/video-tutorials/:category/${node.id}`,
        component: "./src/templates/VideoPage.vue",
        context: {
          id: node.id,
          title: node.title,
          description: node.description,
          category: node.category,
          publishedAt: node.publishedAt
        }
      });
    });

    const videoCategories = videoTutorials.map(tech => tech.name);
    videoCategories.forEach(cat => {
      createPage({
        path: `/video-tutorials/${cat.toLowerCase()}`,
        component: "./src/templates/TechnologyPage.vue",
        context: {
          technology: cat.toLowerCase(),
          color: videoTutorials.find(tech => tech.name === cat).color
        }
      });
    });
  });
};
