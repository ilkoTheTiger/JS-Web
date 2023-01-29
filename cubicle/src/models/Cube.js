const mongoose = require('mongoose');

const cubeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
        maxLength: 50,
    },
    imageUrl: {
        type: String,
        required: true,
        // Add Http/https validation
    },
    difficultyLevel: {
        type: Number,
        mxa: 6,
        min: 1,
    }
});

// Short-Way 
// const { Schema } = require('mongoose');
// const cubeSchema = new Schema;




class Cube {
    constructor({name, description, imageUrl, difficultyLevel}) {
        this.name = name, 
        this.description = description, 
        this.imageUrl = imageUrl, 
        this.difficultyLevel = difficultyLevel
    }

    //Validations possible

    static save(cube) {
        this.id = db.cubes[db.cubes.length - 1].id + 1;
        // this.id = db.cubes.length; - might overlap IDs, if some are deleted
        db.cubes.push(cube);
        let json = JSON.stringify(db, null, 2);
        fs.writeFileSync(path.resolve(__dirname, '../db.json'), json);
    }
}

module.exports = Cube;