const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { AssemblyAI } = require("assemblyai");
const { Together } = require("together-ai");



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

        console.log("audio extracted from link")

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
        // this is the text from audio

        fs.unlink("audio.mp3", (e) => { console.log(e) })

        console.log("audio to text done ")

        // Converting text into summary 

        const together = new Together({ apiKey: 'a7b5526446ea835510ae1ddb5198cea5081283bede8010578cac106d84644f2c' });
        const response = await together.chat.completions.create({
            messages: [
                {
                    "role": "user",
                    "content": `You are a specialist in the summarization domain. You have been given a caption of a YouTube tutorial video.

                Task Instructions:
                - First Identify the different topics that are being mentioned in the input.
                - Explain the topics in the heading content format, keep the heading in capital letters, and the content in normal
                - For Now just use space to show differences between each topic
                - Each topic should atleast have minimum 4 diffent points which explains about the topic, keep them medium, add a "-" in the beginning 
                    which helps in understanging.
                - the output that you are providing must be in a json object, which exampple will be provided it you
                - Please provide the output in valid JSON format without any newline characters or line breaks.
                 The response should be a continuous string without line breaks.
                - it should only contain the required json and nothing else, no extra texts 



                Example - 

                [
                    {
                        topicname:  name 
                        summary: - point 1
                                 - point 2 
                                 - point 3 
                    },
                    {
                        topicname:  name 
                        summary: - point 1
                                 - point 2 
                                 - point 3 
                    },
                ]

                    Data example of how it should look when sent in response- 

                    [
                        {
                          "topicname": "COMPONENTS",
                          "summary": [
                            { point: "Components are the building blocks of every React app." },
                            { point: "Components are reusable pieces of code that can be used to create user interface elements." },
                            { point: "Every React component is a JavaScript function that returns markup." },
                            { point: "JSX is optional, but it's the most commonly used way to create user interfaces in React." }
                          ]
                        },
                        {
                          "topicname": "JSX",
                          "summary": [
                            { point: "JSX is JavaScript in disguise." },
                            { point: "JSX is used to create user interface elements in React." },
                            { point: "JSX is optional, but it's the most commonly used way to create user interfaces in React." },
                            { point: "JSX is similar to HTML, but it has some differences." }
                          ]
                        }
                    ]
                


                Input ${finaltext}`
                }
            ],
            model: "meta-llama/Llama-3.2-11B-Vision-Instruct-Turbo",
            // model: "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",
        });

        console.log("Summary done")
        const result = response.choices[0].message.content

        res.send(result);


    } catch (error) {
        console.error(error);
        res.status(500).send('Error downloading audio.');
    }
};

module.exports = getaudio;
