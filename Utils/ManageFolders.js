const fs = require('fs');

class ManageFolders{
    constructor(path) {
        this.path = path;
    }

    isEmpty() {
        const files = fs.readdirSync(this.path);
        return (files.length === 0);
    }

    deleteAll() {
        fs.readdir(this.path, (err, files)=> {
            if (err) { console.log(err); return; }
            files.forEach(file => {
                const filePath = `${this.path}/${file}`;
                fs.unlink(filePath, err =>{
                    if (err) {console.log(err); return;}
                })
            })
        })
    }
}

module.exports = ManageFolders;