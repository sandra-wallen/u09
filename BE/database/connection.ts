import mongoose from "mongoose";

const dbConnection = async (uri: string) => {
    await mongoose.connect(uri).then(
        (res) => {
            const connection = mongoose.connection;
            const message = `Connected to database ${connection.db.databaseName}`;

            //return console.log(message), connection;
            return console.log(message);
        },
        (err) => {
            const message = `Attempt to connect failed. ${err}`;
            return console.log(message);
        }
    );
};

export { dbConnection };
