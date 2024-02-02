# Pinteract User Stories
This page describes the experience a user will go through when exploring the website in both unauthorized and authenticated states.

## Users
### Sign Up
- As an unregistered and unauthorized user, I want to be able to sign up for the website via a sign-up form.
	- When I open the **Signup Modal**:
		- I would like to be able to enter my email, username, and preferred password on a clearly laid out form.
		- I would like the website to log me in upon successful completion of the sign-up form.
			- So that I can seamlessly access the site's functionality
	- When I enter invalid data on the sign-up form:
		- I would like the website to inform me of the validations I failed to pass, and repopulate the form with my valid entries (except my password).
		- So that I can try again without needing to refill forms I entered valid data into.

### Log In
- As a registered and unauthorized user, I want to be able to log in to the website via a log-in form.
	- When I open the **Login Modal**:
		- I would like to be able to enter my email and password on a clearly laid out form.
		- I would like the website to log me in upon successful completion of the log-in form.
			- So that I can seamlessly access the site's functionality
			- I will be redirected to the Discover landing page
	- When I enter invalid data on the log-in form:
		- I would like the website to inform me of the validations I failed to pass, and repopulate the form with my valid entries (except my password).
			- So that I can try again without needing to refill forms I entered valid data into.

### Demo User
- As an unregistered and unauthorized user, I would like an easy to find and clear button on both the sign-up and login modals to allow me to visit the site as a guest without signing up or logging in.
	- When I'm on either the sign-up or login modals:   
		- I can click on a Demo User button to log me in and allow me access as a normal user.
			- So that I can test the site's features and functionality without needing to stop and enter credentials.

### Log Out
- As a logged in user, I want to log out via an easy to find log out button on the navigation bar.
	- While on any page of the site:
		- I can log out of my account and be redirected to the Discover landing page.

## 1. Pins
### Create Pins
- As a logged in user, I want to be able to post new Pins.
	- When I'm on the `/new-pin` page, I can upload an image for my new Pin
		- Title and Description are optional
		- I can set it to Private or Public *(public by default)*

### Viewing Pins
- As a logged in *or logged out* user,
	- I can view public pins on the Discover landing page at `/discover`.
	- I can click on a Pin, redirecting me to `/pins/:id`, to view more details on the Pin, including comments and the author who posted it.

### Updating Pins
- As a logged in user,
	- I can update __my own__ Pins at `/pins/:id/edit` by clicking an Edit button associated with the Pin.
		- I can change the Title, Description, and Public (boolean) properties on the Pin. 

### Deleting Pins
- As a logged in user,
	- I can delete __my own__ Pins by clicking a Delete button associated on the Pin. (Only visible if I'm the author of the Pin)
	- After clicking the button, a confirmation modal will pop up asking if I'm sure about deleting it.

## 2. Boards
### Create Boards
- As a logged in user, I want to be able to create new Boards.
	- On my personal profile page at `/me`, I can view my own boards by clicking Saved, redirecting me to the `/users/me/boards` page.
	- I can create new Boards by clicking the `+` icon.
	- I can set a Board visibility to Public or Private
### Viewing Boards
- As a logged in *or logged out* user,
	- I can view public boards from other users by checking out their Boards on their profile at `/users/:userId`
	- I can view more details on a specific board by clicking on it, redirecting me to `/boards/:boardId`
### Updating Boards
- As a logged in user,
	- I can edit my own boards by clicking an Edit button on `/boards/:boardId`
		- I can change the Title, Description, and Public (boolean) properties on the Board.
		- I can set the Board thumbnail cover if there is at least one Pin in the Board. 
### Deleting Boards
- As a logged in user,
	- I can delete my own boards by clicking a Delete button on `/boards/:boardId`
	- After clicking the button, a confirmation modal will pop up asking if I'm sure about deleting it.


## 3. Comments
### Create Comments
- As a logged in user, I want to be able to post new comments.
	- When I'm viewing a Pin on the `/pins/:id` page:
		- I should be able to type in the comment box.
		- I can only send up to 500 characters.
		- I can only click the Submit button if there is valid data in the comment box.

### Viewing Comments
- As a logged in or logged out user, I want to be able to view a selection of the most recent comments on a Pin.
	- When I'm on the `/pins/:id` page,
		- I can view the most recently posted comments on that Pin.
		- My comments will be placed at the top on my screen.
		- I can interact with the comment, such as Likes and Replies (if implemented) 

### Updating Comments
- As a logged in user, I want to be able to edit my comments by clicking an Edit button on the comment.
	- When I'm viewing comments, with my comments being placed at the top locally:
		- I can click "Edit" to make changes to comments in the Edit modal.

### Deleting Comments
- As a logged in user, I want to be able to delete my comments by clicking a Delete button on the comment.
	- When I'm viewing my own comments:
		- I can click "Delete" to permanently delete a comment I have posted.
		- After clicking the button, a confirmation modal will pop up asking if I'm sure about deleting it.

## 4. Favorites
### Create Favorites
- As a logged in user, I want to be able to mark Favorites on Pins.
	- When viewing public pins:
		- I can click "Favorite" on the Pin.
### Viewing Favorites
- As a logged in user, I want to be able to see all my Favorites in one place.
	- I can view my favorites on my profile at `/users/me/`
### Deleting Favorites
- As a logged in user, I want to be able to unfavorite Pins I have previously favorited.
	- I can view my favorites on my profile at `/users/me/`
		- I can click on the star icon to unfavorite the Pin.

<!-- 

## Unauthorized
- I will be presented with the landing page (staggered grid of many public pins).
- I can view pins without being authorized.
- I will be redirected to the login page if I try to interact with any pins.
- To register an account, I will have to fill out the on-screen registration form with valid data.
	- Required Fields:
		- e-mail
		- username
		- password
	- Optional Fields:
		- first name
		- last name

## Authorized
- Account Control Panel
	- In Account Settings, I will be able to change my:
		- About Me
		- Display Name
		- Username
		- First Name
		- Last Name
		- Profile Picture
- Pins
	- I will be able to save public pins.
	- I will be able to upload (create) my own pins.
	- I will be able to edit/delete my own pins.
	- I will be able to set my pins to private.
- Boards
	- I will be able to create my own boards.
	- I will be able to add public pins or my pins to my boards.
	- I will be able to make my boards private.
	- I will be able to edit/delete my own boards.
- Comments
	- Users can comment up to 500 characters on public pins.
	- Users can edit their own comments.
	- Users can delete comments if they wrote it or if they are the Pin owner.
	- Users may be able to reply if implemented.
- Favorites
	- Can only be viewed by the person favorited.
	- Users can favorite/unfavorite pins. -->