# Generate a File Tree into a `.txt` File

## Windows (Command Prompt)

```bash
tree /F /A > tree.txt
```

**Explanation**

* `/F` → includes files (not only folders)
* `/A` → uses ASCII characters (better for `.txt`)
* `>` → redirects output to a file
* `tree.txt` → output file name

---

## Linux / macOS

### If `tree` is installed

```bash
tree > tree.txt
```

Include hidden files:

```bash
tree -a > tree.txt
```

---

### Install `tree` (if missing)

#### Ubuntu / Debian

```bash
sudo apt install tree
```

#### macOS (Homebrew)

```bash
brew install tree
```

---

## Useful Variants

### Show only directories

```bash
tree -d > tree.txt
```

### Limit depth

```bash
tree -L 2 > tree.txt
```

### Exclude folders

```bash
tree -I "node_modules|.git" > tree.txt
```
