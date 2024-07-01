
# How to use my Application

---

### Concepts

- Spoilers : Hidden text hat will appear afterwards
- Slides : As markdown doesn't support "page jumps" I use things called slides
- Markdown : Understanding markdown syntax is recommended if not needed ([Markdown website](https://www.markdownguide.org/))

--- 

### What does it do ?

- It takes a markdown file as input
- It outputs the formated file with its spoiler

---

### How to use "spoilers"

- In your markdown file, just put your text between "@" to make it a spoiler:

| Markdown file       | Displayed            | 
| ------------------- | ---------------------|
| this is a @ test @  | this is a .......... |

--- 

### How to use "slides"

- In your markdown file, just put "===" with an empty line before and after
- The number of slides will be shown at the bottom right of your screen

--- 

### Using spoilers arguments

You can add characters after the first '@' which opens your spoiler such as:
- '/' which skips whitespaces (' ')
- '\_' which replace dots ('.') with underscore ('_')

| Markdown file       | Displayed              | 
| ------------------- | ---------------------  |
| this is @ a test @  | this is .. ..........  |
| this is @/ a test @ | this is ............   |
| this is @_ a test @ | this is __ _______     |
| this is @/_ a test @| this is _________      |

---

### Default keybindings 

| Key | Usage |
| ------------- | -------------- |
| RightArrow | Show next spoiler or go down if none is found |
| LeftArrow  | Hide spoiler or go up if none is found |
| n | Go to next slide  |
| p | Go to previous slide |
| z | Increase font size|
| Z | Decrease font size|

---

### User Interface

- To open a markdown file, just press the button and select your file
- If you want to open a word (.docx) file see the next section
- If you are editing the file while using it in Helium, you can reload it using the "Reload" button to see changes
- You can open the currently selected file in your default text editor using the corresponding button
- You can also switch the state (displayed/hidden) of a spoiler by clicking on it

---

### Settings

- **Settings are not saved in-between sessions**
- You can open your file in dillinger using the "open with web editor" button
- You can import files from word format using [pandoc](https://pandoc.org/installing.html) if downloaded (you may need to make some changes to markdown file)
- You can report bugs using the button, which leads you to the github issue page
- You can change font-family (more to be added)

Pandoc not installed can lead to some crashes.

--- 

# Thanks for using it !
### You can still contact me at github.asleep687@passinbox.com 
I am open for any feature request
