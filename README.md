# Backend API for Social Website
* This is a backend API for a social networking platform, built with Node.js, TypeScript, and TypeORM, providing functionality for user authentication, advanced search, and managing friend requests.

### Features
* User registration and login with access and refresh tokens.
* Advanced search functionality for users by first name, last name, and age.
* Friend request management: sending, viewing, accepting, and declining friend requests.
* Viewing and managing the friends list.
* Token-based authentication with jsonwebtoken.
* Secure password hashing using bcrypt.

### Prerequisites
Before you begin, ensure you have the following installed:
* Node.js (version 16 or higher)
* npm (version 8 or higher)
* PostgreSQL (version 12 or higher)

### Installation
1. Clone the repository: 
```bash
git clone https://github.com/DavXYZ/nodejs-social-api
```
2. Install dependencies:

```bash
npm install
```
3. Configure environment variables:

#### Create a .env file in the root directory and add the following:
```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=<your_db_username>
DB_PASSWORD=<your_password>
DB_DATABASE=<your_database_name>
NODE_ENV=production
DB_SYNCHRONIZE=false
DB_LOGGING=false
JWT_ACCESS_SECRET=<your_access_secret>
JWT_REFRESH_SECRET=<your_refresh_secret>
```

4. Generating ormconfig.json
* Before running any other commands, you need to generate the ormconfig.json file from the TypeScript configuration file. Use the following command:

```bash
npm run generate-ormconfig
```
* This script uses the ts-node package to execute the ormconfig.ts file, which generates the ormconfig.json file required for TypeORM to work with your database connection settings.

* Verify that the ormconfig.json file has been created in the root directory.
* Ensure you have already configured your .env file with the correct database credentials.
5. Set up the database:
#### Create a PostgreSQL database.
* If in migrations folder we don`t have any migration you must run this command.
```bash
npm run migration:generate src/migrations/<yourMigrationName>
```
* After that.
```bash
npm run migration:run
```
* Seed the database (optional)(Users):

```bash
npm run seed
```
---
## API Endpoints
### Authentication
* POST /api/v1/register: Register a new user.
  * Request Body:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "age": 25,
  "username": "johndoe",
  "password": "password123"
}
```

* POST /api/v1/login: Log in a user.
  * Request Body:
```json
{
  "username": "johndoe",
  "password": "password123"
}
```

### Friend Management
* POST /api/v1/send-request: Send a friend request.
  * Request Body:
```json
{
  "receiverId": 2
}
```
* GET /api/v1/requests: View pending friend requests.
  * Request Body: No body required, the user ID is fetched from the token.

* POST /api/v1/respond-request: Accept or decline a friend request.
  * Request Body:
```json
{
  "senderId": 1,
  "status": "accepted"  // or "declined"
}
```
* GET /api/v1/friends: View the friends list.
  * Request Body: No body required, the user ID is fetched from the token.
* DELETE /api/v1/remove-friend: Remove a friend from the list.
  * Request Body:
```json
{
  "friendId": 2
}
```
* GET /api/v1/search: Search for users by first name, last name, and age.
  * Query Parameters:
    * firstName: (optional)
    * lastName: (optional)
    * age: (optional)
```ruby
?firstName=John&lastName=Doe&age=25
```
---
# Database Structure

The database for this project consists of three main tables: `Users`, `FriendRequests`, and `Friends`. Below is a detailed overview of each table and its relationships:

## 1. Users Table
This table represents all registered users in the system.

#### Column     | Data Type  | Description                             
* | `id`       | `int`      | Primary key for the user.              |
* | `username` | `varchar`  | Unique username of the user.           |
* | `password` | `varchar`  | Hashed password of the user.           |
* | `firstName`| `varchar`  | First name of the user (optional).     |
* | `lastName` | `varchar`  | Last name of the user (optional).      |
* | `age`      | `int`      | Age of the user (optional).            |

**Relationships:**
- **Friend Requests:**
  - One-to-Many relationship with `FriendRequests`:
    - `sentRequests`: Friend requests sent by the user.
    - `receivedRequests`: Friend requests received by the user.
- **Friends:**
  - One-to-Many relationship with `Friends`: Users can have many friends.

## 2. FriendRequest Table
This table tracks all friend requests sent between users.

#### Column     | Data Type  | Description                                      
* | `id`       | `int`      | Primary key for the friend request.              |
* | `senderId` | `int`      | Foreign key referencing the sender user ID.      |
* | `receiverId`| `int`     | Foreign key referencing the receiver user ID.    |
* | `status`   | `enum`     | Status of the request: `pending`, `accepted`, or `declined`. |
* | `createdAt`| `timestamp`| Timestamp when the request was created.          |
* | `updatedAt`| `timestamp`| Timestamp when the request was last updated.     |

**Relationships:**
- **Sender:** Many-to-One relationship with `Users`, referenced by `senderId`.
- **Receiver:** Many-to-One relationship with `Users`, referenced by `receiverId`.

## 3. Friend Table
This table records confirmed friendships between users.

#### Column     | Data Type  | Description                                      
* | `id`       | `int`      | Primary key for the friendship.                 |
* | `userId`   | `int`      | Foreign key referencing the first user's ID.    |
* | `friendId` | `int`      | Foreign key referencing the second user's ID (friend). |
* | `createdAt`| `timestamp`| Timestamp when the friendship was created.      |

**Relationships:**
- **User:** Many-to-One relationship with `Users`, referenced by `userId`.
- **Friend:** Many-to-One relationship with `Users`, referenced by `friendId`.

## Entity Relationships

- **Friendship Model:**
  - Friendships are stored as pairs in the `Friends` table. Each friendship is recorded twice:
    - For example, if User A and User B are friends, the following entries will exist:
      - `(userId: A, friendId: B)`
      - `(userId: B, friendId: A)`
  
- **Friend Request Workflow:**
  - When a user sends a friend request, a new entry is created in the `FriendRequest` table.
  - The `status` column tracks the status of the request (e.g., `pending`, `accepted`, or `declined`).
  - When a friend request is accepted, corresponding friendship entries are created in the `Friends` table.

## Summary

This database structure supports the core functionality of a social platform, including:
- User registration and authentication.
- Sending and managing friend requests.
- Creating and managing confirmed friendships.

*** Thank you
