var fs = require('fs');

const storeFS = ({stream, filename} ) => {
    const uploadDir = `E:\\_NODE\\sequelize-graphql-node\\public\\images`;
    const path = `${uploadDir}/${filename}`;
    return new Promise((resolve, reject) =>{
        stream
            .on('error', error => {
                if (stream.truncated)
                    // delete the truncated file
                    fs.unlinkSync(path);
                reject(error);
            })
            .pipe(fs.createWriteStream(path))
            .on('error', error => reject(error))
            .on('finish', () => resolve({ path }))
        });
    
}

const attachmentTypeDef = `
    type Attachment {
        id:ID!
        attachment_path:String!
        attachment_type:String!
        parent_id:Int!
    }

    extend type Mutation {
        deleteAttachment(id:ID!):String
        testUploadAttachment(avatar:Upload!):Attachment
    }
`

const attachmentResolvers = {
    Mutation:{
        testUploadAttachment : async( _ , args, {models}) => {
            const { filename, mimetype, createReadStream } = await args.avatar.file;
            const stream = createReadStream();
            const pathObj = await storeFS( {stream, filename} );
            const fileLocation = pathObj.path;
            const attachment = await models.Attachment.create({
                attachment_path:fileLocation,
                attachment_type:'book_cover_photo',
                parent_id:1
            })
            return attachment;
        }
    }
}

module.exports = {attachmentTypeDef, attachmentResolvers}