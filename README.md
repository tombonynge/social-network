# social-network
A dummy social network app.

<kbd>![](https://github.com/tombonynge/social-network/blob/master/demo.gif)
</kbd>

#### Functionality
- Register / login / forgot password
- Find users
- Add / remove friends
- Public chat

#### Made with
Node, React, Redux, Postgres, AWS(S3), Socket.io

#### Additional Fun Stuff
I needed a lot of dummy users for this project, so I wrote a function that takes a list of names and auto generates a user account for each one, scraping a profile image from the great, but a bit creepy [thispersondoesnotexist.com/](https://thispersondoesnotexist.com/).
To see the code for this, check out src/genusers.js and the post reqest for /genusers in index.js

