const axios = require('axios');
const fs = require('fs');
const path = require('path');

const getaudio = async (req, res) => {
  try {
    const { data } = await axios.get('https://youtube-mp310.p.rapidapi.com/download/mp3', {
      params: { url: req.body.link },
      headers: {
        'x-rapidapi-key': '99b47a62fcmsh4a1b4667e38275bp189ec4jsn1176a852c2b3',
        'x-rapidapi-host': 'youtube-mp310.p.rapidapi.com',
      },
    });

    const audioData = await axios.get(data.downloadUrl, { responseType: 'arraybuffer' });
    fs.writeFileSync(path.join(__dirname, 'audio.mp3'), audioData.data);

    res.send('Audio file downloaded and saved as audio.mp3.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error downloading audio.');
  }
};

module.exports = getaudio;
