import {GraphQLClient} from "graphql-request";

// Init basic config
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

export const graphQLClient = new GraphQLClient(`${STRAPI_URL}/graphql`, {
    headers: {
        "Authorization": "Bearer " + STRAPI_TOKEN,
    },
});
