const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { AssemblyAI } = require("assemblyai");


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

        //  converting audio into text

        const client = new AssemblyAI({
            apiKey: '23fe24d41a764e88b49592d3bcbaa745',
        });

        const FILE_URL = './audio.mp3';

        const audiodata = {
            audio: FILE_URL
        }

        const transcript = await client.transcripts.transcribe(audiodata);
        const finaltext = transcript?.text
        
        fs.unlink("audio.mp3", (e) => { console.log(e) })

        console.log("audio to text done ")   

        res.send(finaltext)

    } catch (error) {
        console.error(error);
        res.status(500).send('Error downloading audio.');
    }
};

module.exports = getaudio;
