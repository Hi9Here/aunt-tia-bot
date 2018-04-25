'use strict';

const {
  dialogflow,
  BrowseCarousel,
  BrowseCarouselItem,
  Button,
  Carousel,
  Image,
  List,
  MediaObject,
  Suggestions,
  SimpleResponse,
} = require('actions-on-google');
const functions = require('firebase-functions');
const admin = require("firebase-admin");

const serviceAccount = require("./config/firebaseKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://aunt-tia-bot.firebaseio.com"
});

const db = admin.firestore();

// Constants for list and carousel selection
const SELECTION_KEY_PIRAN = 'piran';
const SELECTION_KEY_DAN = 'dan';
const SELECTION_KEY_JAIME = 'jaime';
const SELECTION_KEY_JOSH = 'josh';

// Constants for selected item responses
const SELECTED_ITEM_RESPONSES = {
  [SELECTION_KEY_JOSH]: 'You selected the Josh\'s Story!',
  [SELECTION_KEY_DAN]: 'You selected the Dan\'s Story!',
  [SELECTION_KEY_JAIME]: 'You selected the Jamie\'s Story!',
  [SELECTION_KEY_PIRAN]: 'You selected the Piran\'s Story!'
};

const intentSuggestions = [
  'List',
  'Other'
];

const app = dialogflow({ debug: true });

// Parameters for Stories
app.intent('story', (conv, { Stories }) => {

  if (!Stories.exist) {
    db.collection('user').doc('admin').collection('cards').doc('FhAT090ueyyh5AzBL2Om').get()
      .then(doc => {
        if (!doc.exists) {
          console.log('No such document!');
        } else {
          const storyAudio = doc.data().audio;
          console.log(`this is the audio url ${storyAudio}`);
        }
        return
      })
      .catch(err => {
        console.log('Error getting document', err);
      });

  } else {
    console.log(`User was blank`);
  }

  if (!conv.surface.capabilities.has('actions.capability.AUDIO_OUTPUT')) {
    conv.ask('Sorry, this device does not support audio playback.');
    return;
  }
  const storyPerson = Stories.toLowerCase();
  console.log(`Story person is ${storyPerson}`);

  const imgURL = `https://storage.googleapis.com/staging.aunt-tia-bot.appspot.com/Images/${storyPerson}`;
  const audioURL = `https://storage.googleapis.com/staging.aunt-tia-bot.appspot.com/Stories/${storyPerson}`;

  conv.ask(new SimpleResponse({
    speech: `This is the ${storyPerson} Story`,
    text: `This is the text for the ${storyPerson} Story?`,
  }));
  conv.ask(new MediaObject({
    name: `${storyPerson} Story`,
    url: audioURL,
    description: `A funny story from ${storyPerson}`,
    icon: new Image({
      url: imgURL,
      alt: `${storyPerson} Pic`
    })
  }));
  conv.ask(new Suggestions(intentSuggestions));
  return
});

// List
app.intent('list', (conv) => {
  if (!conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT')) {
    conv.ask('Sorry, try this on a screen device or select the ' +
      'phone surface in the simulator.');
    return;
  }
  conv.ask(new SimpleResponse({
    speech: 'This is a list of stories',
    text: 'Howdy! I would like to share with you some stories?',
  }));
  // Create a list
  conv.ask(new List({
    title: 'List Title',
    items: {
      // Add the first item to the list
      [SELECTION_KEY_JOSH]: {
        synonyms: [
          'josh story',
          'story of josh',
          'Josh talking',
        ],
        title: 'Josh\'s Story',
        description: 'This is a description of Josh\'s story.',
        image: new Image({
          url: '',
          alt: 'Josh Image',
        }),
      },
      // Add the second item to the list
      [SELECTION_KEY_DAN]: {
        synonyms: [
          'dan story',
          'story of dan',
        ],
        title: 'Dan\'s Story',
        description: 'This is a descriptioin of Dan\'s Story',
        image: new Image({
          url: '',
          alt: 'Dan Image',
        }),
      },
      // Add the third item to the list
      [SELECTION_KEY_JAIME]: {
        synonyms: [
          'jaime story',
          'story jamie',
          'jamie talking',
        ],
        title: 'Jaime\'s Story',
        description: 'This is a descriptioin of Jamie\'s Story',
        image: new Image({
          url: '',
          alt: 'Jamie Image',
        }),
      },
      // Add the last item to the list
      [SELECTION_KEY_PIRAN]: {
        title: 'Piran\'s Story',
        synonyms: [
          'Piran Story',
        ],
        description: 'This is a descriptioin of Piran\'s Story',
        image: new Image({
          url: '',
          alt: 'Piran Image',
        }),
      },
    },
  }));
});

// Handle a media status event
app.intent('media status', (conv) => {
  const mediaStatus = conv.arguments.get('MEDIA_STATUS');
  let response = 'Unknown media status received.';
  if (mediaStatus && mediaStatus.status === 'FINISHED') {
    response = 'Hope you enjoyed the story!';
  }
  conv.ask(response);
  conv.ask(new Suggestions(intentSuggestions));
});

// React to list selection
app.intent('item selected', (conv, params, option) => {
  let response = 'You did not select any item from the list';
  if (option && SELECTED_ITEM_RESPONSES.hasOwnProperty(option)) {
    response = SELECTED_ITEM_RESPONSES[option];
  } else {
    response = 'You selected an unknown story from the list';
  }
  conv.ask(response);
});

app.intent('Default Welcome Intent', (conv) => {
  conv.ask('V3')
})

exports.aunttiacomponents = functions.https.onRequest(app);