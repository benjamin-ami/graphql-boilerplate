import { Arg, Mutation, Resolver } from 'type-graphql';
import { GraphQLUpload } from 'graphql-upload';
import { createWriteStream } from 'fs';
import * as path from 'path';
import { Upload } from '../interfaces';

@Resolver()
export default class UploadFileResolver {
	@Mutation(() => Boolean)
	async singleUpload(
		@Arg('image', () => GraphQLUpload)
			{ createReadStream, filename }: Upload
	): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			createReadStream()
				.pipe(createWriteStream(path.join(__dirname, '..', '..', 'uploads', filename)))
				.on('finish', async () => {
					resolve(true);
				})
				.on('error', (e) => reject(e));
		});
	}
}
