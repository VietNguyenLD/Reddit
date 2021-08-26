
require('dotenv').config()
import 'reflect-metadata'
import express from 'express'
import mongoose from 'mongoose'
import { createConnection } from 'typeorm'
import {ApolloServer} from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { Post, User } from './entities';
import { HelloResolver } from './resolvers/hello'
import { UserResolvers } from './resolvers/user';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'


const main = async () => {
    await createConnection({
        type: 'postgres',
        database: 'Redit',
        username: process.env.DB_USERNAME_DEV,
        password: process.env.DB_PASSWORD_DEV,
        logging: true,
        synchronize: true,
        entities: [User, Post]
    })

    const app = express()

   // Session/Cookie store
	const mongoUrl = ` mongodb+srv://${process.env.SESSION_DB_USERNAME_DEV_PROD}:${process.env.SESSION_DB_PASSWORD_DEV_PROD}@redit.z9c5u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
	await mongoose.connect(mongoUrl, {
		useCreateIndex: true,
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false
	})

    console.log('MongoDB Connected')

    const apolloServer = new ApolloServer({
        schema: await buildSchema({resolvers: [HelloResolver, UserResolvers], validate: false}),
        plugins: [ApolloServerPluginLandingPageGraphQLPlayground]
    })

    await apolloServer.start()
    apolloServer.applyMiddleware({app, cors: false})

    app.listen(4000, () => console.log('Server started on port 4000'))
}

main().catch(error => console.log(error))