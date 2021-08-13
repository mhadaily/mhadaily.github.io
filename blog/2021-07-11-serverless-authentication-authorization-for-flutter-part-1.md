# Serverless Authentication and Authorization for Flutter - Part 1 - Overview

Authentication and authorization are two main concerns regarding securing our applications, whether mobile, web apps, or machine-to-machine connections. Flutter is not an exception. The security concerns are even more severe when you need to share your credentials to enable the applications to access third-party platform resources.

Authentication is dealing with the question "Who you are?" and authorization answers the question "What do you allow to do?". My experience shows in real-world applications; you will need Accounting which is another critical aspect; you need logs and trackings to do audits and debugging.

In this series, you will learn how to enable authentication, including federated identity providers, add authorization by introducing roles, permissions, build and secure your Flutter app, all by leveraging Auth0. This security provider helps you to create fully serverless authentication and authorization for your Flutter applications.

You need to know the basics of Flutters to follow the tutorial smoothly, but it's not a hard requirement; you can learn as you go.

## What you will learn and build

While you can create a new Flutter project and implement everything you will learn in this article, it's pretty common to implement authentication and authorization to an existing app, especially if it is supposed to release to production. To ensure what I will write in this article is as close to production-ready as possible, I have decided to add Auth0 and Chat to my existing app, MJ coffee.

Throughout these articles, you will secure the MJ Coffee app by adding authentication flow to log in via customer username and password and social identity providers such as Google and Apple. You'll add roles and permissions to the users and limit app functionalities based on the user permissions and roles. Then you will learn how to add a support chat by adding GetStream.io chat while retrieving production-chat-token for each user via Auth0 Action, and limiting chat functionalities based on user roles and permissions.

