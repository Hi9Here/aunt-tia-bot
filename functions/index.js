'use strict';

const {
  dialogflow,
  BasicCard,
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
const SELECTION_KEY_DAN = 'dan';
const SELECTION_KEY_JAMIE = 'jamie';
const SELECTION_KEY_IMOGEN = 'imogen';
const SELECTION_KEY_KELLEE = 'kellee';
const SELECTION_KEY_KELLEECOCAINE = 'kellee cocaine';
const SELECTION_KEY_JOSH = 'josh';
const SELECTION_KEY_ISAAC = 'isaac';
const SELECTION_KEY_DANDRUNK = 'dan drunk';
const SELECTION_KEY_HENRY = 'henry';
const SELECTION_KEY_ISAACCLUB = 'isaac club';
const SELECTION_KEY_CHLOE = 'chloe';
const SELECTION_KEY_CHLOEBLACKOUT = 'chloe blackout';
const SELECTION_KEY_PIRAN = 'piran';
const SELECTION_KEY_LAURA = 'laura';
const SELECTION_KEY_CHLOEDRINKING = 'chloe ';
const SELECTION_KEY_HENRYSCHOOL = 'henry school';

// Constants for selected item responses
const SELECTED_ITEM_RESPONSES = {
  [SELECTION_KEY_DAN]: 'You selected the Dan\'s Story!',
  [SELECTION_KEY_JAMIE]: 'You selected the Jamie\'s Story!',
  [SELECTION_KEY_IMOGEN]: 'You selected the Imogen\'s Story!',
  [SELECTION_KEY_KELLEE]: 'You selected the Kellee\'s Story!',
  [SELECTION_KEY_KELLEECOCAINE]: 'You selected the Kellee\'s Cocaine Story!',
  [SELECTION_KEY_JOSH]: 'You selected the Josh\'s Story!',
  [SELECTION_KEY_ISAAC]: 'You selected the Isaac\'s Story!',
  [SELECTION_KEY_DANDRUNK]: 'You selected the Dan Drunk\'s Story!',
  [SELECTION_KEY_HENRY]: 'You selected the Henry\'s Story!',
  [SELECTION_KEY_ISAACCLUB]: 'You selected the Isaac\'s club Story!',
  [SELECTION_KEY_CHLOE]: 'You selected the Chloe\'s Story!',
  [SELECTION_KEY_CHLOEBLACKOUT]: 'You selected the Chloe\'s Blackout Story!',
  [SELECTION_KEY_PIRAN]: 'You selected the Piran\'s Story!',
  [SELECTION_KEY_LAURA]: 'You selected the Laura\'s Story!',
  [SELECTION_KEY_CHLOEDRINKING]: 'You selected the Chloe\'s Story!',
  [SELECTION_KEY_HENRYSCHOOL]: 'You selected the Henry\'s School Story!'
};

const intentListSuggestions = [
  'Contact Numbers',
  'About Aunti Tia'
];

const intentSuggestions = [
  'Contact Numbers',
  'About Aunti Tia'
];

const app = dialogflow({ debug: true });

// Parameters for Stories
app.intent('story', (conv, { Stories }) => {

  // if (!Stories.exist) {
  //   db.collection('user').doc('admin').collection('cards').doc('FhAT090ueyyh5AzBL2Om').get()
  //     .then(doc => {
  //       if (!doc.exists) {
  //         console.log('No such document!');
  //       } else {
  //         const storyAudio = doc.data().audio;
  //         console.log(`this is the audio url ${storyAudio}`);
  //       }
  //       return
  //     })
  //     .catch(err => {
  //       console.log('Error getting document', err);
  //     });

  // } else {
  //   console.log(`User was blank`);
  // }

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
      [SELECTION_KEY_DAN]: {
        synonyms: [
          'dan story',
          'story of dan',
        ],
        title: "Dan\'s Painkiller Story",
        description: "When Dan was Addicted to Painkillers",
        image: new Image({
          url: '',
          alt: 'Dan Image',
        }),
      },
      [SELECTION_KEY_JAMIE]: {
        synonyms: [
          'jamie story',
          'story of jamie',
        ],
        title: "Jamie Acide Story",
        description: "When Jamie took Acid",
        image: new Image({
          url: '',
          alt: 'Jamie Image',
        }),
      },
      [SELECTION_KEY_IMOGEN]: {
        synonyms: [
          'imogen story',
          'story of imogen',
        ],
        title: 'Imogen\'s Story',
        description: 'When Imogen drank wine and felt suicidal',
        image: new Image({
          url: '',
          alt: 'Imogen Image',
        }),
      },
      [SELECTION_KEY_KELLEE]: {
        synonyms: [
          'kellee story',
          'kellee talking',
        ],
        title: "Kellee\'s MDMA Story",
        description: 'When Kellee took MDMA',
        image: new Image({
          url: '',
          alt: 'Kellee Image',
        }),
      },
      [SELECTION_KEY_KELLEECOCAINE]: {
        synonyms: [
          'kellee cocaine story',
          'kellee talking about cocaine',
        ],
        title: "Kellee\'s Cocaine Story",
        description: 'When Kellee took Cocaine',
        image: new Image({
          url: '',
          alt: 'Kellee Image',
        }),
      },
      [SELECTION_KEY_JOSH]: {
        synonyms: [
          'josh mdma story',
          'mdma talking about mdma',
        ],
        title: "Josh\'s MDMA Story",
        description: 'When Josh took too much MDMA',
        image: new Image({
          url: '',
          alt: 'Josh Image',
        }),
      },
      [SELECTION_KEY_JOSH]: {
        synonyms: [
          'josh mdma story',
          'josh talking about mdma',
        ],
        title: "Josh\'s MDMA Story",
        description: 'When Josh took too much MDMA',
        image: new Image({
          url: '',
          alt: 'Josh Image',
        }),
      },
      [SELECTION_KEY_ISAAC]: {
        synonyms: [
          'isaac story',
          'isaac talking',
        ],
        title: "Isaac\'s Fight Story",
        description: 'When Isaac got so drunk he punched his friend',
        image: new Image({
          url: '',
          alt: 'Isaac Image',
        }),
      },
      [SELECTION_KEY_DAN]: {
        synonyms: [
          'dan story',
          'dan talking',
        ],
        title: "Dan\'s Car Accident",
        description: 'When Dan got in a drunken car accident',
        image: new Image({
          url: '',
          alt: 'Dan Image',
        }),
      },
      [SELECTION_KEY_HENRY]: {
        synonyms: [
          'henry story',
          'henry talking',
        ],
        title: "Henry Got Drunk First Time",
        description: 'When Henry got drunk for the first time',
        image: new Image({
          url: '',
          alt: 'Henry Image',
        }),
      },
      [SELECTION_KEY_ISAACCLUB]: {
        synonyms: [
          'isaac story',
          'isaac talking',
        ],
        title: "Isaac got too drunk",
        description: 'When Isaac got too drunk at the club',
        image: new Image({
          url: '',
          alt: 'Isaac Image',
        }),
      },
      [SELECTION_KEY_CHLOE]: {
        synonyms: [
          'chloe story',
          'chloe talking',
        ],
        title: "Chloe Birthday Story",
        description: 'When Chloe blacked out at her friend\'s birthday',
        image: new Image({
          url: '',
          alt: 'Chloe Image',
        }),
      },
      [SELECTION_KEY_CHLOEBLACKOUT]: {
        synonyms: [
          'chloe blackout story',
          'chloe talking about blackout',
        ],
        title: "Chloe drank too much Bacardi",
        description: 'When Chloe drank too much Bacardi',
        image: new Image({
          url: '',
          alt: 'Chloe Image',
        }),
      },
      [SELECTION_KEY_PIRAN]: {
        synonyms: [
          'piran story',
          'piran talking',
        ],
        title: "Piran\'s Friends too high",
        description: 'When all of Piran\'s friends were high',
        image: new Image({
          url: '',
          alt: 'Piran Image',
        }),
      },
      [SELECTION_KEY_LAURA]: {
        synonyms: [
          'laura story',
          'laura talking',
        ],
        title: "Laura\'s first time drunk",
        description: 'When Laura got drunk for the first time',
        image: new Image({
          url: '',
          alt: 'laura Image',
        }),
      },
      [SELECTION_KEY_CHLOEDRINKING]: {
        synonyms: [
          'chloe drinking story',
          'chloe talking about drinking',
        ],
        title: "Chloe drink Sambuca",
        description: 'When Chloe drank too much black Sambuca',
        image: new Image({
          url: '',
          alt: 'chloe Image',
        }),
      },
      [SELECTION_KEY_HENRYSCHOOL]: {
        synonyms: [
          'henry school story',
          'henry school talking',
        ],
        title: "Henry\'s Realisation",
        description: 'When Henry realised his friends were damaged',
        image: new Image({
          url: '',
          alt: 'henry Image',
        }),
      }
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
  conv.ask('V12')
})

exports.aunttiacomponents = functions.https.onRequest(app);