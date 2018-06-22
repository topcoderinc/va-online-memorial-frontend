/*
 * Copyright (c) 2017 Topcoder, Inc. All rights reserved.
 */

/*
 * App configurations
 */

/* TODO: For some reason, the attempt to set default URL from environment
 * variable, which is commented out below, does not work at Heroku. Most
 * probably, there is something wrong with configuration of the build
 * procedure. */
export const API_URL = 'https://rest-api.app.cloud.gov/api';
/*
'http://localhost:4000/api'
  || process.env.REACT_APP_API_URL;
  */

export const META = {
  PAGE_TITLE_SUFFIX: 'VA Online Memorial',
  PAGE_DESCRIPTION: 'VA Online Memorial',
  PAGE_KEYWORDS: 'VA Online Memorial'
};

export const DEFAULT_SERVER_ERROR = 'There was an error processing your request.';

export const VETERAN_NAME_LIMIT = 30;

export const DEFAULT_PROFILE_DATA = {
  acceptedProof: "Please provide next-of-kin information (name, relationship to the deceased, phone number, email address). No Personal Identifiable Information, please (birthdates, social security numbers, etc). If a cemetery has already established your NOK designation, and you have proof of this, you can include that documentation as well.",
  profileImgSrc: "/profile-pic-placeholder.svg",
  "flaggingOpts": [
    {
      "id": 1,
      "reason": "Content is inappropriate",
      "details": "This content is offensive to others, and may include profanity, shocking content, sexual content, or promotes hatred, intolerance, discrimination, or violence."
    },
    {
      "id": 2,
      "reason": "This content/information is incorrect",
      "details": "Information contained in this content is factually inaccurate, or displays incorrect information that needs to be reviewed and/or corrected."
    },
    {
      "id": 3,
      "reason": "This content is spam",
      "details": "This content contains irrelevant or innapropriate messages, unsolicited ads, or commercial messaging."
    }
  ]
};

export const PROFILE_TAB_NAVS = [
  {
    "id": "stories",
    "name": "Stories",
  },
  {
    "id": "photos",
    "name": "Photos",
  },
  {
    "id": "testimonials",
    "name": "Testimonials",
  },
  {
    "id": "badges",
    "name": "Badges",
  }
];
