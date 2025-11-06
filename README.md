# NK-Girl

**NK-Girl** is a project by [xLucyu](https://github.com/xLucyu).  
This repository contains the source code and configuration files for the project. Further documentation, development roadmap, and usage instructions can be found below.

---

## 🚀 Features

- ✨ Customizable bot 
- 🧠 Built with Python 3.12.8
- ⚙️ Modular and clean architecture

---

How to use:

1. install a postgresql server, i recommend watching a guide on how to do so. Check the .env example for depenecies.
2. make sure postgresql is installed on your system.
3. Run the following command: `psql -h <postgresql server ip> -U >your user> -d <your database> -a -f database/raw/schema.psql`
4. setup a discord bot, also recommend watching a tutorial on how to do so.
5. clone git repo into a folder. 
6. setup a virtual enviorement for python 3.12 (3.13+ doesnt work). I recommend using 3.12.8.
7. install requirements.txt or setup a docker container
8. you're good to go!

Disclaimer: you do not need a submission channel id, 
IMPORTANT: if you have discord.py and py-cord installed this will not run!
You might need to manually sync in the on_ready function in index.py