[![Overview of what you'll learn](https://img.youtube.com/vi/bHdSLwWFNJ4/0.jpg)](https://www.youtube.com/watch?v=bHdSLwWFNJ4)

You will have full access to the complete source code of the application, which is available on [this Github repository](https://github.com/mhadaily/serverless-authentication-authorization-flutter/tree/complete). However, I do recommend you to follow me step by step to understand inside-out.

Additionally, I have recoded more comprehensive and longer videos to support this article, you may watch them on my [Youtube channel
playlist](https://www.youtube.com/playlist?list=PLCOnzDflrUceRLfHEkl-u2ipjsre6ZwjV).

## What is Auth0 and Why?

Auth0 is an identity management platform for application builders. Getting a perfect authentication and authorization solution to work in your application is a challenging task. Imagine that you have a tedious and traditional username and password login. You decide to modernize and add social button logins such as Google and Apple, or perhaps even better, go for passwordless solutions!. It may take several days to fully and flawlessly implement the standards such as OAuth 2.0 and OpenID Connect.

Auth0 provides convenient solutions to make all of these extremely easy and secure. You'll somehow focus on your application and the features you need to deliver rather than on authentication and authorization development. Speeding up development, scaling, customizing, reduce the cost of maintenance, and, more importantly, being secure by design are some of the benefits of using Auth0 as your identity manager.

> If you are familiar with OAuth and OpenId Connect, you can skip to Prerequisites section.

## Oauth 2.0 and OpenID Connect (OIDC) for Flutter developer

Let's understand OAuth and OpenID Connect. Throughout this series, I will name OAuth instead of OAuth 2.0, which is the latest version for the sake of brevity.

OAuth is a standard security protocol for authorization. It allows users to give third-party applications access to their resources. Imagine you have a Flutter app that needs to send a tweet on behalf of your user to their timeline on Twitter. The user usually goes through a flow that gives a contest to the app that accesses the Twitter resources. Typically, the permissions (scopes in OAuth) defined in the contest screen that the user can approve or reject. The idea here is simple. If your users already have an account with one of these companies, you don't need to ask your users to reveal their username or password.

### OAuth Terminology

Before we see how OAuth flow works, let's be familiar with OAuth Terminology:

- **Resource Owner:** Typically, a user of our Flutter app who has logged in.
- **Resource Server (Protected resources):** Our user data which pass via HTTP API
- **Client:** This refers to our app, which is accessing the user's account approved by users.
- **Authorization server:** The server that holds authorization logic and exchange access token.

There are other terminologies that you use to know them before we move on:

- **Redirect URI:** It is the URI that our authorization server posts an authorization code to it.
- **Access_Token:** Access tokens are what applications use to make API requests on behalf of a user. The access token represents the authorization of a specific application to access particular parts of a user's data.
- **Scope:** These are permissions to protect resources on behalf of the resource owner. Scope definitions are flexible; it might be the entire API or a particular type of access or a specific piece of function.

|     Entire      |           Feature            |      Function       |
| :-------------: | :--------------------------: | :-----------------: |
| stream_chat_api | stream_chat_api.message.read | steam_chat_api.feed |

- **Consent:** the page that user can see and approve or reject the scope
- **Back channel (highly secure channel):** Typically, it refers to a machine to machine calls.
- **Front channel (less secure channel):** Generally, it refers to Public apps such as mobile app or SPA (single page applications).

In OAuth, An authorization server mainly has two endpoints:

- **Authorize:** This is usually handling all client interactions, such as browsers or Flutter apps.
- **Token:** And this endpoint is typically for machines only

### Authorization flow with OAuth

Let's now take a look at how a high-level overview of a typical authorization flow with OAuth.

- 1-It begins with the Client app (our Flutter app) that sends an authorization request where a resource owner (user) must accept.
- 2- Then typically, the user should authenticate and verify who they are. The authentication can occur via OpenID Connect; we will get back to that later. Then, the user can consent to share specific data.
- 3- After consent, the user redirects to the app with an authorization grant.
- 4- Then the client application makes a back channel request to the authorization server with the authorization grant received and some way that shows this is a valid client.
- 5- If all checks out, the authorization server responds with access_token.
- 6- Then The client can use this access_token to exchange data and authorize requests to the protected resource. Usually, we send access_token via the Authorization header that the authorization server has defined the scheme. However, typically it's a Bearer scheme. e.g., **Authorization: Bearer f7hw31qqw80byd4d2uaa7wduie9nx48f9oi0**
- 7- Lastly, the protected resource must trust the token by verifying that with the authorization server and understands what permissions the user has delegated. Once all checks out, the protected resource will respond.

![Authorization Code Grant](https://images.ctfassets.net/cdy7uua7fh8z/2nbNztohyR7uMcZmnUt0VU/2c017d2a2a2cdd80f097554d33ff72dd/auth-sequence-auth-code.png)

While we have seen a typical flow for OAuth, the exact flow varies on which OAuth flow you choose. The two main important ones you may see quite often are

- 1- The Authorization Code Grant Type
- 2- The Implicit Grant Type
- 3- The Client Credentials Grant Type

We have seen the typical flow that was The Authorization Code Grant Type that we typically used in Server-side applications. We use it combined with PKCE for Native apps, for example, our Flutter application.

The Implicit Grant type has been designed for public clients, such as single-page applications that cannot hold any secret to exchange the code with access_token. In this flow, after user consent, the user will redirect to the client with the access_token, and then the client can request the protected resources.

![Implicit Code Grant](https://images.ctfassets.net/cdy7uua7fh8z/6m0uE4E7Hpzbdhyh9dEuYK/e36c910ff47a7540bf27e23c02822624/auth-sequence-implicit-form-post.png)

The Client Credentials Grant Type is designed for the client application, that the resource owner is itself, and no user is involved in the transactions. Best for machine-to-machine communication, which requires client authentication.

![Credential Grant](https://images.ctfassets.net/cdy7uua7fh8z/2waLvaQdM5Fl5ZN5xUrF2F/8c5ddae68ac8dd438cdeb91fe1010fd1/auth-sequence-client-credentials.png)

I can recommend a table to show different flows for different apps:

|      AppType       |     Recommended Flow      |
| :----------------: | :-----------------------: |
|    Server-side     |    Authorization Code     |
|        SPA         |         Implicit          |
|     Native app     | Authorization Code + PKCE |
| Machine-to-machine |    Client Credentials     |

### OAuth 2.1

I want to take a moment and talk about OAuth 2.1, which aims to simplify OAuth and address outdated recommendations. I do not want to go into the details, but in short, there are four significant changes:

- No more implicit
- Single-use refresh tokens (I will talk about refresh tokens later)
- PKCE across the board
- No tokens in the query string

|      AppType       |     Recommended Flow      |
| :----------------: | :-----------------------: |
|    Server-side     | Authorization Code + PKCE |
|        SPA         | Authorization Code + PKCE |
|     Native app     | Authorization Code + PKCE |
| Machine-to-machine |    Client Credentials     |

### How PKCE works?

I have talked about PKCE several times to let's explore it. In native apps, we cannot receive a token in the browsers as it's not secure. In other words, implicit flow is not a choice for native applications. However, we can secure back channel requests with one exception: we can not keep the secret in the native app as they are still a public client and are considered insecure apps. In other words, the authorization code grant type is a perfect choice for native apps, although we must address keeping the secret issue. Luckily, there is a standard for that PKCE.

PKCE stands for Proof Key for Code Exchange, which allows us to link the authorization request to the token request using a proof key that only the initial requester would have known.

Let's see how it works:

- 1- before the application start the authorization process, it first generates a random value called code_verifier
- 2- Then the client init authorization request and includes the SHA256 hash value of the code verifier known as code_challenge
- 3- The process goes and the Authorization server store the code_challenge
- 4- The authorization code goes as explained until the token request part that client will include the code_verifier, the initial un-hashed value.
- 5- The Authorization Server then hash this value the same way as what the client has done with SHA256 and then compare it with the code_challenge received in the initial request and stored it.
- 6- If the hash match, the server knows that the client is the same and has not tampered along the way, it will send the access token back.

![Authorization with PKCE](https://images.ctfassets.net/cdy7uua7fh8z/3pstjSYx3YNSiJQnwKZvm5/33c941faf2e0c434a9ab1f0f3a06e13a/auth-sequence-auth-code-pkce.png)

Although this seems like a simple process, it gives us such a high-security assurance between client native apps and the authorization server.

Now that you are pretty familiar with OAuth, there is still one missing piece of the puzzle, authentication. There is no specification in OAuth to standard authentication. Therefore, the OpenID Connect extension of OAuth makes it possible to implement standard authentication and formalize some OAuth ambiguity.

By using OIDC, the authorization server can act as an Identity Provider. It provides the Discovery document, a well-known endpoint that describes the OpenID provider, Including the URLs of its various endpoints, what scopes and claimed types support it, and the public keys for verifying tokens. This document helps to allow clients to configure to use the identity provider automatically. an example of the document is `/.well-known/OpenID-configuration`.

OpenID Connects has a userInfo endpoint to obtain user information by passing a token which proper scopes have been delegated, such as profile.

A critical part of the OIDC is Identity Token which describes the authentication event itself instead of permitting us to access a protected resource. The client application uses the identity token to verify the data within it and whether or not the identity token has been tampered with by public key and cryptography.

An ID Token is always a JSON Web Token or JWT, sometimes pronounced as JOT. The ID token has three parts:

- Header
- Body(Payload)
- Signature

A full stop delimits each part.

```bash
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

The Header describes the token itself.

```json
{
  ''alg": "RS256",
  "kid": "dsadasdsa", -> match back in the providers Discovery document.
  "typ:  "JWT"
}
```

The payload has the most exciting information for the client application.

```json
{
  "nbf": "....",
  "exp": "....",
  "iat": "....",
  "auth_time": "....",
  "iss: "...."
  "aud: "..."
  "nonce": "..."
  "at_hash": "...." -> include the access token especially in implicit flow
  "sub": "..." -> Unique ID for user
  "idp": "" -> identify provider who issued the ID
  "amr" : "" -> the method that shows how user authenticated.
}
```

You can usually debug your JWT tokens on the [JWT.io](https://JWT.io) website.

Using OAuth and OIDC will have significant benefits for your application, including:

- 1- You can double your application for a particular vendor
- 2- You can use open-source libraries that follow the standard
- 3- It provides a high-level security assurance.
- 4- You don't need to invent the wheel.

## Prerequisites

Before getting started, you need to have the following installation in your machine:

- Flutter SDK version 2+, I use 2.2 for building my application
- Basic Null safety knowledge, if you need to know yet, please read [Null Safety](https://flutter.dev/docs/null-safety)
- An IDE or an editor of your choice, I recommend
  - Android Studio, or
  - IntelliJ, or
  - Visual Studio Code, I will use VScode throughout these articles.
- Dart and Flutter plugins for your IDE regardless of what you use.
- [Clone MJ Coffee app main](https://github.com/mhadaily/serverless-authentication-authorization-flutter), the `main` branch, is ready to implement Auth0 and Chat. Alternatively you can clone the [`complete` brand](https://github.com/mhadaily/serverless-authentication-authorization-flutter/tree/complete)
- A cup of tea or coffee

Once you have set up your environment and are ready, continue reading the article.

## Overview of the Flutter application

First, let's get familiar with the MJ Coffee app. This application is a typical minimal Flutter app that contains several screens and simple functionalities to let the customers find and order their coffee. The app starts with `main.dart` and uses `MaterialApp` to pass to`runApp()` wrapped in `runZoneGuarded()`.

```dart
// main.dart
runZonedGuarded<Future<void>>(
    () async {
      await SystemChrome.setPreferredOrientations(
        [DeviceOrientation.portraitUp],
      );
      runApp(
        MaterialApp(
          debugShowCheckedModeBanner: false,
          themeMode: ThemeMode.system,
          home: HomeScreen(),
          navigatorKey: CoffeeRouter.instance.navigatorKey,
          theme: getTheme(),
        ),
      );
    },
    (error, stackTrace) async {
      print('Caught Dart Error!');
      print('$error');
      print('$stackTrace');
    },
  );

```

The app consists of several screens.

I will add support and community chat screens in this tutorial and replace the login page with Auth0.

- lib/screens
  - home.dart
  - menu.dart
  - profile.dart
  - support.dart (To be implemented)
  - community.dart (To be implemented)

Since this is a minimal application, I decide not to use any advanced state management and dependencies injection solution. Hence, I will use `StatefulWidget` and `setState` and simple singleton services to provide data across screens, including:

- auth_service. Dart (To be implemented)
- chat_service. Dart (To be implemented)
- coffee_router. Dart

You will need to add and work with models from time to time. Therefore, to make it easier to generate models in this application, you can use `build_runner` and `json_serializable` packages. To start, you will find only one model, but we will add more models as we go.

- libs/models
  - coffee.dart

Moreover, all reusable widgets and helpers functions or constants are placed under their folders, respectively.

- libs/helpers

  - validators.dart
  - is_debug.dart
  - theme.dart
  - constants.dart

- libs/widgets

  - button.dart
  - coffee_additions.dart
  - coffee_count.dart
  - coffee_size.dart
  - coffee_sugar.dart

Last but not least, the unique identifier for this app is `mj.coffee.app` which the `mj.coffee` parameter sets the hierarchy of the Flutter app, and it is critical to set callback URL. You will find more details on this concept as you follow the article.

## Looking Forward

Now that you are ready, let's go to next article, part 2, where you will learn how to implement Auth0 in the Flutter, MJ Coffee app.

# Serverless Authentication and Authorization for Flutter - Part 2 - Flutter and Auth0

In the previous article, you have learned the fundamentals of OAuth 2.0 and OpenID Connect. You have also seen what you will build. You know an overview of the app, MJ Coffee app structure. In this part, you will learn how to implement authentication in the Flutter app.

## Install Flutter Dependencies

You need to install three main dependencies:

- [http](https://pub.dartlang.org/packages/http): A composable, Future-based library for making HTTP requests published by [Dart team](https://dart.dev/)
- [flutter_appauth](https://pub.dev/packages/flutter_appauth) : A well-maintained wrapper package around [AppAuth](https://appauth.io/) for Flutter developed by [Michael Bui](https://dexterx.dev/about/). AppAuth authenticates and authorizes users and supports the PKCE extension.
- [fluttersecurestorage](https://pub.dev/packages/flutter_secure_storage): A library to securely persist data locally developed by [German Saprykin](https://github.com/mogol). You will need this to store tokens and other necessary information.

Next, open the `pubspec.yaml` file located under the project root directory and add specified dependencies:

```yaml
dependencies:
  flutter:
    sdk: flutter
  ....
  json_annotation: ^4.0.1
  http: ^0.13.3
  flutter_appauth: ^1.1.0
  flutter_secure_storage: ^4.2.0
  ....
```

Then, make sure to run the `flutter pub get` command in the root of your project in the terminal or run `Pub get` in your editor or IDE.

## Configuring Android, iOS, and Callback URL

a callback URL is a mechanism that an authorization server, for example, Auth0, can communicate back to your application. It's one of the required parameters when requesting and needs to be added to the authorization server's allow-list.

A callback URL is a valid HTTPS URL for a web application. For native app including your implementation in Flutter, you need to create a sudo-URL composed using application schema. URI configured per application is pretty much similar to a valid HTTPS URL.

Therefore, you can use `mj.coffee.app://login-callback` as your callback URL. Keep in mind; you might need to change `mj.coffee.app` part in another application depends on your unique application ID or schema of your app.

`flutter_appauth` will register your app with an intent filter on that callback URL. If there's no match, the app will not receive the result.

### Android

So, to set this value on Android, open `android/app/build.gradle` file and update `defaultConfig` by adding `manifestPlaceHolders` with a member of `'appAuthRedirectScheme': 'mj.coffee.app'`. The value of `appAuthRedirectScheme` must be in lower case letters.

```java
   defaultConfig {
        applicationId "mj.coffee.app"
        minSdkVersion 21
        targetSdkVersion 29
        versionCode flutterVersionCode.toInteger()
        versionName flutterVersionName
        manifestPlaceholders = [
            'appAuthRedirectScheme': 'mj.coffee.app'
        ]
    }
```

Note that you have to update your `minSdkVersion` to at least `18` as it's a requirement to `flutter_secure_storage` package. I used `21` in the MJ Coffee app.

### iOS

The only change that you need to set in iOS default settings is to add a callback scheme. To do that, open `ios/Runner/Info.plist` file and add `CFBundleURLTypes` key to `<dict>` to register one `CFBundleURLSchemes` as follows:

```java
...
   <key>CFBundleURLTypes</key>
    <array>
        <dict>
            <key>CFBundleTypeRole</key>
            <string>Editor</string>
            <key>CFBundleURLSchemes</key>
            <array>
                <string>mj.coffee.app</string>
            </array>
        </dict>
    </array>
...
```

You can now run both Android and iOS and ensure that the app runs on all devices or simulators with no error:

```bash
flutter run -d all
```

## Setup Auth0

If you already have an account in Auth0 and created your first Tenant, skip this part, but If you don't have an Auth0 account, you need to create a completely free account, and in many cases, the free tier is generous enough for many small applications.

Everything starts with an Auth0 tenant. Once you create your account, you will need to create a tenant where you configure your use of Auth0. You may follow this link [create-tenants](https://auth0.com/docs/get-started/create-tenants) to obtain your Tenant or you can watch on it [this video](https://www.youtube.com/playlist?list=PLCOnzDflrUceRLfHEkl-u2ipjsre6ZwjV).

After creating an Auth0 account and Tenant, follow the steps below to set up an application:

- Go to the Applications section of your dashboard.
- Click on the "Create Application" button.
- Enter a name for your application (e.g., "MJ Coffee Flutter Application").
- Select Native as the application type and click the Create button.

![Create Auth0 Application](./2021-07-11-serverless-authentication-authorization-for-flutter-assets/auth0-create-application.png)

Once you are in the application, go to the Connections tab and ensure that you have at least one Connection enabled, typically a `Username-Password-Authentication` database. You can, and you will add a social connection slater to this application too.

![Connections in Auth0](./2021-07-11-serverless-authentication-authorization-for-flutter-assets/connections.png)

Then head back to the Settings tab. You can find all information, including client ID, client secret, domain(Tenant), etc.

![Basic info auth0](./2021-07-11-serverless-authentication-authorization-for-flutter-assets/settings-basic-auth0.png)

You need to add your callback URLs to the Allowed Callback URLs under Application URIs.

![Allowed callback URLs](./2021-07-11-serverless-authentication-authorization-for-flutter-assets/allowed-callback-urls.png)

You will need to copy the domain and client ID to your Flutter application; either you can create constant variables, or you can pass them via Dart define to the environment. I suggest you supply the sensitive information by `--dart-define` arguments.

You command in terminal will look like:

```bash
flutter run -d all --dart-define=AUTH0_DOMAIN=[YOUR DOMAIN] --dart-define=AUTH0_CLIENT_ID=[YOUR CLIENT ID]
```

But, you can also add the args to your editor of choice; for example, in VsCode, you can pass additional `--dart-define` values in the args field of your launch configuration (`launch.json`):

```json
"configurations": [
  {
    "name": "Flutter",
    "request": "launch",
    "flutterMode": "debug",
    "type": "dart",
    "args": [
      "--dart-define",
      "AUTH0_DOMAIN=MY_VALUE",
      "--dart-define",
      "AUTH0_CLIENT_ID=MY_OTHER_VALUE"
    ]
  }
]
```

Then define all variables in your `constants.dart` file.

```dart
// constants.dart
...

const AUTH0_DOMAIN = String.fromEnvironment('AUTH0_DOMAIN');
const AUTH0_CLIENT_ID = String.fromEnvironment('AUTH0_CLIENT_ID');
const AUTH0_ISSUER = 'https://$AUTH0_DOMAIN';
const BUNDLE_IDENTIFIER = 'mj.coffee.app';
const AUTH0_REDIRECT_URI = '$BUNDLE_IDENTIFIER://login-callback';

...
```

Notice that you only need the domain and Client ID because the authorization Code Grant flow with PKCE does not require a Client Secret.Then create a top-level domain for your tenant, which is called the issuer. You could have several tenants which can be configured.

As mentioned earlier, you need to create your redirect URI based on your bundle identifier, which you have added to the "Allowed Callback URLs" list. However, it would be best to keep in mind that the bundler identifier, the scheme part of the redirect URL, must match `appAuthRedirectScheme` in Android and `CFBundleURLSchemes` iOS and they must be all in lowercase.

![Allowed callback URLs](./2021-07-11-serverless-authentication-authorization-for-flutter-assets/allowed-callback-urls.png)

## Integrate Auth0 with Flutter

Since Auth0 is a standard OAuth 2.0 authorization server, you can utilize any standard OAuth or OIDC SDK to authenticate against Auth0. One of them is `flutter_appauth` which is a wrapper around `AppAuth` Native SDK that you will need to integrate into your application.

Open `auth_service.dart` file and instantiate `FlutterAppAuth` and `FlutterSecureStorage`.

```dart
// auth_service.dart

class AuthService {
  static final AuthService instance = AuthService._internal();
  factory AuthService() => instance;
  AuthService._internal();

  final FlutterAppAuth appAuth = FlutterAppAuth();
  final FlutterSecureStorage secureStorage = const FlutterSecureStorage();

}
```

`AppAuth` supports three methods to configure your endpoints. You should pass the discovery URL as a parameter to AppAuth methods.

As mentioned, OpenID Connect introduces Discovery as a standard way to discover authorization server endpoints in JSON documents. In Auth0, you can find the discovery document at the `/.well-known/openid-configuration` endpoint of your tenant address.

For this demo, that's `https://YOUR-AUTH0-TENANT-NAME.auth0.com/.well-known/openid-configuration`, including the `issuer`, `authorization_endpoint`, `token_endpoint`, `userinfo_endpoint`, `scopes_supported` and more. If you watch [my videos](https://www.youtube.com/playlist?list=PLCOnzDflrUceRLfHEkl-u2ipjsre6ZwjV), you will see an example of a discovery URL.

You can also pass the top-level domain name (i.e., issuer) as a parameter conveniently. AppAuth will figure out internally how to fetches the discovery documents and where to send subsequent requests.

Let's create a login method in our `AuthService` to construct the `AuthorizationTokenRequest`.

```dart
// auth_service.dart

  login() async {
      final authorizationTokenRequest = AuthorizationTokenRequest(
        AUTH0_CLIENT_ID, AUTH0_REDIRECT_URI,
        issuer: AUTH0_ISSUER,
        scopes: ['openid', 'profile', 'offline_access', 'email'],
      );
      final AuthorizationTokenResponse? result =
          await appAuth.authorizeAndExchangeCode(
        authorizationTokenRequest,
      );
      print(result);
  }
```

To construct the request, you can create `AuthorizationTokenRequest` object by passing mandatory `clientID` and `redirectUrl` parameters and correspond to the `AUTH0_CLIENT_ID`, `AUTH0_REDIRECT_URI`, respectively and define `issuer` to enable the endpoints discovery.

It would be best if you defined `scopes,` so when the user allows them, you can perform actions on behalf of the user. Here are some of the scopes that we have requested:

- `openid`: Perform an OpenID connect sign-in,
- `profile`: Retrieve user profile,
- `offline_access`: Retrieve a refresh token for `offline_access` from the application.
- `email`: Retrieve users email
- and anything else that you might want to add, you will add more scopes later in this article series.

Once the request is constructed, a sign-in transaction will start by calling `appAuth.authorizeAndExchangeCode()`.

Then the authentication process will start, and upon completion user will return to the application with the `AuthorizationTokenResponse` contains `accessToken`, `IdToken`, `refreshToken` as follows:

```dart
AuthorizationTokenResponse(
    String? accessToken,
    String? refreshToken,
    DateTime? accessTokenExpirationDateTime,
    String? idToken,
    String? tokenType,
    this.authorizationAdditionalParameters,
    Map<String, dynamic>? tokenAdditionalParameters,
  )
```

You can use `accessToken` to request APIs. However, that is opaque to the client. `AccessToken` usually has a short time to live. There are different methods to keep it alive for a more extended period, but one way to use refresh tokens is to re-authenticate your users whenever they launch the app. Hence, If there is any refresh token available, you can silently use it to get a new access token. So, it would be best if you stored refresh tokens very securely alongside the application.

So, I recommend defining a constant key for your refresh token and added it to your `constants.dart` file.

```dart
// constants.dart

...
const REFRESH_TOKEN_KEY = 'refresh_token';
...
```

On the other hand, `AppAuth` SDK validates `idToken` as part of OpenID Connect clients' responsibility; Then the only thing you should do is to decode the body to receive the JSON payload.

First, let's create `Auth0IdToken` model in `auth0_id_token.dart` file as follows:

```dart
// auth0_id_token.dart

import 'package:json_annotation/json_annotation.dart';
part 'auth0_id_token.g.dart';

@JsonSerializable()
class Auth0IdToken {
  Auth0IdToken({
    required this.nickname,
    required this.name,
    required this.email,
    required this.picture,
    required this.updatedAt,
    required this.iss,
    required this.sub,
    required this.aud,
    required this.iat,
    required this.exp,
    this.authTime,
  });

  final String nickname;
  final String name;
  final String picture;

  @JsonKey(name: 'updated_at')
  final String updatedAt;

  final String iss;

 // userID getter to understand it easier
  String get userId => sub;
  final String sub;

  final String aud;
  final String email;
  final int iat;
  final int exp;

  @JsonKey(name: 'auth_time')
  final int? authTime; // this might be null for the first time login

  factory Auth0IdToken.fromJson(Map<String, dynamic> json) =>
      _$Auth0IdTokenFromJson(json);

  Map<String, dynamic> toJson() => _$Auth0IdTokenToJson(this);
}
```

Notice that the `sub` value is a unique identifier, or in other word, it is the userId.

Then run the following command to build your generated model.

```bash
flutter pub run build_runner build --delete-conflicting-outputs
```

Once model is ready, you can implement `parseIdToken()` method in `AuthService` class as follows:

```dart
// auth_service.dart

Auth0IdToken parseIdToken(String idToken) {
    final parts = idToken.split(r'.');
    assert(parts.length == 3);

    final Map<String, dynamic> json = jsonDecode(
      utf8.decode(
        base64Url.decode(
          base64Url.normalize(parts[1]),
        ),
      ),
    );

    return Auth0IdToken.fromJson(json);
  }
```

Now that you have successfully managed JWT and have accessToken, you can get user information. The standard OpenID Connect user details endpoint is `https:.//[AUTH0_DOMAIN]/userinfo`. Let's create another model `Auth0User` so that we can deserialize and serialize receiving body from the `userinfo` endpoint. First create a file `auth0_user.dart`, then:

```dart
// auth0_user.dart

import 'package:json_annotation/json_annotation.dart';
part 'auth0_user.g.dart';

@JsonSerializable()
class Auth0User {
  Auth0User({
    required this.nickname,
    required this.name,
    required this.email,
    required this.picture,
    required this.updatedAt,
    required this.sub,
  });
  final String nickname;
  final String name;
  final String picture;

  @JsonKey(name: 'updated_at')
  final String updatedAt;

 // userID getter to understand it easier
  String get id => sub;
  final String sub;

  final String email;

  factory Auth0User.fromJson(Map<String, dynamic> json) =>
      _$Auth0UserFromJson(json);

  Map<String, dynamic> toJson() => _$Auth0UserToJson(this);
}
```

Then run the following command to build your generated model.

```bash
flutter pub run build_runner build --delete-conflicting-outputs
```

Once model is ready, let's create our `getUserDetails()` method as follow:

```dart
// auth_service.dart

 Future<Auth0User> getUserDetails(String accessToken) async {
    final url = Uri.https(
      AUTH0_DOMAIN,
      '/userinfo',
    );

    final response = await http.get(
      url,
      headers: {'Authorization': 'Bearer $accessToken'},
    );

    print('getUserDetails ${response.body}');

    if (response.statusCode == 200) {
      return Auth0User.fromJson(jsonDecode(response.body));
    } else {
      throw Exception('Failed to get user details');
    }
  }
```

Do not forget to import `http` on top of the file.

```dart
import 'package:http/http.dart' as http;
```

Since you will need to reuse `idToken`, `profile`, and `accessToken` throughout the application, it would be nice to store their values into local variables to access them easily.

```dart
// auth_service.dart

class AuthService {
  ...
  Auth0User? profile;
  Auth0IdToken? idToken;
  String? auth0AccessToken;
  ...
}
```

You can create a simple method `_setLocalVariables()` to handle an appropriate logic to store these local variables:

```dart
//auth_service.dart

Future<String> _setLocalVariables(result) async {
    final bool isValidResult =
        result != null && result.accessToken != null && result.idToken != null;

    if (isValidResult) {
      auth0AccessToken = result.accessToken;
      idToken = parseIdToken(result.idToken!);
      profile = await getUserDetails(result.accessToken!);

     if (result.refreshToken != null) {
        await secureStorage.write(
          key: REFRESH_TOKEN_KEY,
          value: result.refreshToken,
        );
      }

      return 'Success';
    } else {
      return 'Something is Wrong!';
    }
  }
```

Let's review this function. First, make sure if all tokens are available, then assign the value of each to the local variable. Write your refresh token securely via secure storage and then return an appropriate string response.

You can now update your `login()` method and return a successful response.

```dart
// auth_service.dart

Future<String> login() async {
    try {
      final authorizationTokenRequest = AuthorizationTokenRequest(
        AUTH0_CLIENT_ID,
        AUTH0_REDIRECT_URI,
        issuer: AUTH0_ISSUER,
        scopes: ['openid', 'profile', 'offline_access', 'email'],
      );

      final AuthorizationTokenResponse? result =
          await appAuth.authorizeAndExchangeCode(
        authorizationTokenRequest,
      );

      return await _setLocalVariables(result);
    } on PlatformException {
      return 'User has cancelled or no internet!';
    } catch (e) {
      return 'Unkown Error!';
    }
  }

```

To handle errors better, you can catch any exceptions and return a specific response based on that.

The only missing part now is to handle the authentication state when an app is in the initial state. You might want to be able to silently login and retrieve a new `accessToken` if `refreshToken` exists.

Let's create the `init()` method in `AuthService` class as follow:

```dart
// auth_service.dart


  Future<bool> init() async {
    final storedRefreshToken = await secureStorage.read(key: REFRESH_TOKEN_KEY);

    if (storedRefreshToken == null) {
      return false;
    }

    try {
      final TokenResponse? result = await appAuth.token(
        TokenRequest(
          AUTH0_CLIENT_ID,
          AUTH0_REDIRECT_URI,
          issuer: AUTH0_ISSUER,
          refreshToken: storedRefreshToken,
        ),
      );
      final String setResult = await _setLocalVariables(result);
      return setResult == 'Success';
    } catch (e, s) {
      print('error on refresh token: $e - stack: $s');
      // logOut() possibly
      return false;
    }
  }
```

As you can see

- You can read `refreshToken` from secure storage.
- Then you can if it exists.
- Then try to get a new token, passing the `TokenRequest` object to `appAuth.token()`, including the existing `refreshToken`
- Set all new local variables that you have already defined
- Finally, return an appropriate response value.

Now that you have both login and initial action methods, you can implement them on your screen and set the proper state.

Locate `initState()` and Login / Register button in `HomeScreen` class (`home.dart`).

```dart
//home.dart

class _HomeScreenState extends State<HomeScreen> {
  bool isProgressing = false;
  bool isLoggedIn = false;
  String errorMessage = '';
  String? name;

  @override
  void initState() {
    initAction();
    super.initState();
  }
 @override
  Widget build(BuildContext context) {
  ...
  Row(
    mainAxisAlignment: MainAxisAlignment.center,
    children: <Widget>[
      if (isProgressing)
        CircularProgressIndicator()
      else if (!isLoggedIn)
        CommonButton(
          onPressed: loginAction,
          text: 'Login | Register',
        )
      else
        Text('Welcome $name'),
    ],
  ),
  if (errorMessage.isNotEmpty) Text(errorMessage),
  ...
}
```

Steps completed as follow:

- Call `initAction()` on initiate to handle existing token and refresh token.
- When the user is logged in successfully, a welcome message is shown along with the name. Otherwise, we show the login button with the `loginAction` handler.
- In case of error, an error message can be shown.
- A loading indicator will appear if the login is in progress.

Let's look at each method that you have called in the widget above.

```dart
//home.dart

class _HomeScreenState extends State<HomeScreen> {
...
setSuccessAuthState() {
    setState(() {
      isProgressing = false;
      isLoggedIn = true;
      name = AuthService.instance.idToken?.name;
    });

    CoffeeRouter.instance.push(MenuScreen.route());
  }

  setLoadingState() {
    setState(() {
      isProgressing = true;
      errorMessage = '';
    });
  }

  Future<void> loginAction() async {
    setLoadingState();
    final message = await AuthService.instance.login();
    if (message == 'Success') {
      setSuccessAuthState();
    } else {
      setState(() {
        isProgressing = false;
        errorMessage = message;
      });
    }
  }
initAction() async {
    setLoadingState();
    final bool isAuth = await AuthService.instance.init();
    if (isAuth) {
      setSuccessAuthState();
    } else {
      setState(() {
        isProgressing = false;
      });
    }
  }
  ...
}
```

In `initAction`, you can call `AuthService.instance.init()` that you have defined in `AuthService` class, and in `loginAction`, you can call `AuthService.instance.login()`.

In each method, we call `setSuccessAuthState()`, which is technically setting local variables appropriately and redirecting the user to the proper screen on the page. In case of failure, you can adequately set a local error message to show the user about the recent error message.

You have done a great job of getting to the final stage. It is time to check what you have achieved so far. Make sure your emulators or real devices are ready to test and then stop your applications and run it again.

```bash
flutter run -d all --dart-define=AUTH0_DOMAIN=[YOUR DOMAIN] --dart-define=AUTH0_CLIENT_ID=[YOUR CLIENT ID]
```

Once the app is loaded, tap on the "Login / Register" button.

On iOS, you will see a consent prompt for the first time, expected due to the `ASWebAuthenticationSession` implementation, notifying the user that the application intends to run system browser SSO to process the login.

![Allowed callback URLs](./2021-07-11-serverless-authentication-authorization-for-flutter-assets/ASWebAuthenticationSession.png)

If all goes well, you will see the Auth0 Universal Login page. Note that you can design this page or even choose other templates in the Auth0 dashboard. [You may watch the video to learn more about the theming of the login page in Auth0](https://www.youtube.com/playlist?list=PLCOnzDflrUceRLfHEkl-u2ipjsre6ZwjV).

![Allowed callback URLs](./2021-07-11-serverless-authentication-authorization-for-flutter-assets/auth0-login.png)

Once you successfully finalize the login progress, you will be redirected to the application, and you're name will appear, and you'll redirect to the menu screen as part of the success state handler.

> After signing up for the first time, you may receive an email verification from Auth0 for your application.

To ensure your refresh token works, you can simply terminate your application and reopen it again. Once you return to the app, the application will look for `refreshToken` and get new `accessToken` and `idToken`. Then, it will take you straight to the menu screen without asking for your credentials or showing your login process.

## Simple logout

Every login requires a logout logic too. Logout is more complicated than it looks. There are typically three-session layers you need to consider:

- **Application Session Layer:** The first layer is the session inside your application.
- **Auth0 Session Layer:** Auth0 also maintains a session for the user and stores their information inside a cookie or other ways.
- **Identity Provider Session Layer:** The last session layer is the identity provider layer (for example, Facebook or Google).

After users log out, you can redirect users to a specific URL. You need to register the redirect URL in your tenant or application settings.

However, OIDC comes with `prompt` parameter in the request, making it easier to clear sessions.

There are four options as of standard:

- **none:** Do not display any authentication or consent user interface pages.
- **login:** Ignore any existing session and force end-user to interactive login prompt.
- **consent:** Showing consent before returning information to the app.
- **select_account:** Showing a prompt to select a user account in case the user has multiple accounts.

Luckily, that is supported in `AppAuth` SDK. Locate `login()` method where you have constructed `AuthorizationTokenRequest` and add your prompt values:

```dart
// auth_service.dart

final authorizationTokenRequest = AuthorizationTokenRequest(
        AUTH0_CLIENT_ID, AUTH0_REDIRECT_URI,
        issuer: AUTH0_ISSUER,
        scopes: ['openid', 'profile', 'offline_access', 'email'],
        promptValues: [
          'login'
        ],
      );

```

Although this will invalidate the Auth0 session, we still need to clear our application session by removing the `refresh_token` key. Hence, you can implement a logout method.

```dart
// auth_service.dart

class AuthService {
...

 Future<void> logout() async {
    await secureStorage.delete(key: REFRESH_TOKEN_KEY);
  }

...
}
```

By deleting the refresh token from secure storage, users tap on the login button; they will need to interact with a login prompt. On the next load, since the refresh token is missing. Then, user will redirect to the home screen to see the login button.

While this is sufficient for the MJ Coffee app, I would like to mention that you can also manually call logout endpoints and pass necessary params.

```dart
// Example:

Future<bool> logout() async {
  await secureStorage.delete(key: REFRESH_TOKEN_KEY);

  final url = Uri.https(
      AUTH0_DOMAIN,
      '/v2/logout',
      {
        'client_id': AUTH0_CLIENT_ID,
        'federated': '',
        //'returnTo': 'YOU_RETURN_LOGOUT_URL'
      },
    );

    final response = await http.get(
      url,
      headers: {'Authorization': 'Bearer $auth0AccessToken'},
    );

    print(
      'logout: ${response.request} ${response.statusCode} ${response.body}',
    );

    return response.statusCode == 200;
}

```

For more information, you can read [https://auth0.com/docs/logout](https://auth0.com/docs/logout)

To implement that logout button, go to `ProfileScreen` and locate `logout` button and on `onPressed`, call `logout` on `AuthService` instance and redirect user to `HomeScreen`.

```dart
// profile.dart

class ProfileScreen extends StatelessWidget {

  ...
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 30),
          child: CommonButton(
            onPressed: () async {
              await AuthService.instance.logout();
              CoffeeRouter.instance.pushReplacement(HomeScreen.route());
            },
            text: 'Logout',
          ),
        ),
  ...
}
```

Lastly, restart your application, go to profile and logout. Next time you refresh your app, it will show home screen and you have to login again.

## Moving Forward

In the next article, you will learn more about `Refresh token rotation`, and how to manage your Auth0 accounts branding, roles and how to add social connections such as Apple and Google.

# Serverless Authentication and Authorization for Flutter - Part 3 - Social logins

In the previous article you have learned to implement Auth0 in Flutter. The authentication flow with username and password was in place and you managed refresh token.

In this Article, you will learn more about `Refresh Token Rotation` and how you can connect social logins to your application. You will also learn about managing your Auth0 account.

## Add Refresh Token Rotation

We have seen that by adding `offline_access`, Auth0 will issue a refresh token that you must store securely in the device storage for your application.

While this enhances user experience in mobile applications, we can introduce risk as the refresh token is long-lived and technically by having them, the login and exchange can perform to retrieve access token forever.

Therefore, I highly recommend enabling Refresh Token Rotation and Automatic Reuse Detection to help mitigate this risk, especially in the production environment.

Navigate to your application settings in the Auth0 dashboard and enable Refresh Token Rotation.

Auth0 recommends that you issue a refresh token that expires after a preset lifetime. The refresh token expiration lifetime can be extended each time the refresh token is used to get a new access token or refresh token/access token pair.

![Refresh token rotation](./2021-07-11-serverless-authentication-authorization-for-flutter-assets/refresh_token_rotation.png)

Generally:

- **Absolute Lifetime:** Set a refresh token or refresh token family lifetime, after which the user must re-authenticate before being issued a new access token. If you disable this setting, the absolute lifetime will be indefinite.
- **Inactivity Lifetime:** Set the inactivity lifetime of issued refresh tokens to expire if the user is not active in your application during a specified period.

## Social Logins

These days, it's pretty common to have multiple login methods, from passwordless to several social media login buttons, which will significantly enhance your user experiences.

While adding federated solutions is excellent, implementing each of them and adding them to your authorization server is significantly time-consuming and will come with many considerations and risks.

Luckily, Auth0 provides lots of integration across well-known third parties, and even it allows you to write your custom connection.

Let's add both Google and Apple connection. First, Navigate to Authentication and then Social tab in Auth0 dashboard .

![Social connection](./2021-07-11-serverless-authentication-authorization-for-flutter-assets/social-connections.png)

### Google

Click on "Create Connection" and select Google. You may leave all fields empty if you want to test in a Development environment except that you have to enter a "Name" for this connection.

However, do not forget to obtain a Client ID and Secret ([doc](https://auth0.com/docs/connections/social/google)) for production apps and allow your mobile client IDs. I will cover the production-ready requirements in another video or article.

![Google Dev](./2021-07-11-serverless-authentication-authorization-for-flutter-assets/google-dev.png)

You may also set more permissions where end-user will need to approve while the authorization contest is progressing. These permissions depend on your application and what you want to do on behalf of the user. MJ Coffee app does not need any extra permission except the basic and extended profile.

![Google Permission](./2021-07-11-serverless-authentication-authorization-for-flutter-assets/google-permissions.png)

Make sure, you sync user profile attributes at each login and hit the save button.

### Apple

Click on "Create Connection", and this time, select Apple. Specify your connection name. You may leave Client ID and Secret Signing Key empty for development purposes and environment; however, you need to obtain proper keys ([doc](https://auth0.com/docs/connections/apple-siwa/set-up-apple)) in production.

![Google Permission](./2021-07-11-serverless-authentication-authorization-for-flutter-assets/apple-dev.png)

To get your Apple Team ID and a Key ID, you need to have a registered app in your Apple Developer Account. Sign in to your Apple Developer Account, and go to the Membership page and make a note of your Team ID.

If you have a registered app skip to Create service ID, but if you don't have an app yet, follow the steps below:

- On the Apple Developer Portal, go to **Certificates, IDs, & Profiles > Identifiers** and click the **blue plus icon** next to **Identifiers** to create a new App ID.
- Choose **App IDs** as the identifier type and click **Continue**.
- Provide a description and a Bundle ID (reverse-domain name style, e.g., mj.coffee.app).
- Scroll down and check **Sign In with Apple**.
- Click **Continue**, and then click **Register**.

Create Service ID:

- Return to the **Certificates, IDs, & Profiles** section, and select the **blue plus icon** next to **Identifiers**.
- Choose **Services IDs**, and select **Continue**. Fill in the description and identifier (mj.coffee.app).
- After checking **Sign In with Apple**, select **Configure**, and define your Web Domain (mjcoffee.app) and your "Return URL". Ensure that your Return URL is your Auth0 domain and follows this format: `https://YOUR_AUTH0_DOMAIN/login/callback`.

![Return URL apple sign in](./2021-07-11-serverless-authentication-authorization-for-flutter-assets/callback-apple.png)

- Finally, save, Continue and then register the service.

#### Set up your Client Secret Signing Key

- Go to **Keys** under the **Certificates, Identifiers, & Profiles** section of your Apple developer dashboard.
- Select the **blue plus icon** to add a new key.
- Enter a **Key Name** and check the **Sign In with Apple** option.
- Select **Configure** to make sure the **Choose a Primary App ID** field is filled with the correct App ID.
- Select **Save, Continue**, and then **Register**.
- On the page to which you're redirected after registering, make a note of the Key ID. Then download the key; it will have a .p8 extension.

Head back to your Apple social connection settings and paste the Key ID.Ensure the proper attributes are selected (Name, Email) and sync user profile at each login is enabled. Hit save changes.

## Enable Social connection

Once you have created all social connections and set them up correctly, You can go back to your applications and, under the connections tab, enable as many social connections as you want.

![app social connections](./2021-07-11-serverless-authentication-authorization-for-flutter-assets/app-social-connections.png)

Auth0 aims to simplify the process as you can see how simple and powerful you can add or remove social connections to your application.

Perfect, I have good news. You do not need to implement anything in your Flutter application! Restart your application and force log out and try to log in.

![app social connections](./2021-07-11-serverless-authentication-authorization-for-flutter-assets/social-buttons-flutter.png)

That's it! You can see social login buttons and the whole login flow, ready to use in your application for your end-user.

## Branding in Auth0

Having a customized and beautiful login page is usually common for any application using Auth0 in production. Auth0 allows you to customize your login page by providing different functionalities and options. You can change the look and feel of the page by adding colors and logos and customize all email templates, texts, and even changing your email provider.

![Auth0 branding](./2021-07-11-serverless-authentication-authorization-for-flutter-assets/branding.png)

Navigate to the Branding section in the Auth0 dashboard and set it up based on your app design requirements. For example, You can select new experience for the MJ Coffee app.

### Add Roles

You may want to provide certain functionalities based on the user roles. Having a proper authorization server such as Auth0 can facilitate adding roles and assigning permissions (scopes) and their usages. In the MJ Coffee app, you can consider three different roles:

- **Admin:** They will have access to all functionalities, full permission.
- **Customer:** Default role for registered or logged-in users, accessing certain features. E.g., support screen, read and edit own chat message. You will automatically assign this role to all users upon registration or login; you will lean how to do this in Auth0 later in the article.
- **Employee:** Shop employees who can access the community screen to answer support chat, read, edit and delete chat messages, upload files, etc.

![Auth0 roles](./2021-07-11-serverless-authentication-authorization-for-flutter-assets/roles.png)

You may add more roles based on your app.

## User Management in Auth0

By default, Auth0 will provide the infrastructure to store users on their cloud database.

For the MJ Coffee app, the cloud database provided by Auth0 is sufficient as one of our goals is to reduce the cost of extra infrastructure maintenance and cost.
You can access users under User Management. You can create a user directly and manage your existing users by changing details, adding permissions and roles, or revoking their access.

![Auth0 users](./2021-07-11-serverless-authentication-authorization-for-flutter-assets/users.png)

If you open any users, you will see that Auth0 providers more functionalities and features, including details of the user, connected devices, and history logs which might be pretty helpful for debugging and investigation and their application access, permissions, and roles.

![Auth0 user roles](./2021-07-11-serverless-authentication-authorization-for-flutter-assets/user-roles.png)

You can extend user details by adding user_metadata or manipulating `app_metadata`, which helps to provide more information to the Flutter application while receiving user details.

## Moving forward

In the next article, you will learn how to add a real-time chat to your Flutter application and you will implement it in MJ Coffee app.

# Serverless Authentication and Authorization for Flutter - Part 4 - Real-time chat

In the previous articles, you have learn a lot about authentication and you have implemented it in MJ coffee app. from This article, we will focus more on authorization. Let's first start a real-time chat to your application so that later we can see how we can integrate this chat with Auth0 and limit its functionalities and UIs based on roles and permission.

## Add real-time Chat to the Flutter application

Having a real-time chat service in the MJ Coffee app can significantly improve how fast users can communicate with our customer service or employees. Having looked around, I found [Get Stream chat](https://getstream.io), an exciting service with a solid Flutter SDK that I can integrate quickly, easily, and customize within a few minutes.

### Install dependencies

GetStream chat comes with several SDKs that can be used in Dart or Flutter applications. However, they also provide one fully-fledged package which comes with all features and a beautiful theme and provides enough API so you can customize it as much as you wish.

Open the `pubspec.yaml` file and add `stream_chat_flutter` to your dependencies.

```yaml
// pubspec.yaml

dependencies:
  .....
  stream_chat_flutter: ^2.0.0
  ....
```

I recommend using a version bigger than two where is fully compatible with Flutter 2 and null-safety.

> you do not need to do anything extra for Android however, you may need to add certain permissions to iOS. The library uses flutter file picker plugin to pick files from the os. Follow this wiki to fulfill iOS requirements. They also use video_player to reproduce videos. Follow this guide to fulfill the requirements. To pick images from the camera, they use the image_picker plugin. Follow these instructions to check the requirements. [Read more here](https://pub.dev/packages/stream_chat_flutter)

Do not forget `flutter pub get` in the terminal or `Pub get` in your IDE.

### Create a Stream account and app

Before you can integrate chat to your app, you must have an account and app in [getstream.io](https://getstream.io). [Create your account](https://getstream.io/accounts/signup/) and go to the dashboard.

![get stream dashboard](./2021-07-11-serverless-authentication-authorization-for-flutter-assets/getstream-dashboard.png)

Tap on the `create App` button, then follow the steps:

- Write a name for your app, e.g., MJCoffee
- Select closest feeds server location, e.g., EU west
- Select closest Chat server location, e.g., EU west
- Select your environment. Usually, it's a good idea to separate apps for production and development. In this article, we focus on production.

![get stream app](./2021-07-11-serverless-authentication-authorization-for-flutter-assets/stream-app.png)

Once your app is ready, take a note of your key. Notice that you will need a secret key to sign user ID and get a production user token to connect users. You will lean how to do that with Auth0 Action.

I recommend passing the sensitive data and keys with `--dart-define` via the command line or adding to your editor or IDE run command.

You have already define two keys so your command will become:

```bash
flutter run -d all --dart-define=AUTH0_DOMAIN=[YOUR DOMAIN] --dart-define=AUTH0_CLIENT_ID=[YOUR CLIENT ID] --dart-define=STREAM_API_KEY=[YOUR KEY]
```

Then define the new variable in your `constants.dart` file.

```dart
const STREAM_API_KEY = String.fromEnvironment('STREAM_API_KEY');
```

### Integrate chat with Flutter application

Let's start by creating a new `StreamChatClient` in the `ChatService` singleton class. There are three essential considerations that you need to take into account:

- 1- initializing the Dart API client with your API Key
- 2- Set current user
- 3- Pass the client to the top-level StreamChat widget

Open `chat_service.dart` and initialize `StreamChatClient` as follow:

```dart
// chart_service.dart

class ChatService {
  static final ChatService instance = ChatService._internal();
  factory ChatService() => instance;
  ChatService._internal();

  final StreamChatClient client = StreamChatClient(
    STREAM_API_KEY,
    logLevel: isInDebugMode ? Level.INFO : Level.OFF,
  );

}
```

The only required positional parameter is `STREAM_API_KEY`, but you have more options to configure your client. For instance, it might be pretty helpful to see all the logs during debugging so that's why you can set logLevel for your client.

Now that the client is created, you need to ensure that your current user is connected appropriately.

```dart
//chart_server.dart

class ChatService {
....
  Future<Auth0User> connectUser(Auth0User? user) async {
    if (user == null) {
      throw Exception('User was not received');
    }
    await client.connectUser(
      User(
        id: user.id,
        extraData: {
          'image': user.picture,
          'name': user.name,
        },
      ),
      // To be replaced with PRODUCTION TOKEN for user
      client.devToken(user.id).rawValue,
    );
    return user;
  }
....
}
```

The `connectUser()` method on `ChatService` will handle the logic for connecting the current user. It accepts an `Auth0User` object, and if it's not presented, that means the authentication perhaps has failed, and you should not connect any user to the chat.

Locate `setSuccessAuthState` on `HomeScreen` and add:

```dart
// home.dart

...
  setSuccessAuthState() {
    setState(() {
      isProgressing = false;
      isLoggedIn = true;
      name = AuthService.instance.idToken?.name;
    });

    ChatService.instance.connectUser(AuthService.instance.profile);
    CoffeeRouter.instance.push(MenuScreen.route());
  }...
```

You need to pass two required positional parameters, the `User` object with a defined user ID and user token, a signed and encrypted hash string. Typically, the user token should be generated on a back-end server to store the mentioned secret key and sign and get the token. You'll learn how Auth0 can handle that as your backend.

To continue, you need to get a development token, pass `user.id` to the `devToken()` method on the chat client, and get the `rawValue` which is the token string. To ensure that `devToken` works, You need to disable auth checks in the `GetStream` app, chat dashboard.

![get stream dashboard](./2021-07-11-serverless-authentication-authorization-for-flutter-assets/auth-stream-disable.png)

> Make sure to undo the change to authentication for production app, once you have a proper method to receive production-token

Finally, Stream chat UI components will consume extra data provided while connecting a user. For example, you may create a `Map` containing user image and name, so they appear automatically and beautifully throughout the chat widget.

> At the time of writing this article, GetStream does not accept Auth0 userId format which includes `|` between Auth source and user hash id. Therefore, you need to change `id` on `Auth0User` model to `String get id => sub.split('|').join('');`

The next and final step is to make `StreamChat`, the root widget of the application.

Locate `MaterialApp` in `main.dart` file and add `builder` to return `StreamChat`.

```dart
//main.dart

MaterialApp(
        debugShowCheckedModeBanner: false,
        themeMode: ThemeMode.system,
        home: HomeScreen(),
        navigatorKey: CoffeeRouter.instance.navigatorKey,
        theme: getTheme(),
        builder: (context, child) {
          return StreamChat(
            child: child,
            client: ChatService.instance.client,
          );
        },
      ),
    );

```

`StreamChat` is an inherited widget and aims to provide APIs for building advanced customization. `StreamChat` requires a child and a client that you have initialized in the `ChatService` class.

That's it! Your chat is ready, restart the app, and let's continue to add the support screen and community screen with the prebuilt `StreamChat` UI widget to leverage the chat service you added to the MJ Coffee.

### Implement support chat screen

Typically, a support chat consists of a user and an agent in a particular channel that can create between both of them. Hence, This is precisely what the support chat screen will do following the steps:

- Create a private channel between the current user and one of the available employees (agent)
- Listen to the channel for the updates
- Load existing chat content if any
- Upon chat compilation, archiving the chat history

Let's create `createSupportChat` method in `ChatService` class.

```dart
// chart_server.dart

class ChatService {
...
  String? _currentChannelId;

  Future<Channel> createSupportChat() async {
    // To be replaced with EmployeeRole via Auth0
    final String employeeId = 'rootEmployeeId';
    final channel = client.channel(
      'support',
      id: _currentChannelId,
      extraData: {
        'name': 'MJCoffee Support',
        'members': [
          employeeId,
          client.state.user!.id,
        ]
      },
    );
    await channel.watch();
    _currentChannelId = channel.id;
    return channel;
  }
...
}
```

A lot is going on here. Let's review step by step.

First, to create a support chat channel with the current user, you should know an available employee id. You will learn how to create an API to get an available employee via Auth0 based on their roles. However, for now, we will skip this part.

Second, you need to create a channel with a specific type, in this case, `support`.

`GetStream` provides default types; however, you can define your types if you need. To create a channel type, navigate to the `GetStream` dashboard, go to your app in the Chat overview tab, and add your channel types to the list.

![stream channel types](./2021-07-11-serverless-authentication-authorization-for-flutter-assets/streamchat_type.png)

![New stream channel type](./2021-07-11-serverless-authentication-authorization-for-flutter-assets/chat_type.png)

Next, you can pass an existing channel Id, which helps reconnect to the channel or leave it `null` if this is a new channel. The `GetStream` will assign an ID automatically to new channels. As this support chat is private between one employee and a current user, you may add IDs to `members` in the `extraData` map.

Then, call the `watch()` method on the channel to create and listen to the events to come through. The `watch` method is a `Future` and will perform asynchronously. You can assign the channel ID to the `_currentChannelId` private local variable for temporary caching to reconnect to the channel at any time that is needed.

However, it might be a good idea to handle the caching to an external database or local secure storage in the app so that you can persist the data.

Finally, you will return the created channel.

Since your method is ready, you can open `SupportChatScreen` class in `support.dart` and implement the chat UI.

```dart
// screens/support.dart

class SupportChatScreen extends StatefulWidget {
  @override
  _SupportChatScreenState createState() => _SupportChatScreenState();
}

class _SupportChatScreenState extends State<SupportChatScreen> {
  Auth0User? profile = AuthService.instance.profile;
  Channel? channel;

  @override
  void initState() {
    super.initState();
    createChannel();
  }

  createChannel() async {
    final _channel = await ChatService.instance.createSupportChat();
    setState(() {
      channel = _channel;
    });
  }

  @override
  Widget build(BuildContext context) {
    return channel == null
        ? Center(
            child: Text('You are int he queue!, please wait...'),
          )
        : Scaffold(
            body: SafeArea(
              child: StreamChannel(
                channel: channel!,
                child: Column(
                  children: <Widget>[
                    Expanded(
                      child: MessageListView(),
                    ),
                    MessageInput(
                      disableAttachments: true,
                      sendButtonLocation: SendButtonLocation.inside,
                      actionsLocation: ActionsLocation.leftInside,
                      showCommandsButton: true,
                    ),
                  ],
                ),
              ),
            ),
          );
  }
}
```

The UI implementation is pretty straightforward as follow:

- This widget is `StatefulWidget`
- The profile variable is the user profile from `AuthService` that you have created in the previous article.
- The channel variable is to detect if a support channel is created.
  `createChannel` method calls `createSupportChat` on `ChatService` that you defined recently
- Once the channel is ready, call `setState` to render chat UI.
- On `build`, you can show a message while the channel is creating or return `StreamChannel`, which provides information about the channel to the widget tree and pass `channel`
- Typically, a child should be a `Column` including `MessageListView()` wrapped by `Expanded` to ensure it takes all available space and `MessageInput()`.
- You can highly customize `MessageInput()`. e.g., disabling attachment buttons or commands buttons. You will learn how to use permissions and roles from Auth0 to do that for the current user later in this article, so stay tuned.

Congratulation! Now let's move on to create community view!

### Implement Community view

You successfully created a support chat between an employee and a user. It's time to make a screen to allow employees see all the messages they receive via support. Let's call this screen `CommunityScreen`.

The `CommunityScreen` implementation will be simple as follow:

```dart
//screens/community.dart

class CommunityScreen extends StatelessWidget {
  final userId = ChatService.instance.client.state.user?.id as Object;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: ChannelsBloc(
        child: ChannelListView(
          filter: Filter.in_(
            'members',
            [userId],// current user is employee (role/permission)
          ),
          sort: [SortOption('last_message_at')],
          pagination: PaginationParams(
            limit: 30,
          ),
          channelWidget: ChannelPage(),
        ),
      ),
    );
  }
}

class ChannelPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: ChannelHeader(),
      body: Column(
        children: <Widget>[
          Expanded(
            child: MessageListView(),
          ),
          MessageInput(),
        ],
      ),
    );
  }
}

```

The logic behind this page is relatively simple. You want to load all channels that the current user, an employee in this context, see and open each channel to answer the customer.

`ChannelsBloc` manages a list of channels with pagination, re-ordering, querying, and other operations associated with channels together with `ChannelListView()`. The `Bloc` is not related to the `Bloc` package or pattern; this is just a coincidence.

First, you need to filter all channels by the membership of the current user. If necessary, do custom sorting and pagination too.

Last, you need to ensure that the `ChannelPage()` is also passed to correctly as it makes channels routable. The `ChannelPage()` is nothing fancy except a straightforward implementation of what you have done already in `SupportScreen`.

Perfect, You have created all screens. However, we still need to implement permissions and roles to load each screen and functionalities based on what we can define and receive via Auth0 tokens. But if you are curious, you can simply add another tab to the `MenuScreen` and load these pages, although, you might not see any channels yet.

Locate `final List<Widget> tabs` in `MenuScreenState` and add:

```dart
// menu.dart

...
  final List<Widget> tabs = [
    MenuList(coffees: coffees),
    SupportChatScreen(),
    ProfileScreen(),
  ];
...
```

and add a new icon to `BottomNavigatorBar`:

```dart
// menu.dart

...
   items: <BottomNavigationBarItem>[
        BottomNavigationBarItem(
          icon: Icon(Icons.list_alt),
          label: "Menu",
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.support),
          label: "Support",
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.person),
          label: "Profile",
        ),
      ],
...
```

Before you can test support chat, you should add `rootEmployeeId` user id that you have defined in `createSupportChat` temporarily in `GetStream` dashboard.

![Custom user in chat](./2021-07-11-serverless-authentication-authorization-for-flutter-assets/chat-custom-user.png)

You can skip this step, however, still this is a good idea to have a root support user in case of any problem retrieving employees, that this user can handle the support chat.

![Custom user in chat](./2021-07-11-serverless-authentication-authorization-for-flutter-assets/custom-user-root.png)

Now, run your app in emulator and go to support chat screen.

> If you encounter an error regarding outdate Kotlin version on Android emulator, you should open `android/app/build.gradle` and modify kotlin version as `ext.kotlin_version = '1.5.10'`

## Auth0 Actions and Generating Stream User Production-Token

Until now, you have used a development-generated token for each user. However, asking for a production token is a requirement before releasing your app.

As I mentioned earlier, retrieving production tokens is usually done in your backend server, which Auth0 can act as one. Auth0 Actions are a potent tool in your hand to handle your logic and put them together in a particular flow. Actions are secure, tenant-specific, versioned functions written in Node.js that execute at specific points during the Auth0 runtime, which can customize and extend Auth0's capabilities with custom logic. You can think of actions as serverless functions, such as AWS Lambda or Google Cloud Functions.

You can determine when and where to execute an Action in the Auth0 runtime environment. Your flows might be:

- **Login:** Executed after a user logs in and when Refresh tokens are issued.
- **Machine to Machine:** Executed after a user logs in and after the Client Credentials hook
- **Pre User Registration:** Executed before a user is added to the database or passwordless connections.
- **Post User Registration:** Executed after a user is added to a Database or Passwordless Connections. The execution is asynchronous and will not affect the transaction.
- **Post Change Password:** Executed after a password is changed for a Database Connection user.
- **Send Phone Message:** Executed when using a Custom MFA provider.

![Actions flow](./2021-07-11-serverless-authentication-authorization-for-flutter-assets/actions-flow.png)

You might have already thought of several use cases for each of these scenarios.

Let's start to create a custom action to exchange `GetStream` Chat production user's token for users after they logged in and hooked it up to the user meta and `idToken` receiving by the Flutter app.

First, You need to create a new action. Go to the Custom Actions menu under Actions in Auth0 Dashboard and hit the "Create" button.

![Create action](./2021-07-11-serverless-authentication-authorization-for-flutter-assets/create-action.png)

You should name your actions and select the trigger from the list and finally create. For sake of generating chat token and attach it to `idToken` you can use `Login / Post login` trigger so can you can use it in `Login` flow.

![Create action trigger](./2021-07-11-serverless-authentication-authorization-for-flutter-assets/create-action-trigger.png)

Then, you'll see an editor that can help you to write your logic. You can run this function, test it out before deploying, add your secrets to the environment instead of hard-coding in the code, and add nearly all public NPM packages.

![ action module](./2021-07-11-serverless-authentication-authorization-for-flutter-assets/action-module.png)

Start by adding the `getstream` npm package. At the time of writing this article, the latest version of the package is `7.2.10`.

![chat app secret](./2021-07-11-serverless-authentication-authorization-for-flutter-assets/chat-app-secret.png)q

Next, Go back to your GetStream dashboard, copy your secret and client keys, and then add them with the name of `GET_STREAM_CHAT_SECRET_KEY` and `GET_STREAM_CHAT_CLIENT_KEY`, respectively, to this function in Auth0.

![ action secrets](./2021-07-11-serverless-authentication-authorization-for-flutter-assets/action-secrets.png)

Lastly, you can import `getStream` and connect and create a user token by passing `user_id`.

```javascript
// Javascript

const stream = require('getstream');

exports.onExecutePostLogin = async (event, api) => {
  const getStreamClient = stream.connect(
    event.secrets.GET_STREAM_CHAT_CLIENT_KEY,
    event.secrets.GET_STREAM_CHAT_SECRET_KEY,
  );
  const getStreamToken = getStreamClient.createUserToken(
    `${event.user.user_id.split('|').join('')}`, // getstream does not support `|` in the ID yet, so we have to omit it.
  );

  // api.user.setAppMetadata("stream_chat_token", getStreamToken);
  // api.user.setUserMetadata("stream_chat_token", getStreamToken);
  const namespace = 'https://getstream.mjcoffee.app';
  if (event.authorization) {
    api.idToken.setCustomClaim(`${namespace}/user_token`, getStreamToken);
    api.accessToken.setCustomClaim(`${namespace}/user_token`, getStreamToken);
  }
};
```

let's explore the implementation above. Once you get the token, you can set a user or app metadata named `stream_chat_token` with the token value, or alternately you set a custom claim on `idToken` and `accessToken`. A custom claim must take the form of a URI. In other words, `https://getstream.mjcoffee.app/user_token` is an acceptable name for a claim, but `user_token` alone is not.

> Important note that in Stream, only `a-z, 0-9, @, \_, and -` in user id are allowed. Therefore, we would omit `|` from user_id in Auth0.

Let's run and test this function before we deploy. Click on the play icon and run with the example event, which is automatically generated for you.

![ action run](./2021-07-11-serverless-authentication-authorization-for-flutter-assets/action-run.png)

If everything goes well, you have a generated token back in JWT format where the payload contains `user_id` and is signed by your secret key and `GetStream` servers.

```javascript
// response in Action run

[
  {
    name: 'https://getstream.mjcoffee.app/user_token',
    target: 'idToken',
    type: 'SetCustomClaim',
    value:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYXV0aDA1ZjdjOGVjN2MzM2M2YzAwNGJiYWZlODIifQ.7ZIyr27skgrGm6REEz5o-WvoCArNblDnwiOdxXW4dp8',
  },
  {
    name: 'https://getstream.mjcoffee.app/user_token',
    target: 'accessToken',
    type: 'SetCustomClaim',
    value:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYXV0aDA1ZjdjOGVjN2MzM2M2YzAwNGJiYWZlODIifQ.7ZIyr27skgrGm6REEz5o-WvoCArNblDnwiOdxXW4dp8',
  },
];
```

![ action run](./2021-07-11-serverless-authentication-authorization-for-flutter-assets/jwt-stream.png)

Next, go back to flow, select login, and drag your newly created-custom-action to the flow and apply changes.

![ action run](./2021-07-11-serverless-authentication-authorization-for-flutter-assets/login-flow.png)

As of the last step, you need to read this token in the Flutter app and add it to your user model, so when you connect a user to `GetStream` chat, instead of the development token you have used, you can replace it with a received token.

First, as it's a custom claim, it will show up in `idToken`; thus, modify your `Auth0IdToken` model class.

```dart
// models/auth0_id_token.dart


@JsonSerializable()
class Auth0IdToken {
  Auth0IdToken({
  ....
    required this.streamChatUserToken,
  ....
})
....
  @JsonKey(name: 'https://getstream.mjcoffee.app/user_token')
  final String streamChatUserToken;
....
}
```

Then do the same with your `Auth0User` class as it will be part of user details.

```dart
// models/auth0_user.dart

@JsonSerializable()
class Auth0User {
  Auth0User({
  ....
      required this.streamChatUserToken,
  ....
})
....
  @JsonKey(name: 'https://getstream.mjcoffee.app/user_token')
  final String streamChatUserToken;
....
}
```

Once you are done, run the `build_runner` command to generate models again.

```bash
flutter pub run build_runner build --delete-conflicting-outputs
```

Locate `connectUser` in ChatService class and replace `devToken()` with the newly received token on the user object.

```dart
//chat_server.dart

await client.connectUser(
      User(
        id: user.id,
        extraData: {
          'image': user.picture,
          'name': user.name,
        },
      ),
      // client.devToken(user.id).rawValue,
      user.streamChatUserToken,
    );
```

Well done! Log out from the app and restart the app and log in again. This time, you'll receive a production-ready user token, go to support chat and everything should work as expected.

## Looking ahead

Now that the app with a real-time chat is ready with a proper authentication flow; you can move on to the next article to focus on authorization, roles and permissions.

# Serverless Authentication and Authorization for Flutter - Part 5 - Roles and Permissions

In the previous article, you have learned how to implement a real-time chat to your application and prepared MJ coffee app to load different chat screens. In this article, you will learn how to manage roles and permissions in Auth0 and a Flutter app and apply a proper authorization flow. You'll learn how to leverage RBAC and permission-based functionalities in a Flutter application.

## Managing Roles

Earlier in the article, you learned how to create roles in the Auth0 dashboard. It is time to see why you need roles and how you can leverage them into your app.

Role-based access control (RBAC) is a way to assign permissions to users based on their role, which offers a simple, manageable approach to access management that is less prone to error than assigning permissions to users individually.

For example, suppose you use RBAC to control Customer/Employee access in the MJ Coffee application. In that case, you could give employees a role that allows them to update user details or access the community chat screen. In contrast, customers would view the support screen and don't have enough permission to perform specific tasks such as deleting messages or uploading attachments.

When planning your access control strategy, it's best practice to assign users the fewest number of permissions that allow them to get their work done.

You can leverage Auth0 Actions to assign roles automatically to each user after they sign-up.

Once more, create a new custom action and select `Post User Registration` and name it `Assign Role` and Add `auth0` npm module with version `2.35.1`.

The handler will be called during the execution of a `PostUserRegistration` flow as follow:

```javascript
// Auth0 Actions

const ManagementClient = require('auth0').ManagementClient;
const AuthenticationClient = require('auth0').AuthenticationClient;

exports.onExecutePostUserRegistration = async (event) => {
  const DOMAIN = '{YOU_DOMAIN}';
  const auth0 = new AuthenticationClient({
    domain: DOMAIN,
    clientId: event.secrets.M2M_CLIENT_ID,
    clientSecret: event.secrets.M2M_CLIENT_SECRET,
  });
  const response = await auth0.clientCredentialsGrant({
    audience: `https://${DOMAIN}/api/v2/`,
    scope: 'read:users update:users',
  });
  const API_TOKEN = response.access_token;
  const management = new ManagementClient({
    domain: DOMAIN,
    token: API_TOKEN,
  });

  if (event.user.email.endsWith('@mjcoffee.app')) {
    // employee
    await management.assignRolestoUser(
      { id: event.user.user_id },
      { roles: ['rol_CHpJMdZUPCLzo6E2'] },
    );
  } else {
    // customer
    await management.assignRolestoUser(
      { id: event.user.user_id },
      { roles: ['rol_fG50GuNE9S72jNZn'] },
    );
  }
};
```

Let's analyze this logic step by step.

You have to import both `ManagementClient` and `AuthenticationClient` from the `auth0` module, a Node.js SDK that conveniently provides official Auth0 public APIs.

Then, define your domain name, `DOMAIN`. You can copy that from your application in Auth0. Next, you need to initialize an authentication client by passing domain, client ID, and client secret. However, the application client is a bit special here! That is not the application you have created and worked with so far. You need to create a Machine-to-Machine application or Auth0 Non-Interactive Client where it makes it possible to request for Client Credentials Grant.

Therefore, I suggest opening the Auth0 dashboard in a new tab in your browsers, going to applications in the Auth0 dashboard, and creating a new application with the mentioned type.

![ m2m](./2021-07-11-serverless-authentication-authorization-for-flutter-assets/m2m.png)

Once the application is ready, first take a note of Client ID and Client secret, as you will need to add them to secrets in your actions in the next step and then go to the APIs tab and authorize `Auth0 Management API`.

It's always a great idea to limit the permissions. Hence, make sure only select the permissions that you need to perform actions with this `Client`; for example, `read:users` and `update:users` is need to add roles to users.

![ authorize api](./2021-07-11-serverless-authentication-authorization-for-flutter-assets/authorize-api.png)

Make sure you have added client ID with the key of `M2M_CLIENT_ID` and client secret with the key of `M2M_CLIENT_SECRET` to the action.

Now you can successfully authenticate an Auth0 client and request for management API token by specifying audiences and scopes. Scopes are the ones that you have select in the previous steps in the permission tab under Auth0 management API.

Once access is granted and the token is received, you can create a management client.

The logic is relatively simple for this MJ Coffee app.

```javascript
if (event.user.email.endsWith('@mjcoffee.app')) {
  // employee
} else {
  // customer
}
```

You will define employees if the end of their email with `@mjcoffee.app`; otherwise, they obtain a customer role. This, of course, could change based on your implementation.

Finally, you must call `assignRolesToUser` on the `management` client and pass:

- a map contains the user ID
- Roles include a list of roles ID.

To grab roles ID in Auth0, open the roles under user management.

![ role id](./2021-07-11-serverless-authentication-authorization-for-flutter-assets/role-id.png)

Fantastic! Do not forget to deploy your function.

In the last step, you need to go to Flows and go to a `Post User Registration` and add your `Assign Role` custom action to the flow.

If you are impatient to test what you have created so far, quickly navigate to users view in Auth0 dashboard and create new users with and without emails that you have specified in your function logic. Then, go to the Role tab, and you should be able to see the role has been assigned automatically.

![ user role](./2021-07-11-serverless-authentication-authorization-for-flutter-assets/user-role.png)

## Managing Permissions

You often need to create a custom API that defines permissions. Then you can assign them to a particular role that a user can inherit.

Locate APIs under the application in the Auth0 dashboard and create a new custom API. Name your API, for example, StreamChat management API, and define your identifier. The identifier will become your API audience. Note that the identifier cannot be modified. A good practice to set an identifier is to use a URL even if the URL is not publicly available. For example, `https://getStreamChat.mjcoffee.app/v1/`.

![ custom api ](./2021-07-11-serverless-authentication-authorization-for-flutter-assets/custom-api.png)

Once the API is created, go to the RBAC Settings section and enable RBAC and Add Permissions in the Access Token. The API is supposed to be flagged as First Party so that you can turn on Allow Skipping User Consent. Turn on Allow Offline Access so that Auth0 will allow applications to ask for Refresh Tokens for this API.

![ rbca api ](./2021-07-11-serverless-authentication-authorization-for-flutter-assets/rbca-api.png)

Then Navigate to the permissions tab and add your permission(scope) and description. I recommend at least the three following scope:

- `delete.user.message`
- `edit.user.message`
- `upload.attachments`

![ custom permission ](./2021-07-11-serverless-authentication-authorization-for-flutter-assets/custom-permission.png)

The more and explicit permissions you have, the better you can control the resources.

Next, head over to roles under user management and go to each role and assign as many permissions as you wish. Here is a table of what you can assign

- Employee
  - `edit.user.message`
  - `upload.attachments`
- Customer
  - `edit.user.message`
- Admin
  - `delete.user.message`
  - `edit.user.message`
  - `upload.attachments`

![ custom permission ](./2021-07-11-serverless-authentication-authorization-for-flutter-assets/role-permission.png)

Alright, you have managed to create a role and assigned a role to users automatically on registration. Although, it's automatic role assignment now, you still may alter the user's role manually, for example, adding `Admin` role to certain users under user management in Auth0 dashboard.

The only step left here is to expose roles and permissions to `idToken` and `accessToken` that the Flutter app can consume.

## Exposing Roles and Permission

This step is pretty similar to what you have done for Assigning roles. To recall, you need to follow these steps:

- Create custom action, triggering Login/Post Login
- Name the action Revealing User Roles & Permissions
- Add Machine-2-Machine application client ID and client Key to secrets in the action
- Add `auth0` npm package version `2.35.1`

Once all done, follow the code below:

```javascript
// Auth0 Actions

const ManagementClient = require('auth0').ManagementClient;
const AuthenticationClient = require('auth0').AuthenticationClient;
exports.onExecutePostLogin = async (event, api) => {
  const DOMAIN = 'mhadaily.eu.auth0.com';
  const auth0 = new AuthenticationClient({
    domain: DOMAIN,
    clientId: event.secrets.M2M_CLIENT_ID,
    clientSecret: event.secrets.M2M_CLIENT_SECRET,
  });
  const response = await auth0.clientCredentialsGrant({
    audience: `https://${DOMAIN}/api/v2/`,
    scope: 'read:users update:users read:roles',
  });
  const API_TOKEN = response.access_token;
  const management = new ManagementClient({
    domain: DOMAIN,
    token: API_TOKEN,
  });

  const params = { id: event.user.user_id };
  const roles = await management.getUserRoles(params);
  const permissions = await management.getUserPermissions(params);

  const namespace = 'https://users.mjcoffee.app';
  if (event.authorization) {
    api.idToken.setCustomClaim(`${namespace}/roles`, roles);
    api.accessToken.setCustomClaim(`${namespace}/roles`, roles);
    api.idToken.setCustomClaim(`${namespace}/permissions`, permissions);
    api.accessToken.setCustomClaim(`${namespace}/permissions`, permissions);
  }
};
```

The code is pretty similar to what you have done once before. The first change is that you need to add `read:roles` to the scope. Make sure you have enabled this permission under the M2M application as you have done once for `read:users update:users`; otherwise, you will face an unauthorized error.

Then call `getUserRoles()` and `getUserPermissions()` by passing user ID. They will return user roles and permissions respectively.

After defining a namespace, you can call `setCustomClaim` to add both roles and permission custom claims to the ID and access tokens.

Make sure you deploy and then navigate to Flows. You want to add the new custom action to the Login flow right before the previous action you created earlier in the article.

![ new flow login ](./2021-07-11-serverless-authentication-authorization-for-flutter-assets/new-login-flow.png)

Great! All goes well so far, but you still need to go to the Flutter app and add roles and permission to the models.

## Read Roles and Permissions in Flutter

Now that both roles and permissions are available in IdToken and AccessToken, you can add them to `Auth0IdToken` and `Auth0UserInfo`, respectively.

First, let's create `auth0_roles.dart` file under models folder:

```dart
// auth0_roles.dart

import 'package:json_annotation/json_annotation.dart';

part 'auth0_roles.g.dart';

enum Role {
  Employee,
  Admin,
  Customer,
}

@JsonSerializable()
class Auth0Role {
  Auth0Role({
    required this.id,
    required this.name,
    required this.description,
  });

  final String id;
  final Role name;
  final String description;

  factory Auth0Role.fromJson(Map<String, dynamic> json) =>
      _$Auth0RoleFromJson(json);

  Map<String, dynamic> toJson() => _$Auth0RoleToJson(this);

  @override
  String toString() {
    return '''$name''';
  }
}
```

Then let's create `auth0_permissions.dart` file including the code below:

```dart
// auth0_permissions.dart

import 'package:json_annotation/json_annotation.dart';

part 'auth0_permissions.g.dart';

class UserPermissions {
  static const String delete = 'delete.user.message';
  static const String edit = 'edit.user.message';
  static const String upload = 'upload.attachments';
}

@JsonSerializable()
class Auth0Permission {
  Auth0Permission({
    required this.permissionName,
    required this.description,
    required this.resourceServerName,
    required this.resourceServerIdentifier,
    required this.sources,
  });

  @JsonKey(name: 'permission_name')
  final String permissionName;

  final String description;
  @JsonKey(name: 'resource_server_name')
  final String resourceServerName;
  @JsonKey(name: 'resource_server_identifier')
  final String resourceServerIdentifier;

  final List<Auth0PermissionsSource> sources;

  factory Auth0Permission.fromJson(Map<String, dynamic> json) =>
      _$Auth0PermissionFromJson(json);

  Map<String, dynamic> toJson() => _$Auth0PermissionToJson(this);

  @override
  String toString() {
    return '''$permissionName''';
  }
}

@JsonSerializable()
class Auth0PermissionsSource {
  Auth0PermissionsSource({
    required this.sourceId,
    required this.sourceName,
    required this.sourceType,
  });

  @JsonKey(name: 'source_id')
  final String sourceId;
  @JsonKey(name: 'source_name')
  final String sourceName;
  @JsonKey(name: 'source_type')
  final String sourceType;

  factory Auth0PermissionsSource.fromJson(Map<String, dynamic> json) =>
      _$Auth0PermissionsSourceFromJson(json);

  Map<String, dynamic> toJson() => _$Auth0PermissionsSourceToJson(this);

  @override
  String toString() {
    return '''
      sourceId: $sourceId,
      sourceName: $sourceName,
      sourceType: $sourceType,
      ''';
  }
}
```

What you want to achieve here is to serialize and deserialize the roles and permissions under each model.

Next step is to alter `Auth0IdToken` model:

```dart
//auth0_id_token.dart

@JsonSerializable()
class Auth0IdToken {
  Auth0IdToken({
....
    required this.roles,
    required this.permissions,
....
}}
....
  @JsonKey(name: 'https://users.mjcoffee.app/roles')
  final List<Auth0Role> roles;

  @JsonKey(name: 'https://users.mjcoffee.app/permissions')
  final List<Auth0Permission> permissions;
....
}
```

Then let's do the same for the `Auth0User` model:

```dart
// auth0_users.dart

@JsonSerializable()
class Auth0User {
  Auth0User({
....
    required this.permissions,
    required this.roles,
...
})

....
  @JsonKey(name: 'https://users.mjcoffee.app/roles')
  final List<Auth0Role> roles;

  @JsonKey(name: 'https://users.mjcoffee.app/permissions')
  final List<Auth0Permission> permissions;
...
}
```

Finally, run `build_runner` command to ensure that the models are generated appropriately.

```bash
flutter pub run build_runner build --delete-conflicting-outputs
```

You can now restart the MJ Coffee app, and everything should work as expected.

## Role-based screens in Flutter

It is time to finally have a conditional loading screen based on the user's role. If you remember, you wanted to add Support and Community screens for Customers and Employees, respectively. You have already created both screens earlier in the article.

It would be easier to define `getter` in `Auth0User` to determine whether a user have particular role or permission.

```dart
//auth0_user.dart

class Auth0User {
....

  bool get hasImage => picture.isNotEmpty;
  bool can(String permission) => permissions
      .where(
        (p) => p.permissionName == permission,
      )
      .isNotEmpty;

  get isAdmin => roles.where((role) => role.name == Role.Admin).isNotEmpty;
  get isEmployee =>
      roles.where((role) => role.name == Role.Employee).isNotEmpty;
  get isCustomer =>
      roles.where((role) => role.name == Role.Customer).isNotEmpty;
....
}
```

The `getter`s are pretty self-explanatory.

Next, locate `tabs` list under `_MenuScreenState` (`menu.dart`)

```dart
//menu.dart

  ...
  final List<Widget> tabs = [
      MenuList(coffees: coffees),
      if (AuthService.instance.profile?.isCustomer)
        SupportChatScreen()
      else
        CommunityScreen(),
      ProfileScreen(),
    ];
  ...
```

Finally, `BottomNavigationBar` and add `BottomNavigationBarItem` to the second position in the list.

```dart
// menu.dart
...
BottomNavigationBar _bottomNavigationBar(Auth0User? user) {
    return BottomNavigationBar(
      ....
      items: <BottomNavigationBarItem>[
        ....
        BottomNavigationBarItem(
          icon: AuthService.instance.profile?.isCustomer
              ? Icon(Icons.support_agent)
              : Icon(Icons.group),
          label: AuthService.instance.profile?.isCustomer
              ? "Support"
              : "Community",
        ),
       ...
      ],
     ....
    );
  }
...
```

To make the UI look better, you can add the user's avatar to the `appBar` so the complete implementation comes as follow:

```dart
// menu.dart

class MenuScreen extends StatefulWidget {
  static String routeName = 'menuScreen';
  static Route<MenuScreen> route() {
    return MaterialPageRoute<MenuScreen>(
      settings: RouteSettings(name: routeName),
      builder: (BuildContext context) => MenuScreen(),
    );
  }

  @override
  _MenuScreenState createState() => _MenuScreenState();
}

class _MenuScreenState extends State<MenuScreen> {
  int _selectedIndex = 0;
  Auth0User? profile = AuthService.instance.profile;

  @override
  void initState() {
    super.initState();
  }

  final List<Widget> tabs = [
    MenuList(coffees: coffees),
    if (AuthService.instance.profile?.isCustomer)
      SupportChatScreen()
    else
      CommunityScreen(),
    ProfileScreen(),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        automaticallyImplyLeading: false,
        centerTitle: false,
        title: Text("Welcome ${profile?.name}"),
        actions: [
          _avatar(profile),
        ],
      ),
      body: tabs[_selectedIndex],
      bottomNavigationBar: _bottomNavigationBar(profile),
    );
  }

  BottomNavigationBar _bottomNavigationBar(Auth0User? user) {
    return BottomNavigationBar(
      backgroundColor: Colors.white,
      type: BottomNavigationBarType.fixed,
      unselectedItemColor: Colors.brown.shade300,
      items: <BottomNavigationBarItem>[
        BottomNavigationBarItem(
          icon: Icon(Icons.list_alt),
          label: "Menu",
        ),
        BottomNavigationBarItem(
          icon:
              user?.isCustomer ? Icon(Icons.support_agent) : Icon(Icons.group),
          label: user?.isCustomer ? "Support" : "Community",
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.person),
          label: "Profile",
        ),
      ],
      currentIndex: _selectedIndex,
      selectedItemColor: Colors.brown.shade800,
      onTap: _onItemTapped,
    );
  }

  Padding _avatar(Auth0User? profile) {
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: FittedBox(
        fit: BoxFit.cover,
        child: ClipRRect(
          clipBehavior: Clip.antiAlias,
          borderRadius: BorderRadius.all(Radius.circular(600)),
          child: Container(
            child: _avatarPhoto(profile),
          ),
        ),
      ),
    );
  }

  Widget _avatarPhoto(Auth0User? profile) {
    return profile != null && profile.hasImage
        ? Image.network(
            profile.picture,
            width: 20,
            height: 20,
          )
        : Container(
            width: 20,
            height: 20,
            color: darkBrown,
            child: Center(
              child: Text('${profile?.name[0].toUpperCase()}'),
            ),
          );
  }
}
```

You can create a new user and assign Employee role so that you can also test Employee role screen.

Well done! Restart your app, log out, and log in again, and based on your user role, you will be able to see the proper screen.

![ role base screen flutter ](./2021-07-11-serverless-authentication-authorization-for-flutter-assets/role-base-screen.png)

But that's not all! You still need an employee ID to create a private channel between a current customer and an employee.

Typically, you can define an API that can return available agents to create a channel. However, another strategy that could fit the MJ Coffee app is to retrieve all employees' user IDs via idTokens custom claim and randomly pick one of them.

You can create other custom actions, similar to the previous steps for permissions and roles. I will not walk you through all steps as you have done it perfectly twice.

Let's name this action `Retrieve Employees User IDs` and the logic comes as follow:

```javascript
// Auth0 Action

const ManagementClient = require('auth0').ManagementClient;
const AuthenticationClient = require('auth0').AuthenticationClient;
exports.onExecutePostLogin = async (event, api) => {
  const DOMAIN = 'mhadaily.eu.auth0.com';
  const auth0 = new AuthenticationClient({
    domain: DOMAIN,
    clientId: event.secrets.M2M_CLIENT_ID,
    clientSecret: event.secrets.M2M_CLIENT_SECRET,
  });
  const response = await auth0.clientCredentialsGrant({
    audience: `https://${DOMAIN}/api/v2/`,
    scope: 'read:users read:roles',
  });
  const API_TOKEN = response.access_token;
  const management = new ManagementClient({
    domain: DOMAIN,
    token: API_TOKEN,
  });
  const params = { id: event.secrets.EMPLOYEE_ROLE_ID, per_page: 10, page: 0 };
  const employees = await management.getUsersInRole(params);
  const employee_ids = employees.map((employee) => employee.user_id);
  const namespace = 'https://employees.mjcoffee.app';
  if (event.authorization) {
    api.idToken.setCustomClaim(`${namespace}/id`, employee_ids);
  }
};
```

Again, you will use `ManagementClient` to get the first ten users based on the role by calling `getUsersInRole()` and passing the role ID that `EMPLOYEE_ROLE_ID` identifies from secrets, then define the namespace and set a custom claim on `idToken`.

Lastly, deploy this action and add it to the Login flow right after the GetStream User Token action and apply.

![ role in login flow ](./2021-07-11-serverless-authentication-authorization-for-flutter-assets/role-actions.png)

Locate your `Auth0IdToken` and `Auth0User` classes in Flutter and add a new property, `availableAgents`.

In Auth0IdToken you should have:

```dart
// auth0_id_token.dart

@JsonSerializable()
class Auth0IdToken {
  Auth0IdToken({
  ...
    required this.availableAgents,
    ....
  });
....
  @JsonKey(name: 'https://employees.mjcoffee.app/id', defaultValue: [])
  final List<String> availableAgents;
...
}
```

and in `Auth0User` you can do the same:

```dart
// auth0_user.dart

@JsonSerializable()
class Auth0User {
  Auth0User({
  ...
    required this.availableAgents,
    ....
  });
....
  @JsonKey(name: 'https://employees.mjcoffee.app/id', defaultValue: [])
  final List<String> availableAgents;
...
}
```

Do not forget to run

```bash
flutter pub run build_runner build --delete-conflicting-outputs
```

You may not want to add in both that's perfectly fine if you decide to add to user class only. Locate `createSupportChat` in `ChatService` class. You left the employee ID blank, so now you can refactor this to pick an employee ID randomly.

```dart
// chat_service.dart

 String? _currentEmployeeId;

Future<Channel> createSupportChat(List<String> availableAgents) async {
    // skip if the chat is still open with current employeeId
    if (_currentEmployeeId == null) {
      final _random = new Random();
      final randomNumber = 0 + _random.nextInt(availableAgents.length - 0);
      final String employeeId = availableAgents[randomNumber].split('|').join('');
      _currentEmployeeId = employeeId;
    }

    final channel = client.channel(
      'support',
      id: _currentChannelId,
      extraData: {
        'name': 'MJCoffee Support',
        'members': [
          _currentEmployeeId,
          client.state.user!.id,
        ]
      },
    );
    await channel.watch();
    _currentChannelId = channel.id;
    return channel;
  }
```

Let's check a few things. First, you should pass a list of employees' IDs to the `createSupportChat`. Then, you have to make sure you are storing the current employee ID that has an open support chat to avoid recreating a new channel.

Finally, you will randomly pick an ID from the list and create your channel with the current customer.

This solution might not be the best possible one. However, it would work for our small coffee store. Ideally, you would define an API that can return an available employee to a customer on-demand. I may write another article to show you how you can better with other solutions.

Lastly, locate `createChannel()` method in `support.dart` file and refactor to pass the `availableAgents`.

```dart
// support.dart

...
createChannel() async {
    if (profile != null) {
      final _channel = await ChatService.instance.createSupportChat(
        profile!.availableAgents,
      );
      setState(() {
        channel = _channel;
      });
    }
  }
  ...
```

> it's very important that you have registered all your employees ID in `GetStream` chat. Typically, user can employee should login and everything will work. However, if you still have not registered them you might get an error `The following users are specified in channel.members but don't exist` from `GetStream` that the employee ID doesn't exist and channel will not be created. This usually happens if you have created any users before the Login flow and Custom token generation action have been created.

Nicely done! You can restart your app, and this time you can see the support channel screen.

## Permission-based functionalities

After applying roles to have specific access in the app, you can go one step deeper and use functionalities based on the user's permission inherited from the role.

You have already defined the `can` method on `Auth0User` in the previous section. The purpose of this method is to check if the user has given permission. Let's use it.

Locate `MessageInput` in the `support.dart` file, and you can replace it with

```dart
// support.dart

...
MessageInput(
  disableAttachments: !profile!.can(UserPermissions.upload),
  sendButtonLocation: SendButtonLocation.inside,
  actionsLocation: ActionsLocation.leftInside,
  showCommandsButton: !profile?.isCustomer,
),
...
```

In the implementation above, `disableAttachments` is enabled based on the user's permission, or `showCommandsButton` is active only for the Customer role.

Another scenario you can do is to limit the delete message functionality and apply `UserPermissions.delete` to remove the relevant the UI.

Moreover, you may want to apply for these permissions on your back-end or API to perform. I will leave this part as homework.

## Closing a support chat channel

For the last section of this article series, I'd like to show you how to close a support channel chat.

First, you need to create a method on `ChatService` to send a command to close a channel.

```dart
//chat_service.dart

...
Future<void> archiveSupportChat() async {
   await client.hideChannel(
      _currentChannelId!,
      'support',
      clearHistory: true,
    );
  client.channel('support', id: _currentChannelId).dispose();
  _currentChannelId = null;
  _currentEmployeeId = null;
}
...
```

In this implementation, you can hide a chat with an existing ID and the type `support` and finally, make both `_currentChannelId` and `_currentEmployeeId` to `null` so that next time users come to a support screen; they can see a new channel created with another employee.

> Hiding a channel makes it invisible to the query channels. It can be retrieved if the user adds a new message to it or calls the `show()` method to remove the hidden status.

However, there are other possibilities; for example, you can `archive` or `delete` a channel. At the moment, `archive` is not exposed to the `GetStream` Dart
SDK. Therefore, for now, you can hide a channel.

Next, Locate `MessageInput` in the `support.dart` file, and add `actions`.

```dart
// support.dart
{
...
MessageInput(
  actions: [_closeChat()],
  disableAttachments: !profile!.can(UserPermissions.upload),
  sendButtonLocation: SendButtonLocation.inside,
  actionsLocation: ActionsLocation.leftInside,
  showCommandsButton: !profile?.isCustomer,
),
...
  /// method in the class
  CommonButton _closeChat() {
    return CommonButton(
      onPressed: () {
        ChatService.instance.archiveSupportChat();
        CoffeeRouter.instance.push(MenuScreen.route());
      },
      child: Icon(
        Icons.close,
        color: Colors.white,
      ),
    );
  }
}
```

The `actions` parameter will add a list of additional actions to the `GetStream` chat input UI. You can call the `archiveSupportChat` method `OnPressed` and hide the chat, and redirect the user to the menu screen to show a proper message that the discussion is closed. They can reopen by returning to the support screen.

## Conclusion

Authentication and authorization are sophisticated to handle and manage in an app, and Auth0 will provide a reliable service that you can use in your Flutter application without having a server or infrastructure to maintain. For example, Auth0 Actions, a serverless approach to manipulate your authentication and authorization process, is a blessing.

You have seen how you can speed up your development by adding a support chat using `GetStreamChat` to a Flutter application and limit the functionality by leveraging roles and permission received from Auth0 tokens.

Well done! you have gone far until here and you have learned a lot. However, it is just the beginning. You can still implement and configure a lot in both `GetStreamChat` and Auth0 and take your app to the next level.
