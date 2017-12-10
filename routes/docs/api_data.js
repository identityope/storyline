define({ "api": [
  {
    "type": "post",
    "url": "/story/new",
    "title": "Create New Story",
    "name": "createNewStory",
    "description": "<p>Create a New Story</p>",
    "group": "Story",
    "version": "1.0.0",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>User's token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>Title of the story (optional)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "content",
            "description": "<p>Whatever story you want to tell</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Result object</p>"
          }
        ]
      }
    },
    "filename": "routes/api/story.js",
    "groupTitle": "Story",
    "sampleRequest": [
      {
        "url": "http://localhost:5050/api/story/new"
      }
    ]
  },
  {
    "type": "get",
    "url": "/story/:story_id",
    "title": "Get Story by ID",
    "name": "getStoryByID",
    "description": "<p>Get Story by ID</p>",
    "group": "Story",
    "version": "1.0.0",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Result object</p>"
          }
        ]
      }
    },
    "filename": "routes/api/story.js",
    "groupTitle": "Story",
    "sampleRequest": [
      {
        "url": "http://localhost:5050/api/story/:story_id"
      }
    ]
  },
  {
    "type": "get",
    "url": "/story/permalink/:permalink",
    "title": "Get Story by Permalink",
    "name": "getStoryByPermalink",
    "description": "<p>Get Story by Permalink</p>",
    "group": "Story",
    "version": "1.0.0",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Result object</p>"
          }
        ]
      }
    },
    "filename": "routes/api/story.js",
    "groupTitle": "Story",
    "sampleRequest": [
      {
        "url": "http://localhost:5050/api/story/permalink/:permalink"
      }
    ]
  },
  {
    "type": "get",
    "url": "/test/user_tokens/:user_id",
    "title": "Get User Tokens by ID",
    "name": "GetUserTokensbyID",
    "description": "<p>Get User Tokens by ID</p>",
    "group": "Test",
    "version": "1.0.0",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Result object</p>"
          }
        ]
      }
    },
    "filename": "routes/api/test.js",
    "groupTitle": "Test",
    "sampleRequest": [
      {
        "url": "http://localhost:5050/api/test/user_tokens/:user_id"
      }
    ]
  },
  {
    "type": "get",
    "url": "/test/check",
    "title": "Check API",
    "name": "checkAPI",
    "description": "<p>Health check to the API routes</p>",
    "group": "Test",
    "version": "1.0.0",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Result object</p>"
          }
        ]
      }
    },
    "filename": "routes/api/test.js",
    "groupTitle": "Test",
    "sampleRequest": [
      {
        "url": "http://localhost:5050/api/test/check"
      }
    ]
  },
  {
    "type": "get",
    "url": "/user/auth_data",
    "title": "Get User Authentication Data",
    "name": "getUserAuthenticationData",
    "description": "<p>Get user Authentication Data</p>",
    "group": "User",
    "version": "1.0.0",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>User's token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "Authorization=Token DEVELOPMENT_TOKEN",
          "type": "form-data"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>User object</p>"
          }
        ]
      }
    },
    "filename": "routes/api/user.js",
    "groupTitle": "User",
    "sampleRequest": [
      {
        "url": "http://localhost:5050/api/user/auth_data"
      }
    ]
  },
  {
    "type": "get",
    "url": "/user/profile",
    "title": "Get User Profile",
    "name": "getUserProfile",
    "description": "<p>Get user profile data.</p>",
    "group": "User",
    "version": "1.0.0",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>User's token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "Authorization=Token DEVELOPMENT_TOKEN",
          "type": "form-data"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>User object</p>"
          }
        ]
      }
    },
    "filename": "routes/api/user.js",
    "groupTitle": "User",
    "sampleRequest": [
      {
        "url": "http://localhost:5050/api/user/profile"
      }
    ]
  },
  {
    "type": "get",
    "url": "/user/:id/profile",
    "title": "Get User Profile by ID",
    "name": "getUserProfileById",
    "description": "<p>Get user profile data by user ID.</p>",
    "group": "User",
    "version": "1.0.0",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>User object</p>"
          }
        ]
      }
    },
    "filename": "routes/api/user.js",
    "groupTitle": "User",
    "sampleRequest": [
      {
        "url": "http://localhost:5050/api/user/:id/profile"
      }
    ]
  },
  {
    "type": "post",
    "url": "/user/login",
    "title": "Login User",
    "name": "loginUser",
    "description": "<p>Login user.</p>",
    "group": "User",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username_email",
            "description": "<p>User's username</p>"
          },
          {
            "group": "Parameter",
            "type": "Password",
            "optional": false,
            "field": "password",
            "description": "<p>User's password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "device_id",
            "description": "<p>User's device ID</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "device_model",
            "description": "<p>User's device model</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "device_notif_type",
            "description": "<p>User's device push notification type (APNS or FCM)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "device_notif_id",
            "description": "<p>User's device push notification ID</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "app_version",
            "description": "<p>User's app version</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "advertising_platform",
            "description": "<p>User's app advertising platform</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "advertising_id",
            "description": "<p>User's app advertising ID</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>User object</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.username",
            "description": "<p>Username of user</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.email",
            "description": "<p>Email of user</p>"
          }
        ]
      }
    },
    "filename": "routes/api/user.js",
    "groupTitle": "User",
    "sampleRequest": [
      {
        "url": "http://localhost:5050/api/user/login"
      }
    ],
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>The <code>id</code> of the User was not found.</p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Something happened on the server.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "post",
    "url": "/user/logout",
    "title": "Logout User",
    "name": "logoutUser",
    "description": "<p>Logout user.</p>",
    "group": "User",
    "version": "1.0.0",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>User's token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "Authorization=Token DEVELOPMENT_TOKEN",
          "type": "form-data"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "device_notif_type",
            "description": "<p>User's device push notification type (APNS or FCM)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "device_notif_id",
            "description": "<p>User's device push notification ID</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>User object</p>"
          }
        ]
      }
    },
    "filename": "routes/api/user.js",
    "groupTitle": "User",
    "sampleRequest": [
      {
        "url": "http://localhost:5050/api/user/logout"
      }
    ]
  },
  {
    "type": "post",
    "url": "/user/register",
    "title": "Register New User",
    "name": "registerNewUser",
    "description": "<p>Register new user.</p>",
    "group": "User",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>User's username</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User's email</p>"
          },
          {
            "group": "Parameter",
            "type": "Password",
            "optional": false,
            "field": "password",
            "description": "<p>User's password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "platform",
            "description": "<p>User's platform on registration (android, ios, or web)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "device_id",
            "description": "<p>User's device ID</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "device_model",
            "description": "<p>User's device model</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "device_imei",
            "description": "<p>User's device IMEI</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "device_os",
            "description": "<p>User's device OS version</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "device_notif_type",
            "description": "<p>User's device push notification type (APNS or FCM)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "device_notif_id",
            "description": "<p>User's device push notification ID</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "app_version",
            "description": "<p>User's app version</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "advertising_platform",
            "description": "<p>User's app advertising platform</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "advertising_id",
            "description": "<p>User's app advertising ID</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>User object</p>"
          }
        ]
      }
    },
    "filename": "routes/api/user.js",
    "groupTitle": "User",
    "sampleRequest": [
      {
        "url": "http://localhost:5050/api/user/register"
      }
    ]
  }
] });
