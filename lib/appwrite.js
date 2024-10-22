import {Client,Account,ID,Avatars,Databases} from 'react-native-appwrite'



export const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.jsm.prime',
    projectId: "67175b8500147ffd147b",
    databaseId: '67175e3d000ed1a46aac',
    userCollectionId: '67175e7a0009291f897e',
    videoCollectionId: '67175ec800143ade74ce',
    storageId: '67176109001fb664f945'
}

const client = new Client();



client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);


  const account = new Account(client);
  const avatars = new Avatars(client)
  const databases = new Databases(client)

   //register new user 

  export const createUser = async(email,password,username) => {
   try {
    const newAccount = await account.create(
        ID.unique(),
        email,
        password,
        username
    )

    if(!newAccount) throw Error;
    const avatarUrl = avatars.getInitials(username)

    await signIn(email,password)
    const newUser = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        ID.unique(),
        {
            accountId: newAccount.$id,
            email: email,
            username: username,
            avatar: avatarUrl
        }
    )
    return newUser

   } catch (error) {
    console.log(error)
    throw new Error(error)
   }
  }


  //Sign In
  export async function signIn(email, password){
    try {
        const session = await account.createEmailPasswordSession
        (email,password)
        return session
    } catch (error) {
        throw new Error(error) 
    }
  }