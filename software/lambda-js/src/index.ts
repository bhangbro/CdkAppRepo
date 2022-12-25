import Log from "util/Log";

// This is the entry point of a NodeJS lambda.
//  I'm not sure if it can be anywhere else, but it seems like it must be the root index.ts or (compiled) index.js file
exports.testHandler = async (request: any) => {
    Log.info("REQUEST:");
    Log.info(JSON.stringify(request));
    Log.info("Hello world!");
};

exports.anotherTestHandler = async (request: any) => {
    Log.info("REQUEST:");
    Log.info(JSON.stringify(request));
    Log.info("Bye!");
};
