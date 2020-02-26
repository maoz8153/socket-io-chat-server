import mongoose from 'mongoose';


export class MongodbService {

    dbUri: string;
    dbName: string;

    constructor(dbUri: string, dbName: string) {
        this.dbUri = dbUri;
        this.dbName = dbName;
        this.connect();
    }

    public connect() {
        mongoose
            .connect(
                this.dbUri, { dbName: this.dbName, useNewUrlParser: true, useFindAndModify: false }
            )
            .then(() => {
                return console.info(`Successfully connected to ${mongoose.connection}`);
            })
            .catch(error => {
                console.error('Error connecting to database: ', error);
                return process.exit(1);
            });
    };
}



