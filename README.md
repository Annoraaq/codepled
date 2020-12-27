![Codepled Logo](assets/codepled_logo.png?raw=true)

# Codepled

## A new type of media for coding tutorials.

### Combine the advantages of tutorial videos with those of blog posts.

### Have the code side by side with the explanations and see it change in real time:

![Codepled Preview](assets/codepled_preview.gif?raw=true)

---

### **Navigate** as if you were watching a video.

![Codepled Navigation Preview](assets/codepled_preview_navigation.gif?raw=true)

---

### But **copy and paste** code.

![Codepled Copy and Paste Preview](assets/codepled_preview_copy_paste.gif?raw=true)

## How to use

For complete examples check out the [examples](https://github.com/Annoraaq/codepled/tree/master/examples) section.

### Include Codepled

To use the codepled editor you need to insert `codepled.min.js` and `codepled.min.css` and provide a container element that we give the id `my-codepled`:

```html
<link rel="stylesheet" href="../codepled.min.css" />
...
<script src="../codepled.min.js"></script>
...
<div id="my-codepled"></div>
```

### Initialize Player

To initialize the player we need to create an instance of the PlayerUi and provide the selector of our container element. Afterwards we initialize the player instance with our commands (the content) and a title.

```html
<script>
  const commands = ...;
  const player = new Codepled.PlayerUi("#my-codepled");
  player.init(
    commands,
    "Title of My Codepled"
  );
</script>
```

## Structure of the Commands Array

The player takes an array of commands. Each command is itself an array with two elements: `[type, payload]`. The following commands are supported:

### `DELETE`

Deletes `numberOfChars` characters from the current cursor position.

Payload:

```Typescript
numberOfChars: number
```

### `INSERT`

Inserts `strToInsert` at the current cursor position.

Payload:

```Typescript
strToInsert: string
```

### `SKIP`

Moves the cursor `numberOfChars` characters forward.

Payload:

```Typescript
numberOfChars: number
```

### `SHOW_TEXT`

Payload:

```Typescript
{
  message: string,
  title?: string,
  level?: number = 1,
  toc?: boolean = true,
  pause?: boolean = false
}
```

Shows `message` in the text window. If `toc` is true, it will be shown in the table of contents. If a `title` is provided, it will be used in the table of contents. If no `title` is provided, it will generate one, based on the first characters of `message`. `level` can be `1` or `2` and defines the level in the table of contents. If `pause` is set to `true` the plater will be paused after showing the `message`.

### `HIGHLIGHT_LINES`

Highlights code lines from `start` till `end` starting at index `1`;

Payload:

```Typescript
{
  start: number,
  end: number
}
```

### `SCROLL_TO`

Scrolls to `line`.

Payload:

```Typescript
line: number
```

### `SET_CURSOR`

Sets cursor to `position`.

Payload:

```Typescript
position: number
```

### `PAUSE`

Pauses the player.

Payload: none

### `REPLACE_ALL`

Replaces the whole content of the code window with `newContent`.

Payload:

```Typescript
newContent: string
```

### `CREATE_DIFF`

Creates a set of `INSERT`, `DELETE` and `SKIP` commands that transform `source` into `target`.

Payload:

```Typescript
{
  source: string,
  target: string
}
```
