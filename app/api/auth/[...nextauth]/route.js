import NextAuth from "next-auth/next";
import GoogleProvider from 'next-auth/providers/google'
import { connectToDB } from "@/utils/database";
import User from "@/models/user";

const handler = NextAuth({
    providers:[
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
        
    ],
    callbacks:{
         async  session({session}){
            const sessionUser = await User.findOne({
                email: session.user.email
            })
            
            if (sessionUser) {
                session.user.id = sessionUser._id.toString();
              }
            

              console.log("This id " + session?.user?.id)
            return session;
        },
        async signIn({profile}){
          try{
             await connectToDB()
             console.log("Connect to db")
    
             // check if user already exist
              const userExist = await User.findOne({
                email: profile.email
              })
              console.log('User exist:', userExist);
             // if not create a new user
              
             if(userExist){
                return true
             }
             

             if(!userExist){
                await User.create({
                    email: profile.email,
                    username:profile.name.replace(" ", "").toLowerCase(),
                    image: profile.picture
                })
                console.log('New user created')
                 
               
             }
             return   true
          } catch(error){
             console.log(error)
             return false
          }
        },
        async redirect({ url, baseUrl }) {
            // Customize the redirection behavior here
            
            // If the URL starts with '/profile', redirect to the profile page
            if (url.startsWith('/profile')) {
              return Promise.resolve('/profile');
            }
            
            // Default redirection behavior (redirect to home page)
            return Promise.resolve('/');
          }
    }
   
})

export {handler as GET, handler as POST};