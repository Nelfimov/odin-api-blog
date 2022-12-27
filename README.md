# API for blog app

## API endpoints:

### Authorization

- **POST** */users/register/* - create new account. Needs secret for admin priveleges;
- **POST** */users/login/* - authorize via username and password. Responds with JWT;

### Working with posts

- **GET** */posts/* - display all available posts;
- **POST** */posts/* - create new post. Needs authorization with admin priveleges;

### Working with comments

- **GET** */posts/:id/comments/* - display all available comments for specific post;
- **POST** */posts/:id/comments/* - create new post. Needs authorization;
- **GET** */posts/:id/comments/:id/* - display specific comment;
