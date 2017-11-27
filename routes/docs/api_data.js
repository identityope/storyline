define({ "api": [
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
    ]
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