
# Team Rocket Pokemon Social Media Application
A social-media application aimed towards Pokemon trainers that allows users to interact with other trainers and create a sense of community through a social media platform. This application will allow trainers to create and share posts,
create a team of Pokemon based off of Pokemon that have been captured, propose potential trades, and will use a "follow" system for each user to expand their social circle among the Pokemon fanbase. Other key features include a search
function that utilizes PokeAPI to allow users to filter and search for Pokemon based off of a given criteria, and users will be suggested other users to follow based on how geographically close they are to others using Google's
Geocoding API.


## API Reference

#### Ensure connection to the API

```http
  GET /
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `none` | `none` | Returns "Hello! Welcome to the Pokegram API!" |

#### Post new user (register account)

```http
  POST /api/users
```

| Request Body (JSON) | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `username`      | `string` | **Required**. Username for account |
| `password`      | `string` | **Required**. Password for account |

#### Post login

```http
  POST /api/login
```

| Request Body (JSON)| Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `username`      | `string` | **Required**. Username for account |
| `password`      | `string` | **Required**. Password for account |

## All Requests Below Require Login

#### Get profile info

```http
  GET /api/profiles/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Profile id for account |

#### Update profile bio

```http
  PUT /api/profiles/${id}/bio
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Profile id for account |

| Request Body (JSON)| Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `bio`      | `string` | **Required**. Text to add as profile bio |

#### Update profile picture

```http
  PUT /api/profiles/${id}/photo
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Profile id for account |

| Header| Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `Content-Type`      | `multipart/form-data` | **Required**. Text to add as profile bio |

| Request Body (form-data)| Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `image`      | `jpg, jpeg, png, etc.` | **Required**. Photo to upload |

#### Update profile pokemon

```http
  PUT /api/profiles/${id}/pokemon
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Profile id for account |

| Request Body (JSON)| Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `pokemon`      | `string` | **Required**. Pokemon |
| `action`      | `string` "add" or "remove" | **Required**. Are you adding or removing the pokemon from your list |


#### Get profile pokemon

```http
  GET /api/profiles/${id}/pokemon
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Profile id for account |

#### Get user address coordinates

```http
  GET /api/addresses/user/${id}/
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Profile id for account |

#### Update user address

```http
  PUT /api/profiles/${id}/address
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Profile id for account |

| Request Body (JSON)| Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `address`      | `JSON object` | **Required**. JSON object with the following information|

| address| Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `street_number`      | `string` | **Required**. Street number|
| `street_name`      | `string` | **Required**. Street name|
| `city`      | `string` | **Required**. City|
| `state`      | `string` | **Required**. 2 letter state abbreviation|
| `zip`      | `string` | **Required**. ZIP code|

#### Find users near you

```http
  POST api/addresses/user/${id}/others
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Profile id for account |

| Request Body (JSON) | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `distance`      | `number` | **Required**. Distance to search for 'nearby' users |

#### Get friends list

```http
  GET /api/users/${id}/friends
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Profile id for account |

#### Add friend

```http
  PUT /api/users/${id}/friends
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Profile id for account |

| Request Body (JSON) | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `key_type`      | `string` "user_id" or "username" | **Required**. What type of value you are adding friend by |
| `friend_key`      | `string` | **Required**. What is the user_id/username of the person you want to add |

#### Remove friend

```http
  DELETE /api/users/${id}/friends
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Profile id for account |

| Request Body (JSON) | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `key_type`      | `string` "user_id" or "username" | **Required**. What type of value you are adding friend by |
| `friend_key`      | `string` | **Required**. What is the user_id/username of the person you want to add |


#### Get all your messages
```http
  GET /api/messages
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `none`      | `none` | Returns all your sent and recieved messages |

#### Send message to other user

```http
  PUT /api/messages
```

| Request Body (JSON) | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `recipient_id`      | `string` | **Required**. Can be either username or user_id of the person you are messaging |
| `message_text`      | `string` | **Required**. Message to be sent |

#### Delete message

```http
  DELETE /api/messages/${id}
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Message id to delete |


#### Get your trade data
```http
  GET /api/trades/data
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `none`      | `none` | Returns a JSON object with the lists of your desired and surrendered pokemon |

#### Update desire list

```http
  PUT /api/trades/desire-list
```

| Request Body (JSON)| Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `pokemon`      | `string` | **Required**. Pokemon name or id |
| `action`      | `string` "add" or "remove" | **Required**. Are you adding or removing the pokemon from your list |

#### Update surrender list

```http
  PUT /api/trades/surrender-list
```

| Request Body (JSON)| Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `pokemon`      | `string` | **Required**. Pokemon name or id |
| `action`      | `string` "add" or "remove" | **Required**. Are you adding or removing the pokemon from your list |


#### Get your available trades
```http
  GET /api/trades/data
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `none`      | `none` | Returns a JSON object with the users who meet your trade requirements and which pokemon they are willing to exchange|


#### Get social posts by user id
```http
  GET /api/post/user?user_id=${id}
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required** The user who's posts are being fetched|

#### Post an image (returns image_id)

```http
  POST api/post/image
```

| Header| Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `Content-Type`      | `multipart/form-data` | **Required**. Text to add as profile bio |

| Request Body (form-data)| Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `image`      | `jpg, jpeg, png, etc.` | **Required**. Photo to upload |

#### Get image s3 url
```http
  GET /api/post/image/image_id?=${id}
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required** The id of the image from 'Post an image'|


#### Post a new social post

```http
  POST api/post
```

| Request Body (JSON) | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `current_userID`      | `string` | **Required**. User id of the poster |
| `text_body`      | `string` | **Required**. Text for the post |
| `image_s3_id`      | `string` | **Required**. URL to the s3 object that stores the image to post |
| `tags`      | `[{value: "tag value", label: "#tag"}]` | **Required**. Tag to add to the post|

#### Post a user pokemon team

```http
  POST api/teams
```

| Request Body (JSON) | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `user_id`      | `string` | **Required**. Your user id |
| `teamName`      | `string` | **Required**. The name for your pokemon team |
| `pokemonList`      | `Array of Pokemon JSON Objects` | **Required**. See below |

| Pokemon JSON Object| Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `nickname`      | `string` | **Optional**. The nickname of the pokemon|
| `pokemonName`      | `string` | **Required**. The pokemon species|
| `level`      | `number` | **Required**. The pokemon's level |

#### Get pokemon team
```http
  GET /api/teams/${id}
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required** Your user id|

#### Update a user pokemon team

```http
  PUT api/teams/${id}
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required** Your user id|

| Request Body (JSON) | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `teamName`      | `string` | **Required**. The name for your pokemon team |
| `pokemonList`      | `Array of Pokemon JSON Objects` | **Required**. See below |

| Pokemon JSON Object| Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `nickname`      | `string` | **Optional**. The nickname of the pokemon|
| `pokemonName`      | `string` | **Required**. The pokemon species|
| `level`      | `number` | **Required**. The pokemon's level |